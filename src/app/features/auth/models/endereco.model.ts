export interface Endereco {
    id: number;
    cep: string;
    logradouro: string;
    tipo_logradouro: string;
    logradouro_numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface EnderecoForm {
    cep: string;
    logradouro: string;
    tipo_logradouro: string;
    logradouro_numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}