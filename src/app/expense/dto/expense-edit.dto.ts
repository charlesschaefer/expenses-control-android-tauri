import { DateTime } from "luxon";
import { BaseDto } from './base.dto';

export interface ExpenseEditDto extends BaseDto {
    id: string;
    category: string;
    account: string;
    type: string;
    value: number;
    date: DateTime | string;
}