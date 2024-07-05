import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, firstValueFrom } from "rxjs";

import { CategoryDto, CategoryAddDto } from "./dto/category.dto";
import { ServiceAbstract } from "./service.abstract";

@Injectable({ providedIn: 'root' })
export class CategoryService<T> extends ServiceAbstract<T> {    
    override storeName: string = 'category';
}