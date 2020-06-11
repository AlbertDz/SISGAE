import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class PostgradoService {

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

  public getPostgrado(id: any): Observable<any> {
    let url = `${URL_SERVICIOS}/postgrados/${id}`;

    return this.http.get<any>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public getPostgrados = (): Observable<any[]> => {
    let url = `${URL_SERVICIOS}/postgrados`;

    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public addPostgrado(datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/postgrados`;

    return this.http.post<any>(url, datos, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public deletePostgrado(id: number): Observable<any> {
    let url = `${URL_SERVICIOS}/postgrados/${id}`;

    return this.http.delete<any>(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public updatePostgrado(id: number, datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/postgrados/${id}`;

    return this.http.put<any>(url, datos, this.httpOptions)
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
