interface ConfirmModalProps {
  isOpen: boolean;
  titulo: string;
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmModal({
  isOpen,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h3>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{mensagem}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
