import { Component } from '@angular/core';
import { ProductoTabularDTO } from '../../../../core/interfaces/producto.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare const Swal: any;

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-list.component.html',
})
export class ProductoListComponent {

  public productosSimulados: ProductoTabularDTO[] = [
    { idProducto: 25, codigo: 'PROD-TI-004', nombre: 'Monitor Gamer 24 pulgadas', marca: 'Asus', modelo: 'TUF Gaming', precio: 899.90, stock: 15 },
    { idProducto: 23, codigo: 'PROD-TI-002', nombre: 'Teclado Mecánico RGB', marca: 'Razer', modelo: 'Huntsman Mini', precio: 450.00, stock: 8 },
    { idProducto: 22, codigo: 'PROD-TI-003', nombre: 'Mouse Inalámbrico Pro', marca: 'Logitech', modelo: 'G Pro X', precio: 399.99, stock: 30 },
    { idProducto: 21, codigo: 'PROD-TI-001', nombre: 'Audífonos HyperX Cloud', marca: 'HyperX', modelo: 'Cloud II', precio: 299.90, stock: 12 }
  ];

  public confirmarEliminacion(idProducto: number, nombreProducto: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `El producto "${nombreProducto}" pasará a estado Inactivo`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Color rojo peligro de Bootstrap
      cancelButtonColor: '#6c757d',  // Color gris secundario de Bootstrap
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true // Pone el botón de confirmar a la derecha (estándar UX)
    }).then((result: any) => {
      if (result.isConfirmed) {

        // Aquí adentro es donde conectaremos la cañería real:
        // this.productService.eliminarLogico(idProducto).subscribe(...)

        console.log(`Disparando DELETE al SP para pasar a 'I' el ID: ${idProducto}`);

        // Modal de éxito final instantáneo
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido inactivado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}
