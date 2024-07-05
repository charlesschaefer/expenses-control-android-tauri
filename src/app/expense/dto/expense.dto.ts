import { BaseDto } from './base.dto';

export interface ExpenseDto {
    id: string;
    category: string;
    account: string;
    type: string;
    value: number;
    date: Date | string;
}

export type ExpenseAddDto = Omit<ExpenseDto, "id">;