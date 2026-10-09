export type Service = {
  slug: string;
  name: string;
  badge: string;
  icon: string;
  image: string;
  short: string;
  desc: string;
  steps: string[];
  /** Délai de traitement (affiché si renseigné) */
  duration?: string;
  /** Tarif (affiché si renseigné) : à compléter avec les vrais prix */
  price?: string;
};

function pexels(id: number, w = 900) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}


export const SERVICES: Record<string, Service> = {
  avi: {
    slug: "avi",
    name: "Attestation de Virement (AVI)",
    badge: "Le plus demandé",
    icon: "✈",
    image: pexels(7683694, 700),
    short: "Attestation officielle pour vos dossiers bancaires et administratifs, indispensable pour la procédure Campus France.",
    desc: "L'Attestation de Virement Irrévocable (AVI) prouve la disponibilité de vos fonds pour financer vos études à l'étranger. GPI centralise votre dossier, vérifie les pièces requises avec votre banque partenaire et vous délivre une attestation conforme aux exigences consulaires.",
    steps: ["Demande", "Paiement", "Délivré"],
    duration: "24-48h",
  },
  adl: {
    slug: "adl",
    name: "Attestation de Logement (ADL)",
    badge: "Logement",
    icon: "🏠",
    image: pexels(6147395, 700),
    short: "Justificatif de logement pour votre dossier de visa et vos démarches administratives en France.",
    desc: "L'attestation de logement rassure le consulat sur vos conditions d'hébergement à l'arrivée. Notre réseau de résidences partenaires vous permet d'obtenir un justificatif fiable, daté et vérifiable en ligne via notre outil de vérification.",
    steps: ["Demande", "Paiement", "Délivré"],
    duration: "48-72h",
  },
  "campus-france": {
    slug: "campus-france",
    name: "Campus France",
    badge: "Accompagnement",
    icon: "🎓",
    image: pexels(7972710, 700),
    short: "Accompagnement complet pour votre procédure Campus France, de l'inscription à l'obtention du visa.",
    desc: "De la création de votre espace Études en France jusqu'à l'entretien, nos conseillers vous accompagnent pas à pas : choix des formations, lettre de motivation, simulation d'entretien et constitution du dossier visa.",
    steps: ["Dossier", "Entretien", "Visa"],
    duration: "2-4 semaines",
  },
  bourses: {
    slug: "bourses",
    name: "Bourses d'études",
    badge: "Financement",
    icon: "🎁",
    image: pexels(8276908, 700),
    short: "Identification et accompagnement au montage de dossiers de bourses nationales et internationales.",
    desc: "Nous recensons les bourses accessibles selon votre profil (excellence, mobilité, pays d'accueil) et vous aidons à constituer un dossier de candidature solide, avec relecture de lettre de motivation et CV académique.",
    steps: ["Profil", "Sélection", "Candidature"],
  },
  verificateur: {
    slug: "verificateur",
    name: "Vérificateur d'attestation",
    badge: "Instantané",
    icon: "🔍",
    image: pexels(4622108, 700),
    short: "Vérifiez l'authenticité d'une attestation ADL ou AVI grâce à sa référence, sans création de compte.",
    desc: "Chaque attestation délivrée par GPI comporte une référence unique. Les administrations, banques ou consulats peuvent vérifier son authenticité en temps réel via cette page publique, sans avoir besoin de se connecter.",
    steps: ["Référence", "Vérifié"],
    duration: "Instantané",
  },
};

// Les offres (alternances, stages, jobs étudiants) sont désormais ajoutées par l'administrateur : voir lib/offers.ts

export type Testimonial = { nom: string; role: string; texte: string; note: number; date: string };

export const TESTIMONIALS: Testimonial[] = [
  { nom: "Fatou D.", role: "Étudiante — AVI", texte: "Service excellent, j'ai obtenu mon attestation en moins de 48h. L'équipe est très réactive et accompagne à chaque étape.", note: 5, date: "il y a 2 semaines" },
  { nom: "Mohamed K.", role: "Étudiant — Campus France", texte: "Grâce à GPI, j'ai pu constituer mon dossier Campus France sans stress. Le suivi est personnalisé et les délais sont respectés.", note: 5, date: "il y a 1 mois" },
  { nom: "Amina B.", role: "Étudiante — ADL", texte: "Très satisfaite de l'accompagnement pour mon attestation de logement. Tout a été fait dans les règles.", note: 5, date: "il y a 1 mois" },
  { nom: "Jean-Pierre M.", role: "Étudiant — Bourses", texte: "Une équipe au top ! Ils m'ont aidé de A à Z pour mes démarches d'études en France.", note: 5, date: "il y a 2 mois" },
  { nom: "Khadija L.", role: "Étudiante — Campus France", texte: "J'étais perdue avec toutes les démarches administratives. GPI a tout simplifié pour moi.", note: 5, date: "il y a 2 mois" },
  { nom: "Samuel T.", role: "Étudiant — Vérificateur", texte: "Service professionnel et fiable. Le vérificateur d'attestation en ligne est un vrai plus.", note: 5, date: "il y a 3 mois" },
];

export const PARTNERS = ["ESIC", "French Degree", "ISD Institut", "NoSchool", "Scholia", "SEOPC", "SupMTI", "Will.School"];

export type GalleryPhoto = { src: string; alt: string };

export const GALLERY: GalleryPhoto[] = [
  { src: pexels(7683694), alt: "Groupe d'étudiants internationaux échangeant devant leur université" },
  { src: pexels(7972710), alt: "Étudiants célébrant l'obtention de leur diplôme, attestations en main" },
  { src: pexels(6147395), alt: "Étudiants multiculturels marchant ensemble sur le campus avec leurs livres" },
  { src: pexels(7683897), alt: "Groupe d'étudiants riant en marchant sur le campus" },
  { src: pexels(8276908), alt: "Étudiante prête à s'envoler, valise et passeport en main" },
  { src: pexels(7683745), alt: "Groupe d'étudiants heureux posant devant un bâtiment moderne" },
  { src: pexels(4622108), alt: "Étudiants travaillant ensemble en extérieur sur le campus" },
  { src: pexels(16255363), alt: "Étudiants fêtant leur remise de diplôme avec confettis" },
  { src: pexels(7683910), alt: "Jeunes étudiants souriants réunis devant un bâtiment vitré" },
  { src: pexels(7683631), alt: "Étudiants échangeant en extérieur entre deux cours" },
  { src: pexels(8419512), alt: "Étudiants dans un couloir lumineux de leur établissement" },
  { src: pexels(6147416), alt: "Amis étudiants multiculturels riant dans la rue" },
  { src: pexels(7683746), alt: "Étudiants avec sacs à dos dans les escaliers du campus" },
  { src: pexels(7683692), alt: "Groupe d'étudiants discutant sur le campus au soleil" },
  { src: pexels(7683708), alt: "Étudiants échangeant leurs livres devant le campus" },
  { src: pexels(7683615), alt: "Étudiants heureux profitant d'une journée ensoleillée sur le campus" },
];

export const STATS = [
  { value: 1000, suffix: "+", label: "Étudiants accompagnés" },
  { value: 98, suffix: "%", label: "Satisfaction" },
  { value: 10, suffix: "+", label: "Universités partenaires" },
  { value: 8, suffix: "+", label: "Pays couverts" },
];
