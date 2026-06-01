import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoCreateDTO, ProductoUpdateDTO } from '../../../../core/interfaces/producto.interface';
import { ProductoService } from '../../../../core/services/producto.service';

export enum FormMode {
  CREAR = 'CREAR',
  EDITAR = 'EDITAR'
}

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
})
export class ProductoFormComponent implements OnInit {
private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Estado reactivo de la vista usando Signals
  public mode = signal<FormMode>(FormMode.CREAR);
  public idProducto = signal<number | null>(null);

  // Exponemos el Enum al HTML
  public FormModeEnum = FormMode;

  // Declaramos el búnker del Formulario Reactivo matching con las restricciones del Back
  public productoForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.verificarModo();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      marca: ['', [Validators.required, Validators.maxLength(60)]],
      modelo: ['', [Validators.required, Validators.maxLength(60)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      estado: ['A'] // Solo se usará en modo EDITAR
    });
  }

  private verificarModo(): void {
    // Capturamos el parámetro :id de la URL de forma síncrona al arrancar
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.mode.set(FormMode.EDITAR);
      this.idProducto.set(Number(idParam));

      // Deshabilitamos el código para proteger la restricción única de Oracle (UK_PRODUCTO_CODIGO)
      this.productoForm.get('codigo')?.disable();

      // Simulamos la carga de datos (luego lo conectamos a tu método obtenerPorId)
      this.cargarProductoParaEditar();
    }
  }

  private cargarProductoParaEditar(): void {
    // Simulación estática para maquetar el formulario precargado
    const dataSimulada = {
      codigo: 'PROD-TI-004',
      nombre: 'Monitor Gamer 24 pulgadas',
      marca: 'Asus',
      modelo: 'TUF Gaming',
      precio: 899.90,
      stock: 15,
      estado: 'A'
    };
    this.productoForm.patchValue(dataSimulada);
  }

  /**
   * Helper estático incrustado para extraer los textos de error reactivos
   * ¡Calidad de código pura! Evita duplicaciones absurdas en el HTML.
   */
  public getErrorMessage(controlName: string): string | null {
    const control = this.productoForm.get(controlName);
    if (!control || !control.errors || !control.touched) return null;

    const errors = control.errors;
    if (errors['required']) return 'Este campo es obligatorio.';
    if (errors['maxlength']) return `El máximo permitido es de ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['min']) return `El valor mínimo permitido es ${errors['min'].min}.`;

    return 'Campo inválido.';
  }

  public guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched(); // Enciende los errores visuales si intentan mandar el form vacío
      return;
    }

    // Extraemos los datos del formulario (incluyendo los deshabilitados como el código)
    const formRawValues = this.productoForm.getRawValue();

    if (this.mode() === FormMode.CREAR) {
      console.log('Disparando POST al Back con DTO:', formRawValues as ProductoCreateDTO);
    } else {
      console.log(`Disparando PUT al Back para el ID ${this.idProducto()}:`, formRawValues as ProductoUpdateDTO);
    }

    // Redirigimos de vuelta al listado principal con la tabla actualizada
    this.router.navigate(['/productos']);
  }
}
