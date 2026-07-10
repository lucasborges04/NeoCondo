# Modelagem de Domínio e Regras de Negócio — Sistema de Gestão de Condomínios

> Documento de modelagem: entidades centrais do domínio (Condomínio → Bloco → Unidade → Morador), seus atributos, relacionamentos, regras de negócio e as decisões arquiteturais tomadas — com o impacto de cada decisão em banco de dados, backend e frontend.

---

## 1. Visão Geral do Domínio

Hierarquia estrutural do condomínio:

```
Condomínio (1) ──< possui >── (N) Bloco
Bloco (1)      ──< possui >── (N) Unidade
Unidade (N) ──< relaciona-se >── (N) Morador
```

---

## 2. Entidade: Condomínio (Entidade Raiz)

**O que representa:** a instituição em si — entidade legal e física que engloba tudo, com personalidade jurídica, endereço físico e administração central. É o "guarda-chuva" do sistema (que no futuro pode evoluir para um modelo SaaS multi-condomínio).

**Atributos obrigatórios:**
- Nome (ex.: Condomínio Residencial das Flores)
- CNPJ (identificação legal e fiscal)
- Endereço completo (Rua, Número, CEP, Cidade, Estado)

**Atributos opcionais:**
- Telefone e e-mail da administração
- Data de fundação

**Regra de negócio:** só existe um condomínio ativo operando nesta instância do sistema no momento.

---

## 3. Entidade: Bloco / Torre (Subdivisão Física)

**O que representa:** o agrupamento físico de várias unidades residenciais (em condomínios verticais, "Torres" ou "Blocos"; em horizontais, "Quadras" ou "Ruas"). Fundamental para logística (ex.: onde entregar uma encomenda) e estrutura.

**Atributos obrigatórios:**
- Nome/Identificador (ex.: Bloco A, Torre 1, Edifício Girassol)

**Atributos opcionais:**
- Quantidade de andares (útil para futuras regras de limite de cadastro de unidades)

**Regra de negócio:** um Bloco não pode existir sem pertencer a um Condomínio.

**Relacionamento:** 1 Condomínio possui N Blocos.

---

## 4. Entidade: Unidade (Apartamento ou Casa)

Coração do módulo inicial do sistema — a propriedade privada em si, onde as pessoas moram e alvo de cobranças de taxas.

**Atributos obrigatórios:**
- Número/Identificador (ex.: 101, Casa 5)
- Bloco ao qual pertence

**Atributos opcionais:**
- Andar (pode ser derivado do número em muitos casos, mas útil explicitar)
- Fração ideal ou metragem (m², muito usado em sistemas financeiros reais para calcular a taxa de condomínio — pode ficar opcional no início)

**Regra de negócio:** uma Unidade não pode existir sem pertencer a um Bloco.

**Relacionamento:** 1 Bloco possui N Unidades.

### Como o administrador (síndico) usa esses dados no dia a dia
- Não quer apenas "ver uma lista de 500 apartamentos" — precisa saber, por exemplo, quantos apartamentos do Bloco B estão vazios.
- Ao registrar uma encomenda, a portaria precisa localizar rapidamente a unidade e o bloco de destino.
- Em caso de vazamento, o síndico precisa identificar rapidamente qual unidade fica exatamente acima da afetada — daí a importância de registrar número e bloco.

---

## 5. Regra de Negócio: Unicidade de Numeração das Unidades

**Decisão registrada:** os números dos apartamentos **podem se repetir em blocos diferentes** (ex.: existe o Apartamento 101 no Bloco A e também o Apartamento 101 no Bloco B). A identificação única de uma unidade é dada pela combinação **Bloco + Número**, e não pelo número isoladamente.

### 5.1 Impacto no Banco de Dados

Uma restrição `UNIQUE` simples na coluna `numero` não funcionaria, pois bloquearia a existência de "101" em mais de um bloco.

**Solução:** **Chave Única Composta** (*Composite Unique Constraint*) no PostgreSQL, combinando as colunas `bloco_id` + `numero`. A regra: essa combinação não pode existir duas vezes.

- `(Bloco A, 101)` → aceito
- `(Bloco B, 101)` → aceito
- `(Bloco A, 101)` repetido → rejeitado pelo banco (última e mais forte linha de defesa do sistema)

### 5.2 Impacto no Backend (Java / Spring Boot)

- **Modelagem:** a classe `Unidade` terá obrigatoriamente um atributo do tipo `Bloco` — relacionamento de Composição/Agregação em Orientação a Objetos.
- **Validação na camada de Service:** antes de salvar, o Service não pergunta apenas "a unidade 101 existe?", e sim "existe alguma unidade com o número 101 vinculada ao ID deste bloco específico?".
- **Custom Exceptions:** se a resposta for sim, o Service lança uma exceção de negócio (ex.: `UnidadeDuplicadaNoBlocoException`), impedindo a operação e retornando uma mensagem clara ao frontend.

### 5.3 Impacto no Frontend (React / UX)

A interface não pode ser um campo de texto solto "Número do Apartamento" — precisa refletir a hierarquia Bloco → Unidade:

