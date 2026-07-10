import type { Bloco } from "../types";

interface BlocoCardProps {
  bloco: Bloco;
}

export function BlocoCard({ bloco }: BlocoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">{bloco.nome}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          ID: {bloco.id}
        </span>
      </div>
      <div className="mt-4">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Ver unidades &rarr;
        </button>
      </div>
    </div>
  );
}
