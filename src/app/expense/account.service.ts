import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { AccountDto } from "./dto/account.dto";
import { Injectable } from "@angular/core";
import { AccountAddDto } from "./dto/account-add.dto";
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ServiceAbstract } from "./service.abstract";

@Injectable({ providedIn: 'root' })
export class AccountService<T> extends ServiceAbstract<T> {
    override storeName: string = 'account';
}