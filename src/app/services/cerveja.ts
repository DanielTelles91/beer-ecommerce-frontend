import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cerveja } from '../models/cerveja';

@Injectable({ providedIn: 'root' })
export class CervejaService {

  private apiUrl = 'http://localhost:8080/api/cervejas';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Cerveja[]>(this.apiUrl);
  }
}

