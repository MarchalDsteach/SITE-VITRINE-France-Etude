import { IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @IsIn(['STUDENT', 'ADVISOR', 'ADMIN'])
  role: 'STUDENT' | 'ADVISOR' | 'ADMIN';
}
