import { Injectable } from '@angular/core';
import { NavItem } from '../interfaces/nav-item';

@Injectable({
  providedIn: 'root'
})
export class NavItemService {

  menu: NavItem[] = [
    {
      displayName: 'Escritorio',
      iconName: 'desktop_windows',
      route: 'escritorio',
    },  {
      displayName: 'Entradas GADE',
      iconName: 'ballot',
      route: 'entradasGADE',
    }, {
      displayName: 'Expedientes',
      iconName: 'description',
      children: [
        {
          displayName: 'Mis Expedientes',
          iconName: 'how_to_reg',
          route: '/misexpedientes'
        }, {
          displayName: 'Todos',
          iconName: 'waves',
          route: '/todos'
        }
      ]
    }, {
      displayName: 'Perfiles',
      iconName: 'group',
      children: [
        {
          displayName: 'Búsqueda Perfil',
          iconName: 'search',
          route: '/busquedaperfiles'
        }
      ]
    }
  ];
  constructor() { }
}
