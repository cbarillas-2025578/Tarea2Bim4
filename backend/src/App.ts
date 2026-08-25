import express, { Application } from "express";
import cors from "cors";
import expenseRoutes from "./modules/expense/routes/expense.routes";
import authRoutes from "./modules/auth/auth.routes";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.get("/api/health", (_req, res) => {
      res.status(200).json({ status: "ok" });
    });

    // Rutas de autenticación
    this.app.use("/api/auth", authRoutes);

    // Rutas del módulo de gastos (expense)
    this.app.use("/api/expenses", expenseRoutes);
  }
}

export default new App().app;
