import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneParams {
  @IsString()
  @IsNotEmpty()
  id: string;
}
