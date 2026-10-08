import type { Locale } from '@/types';
import {
  ACAI_BOWL_EVENT as EN_ACAI_BOWL_EVENT,
  CATERING_TAGLINE as EN_CATERING_TAGLINE,
  DELIVERY as EN_DELIVERY,
  HOME_HERO as EN_HOME_HERO,
  MONTHLY_TEA_CLUB as EN_MONTHLY_TEA_CLUB,
  VENMO_CHECKOUT as EN_VENMO,
} from '@/lib/brand-content';
import { BRAND } from '@/lib/constants';

export type AcaiBowlEventCopy = {
  name: string;
  headline: string;
  guestPackages: readonly number[];
  bowlSizes: readonly string[];
  venueTypes: readonly string[];
  serviceArea: string;
  deliveryNote: string;
  serviceDuration: string;
  deposit: string;
  balance: string;
  perfectFor: readonly string[];
  freshFruits: readonly string[];
  premiumToppings: readonly string[];
  packageIncludes: readonly string[];
  howItWorks: readonly string[];
};

export function getHomeHero(locale: Locale) {
  if (locale !== 'es') return EN_HOME_HERO;
  return {
    eyebrow: 'Hecho a pedido • Con sabor • Personalizable',
    description:
      'Loaded teas, favoritos con proteína, bowls de açaí y más — elaborados para complementar tu estilo de vida activo.',
    ctaPrimary: 'Comprar Mega Tea Kits',
    ctaSecondary: 'Explorar el menú',
    ctaTertiary: 'Reservar catering',
    features: [
      { label: 'Más de 100 combinaciones de sabor', href: '/menu?category=mega-teas', icon: 'cup' as const },
      { label: 'Arma tu kit', href: '/menu?category=mega-tea-kits', icon: 'kit' as const },
      { label: 'Catering para cada ocasión', href: '/booking', icon: 'catering' as const },
    ],
  };
}

export function getMonthlyTeaClub(locale: Locale) {
  if (locale !== 'es') return EN_MONTHLY_TEA_CLUB;
  return {
    ...EN_MONTHLY_TEA_CLUB,
    name: 'Club Mensual Mega Tea',
    intro: 'Club Mensual Mega Tea',
    boxTagline: 'Mega Tea Kits adentro. Buena vibra afuera.',
    taglines: {
      primary: 'Sabores nuevos en tu puerta cada mes.',
      secondary: 'Bebe más. Disfruta más.',
      value: 'Una sorpresa cada mes.',
      product: 'Sorpréndete con kits de té curados cada mes.',
    },
    surpriseNote:
      'Elige cuántos kits quieres cada mes — los sabores son sorpresa mensual, con entrega local o envío a todo el país.',
    cta: 'Únete al club',
    ctaDetail: 'Escríbenos o envíanos un DM para suscribirte, o completa el formulario abajo.',
    joinHeadline: 'ÚNETE AL CLUB',
    plans: [
      { kits: 6, label: '6 kits', slug: '6-kits' },
      { kits: 12, label: '12 kits', slug: '12-kits' },
      { kits: 20, label: '20 kits', slug: '20-kits' },
      { kits: 30, label: '30 kits', slug: '30-kits' },
    ],
    fulfillmentOptions: [
      {
        slug: 'local-delivery',
        label: 'Entrega local',
        description: 'Entrega en un radio de 3 millas (pedido mínimo $25).',
      },
      {
        slug: 'nationwide-shipping',
        label: 'Envío nacional',
        description: 'Enviamos a cualquier parte de EE. UU.',
      },
    ],
    features: [
      {
        title: 'Sabores nuevos cada mes',
        description:
          'Cada caja trae blends de loaded tea que no has probado — seleccionados frescos cada mes.',
      },
      {
        title: 'Guía paso a paso',
        description: 'Cada kit incluye instrucciones simples para preparar tés perfectos en casa.',
      },
      {
        title: 'Complementos personalizables',
        description: 'Mejora tus kits con boosters de bienestar y add-ins al inscribirte.',
      },
      {
        title: 'Una sorpresa cada mes',
        description:
          'Tú eliges cuántos kits — nosotros te sorprendemos con sabores nuevos, entregados o enviados a tu puerta.',
      },
    ],
    whatsInside: [
      'Kits sorpresa de Loaded Tea',
      'Guía paso a paso fácil',
      'Boosters y add-ins de bienestar',
      'Sabores nuevos cada mes',
      'Entrega o envío mensual',
    ],
  };
}

