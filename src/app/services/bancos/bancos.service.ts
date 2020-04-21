import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators'

import { Banco } from './banco';
import { BANCOS } from './bancos';
import { DatosReferencia } from './referencia';

import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  DATOS_BANCARIOS: DatosReferencia[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    public http: HttpClient,
  ) { }

  getBancos(): Observable<any[]> {
    let url = `${URL_SERVICIOS}/bancos`;

  	return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  addReferencia(referencia: DatosReferencia) {
  	this.DATOS_BANCARIOS.push(referencia);
  }

  deleteReferencia(referencia: DatosReferencia) {
    const INDICE = this.DATOS_BANCARIOS.findIndex(element => element.referencia === referencia.referencia);
    this.DATOS_BANCARIOS.splice(INDICE, 1);
  }

  clearReferencias() {
    this.DATOS_BANCARIOS = [];
  }

  // HANDLE ERROR
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}` };

    console.log(errorMessage);
    return throwError(errorMessage);
  }
 
}
