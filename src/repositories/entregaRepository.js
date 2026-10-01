import { gerarId } from '../database/entregas.js';

/**
 * @typedef {Object} IEntregasRepository
 * @property {function(Object=): Array} listarTodos
 * @property {function(number): Object|null} buscarPorId
 * @property {function(Object): Object} criar
 * @property {function(number, Object): Object|null} atualizar 
 * @property {function(number): boolean} remover 
 * @property {function(string,string,string): Object|null} buscarDuplicadaAtiva 
 */

/**
 * Repository de Entregas.
 */
export class EntregaRepository {
  constructor(database) {
    this.entregas = database.entregas;
  }

  criar(dados) {
    const entrega = { id: gerarId(), ...dados };
    this.entregas.push(entrega);
    return entrega;
  }

  listarTodos(filtros = {}) {
    const { status, motoristaId } = filtros;
    return this.entregas.filter((entrega) => {
      if (status && entrega.status !== status) return false;
      if (motoristaId !== undefined && entrega.motoristaId !== Number(motoristaId)) return false;
      return true;
    });
  }

  buscarPorId(id) {
    return this.entregas.find((entrega) => entrega.id === Number(id)) ?? null;
  }

  buscarDuplicadaAtiva(descricao, origem, destino) {
    const normalizar = (valor) => String(valor).trim().toLowerCase();
    return this.entregas.find((entrega) =>
      ['CRIADA', 'EM_TRANSITO'].includes(entrega.status) &&
      normalizar(entrega.descricao) === normalizar(descricao) &&
      normalizar(entrega.origem) === normalizar(origem) &&
      normalizar(entrega.destino) === normalizar(destino)
    ) ?? null;
  }

  atualizar(id, dados) {
    const indice = this.entregas.findIndex((item) => item.id === Number(id));
    if (indice === -1) return null;
    this.entregas[indice] = dados;
    return dados;
  }

  listar(status) {
    return this.listarTodos(status ? { status } : {});
  }

  salvar(entrega) {
    return this.atualizar(entrega.id, entrega);
  }

  remover(id) {
    const indice = this.entregas.findIndex((item) => item.id === Number(id));
    if (indice === -1) return false;
    this.entregas.splice(indice, 1);
    return true;
  }
}
