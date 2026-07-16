import type { Morador } from "../types";

interface MoradorCardProps {
  morador: Morador;
}

export function MoradorCard({ morador }: MoradorCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{morador.nome}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          Morador
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-700">CPF:</span>{" "}
          {morador.cpf}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-700">Telefone:</span>{" "}
          {morador.telefone || "Não informado"}
        </p>
      </div>

      <div className="flex items-center text-gray-600 text-sm bg-blue-50 p-3 rounded-md">
        <svg
          className="w-5 h-5 mr-2 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="font-medium">Residência:</span>
        {/* Acessa a árvore relacional: morador -> unidade -> bloco -> nome */}
        <span className="ml-1">
          Unidade {morador.unidade.numero} ({morador.unidade.bloco.nome})
        </span>
      </div>
    </div>
  );
}
