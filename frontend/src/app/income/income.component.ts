import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IncomeListComponent } from "./components/income-list/income-list.component";

@Component({
  selector: "app-income",
  standalone: true,
  imports: [CommonModule, IncomeListComponent],
  templateUrl: "./income.component.html",
  styleUrls: ["./income.component.css"],
})
export class IncomeComponent {
  currentMonth = "Agosto 2026";
}
