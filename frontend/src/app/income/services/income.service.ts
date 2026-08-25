import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  CreateIncomeDTO,
  Income,
  IncomeFilters,
  UpdateIncomeDTO,
} from "../models/income.model";

@Injectable({
  providedIn: "root",
})
export class IncomeService {
  private readonly baseUrl = `${environment.apiUrl}/incomes`;

  constructor(private http: HttpClient) {}

  getAll(filters: IncomeFilters = {}): Observable<Income[]> {
    let params = new HttpParams();
    if (filters.month) params = params.set("month", filters.month);
    if (filters.year) params = params.set("year", filters.year);
    if (filters.source) params = params.set("source", filters.source);

    return this.http.get<Income[]>(this.baseUrl, { params });
  }

  create(income: CreateIncomeDTO): Observable<Income> {
    return this.http.post<Income>(this.baseUrl, income);
  }

  update(id: number, income: UpdateIncomeDTO): Observable<Income> {
    return this.http.put<Income>(`${this.baseUrl}/${id}`, income);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
