import { useState, useEffect } from "react";
import type { Bloco, Unidade } from "./features/unidades/types";
import type { Morador } from "./features/moradores/types";

import { BlocoCard } from "./features/unidades/components/BlocoCard";
import { BlocoForm } from "./features/unidades/components/BlocoForm";
import { UnidadeCard } from "./features/unidades/components/UnidadeCard";
import { UnidadeForm } from "./features/unidades/components/UnidadeForm";
import { MoradorCard } from "./features/moradores/components/MoradorCard";
import { MoradorForm } from "./features/moradores/components/MoradorForm";

import { api } from "./services/api";

export function App() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [moradores, setMoradores] = useState<Morador[]>([]);

  useEffect(() => {
    carregarBlocos();
    carregarUnidades();
    carregarMoradores();
  }, []);

  async function carregarBlocos() {
    try {
      const response = await api.get("/blocos");
      setBlocos(response.data);
    } catch (error) {
      console.error("Erro ao carregar blocos:", error);
    }
  }

  async function carregarUnidades() {
    try {
      const response = await api.get("/unidades");
      setUnidades(response.data);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  }

  async function carregarMoradores() {
    try {
      const response = await api.get("/moradores");
      setMoradores(response.data);
    } catch (error) {
      console.error("Erro ao carregar moradores:", error);
    }
  }

  async function adicionarBloco(nomeDoNovoBloco: string) {
    try {
      const response = await api.post("/blocos", { nome: nomeDoNovoBloco });
      setBlocos([...blocos, response.data]);
    } catch (error) {
      alert("Não foi possível salvar o bloco.");
    }
  }

  async function adicionarUnidade(numeroDaUnidade: string, idDoBloco: number) {
    try {
      const response = await api.post("/unidades", {
        numero: numeroDaUnidade,
        bloco: { id: idDoBloco },
      });
      setUnidades([...unidades, response.data]);
    } catch (error) {
      alert("Não foi possível salvar a unidade.");
    }
  }

  async function adicionarMorador(
    nome: string,
    cpf: string,
    telefone: string,
    idDaUnidade: number,
  ) {
    try {
      const payload = {
        nome: nome,
        cpf: cpf,
        telefone: telefone,
        unidade: { id: idDaUnidade },
      };

      const response = await api.post("/moradores", payload);
      setMoradores([...moradores, response.data]);
    } catch (error) {
      console.error("Erro ao salvar morador:", error);
      alert(
        "Não foi possível salvar o morador. Verifique se o CPF já existe no banco.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-3xl text-gray-800 font-bold border-b pb-4">
          NeoCondo - Dashboard Admin
        </h1>

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Gestão de Blocos
          </h2>
          <BlocoForm onSalvar={adicionarBloco} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocos.map((blocoAtual) => (
              <BlocoCard key={blocoAtual.id} bloco={blocoAtual} />
            ))}
          </div>
        </section>

        <hr className="border-gray-300" />

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Gestão de Unidades
          </h2>
          <UnidadeForm blocosDisponiveis={blocos} onSalvar={adicionarUnidade} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unidades.map((unidadeAtual) => (
              <UnidadeCard key={unidadeAtual.id} unidade={unidadeAtual} />
            ))}
          </div>
        </section>

        <hr className="border-gray-300" />

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Gestão de Moradores
          </h2>

          <MoradorForm
            unidadesDisponiveis={unidades}
            onSalvar={adicionarMorador}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moradores.length === 0 ? (
              <p className="text-gray-500 col-span-full">
                Nenhum morador cadastrado ainda.
              </p>
            ) : (
              moradores.map((moradorAtual) => (
                <MoradorCard key={moradorAtual.id} morador={moradorAtual} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
