import { env } from "./config/env";
import express from "express";
import cors from "cors";
import path from "path";
import { funcionariosRoutes } from "./modules/funcionarios/funcionarios.routes";
import { pontoRouter } from "./routes/ponto.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/funcionarios", funcionariosRoutes);
app.use("/pontos", pontoRouter);

app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});