export function getCateringTagline(locale: Locale): string {
  if (locale !== 'es') return EN_CATERING_TAGLINE;
  return 'Catering disponible — ideal para eventos, fiestas, oficinas y ocasiones especiales.';
}

export function getDelivery(locale: Locale) {
  if (locale !== 'es') return EN_DELIVERY;
  return {
    local: 'Entrega local disponible en un radio de 3 millas (pedido mínimo $25).',
    nationwide: 'Envíos a todo Estados Unidos.',
  };
}

export function getVenmoInstructions(locale: Locale): string {
  if (locale !== 'es') return EN_VENMO.instructions;
  return 'Escanea el código QR con la app Venmo y paga el total exacto del pedido que aparece abajo. Después del pago, marca la casilla para enviar tu pedido.';
}

export function getMegaTeaKitsMarketing(locale: Locale) {
  if (locale !== 'es') {
    return {
      headline: 'Mega Tea Kits',
      description: 'Prepara loaded teas en casa con boosters premium y el enhancer de sabor que elijas.',
      convenienceNote:
        'Los Mega Tea Kits vienen empaquetados individualmente — todo lo que necesitas para hacer loaded tea en casa.',
      kitProductsLabel: 'Cada kit incluye 5 productos',
      shopCta: 'Ver Mega Tea Kits',
      eyebrow: 'Hecho para llevar',
    };
  }
  return {
    headline: 'Mega Tea Kits',
    description:
      'Prepara loaded teas en casa con boosters premium y el potenciador de sabor que elijas.',
    convenienceNote:
      'Los Mega Tea Kits vienen empaquetados individualmente — todo lo que necesitas para hacer loaded tea en casa.',
    kitProductsLabel: 'Cada kit incluye 5 productos',
    shopCta: 'Ver Mega Tea Kits',
    eyebrow: 'Hecho para llevar',
  };
}

export function getHomePageCopy(locale: Locale) {
  const isEs = locale === 'es';
  return {
    cateringTitle: isEs ? 'Catering para cada ocasión' : 'Catering for Every Occasion',
    bookCatering: isEs ? 'Reservar catering' : 'Book Catering',
    howItWorksTitle: isEs ? 'Cómo funciona' : 'How It Works',
    howItWorksSteps: isEs
      ? [
          { step: '1', title: 'Elige tu plan', desc: 'Selecciona una caja de 6, 12, 20 o 30 kits y tus sabores.' },
          { step: '2', title: 'Entrega mensual', desc: 'Recibe blends de loaded tea, guías, boosters y sorpresas dulces.' },
          { step: '3', title: 'Bebe y disfruta', desc: 'Prepara tés energizantes en casa — o reserva catering para tu próximo evento.' },
        ]
      : [
          { step: '1', title: 'Choose Your Plan', desc: 'Pick a 6, 12, 20, or 30 tea kit box and select your flavors.' },
          { step: '2', title: 'Delivered Monthly', desc: 'Receive loaded tea blends, guides, boosters, and sweet surprises.' },
          { step: '3', title: 'Sip & Enjoy', desc: 'Make energizing teas at home — or book catering for your next event.' },
        ],
    signUpClub: isEs ? 'Únete al club →' : 'Sign up for the club →',
    membershipBenefits: isEs ? 'Beneficios de membresía' : 'Membership Benefits',
    whyLoveIt: isEs ? 'Por qué te encantará' : "Why You'll Love It",
    whatsInsideTitle: isEs ? 'Qué incluye' : "What's Inside",
    lifestyleTitle: isEs ? 'Impulsa tu estilo de vida' : 'Fuel Your Lifestyle',
    lifestyleSubtitle: isEs
      ? 'Loaded teas, café con proteína, bowls de açaí, catering y más — hechos para energizar tu día.'
      : 'Loaded teas, protein coffee, açaí bowls, catering, and more — made to energize your day.',
  };
}

