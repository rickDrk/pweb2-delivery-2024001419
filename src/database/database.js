const entregas = [];
const motoristas = [];

let proximoIdEntrega = 1;
let proximoIdMotorista = 1;

export function listarEntregas() {
  return entregas;
}

export function gerarId() {
  return proximoIdEntrega++;
}

export function listarMotoristas() {
  return motoristas;
}

export function gerarIdMotorista() {
  return proximoIdMotorista++;
}

export class Database {
  constructor() {
    this.entregas = entregas;
    this.motoristas = motoristas;
  }
}