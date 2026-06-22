import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cerveja } from '../models/cerveja.model';

@Injectable({ providedIn: 'root' })
export class CervejaService {

  private apiUrl = 'http://localhost:8080/api/cervejas';

  constructor(private http: HttpClient) { }

  listar(page: number, size: number, pais?: string, ordenarPreco?: string) {
    let url = `${this.apiUrl}?page=${page}&size=${size}`;
    if (pais) url += `&pais=${encodeURIComponent(pais)}`;
    if (ordenarPreco) url += `&ordenarPreco=${ordenarPreco}`;
    return this.http.get<any>(url);
  }

  buscarPorNome(nome: string, page: number, size: number, pais?: string, ordenarPreco?: string) {
    let url = `${this.apiUrl}/buscar?nome=${encodeURIComponent(nome)}&page=${page}&size=${size}`;
    if (pais) url += `&pais=${encodeURIComponent(pais)}`;
    if (ordenarPreco) url += `&ordenarPreco=${ordenarPreco}`;
    return this.http.get<any>(url);
  }

  listarPaises() {
    return this.http.get<string[]>(`${this.apiUrl}/paises`);
  }

  buscarPorId(id: number) {
    return this.http.get<Cerveja>(`${this.apiUrl}/${id}`);
  }
}