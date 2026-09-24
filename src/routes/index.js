import express from 'express';
import { EntregaRepository } from '../repositories/entregaRepository.js';
import { EntregaService } from '../services/entregaService.js';
import {
  criarEntregaController,
  listarEntregasController,
  buscarEntregaController,
  atualizarEntregaController,
  avancarEntregaController,
  cancelarEntregaController,
  historicoEntregaController,
  removerEntregaController,
} from '../controllers/entregaController.js';

export function criarRotas() {
  const router = express.Router();
  const repository = new EntregaRepository();
  const service = new EntregaService(repository);

  router.post('/entregas', criarEntregaController(service));
  router.get('/entregas', listarEntregasController(service));
  router.get('/entregas/:id', buscarEntregaController(service));
  router.put('/entregas/:id', atualizarEntregaController(service));
  router.patch('/entregas/:id', atualizarEntregaController(service));
  router.patch('/entregas/:id/avancar', avancarEntregaController(service));
  router.patch('/entregas/:id/cancelar', cancelarEntregaController(service));
  router.get('/entregas/:id/historico', historicoEntregaController(service));
  router.delete('/entregas/:id', removerEntregaController(service));

  return router;
}
