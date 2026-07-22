'use client'
import { useRouter } from 'next/navigation'

const services = [
  {
    id: 'AVI',
    label: 'Attestation de Virement (AVI)',
    description: 'Attestation officielle pour vos dossiers bancaires et administratifs, indispensable pour la procédure Campus France.',
    delai: '24-48h',
    prix: '49€',
    icon: '✈️',
    tag: 'Le plus demandé'
  },
  {
    id: 'ADL',
    label: 'Attestation de Logement (ADL)',
    description: 'Justificatif de logement pour votre dossier de visa et vos démarches administratives en France.',
    delai: '48-72h',
    prix: '39€',
    icon: '🏠',
    tag: 'Logement'
  },
  {
    id: 'CAMPUS_FRANCE',
    label: 'Campus France',
    description: 'Accompagnement complet pour votre procédure Campus France, de l\'inscription à l\'obtention du visa.',
    delai: '2-4 semaines',
    prix: '149€',
    icon: '🎓',
    tag: 'Accompagnement'
  },
  {
    id: 'BOURSE',
    label: 'Bourse d\'études',
    description: 'Aide à la constitution de votre dossier de demande de bourse pour financer vos études en France.',
    delai: '1-2 semaines',
    prix: '79€',
    icon: '💰',
    tag: 'Financement'
  },
  {
    id: 'VISA',
    label: 'Visa étudiant',
    description: 'Accompagnement complet pour l\'obtention de votre visa étudiant long séjour.',
    delai: '2-6 semaines',
    prix: '199€',
    icon: '🛂',
    tag: 'Visa'
  },
]

export default function NouvelleDemandesPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#0f1e3c]">Nouvelle demande</h1>
        <p className="text-gray-400 text-sm mt-1">Choisissez le service dont vous avez besoin</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#C9962B] hover:shadow-sm transition-all cursor-pointer group"
            onClick={() => router.push(`/dashboard/etudiant/nouveau/${service.id.toLowerCase().replace('_', '-')}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0f1e3c] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-[#0f1e3c]">{service.label}</h2>
                    <span className="text-xs bg-[#f5f3ee] text-[#C9962B] px-2 py-0.5 rounded-full font-medium">
                      {service.tag}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-400">⏱ Délai : <strong className="text-gray-600">{service.delai}</strong></span>
                    <span className="text-xs text-gray-400">💶 Prix : <strong className="text-[#C9962B]">{service.prix}</strong></span>
                  </div>
                </div>
              </div>
              <div className="text-gray-300 group-hover:text-[#C9962B] transition-colors text-xl ml-4">→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}