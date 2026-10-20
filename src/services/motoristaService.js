import { RegraNegocioError } from './entregaService.js';

export class MotoristaService {
  constructor(repository, entregaRepository) {
    this.repository = repository;
    this.entregaRepository = entregaRepository;
  }

  async criar({ nome, cpf, placaVeiculo }) {
    if ([nome, cpf].some((valor) => typeof valor !== 'string' || !valor.trim())) {
      throw new RegraNegocioError('nome e cpf são obrigatórios', 400);
    }

    const cpfNormalizado = cpf.trim();
    if (await this.repository.buscarPorCpf(cpfNormalizado)) {
      throw new RegraNegocioError('CPF já cadastrado', 409);
    }

    return await this.repository.criar({
      nome: nome.trim(),
      cpf: cpfNormalizado,
      ...(typeof placaVeiculo === 'string' && placaVeiculo.trim()
        ? { placaVeiculo: placaVeiculo.trim() }
        : {}),
      status: 'ATIVO',
    });
  }

  async listar() {
    return await this.repository.listarTodos();
  }

  async buscarPorId(id) {
    const motorista = await this.repository.buscarPorId(id);
    if (!motorista) throw new RegraNegocioError('motorista não encontrado', 404);
    return motorista;
  }

  async entregas(id, status) {
    await this.buscarPorId(id);
    return await this.entregaRepository.listarTodos({ motoristaId: id, status });
  }
}
