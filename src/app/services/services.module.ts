import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from './login/login.service';
import { SesionActiveService} from './sesion-active/sesion-active.service';
import { SesionCloseService } from './sesion-active/sesion-close.service';
import { ArancelesService } from './aranceles/aranceles.service';
import { EstudiantesService } from './estudiantes/estudiantes.service';
import { BancosService } from './bancos/bancos.service';
import { FormatosService } from './formatos/formatos.service';
import { SesionAnalistaService } from './sesion-active/sesion-analista.service';
import { SesionControlService } from './sesion-active/sesion-control.service';
import { PeriodoService } from './periodo/periodo.service';
import { PostgradoService } from './postgrado/postgrado.service';
import { CarreraService } from './carrera/carrera.service';
import { ValidationsService }from './validaciones/validations.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
  	LoginService,
  	SesionActiveService,
  	ArancelesService,
  	EstudiantesService,
    BancosService,
    FormatosService,
    SesionCloseService,
    SesionAnalistaService,
    SesionControlService,
    PeriodoService,
    PostgradoService,
    CarreraService,
    ValidationsService,
  ]
})
export class ServicesModule { }
