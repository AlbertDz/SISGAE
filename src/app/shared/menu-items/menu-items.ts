import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'inicio', name: 'Inicio', type: 'link', icon: 'home' },
  { state: 'arancel', name: 'Arancel', type: 'link', icon: 'account_balance_wallet' },
  { state: 'aranceles', name: 'Aranceles', type: 'link', icon: 'view_list' },
  { state: 'consulta', name: 'Consulta', type: 'link', icon: 'blur_circular' },
  { state: 'grupos', name: 'Grupos', type: 'link', icon: 'view_comfy' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
