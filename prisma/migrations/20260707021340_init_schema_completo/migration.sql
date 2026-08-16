-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('ADMINISTRADOR', 'GESTOR', 'RH', 'FUNCIONARIO');

-- CreateEnum
CREATE TYPE "TipoPonto" AS ENUM ('ENTRADA', 'SAIDA_ALMOCO', 'RETORNO', 'SAIDA');

-- CreateEnum
CREATE TYPE "StatusPonto" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "StatusAprovacao" AS ENUM ('APROVADO', 'REJEITADO');

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "matricula" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "estabelecimento" TEXT NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL,
    "salario" DECIMAL(65,30) NOT NULL,
    "papel" "Papel" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "gestorId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoReferenciaFacial" (
    "id" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoReferenciaFacial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoCargoSetor" (
    "id" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "estabelecimento" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoCargoSetor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ponto" (
    "id" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "tipo" "TipoPonto" NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "status" "StatusPonto" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ponto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aprovacao" (
    "id" TEXT NOT NULL,
    "pontoId" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "status" "StatusAprovacao" NOT NULL,
    "motivoRejeicao" TEXT,
    "dataAprovacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aprovacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_cpf_key" ON "Funcionario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_email_key" ON "Funcionario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_matricula_key" ON "Funcionario"("matricula");

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "Funcionario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoReferenciaFacial" ADD CONSTRAINT "FotoReferenciaFacial_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoCargoSetor" ADD CONSTRAINT "HistoricoCargoSetor_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ponto" ADD CONSTRAINT "Ponto_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aprovacao" ADD CONSTRAINT "Aprovacao_pontoId_fkey" FOREIGN KEY ("pontoId") REFERENCES "Ponto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aprovacao" ADD CONSTRAINT "Aprovacao_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
