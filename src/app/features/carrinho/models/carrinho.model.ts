export interface CarrinhoItem {
    itemId: number;
    cervejaId: number;
    rotulo: string;
    preco: number;
    quantidade: number;
    subtotal: number;
    estoqueDisponivel: number;
}

export interface Carrinho {
    itens: CarrinhoItem[];
    total: number;
    totalItens: number;
}