import type { Unidade } from "../../unidades/types";

export interface Morador {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  unidade: Unidade;
}
