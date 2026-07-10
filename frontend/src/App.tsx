import { useState } from "react";
import type { Bloco } from "./features/unidades/types";
import { BlocoCard } from "./features/unidades/components/BlocoCard";
import { BlocoForm } from "./features/unidades/components/BlocoForm";

export function App() {
  // 1. Transformamos a variável fixa em um "Estado" do React.
  // Usamos o Generic <Bloco[]> para avisar o TS que essa memória guardará uma lista de Blocos.
  const [blocos, setBlocos] = useState<Bloco[]>([
    { id: 1, nome: "Bloco A - Girassol" },
    { id: 2, nome: "Bloco B - Orquídea" },
  ]);

  // 2. Criamos a função que sabe como adicionar um novo bloco na lista
  function adicionarBloco(nomeDoNovoBloco: string) {
    // Simulando a criação de um ID (já que ainda não temos o banco de dados)
    const novoId = blocos.length > 0 ? blocos[blocos.length - 1].id + 1 : 1;

    const novoBloco: Bloco = {
      id: novoId,
      nome: nomeDoNovoBloco,
    };

    // Atualizamos a memória: pegamos todos os blocos antigos (...blocos) e adicionamos o novo no final
    setBlocos([...blocos, novoBloco]);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-gray-800 font-bold mb-8">
          NeoCondo - Gestão de Unidades
        </h1>

        {/* 3. Injetamos o formulário na tela e passamos a nossa função como propriedade */}
        <BlocoForm onSalvar={adicionarBloco} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocos.map((blocoAtual) => (
            <BlocoCard key={blocoAtual.id} bloco={blocoAtual} />
          ))}
        </div>
      </div>
    </div>
  );
}
