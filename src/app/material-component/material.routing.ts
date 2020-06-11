import { Routes } from '@angular/router';

import { ArancelComponent } from './arancel/arancel.component';
import { ArancelesComponent } from './aranceles/aranceles.component';
import { SesionAnalistaService } from '../services/sesion-active/sesion-analista.service';
import { SesionControlService } from '../services/sesion-active/sesion-control.service';
import { EstudianteComponent } from './estudiante/estudiante.component';
import { IndexComponent as EstudianteIndex } from './estudiante/index/index.component';
import { InscripcionComponent } from './estudiante/inscripcion/inscripcion.component';
import { ConstanciaEstudioComponent } from './estudiante/constancia-estudio/constancia-estudio.component';
import { ConstanciaInscripcionComponent } from './estudiante/constancia-inscripcion/constancia-inscripcion.component';
import { RecordComponent } from './estudiante/record/record.component';
import { HorarioComponent } from './estudiante/horario/horario.component';
import { NuevoIngresoComponent } from './estudiante/nuevo-ingreso/nuevo-ingreso.component';
import { EspecializacionComponent } from './especializacion/especializacion.component';
import { CarreraComponent } from './especializacion/carrera/carrera.component';
import { MateriaComponent } from './especializacion/materia/materia.component';

export const MaterialRoutes: Routes = [
  {
    path: 'arancel',
    canActivate: [ SesionAnalistaService ],
    component: ArancelComponent
  },
  {
    path: 'aranceles',
    canActivate: [ SesionAnalistaService ],
    component: ArancelesComponent
  },
  {
    path: 'estudiante',
    canActivate: [ SesionControlService ],
    component: EstudianteComponent,
    children: [
      {
        path: '',
        component: EstudianteIndex
      },
      {
        path: 'inscripcion/:cedula',
        component: InscripcionComponent
      },
      {
        path: 'constancia-inscripcion/:cedula',
        component: ConstanciaInscripcionComponent
      },
      {
        path: 'constancia-estudio/:cedula',
        component: ConstanciaEstudioComponent
      },
      {
        path: 'record/:cedula',
        component: RecordComponent
      },
      {
        path: 'horario/:cedula',
        component: HorarioComponent
      },
      {
        path: 'nuevo-ingreso',
        component: NuevoIngresoComponent
      }
    ]
  },
  {
    path: 'especializacion',
    canActivate: [ SesionControlService ],
    component: EspecializacionComponent
  },
  {
    path: 'especializacion/:idEspecializacion/carreras',
    canActivate: [ SesionControlService ],
    component: CarreraComponent
  },
  {
    path: 'especializacion/:idEspecializacion/carreras/:idCarrera/materias',
    canActivate: [ SesionControlService ],
    component: MateriaComponent
  }
];
