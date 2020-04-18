import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Banco } from './banco';
import { BANCOS } from './bancos';
import { DatosReferencia } from './referencia';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  DATOS_BANCARIOS: DatosReferencia[] = [];

  constructor() { }

  getBancos(): Observable<Banco[]> {
  	return of(BANCOS);
  }

  addReferencia(referencia: DatosReferencia) {
  	this.DATOS_BANCARIOS.push(referencia);
  }

  deleteReferncia(referencia: DatosReferencia) {
    const INDICE = this.DATOS_BANCARIOS.findIndex(element => element.referencia === referencia.referencia);
    this.DATOS_BANCARIOS.splice(INDICE, 1);
  }

  clearReferencias() {
    this.DATOS_BANCARIOS = [];
  }
 
}
