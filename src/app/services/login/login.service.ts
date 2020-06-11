import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import { URL_SERVICIOS } from '../../config/config';

export interface Login {
	cedula: number;
	password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
  	public http: HttpClient,
  	private cookie: CookieService
  ) { }

  public login = (datosLogin: Login): Observable<any> => {
  	let url = `${URL_SERVICIOS}/login`;

    return this.http.post<Login>(url, datosLogin, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  public setToken = (token: string, acceso: string, user: number): void => { 
    this.cookie.set('token', token, 60*60*24);
    localStorage.setItem('acceso', acceso);
    localStorage.setItem('idUser', user.toString());
  }

  // HANDLE ERROR
  public handleError = (error): any => {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = error };

    return throwError(errorMessage);
  }
}
