import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PageResponse,
  ProductoTabularDTO,
  ProductoDetailDTO,
  ProductoCreateDTO,
  ProductoUpdateDTO
} from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/productos';

  listarPaginado(
    marca?: string | null,
    modelo?: string | null,
    page: number = 0,
    size: number = 5
  ): Observable<PageResponse<ProductoTabularDTO>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Agregamos los filtros a la URL solo si el usuario escribió algo en los inputs
    if (marca && marca.trim() !== '') {
      params = params.set('marca', marca.trim());
    }
    if (modelo && modelo.trim() !== '') {
      params = params.set('modelo', modelo.trim());
    }

    return this.http.get<PageResponse<ProductoTabularDTO>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<ProductoDetailDTO> {
    return this.http.get<ProductoDetailDTO>(`${this.apiUrl}/${id}`);
  }

  crear(dto: ProductoCreateDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: ProductoUpdateDTO): Observable<void> {
    return this.http.put<void>(`${`${this.apiUrl}/${id}`}`, dto);
  }

  eliminarLogico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
