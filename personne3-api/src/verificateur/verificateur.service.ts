import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VerificateurService {
  constructor(private readonly prisma: PrismaService) {}

  async verify(reference: string) {
    const dossier = await this.prisma.dossier.findUnique({
      where: { reference },
      select: {
        // On sélectionne explicitement UNIQUEMENT ce qui est nécessaire à
        // la vérification publique — jamais l'objet dossier complet, et
        // jamais l'id interne, l'email, ou l'étudiantId.
        reference: true,
        type: true,
        statut: true,
        dateDelivrance: true,
      },
    });

    if (!dossier) {
      // Message volontairement générique : ne pas indiquer si la
      // référence existe mais n'est pas encore délivrée, vs n'existe pas
      // du tout — évite de donner de l'information à un attaquant qui
      // teste des références au hasard.
      throw new NotFoundException('Référence introuvable ou document non délivré');
    }

    // Ne confirmer l'authenticité que pour un document réellement délivré.
    if (dossier.statut !== 'DELIVRE') {
      throw new NotFoundException('Référence introuvable ou document non délivré');
    }

    return dossier;
  }
}
