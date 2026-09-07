import type { LocalizedString } from '@/types';

function loc(en: string, es: string): LocalizedString {
  return { en, es };
}

export const ABOUT_TAGLINE = 'Fuel Your Day. Boost Your Life.';

export const ABOUT_HERO = {
  eyebrow: loc('Our Story', 'Nuestra historia'),
  badge: loc('Family-Owned & Operated', 'Negocio familiar'),
  subtitle: loc(
    'Home-based in Wimauma, serving Hillsborough & Manatee counties with energizing teas, protein favorites, and catering made with heart.',
    'Desde Wimauma, servimos los condados de Hillsborough y Manatee con loaded teas, favoritos con proteína y catering hecho con cariño.'
  ),
} as const;

export const ABOUT_HIGHLIGHTS = [
  {
    label: loc('Based in', 'Ubicados en'),
    value: loc('Wimauma, FL', 'Wimauma, FL'),
  },
  {
    label: loc('Serving', 'Servimos'),
    value: loc('Hillsborough & Manatee', 'Hillsborough y Manatee'),
  },
  {
    label: loc('Since', 'Desde'),
    value: loc('Bradenton roots', 'Raíces en Bradenton'),
  },
] as const;

export const ABOUT_VALUE_PILLARS = [
  {
    title: loc('Family', 'Familia'),
    description: loc(
      'Every order is prepared with care by our family, for yours.',
      'Cada pedido se prepara con cuidado por nuestra familia, para la tuya.'
    ),
  },
  {
    title: loc('Community', 'Comunidad'),
    description: loc(
      'Schools, pop-ups, and local organizations we love to support.',
      'Escuelas, pop-ups y organizaciones locales que nos encanta apoyar.'
    ),
  },
  {
    title: loc('Quality', 'Calidad'),
    description: loc(
      'Flavorful, convenient nutrition you can feel good about.',
      'Nutrición sabrosa y conveniente de la que puedes sentirte bien.'
    ),
  },
  {
    title: loc('Genuine Care', 'Cuidado genuino'),
    description: loc(
      'Friendly, personalized service on every order and event.',
      'Servicio amable y personalizado en cada pedido y evento.'
    ),
  },
] as const;

export const ABOUT_STORY = {
  title: loc('About Us', 'Sobre nosotros'),
  paragraphs: [
    loc(
      'Welcome to Fusion Fuel & Boost Co., a family-owned and operated business.',
      'Bienvenidos a Fusion Fuel & Boost Co., un negocio familiar.'
    ),
    loc(
      'Our journey began when we owned a nutrition club in Bradenton. We loved connecting with our customers, building relationships and serving the community. Due to unexpected family health circumstances, we made the difficult decision to sell the club. Although we had to step away from the physical location, our passion for what we do never went away.',
      'Nuestro camino comenzó cuando teníamos un club de nutrición en Bradenton. Nos encantaba conectar con nuestros clientes, crear relaciones y servir a la comunidad. Por circunstancias de salud familiares inesperadas, tomamos la difícil decisión de vender el club. Aunque tuvimos que alejarnos del local físico, nuestra pasión por lo que hacemos nunca desapareció.'
    ),
    loc(
      'Today, we continue our journey through our home-based business in Wimauma. Together as a family, we offer energizing teas, Mega Tea kits, protein shakes, protein coffee, açaí bowls, waffles and protein treats. We also provide catering for schools, medical offices, businesses, sporting events and private celebrations throughout Hillsborough and Manatee counties.',
      'Hoy continuamos nuestro camino con un negocio desde casa en Wimauma. En familia ofrecemos loaded teas, kits Mega Tea, batidos de proteína, café con proteína, bowls de açaí, waffles y treats de proteína. También brindamos catering para escuelas, consultorios médicos, empresas, eventos deportivos y celebraciones privadas en los condados de Hillsborough y Manatee.'
    ),
    loc(
      'Every order is prepared with care and gratitude. When you support Fusion Fuel & Boost Co., you are supporting our family and helping us continue doing what we love.',
      'Cada pedido se prepara con cuidado y gratitud. Cuando apoyas a Fusion Fuel & Boost Co., apoyas a nuestra familia y nos ayudas a seguir haciendo lo que amamos.'
    ),
  ],
} as const;

export const ABOUT_MISSION = {
  title: loc('Our Mission', 'Nuestra misión'),
  paragraphs: [
    loc(
      'Our mission at Fusion Fuel & Boost Co. is to provide delicious, convenient nutrition options while creating a welcoming and personalized experience for every customer.',
      'Nuestra misión en Fusion Fuel & Boost Co. es ofrecer opciones de nutrición deliciosas y convenientes mientras creamos una experiencia acogedora y personalizada para cada cliente.'
    ),
    loc(
      'As a family-owned and operated business, we are committed to preparing every order with care, supporting our local community and helping make busy days a little easier. From everyday orders to schools, sporting events, medical offices, corporate gatherings and private celebrations, our goal is to bring great flavor, positive energy and dependable service wherever we go.',
      'Como negocio familiar, nos comprometemos a preparar cada pedido con cuidado, apoyar a nuestra comunidad local y hacer que los días ocupados sean un poco más fáciles. Desde pedidos diarios hasta escuelas, eventos deportivos, consultorios médicos, reuniones corporativas y celebraciones privadas, nuestro objetivo es llevar gran sabor, energía positiva y servicio confiable a donde vayamos.'
    ),
  ],
} as const;

