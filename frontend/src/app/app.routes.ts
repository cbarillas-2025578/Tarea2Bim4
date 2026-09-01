import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { IncomeComponent } from "./income/income.component";
import { EmptyComponent } from "./shared/empty.component";
import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "gastos", component: EmptyComponent, canActivate: [AuthGuard] },
  { path: "ingresos", component: IncomeComponent, canActivate: [AuthGuard] },
  { path: "reportes", component: EmptyComponent, canActivate: [AuthGuard] },
  { path: "categorias", component: EmptyComponent, canActivate: [AuthGuard] },
  { path: "config", component: EmptyComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "login" }
];
