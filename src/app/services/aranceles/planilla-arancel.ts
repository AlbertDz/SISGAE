import { DatosReferencia } from '../bancos/referencia';
import { Concepto } from './concepto';
import { Estudiante } from '../estudiantes/estudiante';

export class DatoPlanilla {
	cedula: number;
	id_periodo: string;
	id_planilla: number;
	nombre_carrera: string;
	nombre_postgrado: string;
	primer_apellido: string;
	primer_nombre: string;
}