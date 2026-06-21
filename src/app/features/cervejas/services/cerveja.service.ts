import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cerveja } from '../models/cerveja.model';

@Injectable({ providedIn: 'root' })
export class CervejaService {

  private apiUrl = 'http://localhost:8080/api/cervejas';

  constructor(private http: HttpClient) { }

  listar(page: number, size: number) {
    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  buscarPorId(id: number) {
    return this.http.get<Cerveja>(`${this.apiUrl}/${id}`);
  }
}