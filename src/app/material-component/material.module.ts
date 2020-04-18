import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ComponentsModule } from '../components/components.module';

import { MaterialRoutes } from './material.routing';

import { ArancelComponent, DialogSelection } from './arancel/arancel.component';
import { ArancelesComponent } from './aranceles/aranceles.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { GruposComponent } from './grupos/grupos.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    ComponentsModule,
  ],
  providers: [],
  entryComponents: [
    DialogSelection,
  ],
  declarations: [
    ArancelComponent,
    ArancelesComponent,
    ConsultarComponent,
    GruposComponent,
    DialogSelection,
  ]
})
export class MaterialComponentsModule {}
