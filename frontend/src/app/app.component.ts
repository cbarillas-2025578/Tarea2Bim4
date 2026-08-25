import { Component } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { filter } from "rxjs/operators";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Control de Gastos";
  isLoginPage = false;

  menuItems = [
    { label: 'Inicio', icon: '🏠', route: '/dashboard', active: true },
    { label: 'Gastos', icon: '💸', route: '/gastos', active: false },
    { label: 'Ingresos', icon: '💰', route: '/ingresos', active: false },
    { label: 'Reportes', icon: '📊', route: '/reportes', active: false },
    { label: 'Categorías', icon: '🏷️', route: '/categorias', active: false },
    { label: 'Configuración', icon: '⚙️', route: '/config', active: false }
  ];

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginPage = event.url.includes("/login");
        this.updateActiveMenu(event.url);
      });
  }

  updateActiveMenu(url: string): void {
    this.menuItems.forEach(item => {
      item.active = url.includes(item.route);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
