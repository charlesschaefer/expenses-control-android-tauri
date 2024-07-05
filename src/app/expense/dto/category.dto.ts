import { BaseDto } from './base.dto';

export interface CategoryDto extends BaseDto {
    id: number;
    name: string;
}

export type CategoryAddDto = Pick<CategoryDto, "name">;