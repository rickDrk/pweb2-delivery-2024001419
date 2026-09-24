function executar(res, fn) {
  try {
    return fn();
  } catch (erro) {
    const status = erro.status ?? 500;
    return res.status(status).json({ erro: erro.message || 'erro interno' });
  }
}

export function criarEntregaController(service) {
  return (req, res) => executar(res, () => res.status(201).json(service.criar(req.body ?? {})));
}

export function listarEntregasController(service) {
  return (req, res) => executar(res, () => res.json(service.listar(req.query.status)));
}

export function buscarEntregaController(service) {
  return (req, res) => executar(res, () => res.json(service.buscarPorId(req.params.id)));
}

export function atualizarEntregaController(service) {
  return (req, res) => executar(res, () => res.json(service.atualizar(req.params.id, req.body ?? {})));
}

export function avancarEntregaController(service) {
  return (req, res) => executar(res, () => res.json(service.avancar(req.params.id)));
}

export function cancelarEntregaController(service) {
  return (req, res) => executar(res, () => res.json(service.cancelar(req.params.id)));
}

export function historicoEntregaController(service) {
  return (req, res) => executar(res, () => res.json(service.historico(req.params.id)));
}

export function removerEntregaController(service) {
  return (req, res) => executar(res, () => {
    service.remover(req.params.id);
    return res.status(204).send();
  });
}
