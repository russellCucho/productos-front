import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoDetailDTO } from '../../../../core/interfaces/producto.interface';
import { ProductoService } from '../../../../core/services/producto.service';

@Component({
  selector: 'app-producto-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-detail.component.html',
})
export class ProductoDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductoService);

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
      this.producto.set({
        idProducto: id,
        codigo: 'PROD-TI-004',
        nombre: 'Monitor Gamer Asus ROG 24p (Actualizado 2)',
        marca: 'Asus',
        modelo: 'ROG Strix',
        precio: 949.99,
        stock: 300,
        estado: 'A', // 'A' = Activo, 'I' = Inactivo
        fechaCreacion: '2026-05-28T14:30:00.000+00:00',
        fechaModif: '2026-05-31T20:00:00.000+00:00'
      });
    }
  }
}
