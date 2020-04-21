import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';

import { Arancel } from './arancel';
import { Concepto } from './concepto';
import { ARANCELES } from './aranceles';
import { DatoPlanilla } from './planilla-arancel';

import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ArancelesService {

  constructor(
    public http: HttpClient,
    private cookie: CookieService
  ) { }

  CONCEPTOS: Concepto[] = [];
  PLANILLAS: DatoPlanilla[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    })
  }

  getToken() {
    return this.cookie.get('token');
  }

  getConceptos(): Observable<Arancel[]> {
    let url = `${URL_SERVICIOS}/conceptos`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  addConcepto(arancel: Arancel): Observable<any> {
    let url = `${URL_SERVICIOS}/conceptos`;

    return this.http.post<Arancel>(url, arancel, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  updateConcepto(arancel: Arancel): Observable<any> {
    let url = `${URL_SERVICIOS}/conceptos/${arancel.codigo}`;

    return this.http.put(url, arancel, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  deleteConcepto(arancel: Arancel): Observable<any> {
    let url = `${URL_SERVICIOS}/conceptos/${arancel.codigo}`;

    return this.http.delete(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  nuevoConcepto(concepto: Concepto) {
    this.CONCEPTOS.push(concepto);
  }

  borrarConcepto(concepto: Concepto) {
    const INDICE = this.CONCEPTOS.findIndex(element => element.codigo === concepto.codigo);
    this.CONCEPTOS.splice(INDICE, 1);
  }

  clearConceptos() {
    this.CONCEPTOS = [];
  }

  getPlanillas(cedula: number): Observable<DatoPlanilla[]> {
    let planillas = this.PLANILLAS.filter(planilla => planilla.estudiante.cedula === cedula);

    return of(planillas);
  }

  addPlanilla(planilla: DatoPlanilla) {
    this.PLANILLAS.push(planilla);
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
