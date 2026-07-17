import { useState } from "react";
import type { Bloco } from "../types";
import { ConfirmModal } from "../../../components/ConfirmModal";

interface BlocoCardProps {
  bloco: Bloco;
  onExcluir: (id: number) => void;
}

export function BlocoCard({ bloco, onExcluir }: BlocoCardProps) {
  const [modalAberto, setModalAberto] = useState(false);

  function handleAbrirModal() {
    setModalAberto(true);
  }

  function handleFecharModal() {
    setModalAberto(false);
  }

  function handleConfirmarExclusao() {
    onExcluir(bloco.id);
    setModalAberto(false);
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex justify-between items-center hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{bloco.nome}</h3>
          <p className="text-sm text-gray-500 mt-1">ID: {bloco.id}</p>
        </div>

        <button
          onClick={handleAbrirModal}
          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
          title="Excluir Bloco"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <ConfirmModal
        isOpen={modalAberto}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza de que deseja excluir o bloco "${bloco.nome}"?\n\nEsta ação não poderá ser desfeita.`}
        onConfirmar={handleConfirmarExclusao}
        onCancelar={handleFecharModal}
      />
    </>
  );
}
