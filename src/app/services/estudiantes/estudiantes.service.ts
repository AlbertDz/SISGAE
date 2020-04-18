import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import {Estudiante} from './estudiante';
import {ESTUDIANTES} from './estudiantes';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  constructor() { }

  getEstudiantes(): Observable<Estudiante[]> {
  	return of(ESTUDIANTES);
  }

  getEstudiante(cedula: number): Observable<Estudiante> {
    return of(ESTUDIANTES.find(estudiante => estudiante.cedula === cedula));
  }

}
