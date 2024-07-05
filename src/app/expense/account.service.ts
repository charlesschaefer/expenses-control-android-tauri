import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { AccountDto, AccountAddDto } from "./dto/account.dto";
import { ServiceAbstract } from "./service.abstract";

@Injectable({ providedIn: 'root' })
export class AccountService<T> extends ServiceAbstract<T> {
    override storeName: string = 'account';
}