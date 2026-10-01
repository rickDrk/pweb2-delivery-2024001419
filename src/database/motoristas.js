// Persistência simulada em memória para os Motoristas da Atividade 06.
const motoristas = [];
let proximoId = 1;

export function listarMotoristas() {
  return motoristas;
}

export function gerarIdMotorista() {
  return proximoId++;
}
