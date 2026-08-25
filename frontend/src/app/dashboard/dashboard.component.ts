import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentMonth = 'Agosto 2026';
  userName = 'Benjamin';

  kpis = [
    { title: 'Ingresos', amount: 6200.00, color: '#00A3FF', icon: '📈' },
    { title: 'Gastos', amount: 3450.00, color: '#FF3B5C', icon: '📉' },
    { title: 'Balance', amount: 2750.00, color: '#FFC700', icon: '💰' }
  ];

  recentTransactions = [
    { name: 'Supermercado La Torre', category: 'Alimentación', amount: -285.50, date: '22 Ago' },
    { name: 'Salario Quincenal', category: 'Ingresos', amount: 3100.00, date: '20 Ago' },
    { name: 'Gasolina Shell', category: 'Transporte', amount: -450.00, date: '19 Ago' },
    { name: 'Netflix Suscripción', category: 'Entretenimiento', amount: -120.00, date: '18 Ago' },
    { name: 'Farmacia Galeno', category: 'Salud', amount: -185.00, date: '17 Ago' },
    { name: 'Freelance Diseño Web', category: 'Ingresos', amount: 1500.00, date: '15 Ago' }
  ];

  userInitials = 'BE';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nombre || 'Benjamin';
      this.userInitials = this.userName.substring(0, 2).toUpperCase();
    }
  }

  formatCurrency(amount: number): string {
    const abs = Math.abs(amount);
    return (amount < 0 ? '-' : '') + 'Q ' + abs.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  logout(): void {
    this.authService.logout();
  }
}
