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
    DialogSelection,
    EstudianteComponent,
    EstudianteIndex,
    InscripcionComponent,
    ConstanciaEstudioComponent,
    ConstanciaInscripcionComponent,
    RecordComponent,
    HorarioComponent,
    NuevoIngresoComponent,
    EspecializacionComponent,
    CarreraComponent,
    MateriaComponent,
  ]
})
export class MaterialComponentsModule {}
