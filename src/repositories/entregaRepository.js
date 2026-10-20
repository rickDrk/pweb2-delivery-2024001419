import prisma from '../config/database.js';

function mapEvento(evento) {
  return {
    status: evento.status,
    evento: evento.evento,
    ...(evento.motoristaId !== null ? { motoristaId: evento.motoristaId } : {}),
    data: evento.data.toISOString(),
  };
}

function mapEntrega(entrega) {
  return {
    id: entrega.id,
    descricao: entrega.descricao,
    origem: entrega.origem,
    destino: entrega.destino,
    status: entrega.status,
    ...(entrega.motoristaId !== null ? { motoristaId: entrega.motoristaId } : {}),
    historico: entrega.historico.map(mapEvento),
  };
}

/**
 * @typedef {Object} IEntregasRepository
 * @property {function(Object=): Promise<Array>} listarTodos
 * @property {function(number): Promise<Object|null>} buscarPorId
 * @property {function(Object): Promise<Object>} criar
 * @property {function(number, Object): Promise<Object|null>} atualizar
 * @property {function(number): Promise<boolean>} remover
 * @property {function(string,string,string): Promise<Object|null>} buscarDuplicadaAtiva
 */

/**
 * Repository de Entregas com Prisma.
 */
export class EntregaRepository {
  async criar(dados) {
    const entrega = await prisma.entrega.create({
      data: {
        descricao: dados.descricao,
        origem: dados.origem,
        destino: dados.destino,
        status: dados.status,
        motoristaId: dados.motoristaId ?? null,
        historico: {
          create: (dados.historico ?? []).map((evento) => ({
            status: evento.status,
            evento: evento.evento,
            motoristaId: evento.motoristaId ?? null,
            data: new Date(evento.data),
          })),
        },
      },
      include: { historico: { orderBy: { id: 'asc' } } },
    });

    return mapEntrega(entrega);
  }

  async listarTodos(filtros = {}) {
    const { status, motoristaId } = filtros;
    const entregas = await prisma.entrega.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(motoristaId !== undefined ? { motoristaId: Number(motoristaId) } : {}),
      },
      include: { historico: { orderBy: { id: 'asc' } } },
      orderBy: { id: 'asc' },
    });

    return entregas.map(mapEntrega);
  }

  async buscarPorId(id) {
    const entrega = await prisma.entrega.findUnique({
      where: { id: Number(id) },
      include: { historico: { orderBy: { id: 'asc' } } },
    });

    return entrega ? mapEntrega(entrega) : null;
  }

  async buscarDuplicadaAtiva(descricao, origem, destino) {
    const entregas = await prisma.entrega.findMany({
      where: { status: { in: ['CRIADA', 'EM_TRANSITO'] } },
      include: { historico: { orderBy: { id: 'asc' } } },
    });

    const normalizar = (valor) => String(valor).trim().toLowerCase();
    const entrega = entregas.find((item) =>
      normalizar(item.descricao) === normalizar(descricao) &&
      normalizar(item.origem) === normalizar(origem) &&
      normalizar(item.destino) === normalizar(destino)
    );

    return entrega ? mapEntrega(entrega) : null;
  }

  async atualizar(id, dados) {
    const existente = await prisma.entrega.findUnique({ where: { id: Number(id) } });
    if (!existente) return null;

    await prisma.$transaction(async (tx) => {
      await tx.entrega.update({
        where: { id: Number(id) },
        data: {
          descricao: dados.descricao,
          origem: dados.origem,
          destino: dados.destino,
          status: dados.status,
          motoristaId: dados.motoristaId ?? null,
        },
      });

      await tx.evento.deleteMany({ where: { entregaId: Number(id) } });
      if (dados.historico?.length) {
        await tx.evento.createMany({
          data: dados.historico.map((evento) => ({
            status: evento.status,
            evento: evento.evento,
            motoristaId: evento.motoristaId ?? null,
            data: new Date(evento.data),
            entregaId: Number(id),
          })),
        });
      }
    });

    return this.buscarPorId(id);
  }

  async remover(id) {
    try {
      await prisma.entrega.delete({ where: { id: Number(id) } });
      return true;
    } catch (erro) {
      if (erro.code === 'P2025') return false;
      throw erro;
    }
  }
}
