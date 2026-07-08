import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { ListaDesejosService } from '../../lista-desejos/services/lista-desejos.service';


interface Usuario {
  nome: string;
  email: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/clientes`;
  private tokenKey = 'auth_token';

  usuario = signal<Usuario | null>(null);

  constructor(private http: HttpClient, private listaService: ListaDesejosService) {
    if (typeof window !== 'undefined') {
      this.restaurarSessao();
    }

  }

  private restaurarSessao() {
    const token = localStorage.getItem(this.tokenKey);
    const nome = localStorage.getItem('auth_nome');
    const email = localStorage.getItem('auth_email');

    if (token && nome && email) {
      this.usuario.set({ nome, email });
      this.listaService.carregarFavoritos();
    }
  }

  login(email: string, senha: string) {
    const params = new URLSearchParams();
    params.set('email', email);
    params.set('senha', senha);

    return this.http.post<any>(`${this.apiUrl}/login?${params.toString()}`, {})
      .pipe(
        catchError(err => {
          return throwError(() => err);
        })
      );
  }

  salvarSessao(token: string, nome: string, email: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem('auth_nome', nome);
    localStorage.setItem('auth_email', email);
    this.usuario.set({ nome, email });
    this.criarEnderecoPendente();
    this.listaService.carregarFavoritos();
  }

  private criarEnderecoPendente() {
    const pendente = localStorage.getItem('endereco_pendente');
    if (!pendente) return;

    const dto = JSON.parse(pendente);
    this.http.post(`${this.apiUrl.replace('/clientes', '')}/enderecos`, dto).subscribe({
      next: () => localStorage.removeItem('endereco_pendente'),
      error: () => { } // falhou silenciosamente, cliente pode adicionar em Minha Conta
    });
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('auth_nome');
    localStorage.removeItem('auth_email');
    this.usuario.set(null);
    this.listaService.idsFavoritos.set(new Set());
  }

  estaLogado(): boolean {
    return this.usuario() !== null;
  }

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

  verificarCpf(cpf: string) {
    return this.http.get<{ disponivel: boolean }>(
      `${this.apiUrl}/verificar-cpf?cpf=${cpf}`
    );
  }

  verificarEmail(email: string) {
    return this.http.get<{ disponivel: boolean }>(
      `${this.apiUrl}/verificar-email?email=${email}`
    );
  }

  buscarPerfil() {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  editarPerfil(dto: any) {
    return this.http.put<any>(`${this.apiUrl}/me`, dto);
  }

  recuperarSenha(email: string) {
    return this.http.post(
      `${this.apiUrl}/recuperar-senha?email=${encodeURIComponent(email)}`,
      {},
      { responseType: 'text' }
    );
  }

  novaSenha(token: string, novaSenha: string) {
    return this.http.post(
      `${this.apiUrl}/nova-senha?token=${token}&novaSenha=${encodeURIComponent(novaSenha)}`,
      {},
      { responseType: 'text' }
    );
  }
}