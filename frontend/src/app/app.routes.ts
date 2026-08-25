import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EmptyComponent } from "./shared/empty.component";
import { IncomeComponent } from "./income/income.component";

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "gastos", component: EmptyComponent },
  { path: "ingresos", component: IncomeComponent },
  { path: "reportes", component: EmptyComponent },
  { path: "categorias", component: EmptyComponent },
  { path: "config", component: EmptyComponent },
  { path: "**", redirectTo: "login" }
];
