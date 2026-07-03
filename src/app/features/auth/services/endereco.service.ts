import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Endereco, EnderecoForm } from '../models/endereco.model';

@Injectable({ providedIn: 'root' })
export class EnderecoService {

    private apiUrl = `${environment.apiUrl}/api/enderecos`;

    constructor(private http: HttpClient) { }

    listar() {
        return this.http.get<Endereco[]>(this.apiUrl);
    }

    criar(dto: EnderecoForm) {
        return this.http.post<Endereco>(this.apiUrl, dto);
    }

    atualizar(id: number, dto: EnderecoForm) {
        return this.http.put<Endereco>(`${this.apiUrl}/${id}`, dto);
    }

    buscarCep(cep: string) {
        const cepLimpo = cep.replace(/\D/g, '');
        return this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    }
}