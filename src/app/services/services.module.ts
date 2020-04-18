import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from './login/login.service';
import { SesionActiveService } from './sesion-active/sesion-active.service';
import { ArancelesService } from './aranceles/aranceles.service';
import { EstudiantesService } from './estudiantes/estudiantes.service';
import { BancosService } from './bancos/bancos.service';
import { FormatosService } from './formatos/formatos.service';

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
  ]
})
export class ServicesModule { }
