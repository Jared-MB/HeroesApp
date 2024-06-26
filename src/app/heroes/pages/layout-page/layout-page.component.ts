import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: `
    .header {
      border-bottom: 1px solid #a855f7;
      * {
        color: #a855f7;

      }
    }
  `
})
export class LayoutPageComponent {

  public sidebarItems = [
    {
      label: 'Listado',
      icon: 'label',
      url: './list'
    },
    {
      label: 'Añadir',
      icon: 'add',
      url: './new-hero'
    },
    {
      label: 'Buscar',
      icon: 'search',
      url: './search'
    }
  ]

}
