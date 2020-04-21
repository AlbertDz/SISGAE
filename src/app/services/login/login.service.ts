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

  login(datosLogin: Login): Observable<any> {
  	let url = `${URL_SERVICIOS}/login`;

    return this.http.post<Login>(url, datosLogin, this.httpOptions)
      .pipe(map((resp: any) => { return resp }),
        catchError(this.handleError))
  }

  setToken(token: string, acceso: string) { 
    this.cookie.set('token', token, 60*60*24);
    this.cookie.set('acceso', acceso, 60*60*24);
  }

  // HANDLE ERROR
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = error };

    return throwError(errorMessage);
  }
}
