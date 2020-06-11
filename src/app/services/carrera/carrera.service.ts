import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

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

  public getCarrera(id: any): Observable<any> {
    let url = `${URL_SERVICIOS}/carrera/${id}`;

    return this.http.get<any>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getCarreras = (id: number): Observable<any[]> => {
    let url = `${URL_SERVICIOS}/carreras/${id}`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public addCarrera(datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/carreras`;

    return this.http.post<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public deleteCarrera(id: number): Observable<any> {
    let url = `${URL_SERVICIOS}/carreras/${id}`;

    return this.http.delete<any>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public updateCarrera(id: number, datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/carreras/${id}`;

    return this.http.put<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getMaterias(): Observable<any> {
    let url = `${URL_SERVICIOS}/materias`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getMateria(id: any): Observable<any> {
    let url = `${URL_SERVICIOS}/materia/${id}`;

    return this.http.get<any>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getMateriasID = (id: number): Observable<any[]> => {
    let url = `${URL_SERVICIOS}/materias/${id}`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public addMateria(datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/materias`;

    return this.http.post<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public deleteMateria(id: number): Observable<any> {
    let url = `${URL_SERVICIOS}/materias/${id}`;

    return this.http.delete<any>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public updateMateria(id: number, datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/materias/${id}`;

    return this.http.put<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public materiasSemestre(idCarrera: number, idSemestre: number): Observable<any> {
    let url = `${URL_SERVICIOS}/carrera/${idCarrera}/materias/semestre/${idSemestre}`;

    return this.http.get<any>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  // HANDLE ERROR
  private handleError = (error): any => {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = `Error Code: ${error.status} Message: ${error.message}` };

    return throwError(errorMessage);
  }
}
