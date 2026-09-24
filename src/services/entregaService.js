const STATUS_VALIDOS = new Set(['CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA']);
const TRANSICOES = {
  CRIADA: 'EM_TRANSITO',
  EM_TRANSITO: 'ENTREGUE',
};

export class RegraNegocioError extends Error {
  constructor(mensagem, status = 422) {
    super(mensagem);
    this.status = status;
  }
}

export class EntregaService {
  constructor(repository) {
    this.repository = repository;
  }

  criar({ descricao, origem, destino }) {
    if ([descricao, origem, destino].some((valor) => typeof valor !== 'string' || !valor.trim())) {
      throw new RegraNegocioError('descricao, origem e destino são obrigatórios', 400);
    }

    if (origem.trim().toLowerCase() === destino.trim().toLowerCase()) {
      throw new RegraNegocioError('origem e destino devem ser diferentes', 400);
    }

    if (this.repository.buscarDuplicadaAtiva(descricao, origem, destino)) {
      throw new RegraNegocioError('entrega duplicada ativa', 409);
    }

    const agora = new Date().toISOString();
    return this.repository.criar({
      descricao: descricao.trim(),
      origem: origem.trim(),
      destino: destino.trim(),
      status: 'CRIADA',
      historico: [{
        status: 'CRIADA',
        evento: 'ENTREGA_CRIADA',
        data: agora,
      }],
    });
  }

  listar(status) {
    if (status && !STATUS_VALIDOS.has(status)) {
      throw new RegraNegocioError('status inválido', 400);
    }
    return this.repository.listar(status);
  }

  buscarPorId(id) {
    const entrega = this.repository.buscarPorId(id);
    if (!entrega) throw new RegraNegocioError('entrega não encontrada', 404);
    return entrega;
  }

  avancar(id) {
    const entrega = this.buscarPorId(id);
    const proximoStatus = TRANSICOES[entrega.status];

    if (!proximoStatus) {
      throw new RegraNegocioError('não é possível avançar uma entrega neste estado', 422);
    }

    entrega.status = proximoStatus;
    entrega.historico.push({
      status: proximoStatus,
      evento: 'STATUS_AVANCADO',
      data: new Date().toISOString(),
    });

    return this.repository.salvar(entrega);
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    if (!['CRIADA', 'EM_TRANSITO'].includes(entrega.status)) {
      throw new RegraNegocioError('não é possível cancelar uma entrega neste estado', 422);
    }

    entrega.status = 'CANCELADA';
    entrega.historico.push({
      status: 'CANCELADA',
      evento: 'ENTREGA_CANCELADA',
      data: new Date().toISOString(),
    });

    return this.repository.salvar(entrega);
  }

  historico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }

  remover(id) {
    this.buscarPorId(id);
    this.repository.remover(id);
  }

  atualizar(id, dados) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw new RegraNegocioError('entrega encerrada não pode ser alterada', 422);
    }

    const origem = dados.origem ?? entrega.origem;
    const destino = dados.destino ?? entrega.destino;
    const descricao = dados.descricao ?? entrega.descricao;

    if ([descricao, origem, destino].some((valor) => typeof valor !== 'string' || !valor.trim())) {
      throw new RegraNegocioError('descricao, origem e destino são obrigatórios', 400);
    }
    if (origem.trim().toLowerCase() === destino.trim().toLowerCase()) {
      throw new RegraNegocioError('origem e destino devem ser diferentes', 400);
    }

    entrega.descricao = descricao.trim();
    entrega.origem = origem.trim();
    entrega.destino = destino.trim();
    entrega.historico.push({
      status: entrega.status,
      evento: 'ENTREGA_ATUALIZADA',
      data: new Date().toString(),
    });

    return this.repository.salvar(entrega);
  }
}
