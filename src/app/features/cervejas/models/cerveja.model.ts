export interface Cerveja {
  id: number;
  rotulo: string;
  preco: string;
  disponibilidade: boolean;
  cor: string;
  descricao: string;
  familia_e_estilo: string;
  sabor: string;
  temperatura: string;
  teor: string;
  volume: string;
  imagem_1: string;
  imagem_2: string;
  imagem_3: string;
  cervejaria: {
    id: number;
    cervejaria: string;
    pais: string;
  };
}