- **No cadastro:** seleção em cascata — o usuário escolhe primeiro o Bloco (Dropdown/Select), e só então o campo "Número" é liberado.
- **Nas buscas/filtros:** ao digitar "101" na busca global, o sistema não deve trazer o resultado direto — deve exibir uma lista ("101 - Bloco A", "101 - Bloco B") para o porteiro escolher o destino correto antes de registrar o visitante.

### 5.4 Alternativas Avaliadas e Descartadas

**Alternativa A — Numeração sequencial global** (ex.: Bloco A = unidades 1–100, Bloco B = 101–200)
- Vantagem: mais simples de programar (um `UNIQUE` simples resolveria tudo).
- Desvantagem: engessa o mundo real — condomínios que usam numeração repetida entre blocos não seriam atendidos. O software deve se adaptar ao negócio, não o contrário.

**Alternativa B — Chave primária como string concatenada** (ex.: `"A-101"` como Primary Key)
- Vantagem: garante unicidade facilmente numa única coluna.
- Desvantagem: fere a normalização do banco e prejudica performance (buscas textuais são mais lentas que IDs numéricos). Renomear um bloco (ex.: "Bloco A" → "Torre Alpha") exigiria atualizar milhares de registros — na abordagem escolhida, basta atualizar o nome do bloco uma única vez.

---

## 6. Entidade: Morador e Relacionamento com a Unidade

**Pergunta de modelagem levantada:** um morador pode ser dono/inquilino de mais de uma unidade simultaneamente (ex.: comprou o 101 e o 102)? O sistema deve manter histórico de moradores antigos vinculados à unidade, ou se preocupar apenas com quem mora lá hoje?

### 6.1 Padrão Corporativo Maduro (Histórico Completo) — referência de mercado

Em sistemas corporativos de ponta (ERPs financeiros e imobiliários), dados não são apagados — perdem a validade. Sem histórico completo, o condomínio não conseguiria gerar uma segunda via de cobrança retroativa para acionar judicialmente um morador antigo inadimplente.

**Como é modelado nesse padrão:**
- O relacionamento Morador–Unidade deixa de ser um simples link e vira uma entidade própria: `ContratoOcupacao` (ou `Posse`).
- **Banco de dados:** tabela com `id`, `morador_id`, `unidade_id`, `tipo_vinculo` (Proprietário/Inquilino), `data_inicio`, `data_fim`.
- **Java:** quando um morador se muda, não se executa um `DELETE` — faz-se um `UPDATE` preenchendo `data_fim` (Soft Delete / versionamento temporal).
- **Por que não adotar isso agora:** mapear atributos extras dentro de uma entidade associativa no JPA/Hibernate exige anotações complexas (`@OneToMany` duplo com `@Embeddable` ou `@MapsId`), o que aumentaria muito a curva de aprendizado nas primeiras sprints, tirando o foco do básico bem feito.

### 6.2 Abordagem Adotada no MVP (Decisão Registrada)

Um morador pode ter várias unidades e uma unidade pode ter vários moradores, mas o sistema se preocupa apenas com o **vínculo atual** (não mantém histórico nesta fase).

- **Relacionamento:** Muitos-para-Muitos (N:M) clássico.
- **Banco de dados:** tabela intermediária `unidade_morador`, com apenas as colunas `unidade_id` e `morador_id`.
- **Comportamento:** se um morador vender sua unidade, o sistema executa um `DELETE` real (Hard Delete) na linha da tabela intermediária — o vínculo deixa de existir fisicamente no banco.
- **Java:** uso da anotação `@ManyToMany` do JPA — o Spring Boot cria e gerencia a tabela intermediária automaticamente, sem necessidade de uma classe específica para ela.

---

## 7. Diretriz Arquitetural Registrada: Evolução Futura

Ainda que a versão atual utilize um relacionamento Muitos-para-Muitos simples entre Morador e Unidade (sem histórico), fica registrada a seguinte diretriz para todo o projeto:

- Toda modelagem de entidades, relacionamentos e responsabilidades deve ser pensada para permitir, no futuro, a evolução natural para uma **entidade associativa** (ex.: `ContratoOcupacao`, `Posse`, ou outro nome mais adequado) — **sem exigir grandes refatorações**.
- Essa complexidade **não deve ser implementada agora**, apenas considerada ao tomar decisões de modelagem, mantendo o sistema flexível e bem arquitetado.
- Sempre que uma decisão for simplificada por fazer parte do MVP, isso deve ser sinalizado explicitamente, explicando qual seria a abordagem normalmente adotada em um software corporativo de grande porte.

---

## 8. Status e Próximos Passos

Com esta modelagem (Condomínio → Bloco → Unidade → Morador), a fase de planejamento, arquitetura e levantamento de requisitos foi considerada encerrada. As entidades centrais (Core) estão mapeadas, o fluxo de dados definido, as ferramentas escolhidas (React, Spring, PostgreSQL — ver documento *Arquitetura Técnica e Planejamento do Projeto*) e a estratégia de entregas por sprints (Vertical Slices) validada.

**Próximo passo definido:** iniciar a Sprint 1 explicando, antes de qualquer configuração de ambiente:
- o objetivo da sprint;
- os conceitos técnicos que serão praticados;
- as entregas esperadas ao final;
- por que a implementação começa pelo Frontend.

Em seguida, a configuração do ambiente React (com VS Code) deve ser conduzida em pequenas etapas, com explicação detalhada de cada decisão antes da execução de qualquer comando no terminal.
