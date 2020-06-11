import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

 private pregunta = new BehaviorSubject<string>('');
 private respuesta = new BehaviorSubject<string>('');
 public customPregunta = this.pregunta.asObservable();
 public customRespuesta = this.respuesta.asObservable();

  constructor(
    public http: HttpClient,
    private cookie: CookieService
  ) { }

  private getToken = (): string => {
    return this.cookie.get('token');
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  httpOptionsToken = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  }

  public validateUser = (cedula: number): Observable<any> => {
  	let url = `${URL_SERVICIOS}/user/${cedula}`;

    return this.http.get(url, this.httpOptions)
      .pipe(map((resp: any) => {
        if (resp.length !== 0) {
          this.pregunta.next(resp[0].pregunta);
          this.respuesta.next(resp[0].respuesta);
        }

      	return (resp.length > 0) ?null :{NotUser: true};
      }), catchError(this.handleError))
  }

  public validarEstudiante = (cedula: number): Observable<any> => {
    let url = `${URL_SERVICIOS}/estudiante/${cedula}`;

    return this.http.get(url, this.httpOptionsToken)
      .pipe(map((resp: any) => {
        return (resp.length > 0) ?null :{NotEstudiante: true};
      }), catchError(this.handleError))
  }

  // HANDLE ERROR
  public handleError = (error): any => {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) { errorMessage = error.error.message }
      else { errorMessage = error };

    return throwError(errorMessage);
  }
}
