import { gerarIdMotorista } from '../database/database.js';

/**
 * @typedef {Object} IMotoristasRepository
 * @property {function(): Array} listarTodos .
 * @property {function(number): Object|null} buscarPorId 
 * @property {function(string): Object|null} buscarPorCpf 
 * @property {function(Object): Object} criar 
 */

/**
 * Repository de Motoristas.
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
