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

  CONCEPTOS: Concepto[] = [];
  PLANILLAS: DatoPlanilla[] = [];

  constructor(
    public http: HttpClient,
    private cookie: CookieService
  ) { }

  private getToken = (): string => {
    return this.cookie.get('token');
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  }

  public getArancel(id: number): Observable<any> {
    let url = `${URL_SERVICIOS}/arancel/${id}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getConceptos = (): Observable<Arancel[]> => {
    let url = `${URL_SERVICIOS}/conceptos`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public addConcepto = (arancel: Arancel): Observable<any> => {
    let url = `${URL_SERVICIOS}/conceptos`;

    return this.http.post<Arancel>(url, arancel, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public updateConcepto = (arancel: Arancel): Observable<any> => {
    let url = `${URL_SERVICIOS}/conceptos/${arancel.codigo}`;

    return this.http.put(url, arancel, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public deleteConcepto = (arancel: Arancel): Observable<any> => {
    let url = `${URL_SERVICIOS}/conceptos/${arancel.codigo}`;

    return this.http.delete(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public nuevoConcepto = (concepto: Concepto): void => {
    this.CONCEPTOS.push(concepto);
  }

  public borrarConcepto = (concepto: Concepto): void => {
    const INDICE = this.CONCEPTOS.findIndex(element => element.codigo === concepto.codigo);
    this.CONCEPTOS.splice(INDICE, 1);
  }

  public clearConceptos = (): void => {
    this.CONCEPTOS = [];
  }

  public getPlanillas = (cedula: number): Observable<DatoPlanilla[]> => {
    let url = `${URL_SERVICIOS}/planillas/${cedula}`;

    return this.http.get<DatoPlanilla[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getPlanilla = (id: number): Observable<any> => {
    let url = `${URL_SERVICIOS}/planilla/${id}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getConceptosPlanilla = (id: number): Observable<any[]> => {
    let url = `${URL_SERVICIOS}/planilla/${id}/conceptos`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public addPlanilla = (total: number, banco: number, diferencia: number, cedula: number, periodo: string): Observable<any> => {
    let url = `${URL_SERVICIOS}/planilla`;
    let concepto = this.CONCEPTOS[0].descripcion;
    
    let datos = {
      id_planilla: 0,
      total_conceptos: total,
      total_banco: banco,
      diferencia_pago: diferencia,
      id_estudiante: cedula,
      id_periodo: periodo,
      concepto_principal: concepto
    }

    return this.http.post(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError));
  }

  public addConceptos = (id: number): Observable<any> => {
    let url = `${URL_SERVICIOS}/planilla/${id}/conceptos`;

    return this.http.post<Concepto[]>(url, this.CONCEPTOS, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError));
  }

  public listAranceles = (datos: any): Observable<any[]> => {
    let url = `${URL_SERVICIOS}/reporte/aranceles`;

    return this.http.put(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError));
  }

  // HANDLE ERROR
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = `Error Code: ${error.status} Message: ${error.message}` };
    return throwError(errorMessage);
  }
  
}
