import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-confirmar-email',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './confirmar-email.html',
    styleUrl: './confirmar-email.css'
})
export class ConfirmarEmailComponent {

    sucesso = signal(false);
    erro = signal<string | null>(null);

    constructor(private route: ActivatedRoute, private authService: AuthService) {

        if (typeof window === 'undefined') {
            return; // não executa durante SSR (servidor)
        }

        const token = this.route.snapshot.queryParams['token'] || '';

        if (!token) {
            this.erro.set('Link inválido.');
            return;
        }

        this.authService.confirmarEmail(token)
            .pipe(catchError(() => {
                this.erro.set('Não foi possível confirmar o e-mail. O link pode ter expirado ou já foi usado.');
                return of(null);
            }))
            .subscribe(res => { if (res !== null) this.sucesso.set(true); });
    }
}