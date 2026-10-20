import prisma from '../config/database.js';

function mapMotorista(motorista) {
  return {
    id: motorista.id,
    nome: motorista.nome,
    cpf: motorista.cpf,
    ...(motorista.placaVeiculo ? { placaVeiculo: motorista.placaVeiculo } : {}),
    status: motorista.status,
  };
}

/**
 * @typedef {Object} IMotoristasRepository
 * @property {function(): Promise<Array>} listarTodos
 * @property {function(number): Promise<Object|null>} buscarPorId
 * @property {function(string): Promise<Object|null>} buscarPorCpf
 * @property {function(Object): Promise<Object>} criar
 */

/**
 * Repository de Motoristas com Prisma.
 */
export class MotoristaRepository {
  async listarTodos() {
    const motoristas = await prisma.motorista.findMany({ orderBy: { id: 'asc' } });
    return motoristas.map(mapMotorista);
  }

  async buscarPorId(id) {
    const motorista = await prisma.motorista.findUnique({ where: { id: Number(id) } });
    return motorista ? mapMotorista(motorista) : null;
  }

  async buscarPorCpf(cpf) {
    const motorista = await prisma.motorista.findUnique({ where: { cpf } });
    return motorista ? mapMotorista(motorista) : null;
  }

  async criar(dados) {
    const motorista = await prisma.motorista.create({
      data: {
        nome: dados.nome,
        cpf: dados.cpf,
        placaVeiculo: dados.placaVeiculo ?? null,
        status: dados.status ?? 'ATIVO',
      },
    });

    return mapMotorista(motorista);
  }
}
