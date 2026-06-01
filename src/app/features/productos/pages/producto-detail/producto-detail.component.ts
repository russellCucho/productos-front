import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoDetailDTO } from '../../../../core/interfaces/producto.interface';
import { ProductoService } from '../../../../core/services/producto.service';

declare const Swal: any; // Por si necesitas alertar un error visualmente

@Component({
  selector: 'app-producto-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-detail.component.html',
})
export class ProductoDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductoService);
  private readonly router = inject(Router);

  // Signal para almacenar la data del producto de forma reactiva
  public producto = signal<ProductoDetailDTO | null>(null);

  ngOnInit(): void {
    this.cargarDetalleProducto();
  }

  private cargarDetalleProducto(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);

      // Simulación estática del DTO completo de auditoría que viene de Oracle
      // (En la siguiente fase lo cambiaremos por: this.productService.obtenerPorId(id)...)
      this.productService.obtenerPorId(id).subscribe({
        next: (data) => {
          this.producto.set(data); // Inyectamos la respuesta del SP en el Signal
        },
        error: (err) => {
          console.error('Error al recuperar auditoría de Oracle:', err);
          Swal.fire('Error', 'No se pudo obtener el detalle de auditoría.', 'error');
          this.router.navigate(['/productos']); // Redirección segura si el ID no existe
        }
      });
    }
  }
}
