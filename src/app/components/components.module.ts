import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';

import { DemoMaterialModule } from '../demo-material-module';

import { ModalsModule } from '../modals/modals.module';

import { PlanillaArancelesComponent, AddArancelesComponent, ConfirmarCantidad } from './planilla-aranceles/planilla-aranceles.component';
import { DatosBancariosComponent, Referencia } from './datos-bancarios/datos-bancarios.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
  	PlanillaArancelesComponent,
  	DatosBancariosComponent,
  	AddArancelesComponent,
    ConfirmarCantidad,
    Referencia,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ModalsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  exports: [
  	PlanillaArancelesComponent,
  	DatosBancariosComponent,
    LoadingComponent
  ],
  entryComponents: [
    AddArancelesComponent,
    ConfirmarCantidad,
    Referencia,
  ],
})
export class ComponentsModule { }
