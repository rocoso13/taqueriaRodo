// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { CustomerComponent } from './customer/customer.component';
import { PlatillosComponent } from './platillos/platillos.component';
import { AgregarMesasComponent } from './agregar-mesas/agregar-mesas.component';
import { MesasComponent } from './mesas/mesas.component';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'productos', component: ProductComponent },
  { path: 'clientes', component: CustomerComponent },
  { path: 'platillos', component: PlatillosComponent },
  { path: 'agregar-mesas', component: AgregarMesasComponent },
  { path: 'mesas', component: MesasComponent },
  // Agrega más rutas según tus necesidades
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
