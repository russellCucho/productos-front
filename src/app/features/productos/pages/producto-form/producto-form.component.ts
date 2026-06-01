import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoCreateDTO, ProductoUpdateDTO } from '../../../../core/interfaces/producto.interface';
import { ProductoService } from '../../../../core/services/producto.service';

declare const Swal: any;

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
      this.cargarProducto(Number(idParam));
    }
  }

  private cargarProducto(id: number): void {
    this.productService.obtenerPorId(id).subscribe({
      next: (productoData) => {
        // Estampamos los valores devueltos por el cursor directamente en los inputs
        this.productoForm.patchValue(productoData);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la información del producto.', 'error');
        this.router.navigate(['/productos']);
      }
    });
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
    const formValues = this.productoForm.getRawValue();

    if (this.mode() === FormMode.CREAR) {

      // 2. ENVIAR POST: Registrar nuevo producto
      const nuevoProducto: ProductoCreateDTO = {
        codigo: formValues.codigo,
        nombre: formValues.nombre,
        marca: formValues.marca,
        modelo: formValues.modelo,
        precio: formValues.precio,
        stock: formValues.stock
      };

      this.productService.crear(nuevoProducto).subscribe({
        next: (idGenerado) => {
          Swal.fire({
            title: '¡Registrado!',
            text: `El producto se guardó correctamente con ID #${idGenerado}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          Swal.fire('Error', err.error?.mensaje || 'No se pudo registrar el producto de forma inesperada.', 'error');
        }
      });

    } else {

      // 3. ENVIAR PUT: Actualizar producto existente
      const id = this.idProducto();
      if (!id) return;

      const productoEditado: ProductoUpdateDTO = {
        codigo: formValues.codigo,
        nombre: formValues.nombre,
        marca: formValues.marca,
        modelo: formValues.modelo,
        precio: formValues.precio,
        stock: formValues.stock,
        estado: formValues.estado
      };

      this.productService.actualizar(id, productoEditado).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Actualizado!',
            text: 'Los cambios fueron aplicados en la base de datos.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          Swal.fire('Error', err.error?.mensaje || 'No se pudieron guardar los cambios.', 'error');
        }
      });

    }

  }
}
