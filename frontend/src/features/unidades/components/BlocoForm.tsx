import { useState } from "react";
import type { SubmitEvent } from "react";
import { toast } from "react-hot-toast";

interface BlocoFormProps {
  onSalvar: (nomeDoBloco: string) => void;
}

export function BlocoForm({ onSalvar }: BlocoFormProps) {
  const [nome, setNome] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      toast.error("O nome do bloco não pode ser vazio.");
      return;
    }

    onSalvar(nome);
    setNome("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Novo Bloco</h2>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do Bloco
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Bloco A"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
