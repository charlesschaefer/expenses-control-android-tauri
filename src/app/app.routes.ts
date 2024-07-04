import { Routes } from '@angular/router';
import { ExpenseAddComponent } from './expense-add/expense-add.component';
import { ExpenseComponent } from './expense/expense.component';

export const routes: Routes = [
    {path: '', component: ExpenseComponent},
    {path: 'expense-add', component: ExpenseAddComponent},
    {path: 'expense-add/:id', component: ExpenseAddComponent},
];
