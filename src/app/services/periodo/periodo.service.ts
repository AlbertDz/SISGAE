import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';
import { Periodo } from './periodo';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

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

  public getPeriodos = (): Observable<Periodo[]> => {
    let url = `${URL_SERVICIOS}/periodos`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getMeses = (id: string): Observable<any[]> => {
    let url = `${URL_SERVICIOS}/meses/${id}`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getSemestres(): Observable<any[]> {
    let url = `${URL_SERVICIOS}/semestres`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  // HANDLE ERROR
  private handleError = (error): any => {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}` };

    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
