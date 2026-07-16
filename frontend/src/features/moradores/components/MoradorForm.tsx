import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Unidade } from "../../unidades/types";
import { toast } from "react-hot-toast";

interface MoradorFormProps {
  unidadesDisponiveis: Unidade[];
  onSalvar: (
    nome: string,
    cpf: string,
    telefone: string,
    unidadeId: number,
  ) => void;
}

export function MoradorForm({
  unidadesDisponiveis,
  onSalvar,
}: MoradorFormProps) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [unidadeIdSelecionada, setUnidadeIdSelecionada] = useState<number | "">(
    "",
  );

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const nomeLimpo = nome.trim();
    const cpfLimpo = cpf.trim();

    if (!nomeLimpo && !cpfLimpo) {
      toast.error("Nome e CPF são obrigatórios!");
      return;
    }

    if (!nomeLimpo) {
      toast.error("Nome é obrigatório!");
      return;
    }

    if (!cpfLimpo) {
      toast.error("CPF é obrigatório!");
      return;
    }

    if (unidadeIdSelecionada === "") {
      toast.error("Você deve selecionar uma unidade onde o morador reside!");
      return;
    }

    onSalvar(nome, cpf, telefone, Number(unidadeIdSelecionada));

    setNome("");
    setCpf("");
    setTelefone("");
    setUnidadeIdSelecionada("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Novo Morador</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="nomeMorador"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome Completo *
          </label>
          <input
            type="text"
            id="nomeMorador"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Carlos Silva"
          />
        </div>

        <div>
          <label
            htmlFor="cpfMorador"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            CPF *
          </label>
          <input
            type="text"
            id="cpfMorador"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 123.456.789-00"
            maxLength={14}
          />
        </div>

        <div>
          <label
            htmlFor="telefoneMorador"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Telefone
          </label>
          <input
            type="text"
            id="telefoneMorador"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: (11) 98765-4321"
          />
        </div>

        <div>
          <label
            htmlFor="unidadeSelectMorador"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Unidade (Residência) *
          </label>
          <select
            id="unidadeSelectMorador"
            value={unidadeIdSelecionada}
            onChange={(e) =>
              setUnidadeIdSelecionada(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Selecione a Unidade --</option>
            {unidadesDisponiveis.map((unidade) => (
              <option key={unidade.id} value={unidade.id}>
                Unidade {unidade.numero} ({unidade.bloco.nome})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Salvar Morador
        </button>
      </div>
    </form>
  );
}