export function getAcaiBowlEvent(locale: Locale): AcaiBowlEventCopy {
  if (locale !== 'es') return EN_ACAI_BOWL_EVENT;
  return {
    name: 'Experiencia de Evento con Bowls de Açaí',
    headline:
      'Eleva tu próximo evento con nuestra fresca y vibrante barra de bowls de açaí Fusion Fuel & Boost.',
    guestPackages: EN_ACAI_BOWL_EVENT.guestPackages,
    bowlSizes: ['Mini bowl de 5 oz', 'Bowl de 9 oz', 'Bowl de 12 oz'],
    venueTypes: ['Interior', 'Exterior'],
    serviceArea: 'Servimos eventos en los condados de Hillsborough y Manatee',
    deliveryNote: 'Entrega incluida dentro de 20 millas',
    serviceDuration: 'Hasta 2 horas de servicio en el lugar',
    deposit: 'Se requiere un depósito del 50% para reservar la fecha de tu evento.',
    balance: 'El 50% restante debe pagarse antes del inicio del servicio el día del evento.',
    perfectFor: [
      'Eventos corporativos',
      'Escuelas',
      'Gimnasios',
      'Bodas',
      'Baby showers',
      'Cumpleaños',
      'Eventos de bienestar',
      'Eventos comunitarios',
      'Fiestas privadas',
    ],
    freshFruits: ['Fresas', 'Plátanos', 'Kiwi', 'Arándanos'],
    premiumToppings: [
      'Granola',
      'Mantequilla de maní',
      'Nutella',
      'Chispas de chocolate',
      'Almendras laminadas',
      'Copos de coco',
      'Leche condensada',
      'Caramelo',
    ],
    packageIncludes: [
      'Bowls de açaí preporcionados y preparados para un servicio eficiente',
      'Selección de fruta fresca',
      'Selección de toppings premium',
      'Montaje profesional del evento y estación de servicio',
      'Bowls terminados al momento con la fruta y toppings que elija cada invitado',
      'Hasta 2 horas de servicio',
      'Entrega incluida dentro de 20 millas',
    ],
    howItWorks: [
      'Llegamos con los bowls preporcionados para un servicio fluido y eficiente.',
      'Los invitados eligen su fruta fresca y toppings, y cada bowl se termina en nuestra estación de servicio.',
      'Si se sirven todos los bowls antes de que termine la ventana de 2 horas, el servicio concluirá en ese momento.',
      'Cualquier bowl restante al final del evento se preparará para que lo disfrutes después.',
    ],
  };
}

export function getSocialFollowCopy(locale: Locale) {
  if (locale !== 'es') {
    return {
      title: 'Follow the Energy',
      subtitle: 'Scan the code or tap below to follow us on social.',
      qrAlt: (handle: string) => `Scan to follow ${handle} on Instagram`,
    };
  }
  return {
    title: 'Sigue la energía',
    subtitle: 'Escanea el código o toca abajo para seguirnos en redes.',
    qrAlt: (handle: string) => `Escanea para seguir a ${handle} en Instagram`,
  };
}

export function getBrandTagline(locale: Locale): string {
  return locale === 'es' ? BRAND.tagline.es : BRAND.tagline.en;
}

