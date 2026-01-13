export interface Cerveja {
  id: number;
  rotulo: string;
  preco: string;
  imagem_1: string;
  imagem_2: string;
  imagem_3: string;
  cervejaria: {
    id: number;
    cervejaria: string;
    pais: string;
  };
}