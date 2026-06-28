import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/clientes`;

  constructor(private http: HttpClient) { }

  definirSenha(token: string, novaSenha: string) {
    const params = new URLSearchParams();
    params.set('token', token);
    params.set('novaSenha', novaSenha);

    return this.http.post(
      `${this.apiUrl}/definir-senha?${params.toString()}`,
      {},
      { responseType: 'text' }
    );
  }

  cadastro(dto: any) {
    return this.http.post(`${this.apiUrl}/cadastro`, dto, { responseType: 'text' });
  }

  confirmarEmail(token: string) {
    return this.http.get(`${this.apiUrl}/confirmar-email?token=${token}`, { responseType: 'text' });
  }
}