import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators'

// import { Arancel } from './arancel';
// import { Concepto } from './concepto';
// import { ARANCELES } from './aranceles';
// import { DatoPlanilla } from './planilla-arancel';

import { URL_SERVICIOS } from '../../config/config';

import {Estudiante} from './estudiante';
import {ESTUDIANTES} from './estudiantes';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
  	public http: HttpClient,
  ) { }

  getEstudiante(cedula: number): Observable<any> {
  	let url = `${URL_SERVICIOS}/estudiante/arancel/${cedula}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  // getEstudiante(cedula: number): Observable<Estudiante> {
  //   return of(ESTUDIANTES.find(estudiante => estudiante.cedula === cedula));
  // }

  // HANDLE ERROR
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}` };

    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
