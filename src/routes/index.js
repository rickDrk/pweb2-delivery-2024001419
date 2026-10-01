import express from 'express';
import { Database } from '../database/database.js';
import { EntregaRepository } from '../repositories/entregaRepository.js';
import { MotoristaRepository } from '../repositories/motoristaRepository.js';
import { EntregaService } from '../services/entregaService.js';
import { MotoristaService } from '../services/motoristaService.js';
import {
  criarEntregaController,
  listarEntregasController,
  buscarEntregaController,
  atualizarEntregaController,
  avancarEntregaController,
  cancelarEntregaController,
  historicoEntregaController,
  atribuirMotoristaController,
  removerEntregaController,
} from '../controllers/entregaController.js';
import {
  criarMotoristaController,
  listarMotoristasController,
  buscarMotoristaController,
  listarEntregasMotoristaController,
} from '../controllers/motoristaController.js';

/**
 * Composition root da Atividade 06.
 * As dependências são criadas em um único ponto e injetadas nos Services.
 */
export function criarRotas() {
  const router = express.Router();
  const database = new Database();
  const entregaRepository = new EntregaRepository(database);
  const motoristaRepository = new MotoristaRepository(database);
  const entregaService = new EntregaService(entregaRepository, motoristaRepository);
  const motoristaService = new MotoristaService(motoristaRepository, entregaRepository);

  router.post('/entregas', criarEntregaController(entregaService));
  router.get('/entregas', listarEntregasController(entregaService));
  router.get('/entregas/:id', buscarEntregaController(entregaService));
  router.put('/entregas/:id', atualizarEntregaController(entregaService));
  router.patch('/entregas/:id', atualizarEntregaController(entregaService));
  router.patch('/entregas/:id/avancar', avancarEntregaController(entregaService));
  router.patch('/entregas/:id/cancelar', cancelarEntregaController(entregaService));
  router.patch('/entregas/:id/atribuir', atribuirMotoristaController(entregaService));
  router.get('/entregas/:id/historico', historicoEntregaController(entregaService));
  router.delete('/entregas/:id', removerEntregaController(entregaService));

  router.post('/motoristas', criarMotoristaController(motoristaService));
  router.get('/motoristas', listarMotoristasController(motoristaService));
  router.get('/motoristas/:id', buscarMotoristaController(motoristaService));
  router.get('/motoristas/:id/entregas', listarEntregasMotoristaController(motoristaService));

  return router;
}
