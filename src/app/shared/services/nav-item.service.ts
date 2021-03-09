import { Injectable } from '@angular/core';
import { NavItem } from '../interfaces/nav-item';

@Injectable({
  providedIn: 'root'
})
export class NavItemService {

  menu: NavItem[] = [
    {
      displayName: 'Home',
      iconName: 'home',
      route: '/home',
    }, {
      displayName: 'Help',
      iconName: 'ballot',
      route: 'entradasGADE',
    }, {
      displayName: 'LP Validator',
      iconName: 'description',
      children: [
        {
          displayName: 'Validator 1',
          iconName: 'how_to_reg',
          route: '/user-space'
        }, {
          displayName: 'Validator 2',
          iconName: 'waves',
          route: '/todos'
        }
      ]
    }, {
      displayName: 'Profils',
      iconName: 'group',
      children: [
        {
          displayName: 'Settings',
          iconName: 'search',
          route: '/busquedaperfiles'
        }
      ]
    }
  ];
  constructor() { }
}
