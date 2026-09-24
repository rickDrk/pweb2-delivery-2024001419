
const entregas = [];
let proximoId = 1;

export function listarEntregas() {
  return entregas;
}

export function gerarId() {
  return proximoId++;
}
