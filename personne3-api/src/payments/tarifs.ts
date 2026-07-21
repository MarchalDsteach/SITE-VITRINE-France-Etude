import { TypeDocument } from '@prisma/client';

// Montants en centimes. C'est la SEULE source de vérité pour les prix —
// le montant n'est jamais accepté depuis le frontend (voir guide paiements,
// section sécurité : "ne jamais faire confiance à un montant envoyé par
// le client").
export const TARIFS: Record<TypeDocument, number> = {
  AVI: 2500,
  ADL: 3500,
  CAMPUS_FRANCE: 5000,
  BOURSE: 1500,
};
