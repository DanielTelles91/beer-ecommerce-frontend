export interface ItemPedido {
    id: number;
    cervejaId: number;
    rotulo: string;
    nomeCervejaria: string;
    precoUnitario: number;
    imagem: string;
    quantidade: number;
    subtotal: number;
    cervejariaId: number;
}

export interface HistoricoStatus {
    status: string;
    dataMudanca: string;
}

export interface Pedido {
    id: number;
    dataPedido: string;
    status: string;
    total: number;
    enderecoCompleto: string;
    itens: ItemPedido[];
    historico: HistoricoStatus[];
}