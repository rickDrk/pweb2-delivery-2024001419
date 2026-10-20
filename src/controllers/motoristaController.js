async function executar(res, fn) {
  try {
    return await fn();
  } catch (erro) {
    const status = erro.status ?? 500;
    return res.status(status).json({ erro: erro.message || 'erro interno' });
  }
}

export function criarMotoristaController(service) {
  return (req, res) => executar(res, async () => res.status(201).json(await service.criar(req.body ?? {})));
}

export function listarMotoristasController(service) {
  return (req, res) => executar(res, async () => res.json(await service.listar()));
}

export function buscarMotoristaController(service) {
  return (req, res) => executar(res, async () => res.json(await service.buscarPorId(req.params.id)));
}

export function listarEntregasMotoristaController(service) {
  return (req, res) => executar(res, async () => res.json(
    await service.entregas(req.params.id, req.query.status)
  ));
}
