import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private nombreApellido = new BehaviorSubject<string>('');
  public getNombreApellido = this.nombreApellido.asObservable();

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

  public setNombreApellido(datos: string) {
    this.nombreApellido.next(datos);
  }

  getToken() {
    return this.cookie.get('token');
  }

  getUsuario(cedula: string): Observable<any> {
  	let url = `${URL_SERVICIOS}/usuario/${cedula}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  setUsuario(cedula: string, datos: any): Observable<any> {
  	let url = `${URL_SERVICIOS}/usuario/${cedula}`;

  	return this.http.put<any>(url, datos, this.httpOptions)
  		.pipe(map((resp: any) => { return resp }),
  			catchError(this.handleError))
  }

  setPassword(cedula: string, password: string): Observable<any> {
    let url = `${URL_SERVICIOS}/usuario/password/${cedula}`;

    return this.http.put<any>(url, {password: password}, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  setPregunta(id: number, datos: any): Observable<any> {
    let url = `${URL_SERVICIOS}/usuario/pregunta/${id}`;

    return this.http.put<any>(url, datos, this.httpOptions)
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
