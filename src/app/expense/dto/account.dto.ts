import { BaseDto } from './base.dto';

export interface AccountDto extends BaseDto {
    id: number;
    name: string;
}

export type AccountAddDto = Pick<AccountDto, "name">;