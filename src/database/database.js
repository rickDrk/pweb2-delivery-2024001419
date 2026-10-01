import { listarEntregas } from './entregas.js';
import { listarMotoristas } from './motoristas.js';

export class Database {
  constructor() {
    this.entregas = listarEntregas();
    this.motoristas = listarMotoristas();
  }
}
