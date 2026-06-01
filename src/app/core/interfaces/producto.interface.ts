export interface ProductoTabularDTO {
  idProducto: number;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  estado: string;
}

export interface ProductoDetailDTO {
  idProducto: number;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  estado: string;
  fechaCreacion: string; // Recibimos el timestamp ISO de Java como un string para formatear bonito
  fechaModif: string | null;
}

export interface ProductoCreateDTO {
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
}

export interface ProductoUpdateDTO {
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  estado: string;
}

// Interfaz para mapear la metadata del objeto inteligente Page de Spring Boot
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
