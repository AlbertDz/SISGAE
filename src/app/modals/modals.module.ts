import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpcionConceptoComponent } from './opcion-concepto/opcion-concepto.component';
import { StatusDatosComponent } from './status-datos/status-datos.component';
import { RecoverComponent } from './recover/recover.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ConfigComponent } from './config/config.component';

@NgModule({
  declarations: [
  OpcionConceptoComponent,
  StatusDatosComponent,
  RecoverComponent,
  PerfilComponent,
  ConfigComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    OpcionConceptoComponent,
    StatusDatosComponent,
    RecoverComponent,
    PerfilComponent,ConfigComponent
  ],
})
export class ModalsModule { }
