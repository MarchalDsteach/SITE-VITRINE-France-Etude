import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { status?: string } }>();
    if (request.user?.status !== 'ACTIVE') {
      throw new ForbiddenException('Compte non activé. L’administrateur doit valider votre accès.');
    }
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { role?: string; status?: string } }>();
    if (request.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Accès réservé aux administrateurs.');
    }
    if (request.user?.status !== 'ACTIVE') {
      throw new ForbiddenException('Compte administrateur non activé.');
    }
    return true;
  }
}

@Injectable()
export class AdvisorGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { role?: string; status?: string } }>();
    if (!['ADVISOR', 'ADMIN'].includes(request.user?.role ?? '')) {
      throw new ForbiddenException('Accès réservé aux conseillers ou administrateurs.');
    }
    if (request.user?.status !== 'ACTIVE') {
      throw new ForbiddenException('Compte non activé.');
    }
    return true;
  }
}
