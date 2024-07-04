import { DateTime } from "luxon";
import { BaseDto } from './base.dto';

export interface ExpenseAddDto extends BaseDto {
    category: string;
    account: string;
    type: string;
    value: number;
    date: DateTime | string;
}