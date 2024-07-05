import { CommonModule } from '@angular/common';
import { Component, inject, model, signal, OnInit, Type } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DateTime } from 'luxon';

import { CategoryService } from '../expense/category.service';
import { AccountService } from '../expense/account.service';
import { ExpenseService } from '../expense/expense.service';
import { CategoryDto, CategoryAddDto } from '../expense/dto/category.dto';
import { AccountDto, AccountAddDto } from '../expense/dto/account.dto';
import { ExpenseDto, ExpenseAddDto } from '../expense/dto/expense.dto';

export enum TypeDialog {
    CATEGORY,
    ACCOUNT,
}

export interface DialogData {
    type: TypeDialog
    name: string;
}

// A support type to be able to use this[key] inside the class
type ExpenseAddComponentServiceKeys = "categoryAddService" | "accountAddService" | "expenseAddService";

@Component({
    selector: 'expense-add',
    standalone: true,
    imports: [
        CommonModule, 
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatIconModule,
        CurrencyMaskModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
    ],
    templateUrl: './expense-add.component.html',
    styleUrl: './expense-add.component.scss'
})
export class ExpenseAddComponent implements OnInit {
    categories: CategoryDto[];
    currentCategory: string;
    accounts: AccountDto[];
    currentAccount: string;
    id: string | null;
    readonly DialogTypeCategory = TypeDialog.CATEGORY;
    readonly DialogTypeAccount = TypeDialog.ACCOUNT;
    
    readonly dialog = inject(MatDialog);
    readonly dialogItemName = signal('');
    
    expenseForm = new FormGroup({
        category: new FormControl('', [Validators.required]),
        account: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        date: new FormControl(new Date(), [Validators.required]),
        value: new FormControl(0, [Validators.required]),
        id: new FormControl(''),
    });
    
    constructor(
        private categoryService: CategoryService<CategoryDto>,
        private categoryAddService: CategoryService<CategoryAddDto>,
        private accountService: AccountService<AccountDto>,
        private accountAddService: AccountService<AccountAddDto>,
        private expenseService: ExpenseService<ExpenseDto>,
        private expenseAddService: ExpenseService<ExpenseAddDto>,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
    ) {}
    
    ngOnInit(): void {
        this.categoryService.list().subscribe(categories => this.categories = categories);
        this.accountService.list().subscribe(accounts => this.accounts = accounts);
        
        this.id = this.route.snapshot.paramMap.get("id");
        
        if (this.id) {
            this.expenseForm.patchValue({"id": this.id});
            
            this.expenseService.get(this.id as unknown as number).subscribe(expense => {
                this.expenseForm.patchValue({
                    category: expense.category,
                    account: expense.account,
                    type: expense.type,
                    date: typeof expense.date == 'string' ? DateTime.fromFormat(expense.date, "%Y-%m-%d").toJSDate() : expense.date,
                    value: expense.value,
                    id: expense.id,
                });
            });
        }
        
    }
    
    onSubmit() {
        if (!this.expenseForm.valid) {
            return this.snackBar.open("Verifique todos os campos do formulário", "fechar");
        }
        let values = this.expenseForm.value;
        
        if (values['date'] instanceof DateTime) {
            values['date'] = values['date'].toJSDate();
        }
        
        let ok;
        if (values.id) {
            return this.editExpense(values);
        }
        return this.createExpense(values);
        
    }
    
    createExpense(values: Partial<any>) {
        let data: ExpenseAddDto = {
            category: values['category'] || '',
            account: values['account'] || '',
            type: values['type'] || '',
            value: parseFloat(values['value'] || '') || 0,
            date: values['date'] || DateTime.fromJSDate(new Date),
        };
        let ret = this.expenseAddService.add(data).subscribe(values => console.log("Values: ", values));
        this.router.navigate(['/']);
        return ret;
    }
    
    editExpense(values: Partial<any>) {
        let data: ExpenseDto = {
            category: values['category'] || '',
            account: values['account'] || '',
            type: values['type'] || '',
            value: parseFloat(values['value'] || '') || 0,
            date: values['date'] || DateTime.fromJSDate(new Date),
            id: values['id'] || this.id
        };
        let ret = this.expenseService.edit(data).subscribe(values => console.log("Values: ", values));
        this.router.navigate(['/']);
        return ret;
    }
    
    openNewDialog(type: TypeDialog): void {
        const dialogRef = this.dialog.open(NewDialog, {
            data: {
                name: this.dialogItemName(), 
                type: type
            }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
            if (result !== undefined) {
                this.dialogItemName.set(result);
                
                let savedObs;
                let serviceKey: ExpenseAddComponentServiceKeys;
                if (type == TypeDialog.ACCOUNT) {
                    serviceKey = 'accountAddService';
                } else {
                    serviceKey = 'categoryAddService';
                }
                savedObs = this[serviceKey].add({
                    name: result
                });
                savedObs.subscribe(newId => {
                    let service = (type == TypeDialog.ACCOUNT) ? this.accountService : this.categoryService;
                    
                    service.deactivateCache();
                    service.list().subscribe(result => {
                        if (type == TypeDialog.ACCOUNT) {
                            this.accounts = result;
                            this.currentAccount = newId.id as unknown as string;
                        } else {
                            this.categories = result;
                            this.currentCategory = newId.id as unknown as string;
                        }
                    });
                    service.activateCache();
                });
                this.dialogItemName.set('');
            }
        })
    }
}

@Component({
    selector: 'new-dialog',
    templateUrl: 'new-dialog.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
    ],
})
export class NewDialog {    
    readonly dialogRef = inject(MatDialogRef<NewDialog>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly name = model(this.data.name);
    //readonly type = this.data.type;
    readonly DialogTypeCategory = TypeDialog.CATEGORY;
    readonly DialogTypeAccount = TypeDialog.ACCOUNT;
    
    clearOnClose(): void {
        this.dialogRef.close();
    }
}