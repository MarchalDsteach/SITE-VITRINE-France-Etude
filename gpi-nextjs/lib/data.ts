export type Service = {
  slug: string;
  name: string;
  badge: string;
  duration: string;
  icon: string;
  short: string;
  desc: string;
  steps: string[];
  price: string;
};

export const SERVICES: Record<string, Service> = {
  avi: {
    slug: "avi",
    name: "Attestation de Virement (AVI)",
    badge: "Le plus demandé",
    duration: "24-48h",
    icon: "✈",
    short:
      "Attestation officielle pour vos dossiers bancaires et administratifs, indispensable pour la procédure Campus France.",
    desc: "L'Attestation de Virement Irrévocable (AVI) prouve la disponibilité de vos fonds pour financer vos études à l'étranger. GPI centralise votre dossier, vérifie les pièces requises avec votre banque partenaire et vous délivre une attestation conforme aux exigences consulaires.",
    steps: ["Demande", "Paiement", "Délivré"],
    price: "À partir de 45 000 FCFA",
  },
  adl: {
    slug: "adl",
    name: "Attestation de Logement (ADL)",
    badge: "Logement",
    duration: "48-72h",
    icon: "🏠",
    short:
      "Justificatif de logement pour votre dossier de visa et vos démarches administratives en France.",
    desc: "L'attestation de logement rassure le consulat sur vos conditions d'hébergement à l'arrivée. Notre réseau de résidences partenaires vous permet d'obtenir un justificatif fiable, daté et vérifiable en ligne via notre outil de vérification.",
    steps: ["Demande", "Paiement", "Délivré"],
    price: "À partir de 35 000 FCFA",
  },
  "campus-france": {
    slug: "campus-france",
    name: "Campus France",
    badge: "Accompagnement",
    duration: "2-4 semaines",
    icon: "🎓",
    short:
      "Accompagnement complet pour votre procédure Campus France, de l'inscription à l'obtention du visa.",
    desc: "De la création de votre espace Études en France jusqu'à l'entretien, nos conseillers vous accompagnent pas à pas : choix des formations, lettre de motivation, simulation d'entretien et constitution du dossier visa.",
    steps: ["Dossier", "Entretien", "Visa"],
    price: "Sur devis",
  },
  bourses: {
    slug: "bourses",
    name: "Bourses d'études",
    badge: "Financement",
    duration: "Variable",
    icon: "🎁",
    short:
      "Identification et accompagnement au montage de dossiers de bourses nationales et internationales.",
    desc: "Nous recensons les bourses accessibles selon votre profil (excellence, mobilité, pays d'accueil) et vous aidons à constituer un dossier de candidature solide, avec relecture de lettre de motivation et CV académique.",
    steps: ["Profil", "Sélection", "Candidature"],
    price: "Gratuit — commission sur obtention",
  },
  verificateur: {
    slug: "verificateur",
    name: "Vérificateur d'attestation",
    badge: "Instantané",
    duration: "Instantané",
    icon: "🔍",
    short:
      "Vérifiez l'authenticité d'une attestation ADL ou AVI grâce à sa référence, sans création de compte.",
    desc: "Chaque attestation délivrée par GPI comporte une référence unique. Les administrations, banques ou consulats peuvent vérifier son authenticité en temps réel via cette page publique, sans avoir besoin de se connecter.",
    steps: ["Référence", "Vérifié"],
    price: "Gratuit",
  },
};

export type Listing = {
  titre: string;
  org: string;
  ville: string;
  domaine: string;
  duree: string;
  rythme?: string;
  type?: string;
  contrat?: "Apprentissage" | "Professionnalisation";
  limite: string;
};

export const ALTERNANCES: Listing[] = [
  { titre: "Alternance Développeur Web", org: "NoSchool Digital", ville: "Bordeaux, France", domaine: "Informatique", duree: "12-24 mois", rythme: "3j entreprise / 2j école", contrat: "Apprentissage", limite: "15 août 2026" },
  { titre: "Alternance Assistant Marketing", org: "Scholia Group", ville: "Lyon, France", domaine: "Marketing", duree: "12 mois", rythme: "2j entreprise / 3j école", contrat: "Apprentissage", limite: "02 sept. 2026" },
  { titre: "Alternance Comptabilité-Gestion", org: "ISD Institut", ville: "Bordeaux, France", domaine: "Gestion", duree: "24 mois", rythme: "4j entreprise / 1j école", contrat: "Professionnalisation", limite: "20 août 2026" },
  { titre: "Alternance Réseaux & Cybersécurité", org: "ESIC", ville: "Toulouse, France", domaine: "Informatique", duree: "12-24 mois", rythme: "3j entreprise / 2j école", contrat: "Apprentissage", limite: "30 juil. 2026" },
  { titre: "Alternance Chargé RH", org: "Will.School", ville: "Nantes, France", domaine: "RH", duree: "12 mois", rythme: "2j entreprise / 3j école", contrat: "Professionnalisation", limite: "10 sept. 2026" },
  { titre: "Alternance Community Manager", org: "French Degree", ville: "Paris, France", domaine: "Marketing", duree: "12 mois", rythme: "1 sem / 1 sem", contrat: "Apprentissage", limite: "05 août 2026" },
];

