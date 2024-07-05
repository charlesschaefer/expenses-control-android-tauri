import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect, MatOption, MatFormField, MatLabel, MatHint } from '@angular/material/select';
import { 
  MatDateRangePicker, 
  MatDateRangeInput, 
  MatStartDate, 
  MatEndDate, 
  MatDatepickerToggle, 
  MatDatepicker, 
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';

import { CategoryService } from '../expense/category.service';
import { AccountService } from '../expense/account.service';
import { CategoryDto } from '../expense/dto/category.dto';
import { AccountDto } from '../expense/dto/account.dto';


export enum ExpenseTypeEnum {
  CREDIT = 'C',
  DEBIT = 'D'
}

export class ExpenseType {
  public name: string;
  public code: ExpenseTypeEnum;
  public checked: boolean;
}

export class Filter {
  public startDate: DateTime;
  public endDate: DateTime;
  public type_credit: ExpenseType;
  public type_debit: ExpenseType;
  public category: number;
  public account: number;
}


@Component({
  selector: 'filter',
  standalone: true,
  imports: [
    MatCard,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatDateRangePicker,
    MatDateRangeInput,
    MatStartDate,
    MatEndDate,
    FormsModule,
    CommonModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {

  categories: CategoryDto[];
  accounts: AccountDto[];

  @Output() filterChanged: EventEmitter<Filter>;
  
  @Input() filter: Filter;

  constructor(
    private categoryService: CategoryService<CategoryDto>,
    private accountService: AccountService<AccountDto>,
  ) {
    this.filterChanged = new EventEmitter<Filter>();
  }

  ngOnInit(): void {
    this.categoryService.list().subscribe(values => {
      this.categories = values;
    })

    this.accountService.list().subscribe(values => {
      this.accounts = values;
    })
  }

  ngFilterChanged(): void {
    console.log("Entrou ngFilterChanged(), emitting...", this.filterChanged);
    // sends the filter data to the parent component
    this.filterChanged.emit(this.filter);
  }

}
