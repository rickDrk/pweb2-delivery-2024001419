import { gerarIdMotorista } from '../database/motoristas.js';

/**
 * @typedef {Object} IMotoristasRepository
 * @property {function(): Array} listarTodos Lista todos os motoristas.
 * @property {function(number): Object|null} buscarPorId Busca um motorista pelo id.
 * @property {function(string): Object|null} buscarPorCpf Busca um motorista pelo CPF.
 * @property {function(Object): Object} criar Cria e persiste um motorista.
 */

/**
 * Repository de Motoristas.
 * Responsável somente pelo acesso à persistência simulada em memória.
 */
export class MotoristaRepository {
  constructor(database) {
    this.motoristas = database.motoristas;
  }

  listarTodos() {
    return [...this.motoristas];
  }

  buscarPorId(id) {
    return this.motoristas.find((motorista) => motorista.id === Number(id)) ?? null;
  }

  buscarPorCpf(cpf) {
    return this.motoristas.find((motorista) => motorista.cpf === cpf) ?? null;
  }

  criar(dados) {
    const motorista = { id: gerarIdMotorista(), ...dados };
    this.motoristas.push(motorista);
    return motorista;
  }
}
