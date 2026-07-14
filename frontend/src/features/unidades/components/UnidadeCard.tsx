import type { Unidade } from "../types";

interface UnidadeCardProps {
  unidade: Unidade;
}

export function UnidadeCard({ unidade }: UnidadeCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Unidade {unidade.numero}
        </h3>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          ID: {unidade.id}
        </span>
      </div>

      <div className="flex items-center text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
        <svg
          className="w-5 h-5 mr-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="font-medium">Pertence ao:</span>
        <span className="ml-1">{unidade.bloco.nome}</span>
      </div>
    </div>
  );
}
