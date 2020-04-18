import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators'

import { Arancel } from './arancel';
import { Concepto } from './concepto';
import { ARANCELES } from './aranceles';
import { DatoPlanilla } from './planilla-arancel';

import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ArancelesService {

  CONCEPTOS: Concepto[] = [];
  PLANILLAS: DatoPlanilla[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    public http: HttpClient,
  ) { }

  getAranceles(): Observable<Arancel[]> {
    let url = `${URL_SERVICIOS}/conceptos`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  addArancel(arancel: Arancel): Observable<any> {
    let url = `${URL_SERVICIOS}/conceptos`;

    return this.http.post<Arancel>(url, arancel, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  deleteArancel(arancel: Arancel): Observable<any> {
    let url = `${URL_SERVICIOS}/conceptos/${arancel.codigo}`;

    return this.http.delete(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  addConcepto(concepto: Concepto) {
  	this.CONCEPTOS.push(concepto);
  }

  deleteConcepto(concepto: Concepto) {
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
