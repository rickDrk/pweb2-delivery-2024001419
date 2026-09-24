import { gerarId, listarEntregas } from '../database/entregas.js';

export class EntregaRepository {
  constructor() {
    this.entregas = listarEntregas();
  }

  criar(dados) {
    const entrega = { id: gerarId(), ...dados };
    this.entregas.push(entrega);
    return entrega;
  }

  listar(status) {
    if (!status) return [...this.entregas];
    return this.entregas.filter((entrega) => entrega.status === status);
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

  salvar(entrega) {
    const indice = this.entregas.findIndex((item) => item.id === entrega.id);
    if (indice === -1) return null;
    this.entregas[indice] = entrega;
    return entrega;
  }

  remover(id) {
    const indice = this.entregas.findIndex((item) => item.id === Number(id));
    if (indice === -1) return false;
    this.entregas.splice(indice, 1);
    return true;
  }
}
