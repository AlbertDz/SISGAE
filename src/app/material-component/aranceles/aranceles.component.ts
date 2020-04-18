import { Component, OnInit } from '@angular/core';

interface Postgrado {
  value: string;
  viewValue: string;
}

interface Carrera {
	value: string;
	viewValue: string;
}

export interface PeriodicElement {
  posicion: number;
  estudiante: string;
  arancel: number;
  cedula: string;
  concepto: string;
  fecha: string;
  banco: string;
  referencia: string;
  monto: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {posicion: 1, estudiante: 'Yendri Huerta', arancel: 505, cedula: '22667168', concepto: 'Inscripción 2020-I', fecha: '10/01/2020', banco: 'Bicentenario', referencia: '85916055', monto: '100.000,00'},
  {posicion: 2, estudiante: 'Rafael Torres', arancel: 551, cedula: '8682029', concepto: 'Inscripción 2020-I', fecha: '22/01/2020', banco: 'Banesco', referencia: '55569536', monto: '100.000,00'},
];

@Component({
  selector: 'app-aranceles',
  templateUrl: './aranceles.component.html',
  styleUrls: ['./aranceles.component.css']
})
export class ArancelesComponent implements OnInit {

  carrera: Carrera[];
  valor: string;

  postgrado: Postgrado[] = [
    {value: 'especializacion', viewValue: 'Especialización'},
    {value: 'maestria', viewValue: 'Maestria'},
    {value: 'doctorado', viewValue: 'Doctorado'}
  ];

  especializacion: Carrera[] = [];

  doctorado: Carrera[] = [
    {value: 'educacion', viewValue: 'Ciencias de la educación'},
    {value: 'administracion', viewValue: 'Ciencias administrativas'},
  ];

  maestria: Carrera[] = [
    {value: 'gerencia', viewValue: 'Gerencia estratégica'},
    {value: 'educacion', viewValue: 'Ciencias de la educación'},
  ];

  displayedColumns: string[] = ['posicion', 'estudiante', 'arancel', 'cedula', 'concepto', 'fecha', 'banco', 'referencia', 'monto'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

  valorPostgrado(valor: string) {
  	if ( valor === 'especializacion' ) this.carrera = this.especializacion;
  	if ( valor === 'doctorado' ) this.carrera = this.doctorado;
  	if ( valor === 'maestria' ) this.carrera = this.maestria;
  }

}
