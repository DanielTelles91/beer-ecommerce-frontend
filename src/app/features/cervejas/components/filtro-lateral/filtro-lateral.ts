import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CervejaService } from '../../services/cerveja.service';

@Component({
    selector: 'app-filtro-lateral',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './filtro-lateral.html',
    styleUrl: './filtro-lateral.css'
})
export class FiltroLateralComponent implements OnInit {

    @Input() paisSelecionado: string | null = null;
    @Input() sortSelecionado: string | null = null;

    @Output() paisChange = new EventEmitter<string | null>();
    @Output() sortChange = new EventEmitter<string | null>();

    paises = signal<string[]>([]);

    constructor(private service: CervejaService) { }

    ngOnInit() {
        this.service.listarPaises().subscribe(paises => {
            this.paises.set(paises);
        });
    }

    selecionarPais(pais: string) {
        this.paisChange.emit(this.paisSelecionado === pais ? null : pais);
    }

    ordenarPreco(direcao: 'asc' | 'desc') {
        this.sortChange.emit(this.sortSelecionado === direcao ? null : direcao);
    }
}