export const STAGES: Listing[] = [
  { titre: "Stage Développement Mobile", org: "NoSchool Digital", ville: "Bordeaux, France", domaine: "Informatique", duree: "4 mois", type: "Stage de fin d'études", limite: "12 août 2026" },
  { titre: "Stage Assistant Chef de Projet", org: "Scholia Group", ville: "Lyon, France", domaine: "Gestion de projet", duree: "6 mois", type: "Stage de fin d'études", limite: "25 août 2026" },
  { titre: "Stage Communication & Réseaux Sociaux", org: "French Degree", ville: "Paris, France", domaine: "Marketing", duree: "3 mois", type: "Stage d'observation", limite: "01 sept. 2026" },
  { titre: "Stage Analyste Financier Junior", org: "ISD Institut", ville: "Bordeaux, France", domaine: "Finance", duree: "5 mois", type: "Stage de fin d'études", limite: "18 août 2026" },
  { titre: "Stage Support Informatique", org: "ESIC", ville: "Toulouse, France", domaine: "Informatique", duree: "2 mois", type: "Stage court", limite: "08 août 2026" },
  { titre: "Stage Ressources Humaines", org: "Will.School", ville: "Nantes, France", domaine: "RH", duree: "4 mois", type: "Stage de fin d'études", limite: "22 sept. 2026" },
];

export type Testimonial = {
  nom: string;
  role: string;
  texte: string;
  note: number;
  date: string;
};

export const TESTIMONIALS: Testimonial[] = [
  { nom: "Fatou D.", role: "Étudiante — AVI", texte: "Service excellent, j'ai obtenu mon attestation en moins de 48h. L'équipe est très réactive et accompagne à chaque étape.", note: 5, date: "il y a 2 semaines" },
  { nom: "Mohamed K.", role: "Étudiant — Campus France", texte: "Grâce à GPI, j'ai pu constituer mon dossier Campus France sans stress. Le suivi est personnalisé et les délais sont respectés.", note: 5, date: "il y a 1 mois" },
  { nom: "Amina B.", role: "Étudiante — ADL", texte: "Très satisfaite de l'accompagnement pour mon attestation de logement. Tout a été fait dans les règles.", note: 5, date: "il y a 1 mois" },
  { nom: "Jean-Pierre M.", role: "Étudiant — Bourses", texte: "Une équipe au top ! Ils m'ont aidé de A à Z pour mes démarches d'études en France.", note: 5, date: "il y a 2 mois" },
  { nom: "Khadija L.", role: "Étudiante — Campus France", texte: "J'étais perdue avec toutes les démarches administratives. GPI a tout simplifié pour moi.", note: 5, date: "il y a 2 mois" },
  { nom: "Samuel T.", role: "Étudiant — Vérificateur", texte: "Service professionnel et fiable. Le vérificateur d'attestation en ligne est un vrai plus.", note: 5, date: "il y a 3 mois" },
];

export const PARTNERS = ["ESIC", "French Degree", "ISD Institut", "NoSchool", "Scholia", "SEOPC", "SupMTI", "Will.School"];

export const GALLERY = [
  "https://picsum.photos/seed/gpi-salon1/500/500",
  "https://picsum.photos/seed/gpi-salon2/500/500",
  "https://picsum.photos/seed/gpi-salon3/500/500",
  "https://picsum.photos/seed/gpi-salon4/500/500",
  "https://picsum.photos/seed/gpi-salon5/500/500",
  "https://picsum.photos/seed/gpi-salon6/500/500",
  "https://picsum.photos/seed/gpi-salon7/500/500",
  "https://picsum.photos/seed/gpi-salon8/500/500",
];

export const STATS = [
  { value: 1000, suffix: "+", label: "Étudiants accompagnés" },
  { value: 98, suffix: "%", label: "Satisfaction" },
  { value: 10, suffix: "+", label: "Universités partenaires" },
  { value: 8, suffix: "+", label: "Pays couverts" },
];
