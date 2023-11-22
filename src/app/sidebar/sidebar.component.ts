// sidebar.component.ts

import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'fa-home', route: '/inicio' },
    { label: 'Productos', icon: 'fa-cube', route: '/productos' },
    { label: 'Clientes', icon: 'fa-users', route: '/clientes' },
    { label: 'Platillos', icon: 'fa-solid fa-utensils', route: '/platillos' },
    { label: 'Agregar-Mesas', icon: 'fa-solid fa-circle-plus', route: '/agregar-mesas' },
    { label: 'Mesas', icon: 'fas fa-table', route: '/mesas' }
    // Agrega más opciones de menú según tus necesidades
  ];

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
