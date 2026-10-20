async function executar(res, fn) {
  try {
    return await fn();
  } catch (erro) {
    const status = erro.status ?? 500;
    return res.status(status).json({ erro: erro.message || 'erro interno' });
  }
}

export function criarEntregaController(service) {
  return (req, res) => executar(res, async () => res.status(201).json(await service.criar(req.body ?? {})));
}

export function listarEntregasController(service) {
  return (req, res) => executar(res, async () => res.json(await service.listar(req.query.status)));
}

export function buscarEntregaController(service) {
  return (req, res) => executar(res, async () => res.json(await service.buscarPorId(req.params.id)));
}

export function atualizarEntregaController(service) {
  return (req, res) => executar(res, async () => res.json(await service.atualizar(req.params.id, req.body ?? {})));
}

export function avancarEntregaController(service) {
  return (req, res) => executar(res, async () => res.json(await service.avancar(req.params.id)));
}

export function cancelarEntregaController(service) {
  return (req, res) => executar(res, async () => res.json(await service.cancelar(req.params.id)));
}

export function historicoEntregaController(service) {
  return (req, res) => executar(res, async () => res.json(await service.historico(req.params.id)));
}

export function atribuirMotoristaController(service) {
  return (req, res) => executar(res, async () => res.json(
    await service.atribuirMotorista(req.params.id, req.body?.motoristaId)
  ));
}

export function removerEntregaController(service) {
  return (req, res) => executar(res, async () => {
    await service.remover(req.params.id);
    return res.status(204).send();
  });
}