export function getBookingWizardCopy(locale: Locale) {
  const isEs = locale === 'es';
  return {
    steps: isEs
      ? ['Evento', 'Horario', 'Lugar', 'Contacto', 'Detalles', 'Revisar', 'Listo']
      : ['Event', 'Schedule', 'Venue', 'Contact', 'Details', 'Review', 'Done'],
    cateringService: isEs ? 'Servicio de catering' : 'Catering service',
    selectPlaceholder: isEs ? 'Seleccionar…' : 'Select…',
    eventType: isEs ? 'Tipo de evento' : 'Event type',
    preferredDate: isEs ? 'Fecha preferida' : 'Preferred date',
    alternateDate: isEs ? 'Fecha alternativa (opcional)' : 'Alternate date (optional)',
    startTime: isEs ? 'Hora de inicio' : 'Start time',
    guestCount: isEs ? 'Número de invitados' : 'Guest count',
    eventsGuestRangeLead: isEs
      ? 'Los eventos están disponibles para'
      : 'Events are available for',
    eventsGuestRangeSuffix: isEs ? 'invitados.' : 'guests.',
    fulfillment: isEs ? 'Modalidad' : 'Fulfillment',
    delivery: isEs ? 'Entrega' : 'Delivery',
    pickup: isEs ? 'Recoger' : 'Pickup',
    venueName: isEs ? 'Nombre del lugar (opcional)' : 'Venue name (optional)',
    street: isEs ? 'Calle' : 'Street',
    city: isEs ? 'Ciudad' : 'City',
    state: isEs ? 'Estado' : 'State',
    zip: isEs ? 'Código postal' : 'ZIP',
    contactName: isEs ? 'Nombre de contacto' : 'Contact name',
    organization: isEs ? 'Organización (opcional)' : 'Organization (optional)',
    email: isEs ? 'Correo electrónico' : 'Email',
    phone: isEs ? 'Teléfono' : 'Phone',
    preferredContact: isEs ? 'Contacto preferido' : 'Preferred contact',
    dietaryNotes: isEs ? 'Notas dietéticas' : 'Dietary notes',
    budgetRange: isEs ? 'Rango de presupuesto (opcional)' : 'Budget range (optional)',
    specialInstructions: isEs ? 'Instrucciones especiales' : 'Special instructions',
    consent: isEs
      ? 'Acepto ser contactado/a sobre esta solicitud de catering.'
      : 'I consent to be contacted about this catering request.',
    next: isEs ? 'Siguiente' : 'Next',
    back: isEs ? 'Atrás' : 'Back',
    reviewTitle: isEs ? 'Revisa tu solicitud' : 'Review your request',
    reviewSubtitle: isEs
      ? 'Confirma los detalles de tu catering antes de enviar.'
      : 'Please confirm your catering details before submitting.',
    submit: isEs ? 'Enviar solicitud' : 'Submit Request',
    sectionEvent: isEs ? 'Evento' : 'Event',
    sectionSchedule: isEs ? 'Horario' : 'Schedule',
    sectionVenue: isEs ? 'Lugar' : 'Venue',
    sectionContact: isEs ? 'Contacto' : 'Contact',
    sectionDetails: isEs ? 'Detalles' : 'Details',
    productInterests: isEs ? 'Productos de interés' : 'Product interests',
    requestReceived: isEs ? 'Solicitud recibida' : 'Request received',
    thankYou: isEs ? '¡Gracias!' : 'Thank you!',
    submittedMessage: isEs
      ? 'Tu solicitud de catering ha sido enviada. Nuestro equipo revisará los detalles y se pondrá en contacto pronto.'
      : 'Your catering request has been submitted. Our team will review the details and follow up soon.',
    referenceLabel: isEs ? 'Número de referencia:' : 'Reference number:',
    notConfirmed: isEs
      ? 'Esto es una solicitud, no una reserva confirmada. Nos comunicaremos contigo para confirmar disponibilidad.'
      : 'This is a request, not a confirmed booking. We will contact you to confirm availability.',
    submissionFailed: isEs ? 'Error al enviar' : 'Submission failed',
    productInterestLabels: isEs
      ? { 'mega-tea-kits': 'Kits Mega Tea', catering: 'Catering' }
      : { 'mega-tea-kits': 'Mega Tea Kits', catering: 'Catering' },
  };
}
