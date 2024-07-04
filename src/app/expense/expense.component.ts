import { Component } from '@angular/core';
import { ExpenseTypeEnum, FilterComponent } from '../filter/filter.component';
import { ExpenseTableComponent } from '../expense-table/expense-table.component';
import { MatCard } from '@angular/material/card';
import { Filter, ExpenseType } from '../filter/filter.component';
import { CategoryService } from './category.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ExpenseService } from './expense.service';
import { AccountService } from './account.service';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { CategoryDto } from './dto/category.dto';
import { ExpenseDto } from './dto/expense.dto';
import { AccountDto } from './dto/account.dto';


@Component({
  selector: 'expense',
  standalone: true,
  imports: [FilterComponent, ExpenseTableComponent, MatCard, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
})
export class ExpenseComponent {
  filter: Filter;
  categories: { [key: number]: string };

  constructor(
    private categoryService: CategoryService<CategoryDto>,
    private expenseService: ExpenseService<ExpenseDto>,
    private accountService: AccountService<AccountDto>,
  ) {
    let endDate = DateTime.fromJSDate(new Date());
    let startDate = DateTime.fromJSDate(new Date());
    startDate = startDate.minus({days: 30});
    this.filter = {
      startDate: startDate,
      endDate: endDate,
      type_debit: {name: 'Débito', code: ExpenseTypeEnum.DEBIT, checked: false},
      type_credit: {name: 'Crédito', code: ExpenseTypeEnum.CREDIT, checked: false},
      category: 0,
      account: 0
    };
  }

  filterChanged(filterData: Filter): void {
    console.log("filter changed, new values: ", filterData);
    // copies the object data, so a ngOnChanges() event is emitted
    this.filter = Object.assign({}, filterData);
    console.log(this.filter);
  }
}
