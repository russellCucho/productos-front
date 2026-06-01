import { Routes } from '@angular/router';
import { ProductoListComponent } from './features/productos/pages/producto-list/producto-list.component';
import { ProductoFormComponent } from './features/productos/pages/producto-form/producto-form.component';
import { ProductoDetailComponent } from './features/productos/pages/producto-detail/producto-detail.component';

export const routes: Routes = [
  { path: 'productos', component: ProductoListComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: 'productos/detalle/:id', component: ProductoDetailComponent },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'productos' }
];
