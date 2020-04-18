import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';

import { OpcionConceptoComponent } from './opcion-concepto/opcion-concepto.component';
import { StatusDatosComponent } from './status-datos/status-datos.component';

@NgModule({
  declarations: [
  OpcionConceptoComponent,
  StatusDatosComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
  ],
  entryComponents: [
    OpcionConceptoComponent,
    StatusDatosComponent,
  ],
})
export class ModalsModule { }
