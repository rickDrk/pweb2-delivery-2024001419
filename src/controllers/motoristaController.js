function executar(res, fn) {
  try {
    return fn();
  } catch (erro) {
    const status = erro.status ?? 500;
    return res.status(status).json({ erro: erro.message || 'erro interno' });
  }
}

export function criarMotoristaController(service) {
  return (req, res) => executar(res, () => res.status(201).json(service.criar(req.body ?? {})));
}

export function listarMotoristasController(service) {
  return (req, res) => executar(res, () => res.json(service.listar()));
}

export function buscarMotoristaController(service) {
  return (req, res) => executar(res, () => res.json(service.buscarPorId(req.params.id)));
}

export function listarEntregasMotoristaController(service) {
  return (req, res) => executar(res, () => res.json(
    service.entregas(req.params.id, req.query.status)
  ));
}