export const ABOUT_VALUES = {
  title: loc('What We Stand For', 'Lo que representamos'),
  paragraphs: [
    loc(
      'At Fusion Fuel & Boost Co., we stand for family, community, quality and genuine care. We believe nutrition should be flavorful, convenient and enjoyable.',
      'En Fusion Fuel & Boost Co. representamos familia, comunidad, calidad y cuidado genuino. Creemos que la nutrición debe ser sabrosa, conveniente y placentera.'
    ),
    loc(
      'As a family-owned and operated, home-based business, we take pride in preparing every order with care and providing friendly, personalized service. From individual orders and local delivery to catering, community pop-ups, school activities, sporting events, medical offices, corporate gatherings and private celebrations, we are committed to making every experience special.',
      'Como negocio familiar desde casa, nos enorgullece preparar cada pedido con cuidado y brindar un servicio amable y personalizado. Desde pedidos individuales y entrega local hasta catering, pop-ups comunitarios, actividades escolares, eventos deportivos, consultorios médicos, reuniones corporativas y celebraciones privadas, nos comprometemos a hacer cada experiencia especial.'
    ),
    loc(
      'We value honesty, meaningful relationships and opportunities to support local organizations while helping our customers fuel their day with confidence and positive energy.',
      'Valoramos la honestidad, las relaciones significativas y las oportunidades de apoyar organizaciones locales mientras ayudamos a nuestros clientes a impulsar su día con confianza y energía positiva.'
    ),
  ],
} as const;

export type AboutServiceIcon =
  | 'school'
  | 'medical'
  | 'business'
  | 'sport'
  | 'celebration'
  | 'community';

export const ABOUT_SERVICE_CARDS: ReadonlyArray<{
  icon: AboutServiceIcon;
  title: LocalizedString;
  description: LocalizedString;
  href: string;
}> = [
  {
    icon: 'school',
    title: loc('Schools', 'Escuelas'),
    description: loc(
      'Flavorful catering for school events, staff appreciation, and student activities.',
      'Catering sabroso para eventos escolares, reconocimiento al personal y actividades estudiantiles.'
    ),
    href: '/services/school-catering',
  },
  {
    icon: 'medical',
    title: loc('Medical Offices', 'Consultorios médicos'),
    description: loc(
      'Convenient, energizing options for healthcare teams and office events.',
      'Opciones convenientes y energizantes para equipos de salud y eventos de consultorio.'
    ),
    href: '/services/medical-office-catering',
  },
  {
    icon: 'business',
    title: loc('Businesses', 'Empresas'),
    description: loc(
      'Corporate catering with loaded teas, protein options, and customizable menus.',
      'Catering corporativo con loaded teas, opciones con proteína y menús personalizables.'
    ),
    href: '/services/corporate-catering',
  },
  {
    icon: 'sport',
    title: loc('Sporting Events', 'Eventos deportivos'),
    description: loc(
      'Fuel teams, fans, and tournaments with refreshing drinks and treats on-site.',
      'Energiza equipos, aficionados y torneos con bebidas refrescantes y treats en el lugar.'
    ),
    href: '/services/special-event-catering',
  },
  {
    icon: 'celebration',
    title: loc('Private Celebrations', 'Celebraciones privadas'),
    description: loc(
      'Birthdays, showers, weddings, and family gatherings made memorable.',
      'Cumpleaños, despedidas, bodas y reuniones familiares inolvidables.'
    ),
    href: '/services/private-party-catering',
  },
  {
    icon: 'community',
    title: loc('Community Pop-Ups', 'Pop-ups comunitarios'),
    description: loc(
      'Local delivery, pop-ups, and events throughout Hillsborough and Manatee counties.',
      'Entrega local, pop-ups y eventos en los condados de Hillsborough y Manatee.'
    ),
    href: '/services/special-event-catering',
  },
] as const;

export const ABOUT_CONNECT = {
  title: loc('Connect With Us', 'Conéctate con nosotros'),
  ctaTitle: loc('Let Us Serve You!', '¡Permítenos servirte!'),
  ctaDescription: loc(
    'Ready to order, book catering, or ask a question? We would love to hear from you.',
    '¿Listo para ordenar, reservar catering o hacer una pregunta? Nos encantaría saber de ti.'
  ),
} as const;

export const ABOUT_REVIEWS = {
  title: loc('What Customers Are Saying', 'Lo que dicen nuestros clientes'),
  empty: loc(
    'Verified reviews will appear here as they are published.',
    'Las reseñas verificadas aparecerán aquí cuando se publiquen.'
  ),
  viewAll: loc('See all reviews', 'Ver todas las reseñas'),
} as const;
