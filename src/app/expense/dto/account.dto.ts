import { BaseDto } from './base.dto';

export interface AccountDto extends BaseDto {
    id: number;
    name: string;
}