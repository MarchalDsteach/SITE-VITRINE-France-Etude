import { IsIn } from 'class-validator';

export class UpdateAdvisorLeadDto {
  @IsIn(['CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'])
  status: 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
}
