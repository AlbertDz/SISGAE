import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';
import { SesionActiveService } from './services/sesion-active/sesion-active.service';
import { SesionCloseService } from './services/sesion-active/sesion-close.service';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/inicio',
        pathMatch: 'full'
      },
      {
        path: '',
        canActivate: [ SesionActiveService ],
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'inicio',
        canActivate: [ SesionActiveService ],
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      // { path: '**', component: PageNotFoundComponent }
    ]
  },
  { path: 'login', canActivate: [ SesionCloseService ], component: LoginComponent },
];
