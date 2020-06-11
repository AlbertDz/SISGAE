import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';

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
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  }

  constructor(
    public http: HttpClient,
    private cookie: CookieService
  ) { }

  getToken() {
    return this.cookie.get('token');
  }

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

  addReferencias(id: number): Observable<any> {
    let url = `${URL_SERVICIOS}/planilla/${id}/referencia`;

    return this.http.post<DatosReferencia[]>(url, this.DATOS_BANCARIOS, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError));
  }

  getReferenciasPlanilla(id: number): Observable<any[]> {
    let url = `${URL_SERVICIOS}//planilla/${id}/referencia`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  // HANDLE ERROR
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = `Error Code: ${error.status} Message: ${error.message}` };

    console.log(errorMessage);
    return throwError(errorMessage);
  }
 
}
