import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChip } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { ExpenseDto } from '../expense/dto/expense.dto';
import { ExpenseService } from '../expense/expense.service';
import { CategoryService } from '../expense/category.service';
import { CategoryDto } from '../expense/dto/category.dto';
import { AccountService } from '../expense/account.service';
import { AccountDto } from '../expense/dto/account.dto';
import { Filter } from '../filter/filter.component';


type IndexedValue = { [key: number]: string };

@Component({
  selector: 'expense-table',
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CurrencyPipe, DatePipe, CommonModule, MatChip, RouterLink, MatIconModule, MatButtonModule]
})
export class ExpenseTableComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ExpenseDto>;
  
  dataSource: MatTableDataSource<ExpenseDto>;
  expenses: ExpenseDto[];
  categories: IndexedValue = {0: ''};
  accounts:  IndexedValue = {0: ''};
  length: number;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['account', 'category', 'type', 'value', 'date', 'actions'];

  @Input() filter: Filter;

  constructor(
    private expenseService: ExpenseService<ExpenseDto>,
    private categoryService: CategoryService<CategoryDto>,
    private accountService: AccountService<AccountDto>,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.expenseService.listFiltered(this.filter).subscribe((expenses: ExpenseDto[]) => {
      this.expenses = expenses;
      console.log("expenses", expenses);
      this.dataSource = new MatTableDataSource(expenses);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.length = expenses.length;
    });

    this.categoryService.list().subscribe((categories) => {
      categories.forEach(category => this.categories[category.id] = category.name);
    });

    this.accountService.list().subscribe((accounts) => {
      accounts.forEach(account => this.accounts[account.id] = account.name);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.expenseService.listFiltered(this.filter).subscribe((expenses) => {
      this.expenses = expenses;
      console.log("expenses", expenses);
      this.dataSource = new MatTableDataSource(expenses);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.length = expenses.length;
    });
  }

  removeExpense(id: string) {
    this.expenseService.remove(id as unknown as number).subscribe(() => {
      this.snackBar.open("Transação removida com sucesso", "fechar");
      this.expenses.forEach((value, idx) => {
        if (value.id == id) {
          delete this.expenses[idx];
          location.reload();
        }
      })
    })
  }
}
