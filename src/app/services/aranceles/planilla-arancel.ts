import { DatosReferencia } from '../bancos/referencia';
import { Concepto } from './concepto';
import { Estudiante } from '../estudiantes/estudiante';

export class DatoPlanilla {
	estudiante: Estudiante;
	numeroArancel: number;
	conceptos: Concepto[];
	datosBancarios: DatosReferencia[];
}