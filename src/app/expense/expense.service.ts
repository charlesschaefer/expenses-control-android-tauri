import { Injectable } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, Subject, catchError, map, throwError } from "rxjs";
import { DateTime } from "luxon";
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { ExpenseDto, ExpenseAddDto } from "./dto/expense.dto";
import { Filter } from "../filter/filter.component";
import { ServiceAbstract } from "./service.abstract";

@Injectable({ providedIn: 'root' })
export class ExpenseService<T> extends ServiceAbstract<T> {
    override storeName: string = 'expense';

    listFiltered(filter: Filter): Observable<T[]> {
        let dbCursor;
        switch (true) {
            case filter.account != undefined && filter.account != 0: 
                dbCursor = this.dbService.openCursorByIndex(this.storeName, 'account', IDBKeyRange.only(filter.account));
                break;
            case filter.category != undefined && filter.category != 0:
                dbCursor = this.dbService.openCursorByIndex(this.storeName, 'category', IDBKeyRange.only(filter.category));
                break;
            case filter.type_credit.checked != false:
                dbCursor = this.dbService.openCursorByIndex(this.storeName, 'type', IDBKeyRange.only('C'));
                break;
            case filter.type_debit.checked != false:
                dbCursor = this.dbService.openCursorByIndex(this.storeName, 'type', IDBKeyRange.only('D'));
                break;
            case filter.startDate != null && filter.endDate != null:
                let range = IDBKeyRange.bound(filter.startDate.toJSDate(), filter.endDate.toJSDate());
                console.log(range);
                dbCursor = this.dbService.openCursorByIndex(this.storeName, 'date', range);
                break;
            default:
                dbCursor = this.dbService.openCursor(this.storeName);
        }

        return this.filterData(filter, dbCursor);
    }

    private filterData(filter: Filter, cursor: Observable<Event>): Subject<T[]> {
        let filteredData:T[] = [];
        let filteredSubject = new Subject<T[]>();
        

        cursor.subscribe(event => {
            if (!event.target) return;
            let cursor = (event.target as IDBOpenDBRequest).result as unknown as IDBCursor;

            if (!cursor || !cursor.request?.result?.value) {
                console.log("Reached the end of the cursor");
                filteredSubject.next(filteredData);
                return;
            }
            if (this.valuesMatch(cursor.request.result.value, filter)) {
                filteredData.push(cursor.request.result.value);
            }
            cursor.continue();
        });

        return filteredSubject;
    }

    private valuesMatch(expense: ExpenseDto, filter: Filter): Boolean {
        if (filter.account != 0 && parseInt(expense.account) != filter.account) {
            return false;
        }
        if (filter.category != 0 && parseInt(expense.category) != filter.category) {
            return false;
        }
        if (filter.type_credit.checked && expense.type != 'C') {
            return false;
        }
        if (filter.type_debit.checked && expense.type != 'D') {
            return false;
        }
        if (filter.startDate != null && filter.endDate != null) {
            
            if (expense.date < filter.startDate.toJSDate()) return false;
            if (expense.date > filter.endDate.toJSDate()) return false;
        }

        return true;
    }

}