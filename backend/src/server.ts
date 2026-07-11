import { env } from "./config/env";
import express from "express";
import cors from "cors";
import path from "path";
import { routes } from "./routes";

import { funcionariosRoutes } from "./modules/funcionarios/funcionarios.routes";
import { pontosRoutes } from "./modules/pontos/pontos.routes";
import { aprovacoesRoutes } from "./modules/aprovacoes/aprovacoes.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/funcionarios", funcionariosRoutes);
app.use("/pontos", pontosRoutes);
app.use("/aprovacoes", aprovacoesRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});
