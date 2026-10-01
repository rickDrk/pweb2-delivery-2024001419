import { RegraNegocioError } from './entregaService.js';

export class MotoristaService {
  constructor(repository, entregaRepository) {
    this.repository = repository;
    this.entregaRepository = entregaRepository;
  }

  criar({ nome, cpf, placaVeiculo }) {
    if ([nome, cpf].some((valor) => typeof valor !== 'string' || !valor.trim())) {
      throw new RegraNegocioError('nome e cpf são obrigatórios', 400);
    }

    const cpfNormalizado = cpf.trim();
    if (this.repository.buscarPorCpf(cpfNormalizado)) {
      throw new RegraNegocioError('CPF já cadastrado', 409);
    }

    return this.repository.criar({
      nome: nome.trim(),
      cpf: cpfNormalizado,
      ...(typeof placaVeiculo === 'string' && placaVeiculo.trim()
        ? { placaVeiculo: placaVeiculo.trim() }
        : {}),
      status: 'ATIVO',
    });
  }

  listar() {
    return this.repository.listarTodos();
  }

  buscarPorId(id) {
    const motorista = this.repository.buscarPorId(id);
    if (!motorista) throw new RegraNegocioError('motorista não encontrado', 404);
    return motorista;
  }

  entregas(id, status) {
    this.buscarPorId(id);
    return this.entregaRepository.listarTodos({ motoristaId: id, status });
  }
}
