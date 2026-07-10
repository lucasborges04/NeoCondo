export interface Bloco {
  id: number;
  nome: string;
}

export interface Unidade {
  id: number;
  numero: string;
  bloco: Bloco;
}
