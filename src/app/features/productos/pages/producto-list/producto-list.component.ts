import { Component, effect, inject, signal } from '@angular/core';
import { PageResponse, ProductoTabularDTO } from '../../../../core/interfaces/producto.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../../../core/services/producto.service';
import { FormsModule } from '@angular/forms';

declare const Swal: any;

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './producto-list.component.html',
})
export class ProductoListComponent {

  private readonly productService = inject(ProductoService);

  // 1. Signals para controlar el estado de la consulta en tiempo real
  public marcaFiltro = signal<string>('');
  public modeloFiltro = signal<string>('');
  public paginaActual = signal<number>(0);
  public tamañoPagina = signal<number>(5);

  // 2. Signal que almacenará la respuesta estructural que viene del motor Java
  public pageData = signal<PageResponse<ProductoTabularDTO> | null>(null);

  constructor() {
    // reacciona ante cualquier cambio
    effect(() => {
      this.cargarProductos();
    });
  }

  private cargarProductos(): void {
    this.productService.listarPaginado(
      this.marcaFiltro(),
      this.modeloFiltro(),
      this.paginaActual(),
      this.tamañoPagina()
    ).subscribe({
      next: (response) => {
        this.pageData.set(response);
      },
      error: (err) => {
        console.error('Error al traer datos de Oracle:', err);
      }
    });
  }

  public irAPagina(numeroPagina: number): void {
    if (numeroPagina >= 0 && numeroPagina < (this.pageData()?.totalPages || 0)) {
      this.paginaActual.set(numeroPagina);
    }
  }

  // Genera un arreglo de números [0, 1, 2...] para pintar los botones de las páginas en el HTML
  public getTotalPaginasArray(): number[] {
    const total = this.pageData()?.totalPages || 0;
    return Array.from({ length: total }, (_, i) => i);
  }

  // Limpiar filtros restableciendo el búnker de búsqueda
  public limpiarFiltros(): void {
    this.marcaFiltro.set('');
    this.modeloFiltro.set('');
    this.paginaActual.set(0); // Regresa a la primera hoja
  }

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
        this.productService.eliminarLogico(idProducto).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El producto ha sido inactivado correctamente.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            // Refrescamos la lista de inmediato reutilizando la query activa
            this.cargarProductos();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo inactivar el producto.', 'error');
          }
        });
      }
    });
  }
}
