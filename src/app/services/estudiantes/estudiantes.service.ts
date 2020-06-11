import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';

import { URL_SERVICIOS } from '../../config/config';

import {Estudiante} from './estudiante';
import {ESTUDIANTES} from './estudiantes';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

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

  nuevoIngreso(datos): Observable<any> {
    let url = `${URL_SERVICIOS}/estudiante`;

    return this.http.post<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  addDocumentos = (documentos: any[]): Observable<any> => {
    let url = `${URL_SERVICIOS}/estudiante/documentos`;

    return this.http.post<any[]>(url, documentos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError));
  }

  getEstudiante(cedula: number): Observable<any> {
  	let url = `${URL_SERVICIOS}/estudiante/arancel/${cedula}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  getDocumentos(): Observable<any> {
    let url = `${URL_SERVICIOS}/documentos`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  documentosFaltantes(cedula: number): Observable<any> {
    let url = `${URL_SERVICIOS}/documentos/${cedula}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  updateDocumentos(cedula: any, datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/documentos/${cedula}`;

    return this.http.put<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  getNacionalidad(): Observable<any> {
    let url = `${URL_SERVICIOS}/nacionalidad`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  getEstudianteCedula(cedula: number): Observable<any> {
    let url = `${URL_SERVICIOS}/estudiante/${cedula}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  generarPlanilla(datos): Observable<any> {
    let url = `${URL_SERVICIOS}/inscripcion/planilla`;

    return this.http.post<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  inscribirMaterias(datos): Observable<any> {
    let url = `${URL_SERVICIOS}/inscripcion/materias`;

    return this.http.post<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
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
