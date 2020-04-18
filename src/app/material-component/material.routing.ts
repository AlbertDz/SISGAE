import { Routes } from '@angular/router';

import { ArancelComponent } from './arancel/arancel.component';
import { ArancelesComponent } from './aranceles/aranceles.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { GruposComponent } from './grupos/grupos.component';

export const MaterialRoutes: Routes = [
  {
    path: 'arancel',
    component: ArancelComponent
  },
  {
    path: 'aranceles',
    component: ArancelesComponent
  },
  {
    path: 'consulta',
    component: ConsultarComponent
  },
  {
    path: 'grupos',
    component: GruposComponent
  },
];
