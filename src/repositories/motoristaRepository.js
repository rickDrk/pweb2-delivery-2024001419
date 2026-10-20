import prisma from '../config/database.js';

/**
 * @typedef {Object} IMotoristasRepository
 * @property {function(): Promise<Array>} listarTodos
 * @property {function(number): Promise<Object|null>} buscarPorId
 * @property {function(string): Promise<Object|null>} buscarPorCpf
 * @property {function(Object): Promise<Object>} criar
 */

/**
 * Repository de Motoristas.
 */
export class MotoristaRepository {
  constructor(database = prisma) {
    this.motoristas = database.motorista;
  }

  async listarTodos() {
    return this.motoristas.findMany({ orderBy: { id: 'asc' } });
  }

  async buscarPorId(id) {
    return this.motoristas.findUnique({ where: { id: Number(id) } });
  }

  async buscarPorCpf(cpf) {
    return this.motoristas.findUnique({ where: { cpf } });
  }

  async criar(dados) {
    return this.motoristas.create({
      data: {
        nome: dados.nome,
        cpf: dados.cpf,
        placaVeiculo: dados.placaVeiculo ?? null,
        status: dados.status ?? 'ATIVO',
      },
    });
  }
}

