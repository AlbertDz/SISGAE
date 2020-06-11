import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENU_ANALISTA = [
  { state: 'inicio', name: 'Inicio', type: 'link', icon: 'home' },
  { state: 'arancel', name: 'Arancel', type: 'link', icon: 'blur_circular' },
  { state: 'aranceles', name: 'Reporte Aranceles', type: 'link', icon: 'view_list' },
];

const MENU_CONTROL_ESTUDIO = [
  { state: 'inicio', name: 'Inicio', type: 'link', icon: 'home' },
  { state: 'estudiante', name: 'Estudiante', type: 'link', icon: 'person' },
  { state: 'especializacion', name: 'Especialización', type: 'link', icon: 'view_list' },
];


@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return ( localStorage.getItem('acceso') === '0' ) ?MENU_ANALISTA :MENU_CONTROL_ESTUDIO;
  }
}
