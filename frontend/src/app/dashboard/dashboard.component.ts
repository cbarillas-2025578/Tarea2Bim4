import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IncomeService } from '../income/services/income.service';
import { Income } from '../income/models/income.model';
import { environment } from '../../environments/environment';

interface KpiCard {
  title: string;
  amount: number;
  color: string;
  icon: string;
}

interface Transaction {
  name: string;
  category: string;
  amount: number;
  date: string;
  sortDate: Date;
}

interface MonthlyData {
  label: string;
  income: number;
  expense: number;
}

interface CategoryTotal {
  name: string;
  amount: number;
  color: string;
  percent: number;
}

interface ExpenseRecord {
  id: number;
  amount: number;
  category: string;
  transactionDate: string;
}

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
  userInitials = 'BE';

  kpis: KpiCard[] = [
    { title: 'Ingresos', amount: 0, color: '#00A3FF', icon: '📈' },
    { title: 'Gastos', amount: 0, color: '#FF3B5C', icon: '📉' },
    { title: 'Balance', amount: 0, color: '#FFC700', icon: '💰' }
  ];

  recentTransactions: Transaction[] = [];
  monthlyData: MonthlyData[] = [];
  categoryTotals: CategoryTotal[] = [];

  chartIncomePoints = '';
  chartIncomeArea = '';
  chartExpensePoints = '';
  chartExpenseArea = '';
  chartIncomeDots: { cx: number; cy: number }[] = [];
  chartExpenseDots: { cx: number; cy: number }[] = [];
  chartYLabels: string[] = [];
  chartXLabels: string[] = [];

  donutTotal = 0;
  donutSegments: { color: string; dash: string; offset: string; delay: string }[] = [];

  private allIncomes: Income[] = [];
  private allExpenses: ExpenseRecord[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private incomeService: IncomeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nombre || 'Benjamin';
      this.userInitials = this.userName.substring(0, 2).toUpperCase();
    }

    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const currentYear = new Date().getFullYear();

    forkJoin({
      incomes: this.incomeService.getAll({ year: currentYear }),
      expenses: this.http.get<ExpenseRecord[]>(`${environment.apiUrl}/expenses`)
    }).subscribe({
      next: ({ incomes, expenses }) => {
        this.allIncomes = incomes;
        this.allExpenses = expenses;

        this.computeKPIs();
        this.computeMonthlyData(currentYear);
        this.computeChart();
        this.computeDonut();
        this.computeRecentTransactions();
      },
      error: (err) => {
        console.warn('Error loading dashboard data:', err);
      }
    });
  }

  private computeKPIs(): void {
    const totalIncome = this.allIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = this.allExpenses.reduce((sum, e) => sum + e.amount, 0);

    this.kpis = [
      { title: 'Ingresos', amount: totalIncome, color: '#00A3FF', icon: '📈' },
      { title: 'Gastos', amount: totalExpenses, color: '#FF3B5C', icon: '📉' },
      { title: 'Balance', amount: totalIncome - totalExpenses, color: '#FFC700', icon: '💰' }
    ];
  }

  private computeMonthlyData(year: number): void {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonthIdx = new Date().getMonth();

    const months: MonthlyData[] = [];
    for (let i = 7; i >= 0; i--) {
      const mIdx = (currentMonthIdx - i + 12) % 12;
      months.push({ label: monthNames[mIdx], income: 0, expense: 0 });
    }

    this.allIncomes.forEach(inc => {
      const d = new Date(inc.transactionDate);
      if (d.getFullYear() === year) {
        const mIdx = d.getMonth();
        const entry = months.find(m => m.label === monthNames[mIdx]);
        if (entry) entry.income += inc.amount;
      }
    });

    this.allExpenses.forEach(exp => {
      const d = new Date(exp.transactionDate);
      if (d.getFullYear() === year) {
        const mIdx = d.getMonth();
        const entry = months.find(m => m.label === monthNames[mIdx]);
        if (entry) entry.expense += exp.amount;
      }
    });

    this.monthlyData = months;
    this.chartXLabels = months.map(m => m.label);
  }

  private computeChart(): void {
    const data = this.monthlyData;
    if (data.length === 0) return;

    const allValues = data.flatMap(d => [d.income, d.expense]);
    const maxVal = Math.max(...allValues, 1);
    const niceMax = Math.ceil(maxVal / 1000) * 1000 || 1000;

    this.chartYLabels = [];
    for (let i = 4; i >= 0; i--) {
      const val = (niceMax / 4) * i;
      this.chartYLabels.push(val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : String(Math.round(val)));
    }

    const svgWidth = 600;
    const svgHeight = 200;
    const stepX = data.length > 1 ? svgWidth / (data.length - 1) : svgWidth;
    const toY = (val: number) => svgHeight - (val / niceMax) * svgHeight;

    const incPoints: string[] = [];
    const expPoints: string[] = [];

    data.forEach((d, i) => {
      const x = i * stepX;
      incPoints.push(`${x},${toY(d.income)}`);
      expPoints.push(`${x},${toY(d.expense)}`);
    });

    this.chartIncomePoints = incPoints.join(' ');
    this.chartExpensePoints = expPoints.join(' ');
    this.chartIncomeArea = `${incPoints.join(' ')} ${svgWidth},${svgHeight} 0,${svgHeight}`;
    this.chartExpenseArea = `${expPoints.join(' ')} ${svgWidth},${svgHeight} 0,${svgHeight}`;

    this.chartIncomeDots = data.map((d, i) => ({ cx: i * stepX, cy: toY(d.income) }));
    this.chartExpenseDots = data.map((d, i) => ({ cx: i * stepX, cy: toY(d.expense) }));
  }

  private computeDonut(): void {
    const colors = ['#00A3FF', '#FF3B5C', '#FFC700', '#FF6B00', '#A855F7', '#10B981'];
    const categoryMap: { [key: string]: number } = {};

    this.allExpenses.forEach(exp => {
      const cat = exp.category || 'Otros';
      categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
    });

    const total = Object.values(categoryMap).reduce((s, v) => s + v, 0);
    this.donutTotal = total;

    const sorted = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const circumference = 2 * Math.PI * 80;
    let accumulated = 0;

    this.categoryTotals = sorted.map(([name, amount], i) => ({
      name,
      amount,
      color: colors[i % colors.length],
      percent: total > 0 ? Math.round((amount / total) * 100) : 0
    }));

    this.donutSegments = this.categoryTotals.map((cat, i) => {
      const segmentLen = (cat.percent / 100) * circumference;
      const offset = -accumulated;
      accumulated += segmentLen;
      return {
        color: cat.color,
        dash: `${segmentLen} ${circumference - segmentLen}`,
        offset: `${offset}`,
        delay: `${0.2 + i * 0.2}s`
      };
    });
  }

  private computeRecentTransactions(): void {
    const txs: Transaction[] = [];

    this.allIncomes.forEach(inc => {
      const d = new Date(inc.transactionDate);
      txs.push({
        name: inc.source,
        category: 'Ingresos',
        amount: inc.amount,
        date: this.formatShortDate(d),
        sortDate: d
      });
    });

    this.allExpenses.forEach(exp => {
      const d = new Date(exp.transactionDate);
      txs.push({
        name: exp.category || 'Gasto',
        category: exp.category || 'Gastos',
        amount: -exp.amount,
        date: this.formatShortDate(d),
        sortDate: d
      });
    });

    txs.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
    this.recentTransactions = txs.slice(0, 6);
  }

  private formatShortDate(d: Date): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  }

  formatCurrency(amount: number): string {
    const abs = Math.abs(amount);
    return (amount < 0 ? '-' : '') + 'Q ' + abs.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  logout(): void {
    this.authService.logout();
  }
}
