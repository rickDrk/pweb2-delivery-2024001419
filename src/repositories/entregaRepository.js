import prisma from '../config/database.js';

/**
 * @typedef {Object} IEntregasRepository
 * @property {function(Object=): Promise<Array>} listarTodos
 * @property {function(number): Promise<Object|null>} buscarPorId
 * @property {function(Object): Promise<Object>} criar
 * @property {function(number, Object): Promise<Object|null>} atualizar
 * @property {function(number): Promise<boolean>} remover
 * @property {function(string,string,string): Promise<Object|null>} buscarDuplicadaAtiva
 */
export class EntregaRepository {
  constructor(database = prisma) {
    this.entregas = database.entrega;
  }

  async listarTodos(filtros = {}) {
    const where = {};
    if (filtros.status) where.status = filtros.status;
    if (filtros.motoristaId !== undefined) where.motoristaId = Number(filtros.motoristaId);

    return await this.entregas.findMany({
      where,
      include: { historico: { orderBy: { id: 'asc' } } },
      orderBy: { id: 'asc' },
    });
  }

  async buscarPorId(id) {
    return await this.entregas.findUnique({
      where: { id: Number(id) },
      include: { historico: { orderBy: { id: 'asc' } } },
    });
  }

  async buscarDuplicadaAtiva(descricao, origem, destino) {
    const entregas = await this.entregas.findMany({
      where: { status: { in: ['CRIADA', 'EM_TRANSITO'] } },
    });
    for (const entrega of entregas) {
      if (entrega.descricao.trim().toLowerCase() === descricao.trim().toLowerCase() &&
          entrega.origem.trim().toLowerCase() === origem.trim().toLowerCase() &&
          entrega.destino.trim().toLowerCase() === destino.trim().toLowerCase()) {
        return entrega;
      }
    }
    return null;
  }

  async criar(dados) {
    const { historico = [], ...entrega } = dados;
    const eventos = [];
    for (const evento of historico) {
      eventos.push({
        status: evento.status,
        evento: evento.evento,
        data: new Date(evento.data),
        motoristaId: evento.motoristaId ?? null,
      });
    }
    return await this.entregas.create({
      data: { ...entrega, historico: { create: eventos } },
      include: { historico: true },
    });
  }

  async atualizar(id, dados) {
    const existente = await this.buscarPorId(id);
    if (!existente) return null;

    const novos = [];
    for (const evento of (dados.historico ?? []).slice(existente.historico.length)) {
      novos.push({
        status: evento.status,
        evento: evento.evento,
        data: new Date(evento.data),
        motoristaId: evento.motoristaId ?? null,
      });
    }

    return await this.entregas.update({
      where: { id: Number(id) },
      data: {
        descricao: dados.descricao,
        origem: dados.origem,
        destino: dados.destino,
        status: dados.status,
        motoristaId: dados.motoristaId ?? null,
        historico: { create: novos },
      },
      include: { historico: { orderBy: { id: 'asc' } } },
    });
  }

  async listar(status) {
    return await this.listarTodos(status ? { status } : {});
  }

  async salvar(entrega) {
    return await this.atualizar(entrega.id, entrega);
  }

  async remover(id) {
    const existente = await this.buscarPorId(id);
    if (!existente) return false;
    await this.entregas.delete({ where: { id: Number(id) } });
    return true;
  }
}
