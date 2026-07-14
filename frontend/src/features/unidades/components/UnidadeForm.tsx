import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Bloco } from "../types";

interface UnidadeFormProps {
  blocosDisponiveis: Bloco[];
  onSalvar: (numeroDaUnidade: string, idDoBloco: number) => void;
}

export function UnidadeForm({ blocosDisponiveis, onSalvar }: UnidadeFormProps) {
  const [numero, setNumero] = useState("");
  const [blocoIdSelecionado, setBlocoIdSelecionado] = useState<number | "">("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (numero.trim() === "") {
      alert("O número da unidade é obrigatório!");
      return;
    }

    if (blocoIdSelecionado === "") {
      alert("Você deve selecionar um bloco!");
      return;
    }

    onSalvar(numero, Number(blocoIdSelecionado));
    setNumero("");
    setBlocoIdSelecionado("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Nova Unidade</h2>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label
            htmlFor="numeroUnidade"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número / Identificação
          </label>
          <input
            type="text"
            id="numeroUnidade"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ex: 101A, Casa 5"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="blocoSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vincular ao Bloco
          </label>
          <select
            id="blocoSelect"
            value={blocoIdSelecionado}
            onChange={(e) =>
              setBlocoIdSelecionado(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">-- Selecione um Bloco --</option>
            {blocosDisponiveis.map((bloco) => (
              <option key={bloco.id} value={bloco.id}>
                {bloco.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
        >
          Salvar Unidade
        </button>
      </div>
    </form>
  );
}
