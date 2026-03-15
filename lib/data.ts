export type Lang = 'es' | 'en'

export type Status = 'great' | 'good' | 'busy'

export interface Beach {
  slug: string
  gradient: string
  emoji: string
  status: Status
  nameEs: string
  nameEn: string
  tagsEs: string
  tagsEn: string
  driveEs: string
  driveEn: string
  // detail page fields
  descEs: string
  descEn: string
  tipsEs: string[]
  tipsEn: string[]
  parkingEs: string
  parkingEn: string
  bestForEs: string[]
  bestForEn: string[]
  lat: number
  lng: number
  mapLink: string
}

export interface Attraction {
  slug: string
  emoji: string
  gradient: string
  nameEs: string
  nameEn: string
  subEs: string
  subEn: string
}

export interface Event {
  time: string
  ampm: string
  nameEs: string
  nameEn: string
  whereEs: string
  whereEn: string
  type: 'free' | 'featured'
  labelEs: string
  labelEn: string
}

export interface Restaurant {
  num: string
  name: string
  typeEs: string
  typeEn: string
  price: string
  noteEs: string
  noteEn: string
  status: 'open' | 'closing'
  statusEs: string
  statusEn: string
  stars: string
  sponsored?: boolean
  highlight?: boolean
}

export interface Plan {
  icon: string
  nameEs: string
  nameEn: string
  descEs: string
  descEn: string
  color: string
}

// ── BEACHES ──────────────────────────────────────────────
export const beaches: Beach[] = [
  {
    slug: 'playa-sucia',
    gradient: 'from-[#0a3d52] to-[#1a9b8a]',
    emoji: '🏖️',
    status: 'great',
    nameEs: 'Playa Sucia',
    nameEn: 'Playa Sucia',
    tagsEs: 'Vistas · Buceo · Tranquila',
    tagsEn: 'Scenic · Snorkel · Remote',
    driveEs: '12 min en carro',
    driveEn: '12 min drive',
    descEs: 'Playa Sucia es la joya escondida de Cabo Rojo. Con agua turquesa cristalina, el Faro Los Morrillos al fondo y prácticamente sin multitudes, es el lugar perfecto para un día de playa tranquilo. El camino de tierra al final vale cada bache.',
    descEn: 'Playa Sucia is Cabo Rojo\'s hidden gem. Crystal turquoise water, the Los Morrillos Lighthouse in the background, and almost zero crowds — it\'s the perfect spot for a quiet beach day. The dirt road at the end is worth every bump.',
    tipsEs: [
      'Llega antes de las 10am para tener la playa casi para ti solo',
      'Trae agua y snacks — no hay vendedores en la playa',
      'El camino de tierra es transitable en carro regular, ve despacio',
      'El lado izquierdo de la playa es mejor para bucear',
      'No dejes cosas de valor en el carro',
    ],
    tipsEn: [
      'Arrive before 10am to have the beach almost to yourself',
      'Bring water and snacks — no vendors on the beach',
      'The dirt road is manageable in a regular car, just go slow',
      'The left side of the beach is best for snorkeling',
      'Don\'t leave valuables in your car',
    ],
    parkingEs: 'Estacionamiento gratuito al final del camino de tierra. Espacio limitado.',
    parkingEn: 'Free parking at the end of the dirt road. Limited spaces.',
    bestForEs: ['Buceo', 'Fotos', 'Parejas', 'Tranquilidad'],
    bestForEn: ['Snorkeling', 'Photos', 'Couples', 'Quiet day'],
    lat: 17.9441,
    lng: -67.1893,
    mapLink: 'https://maps.google.com/?q=Playa+Sucia+Cabo+Rojo+Puerto+Rico',
  },
  {
    slug: 'playa-buye',
    gradient: 'from-[#0a3d1a] to-[#2db56e]',
    emoji: '🌊',
    status: 'great',
    nameEs: 'Playa Buyé',
    nameEn: 'Playa Buyé',
    tagsEs: 'Familia · Agua clara',
    tagsEn: 'Family · Clear water',
    driveEs: '8 min en carro',
    driveEn: '8 min drive',
    descEs: 'Playa Buyé es una de las playas más accesibles y hermosas de Cabo Rojo. Perfecta para familias con niños, con agua poco profunda, arena blanca y fácil estacionamiento. Los fines de semana se anima bastante.',
    descEn: 'Playa Buyé is one of the most accessible and beautiful beaches in Cabo Rojo. Perfect for families with kids — shallow water, white sand, and easy parking. Weekends get lively.',
    tipsEs: [
      'Ideal para niños por lo poco profunda que es',
      'Llega temprano los fines de semana — se llena',
      'Hay facilidades de baño disponibles',
      'Los vendedores de cocos y frituras llegan alrededor del mediodía',
    ],
    tipsEn: [
      'Ideal for kids due to the shallow water',
      'Arrive early on weekends — it fills up fast',
      'Bathroom facilities available',
      'Coconut and food vendors arrive around noon',
    ],
    parkingEs: 'Estacionamiento disponible frente a la playa. Llega temprano los fines de semana.',
    parkingEn: 'Parking available in front of the beach. Arrive early on weekends.',
    bestForEs: ['Familias', 'Niños', 'Natación', 'Picnic'],
    bestForEn: ['Families', 'Kids', 'Swimming', 'Picnic'],
    lat: 17.9823,
    lng: -67.1654,
    mapLink: 'https://maps.google.com/?q=Playa+Buye+Cabo+Rojo+Puerto+Rico',
  },
  {
    slug: 'combate',
    gradient: 'from-[#522a0a] to-[#c07830]',
    emoji: '🌅',
    status: 'good',
    nameEs: 'Combate',
    nameEn: 'Combate',
    tagsEs: 'Atardecer · Poco profundo',
    tagsEn: 'Sunset · Shallow · Wide',
    driveEs: '6 min en carro',
    driveEn: '6 min drive',
    descEs: 'Combate es la mejor playa de Cabo Rojo para ver el atardecer. Ancha, con arena dorada y aguas poco profundas, es perfecta para caminar y relajarse al final del día. Hoy hay algo de viento — bueno para los que disfrutan el kitesurf.',
    descEn: 'Combate is Cabo Rojo\'s best beach for sunsets. Wide, golden sand and shallow water make it perfect for walking and winding down at the end of the day. Some wind today — great if you enjoy kite surfing.',
    tipsEs: [
      'Mejor atardecer de todas las playas de la zona',
      'El viento puede ser fuerte — trae algo de abrigo por la tarde',
      'Las aguas poco profundas lo hacen ideal para caminar largas distancias',
      'Hay varios restaurantes a poca distancia',
    ],
    tipsEn: [
      'Best sunset of all the beaches in the area',
      'Wind can be strong — bring a light layer for the evening',
      'Shallow water makes it ideal for long walks',
      'Several restaurants within short walking distance',
    ],
    parkingEs: 'Amplio estacionamiento gratuito. Sin problemas hoy.',
    parkingEn: 'Ample free parking. No issues today.',
    bestForEs: ['Atardecer', 'Caminatas', 'Kitesurf', 'Fotos'],
    bestForEn: ['Sunset', 'Long walks', 'Kite surfing', 'Photos'],
    lat: 17.9612,
    lng: -67.1901,
    mapLink: 'https://maps.google.com/?q=Combate+Beach+Cabo+Rojo+Puerto+Rico',
  },
  {
    slug: 'balneario-boqueron',
    gradient: 'from-[#0a1a52] to-[#2d5fb5]',
    emoji: '🎭',
    status: 'busy',
    nameEs: 'Balneario Boquerón',
    nameEn: 'Balneario Boquerón',
    tagsEs: 'Animado · Comida cerca',
    tagsEn: 'Lively · Food nearby',
    driveEs: 'Caminando desde el pueblo',
    driveEn: 'Walk from town',
    descEs: 'El Balneario de Boquerón es la playa más popular y animada de la zona. Con facilidades completas, acceso a restaurantes y bares a pasos, y un ambiente social inigualable. Hoy está bastante lleno — si buscas tranquilidad, considera Buyé o Playa Sucia.',
    descEn: 'Boquerón Balneario is the most popular and lively beach in the area. Full facilities, restaurants and bars steps away, and an unmatched social atmosphere. It\'s pretty packed today — if you want quiet, consider Buyé or Playa Sucia instead.',
    tipsEs: [
      'Llega temprano para conseguir un buen espacio',
      'Los bares y restaurantes del pueblo están a minutos caminando',
      'Tiene duchas, baños y áreas de picnic',
      'Perfecto para socializar y conocer gente',
      'Puede estar lleno los fines de semana y días feriados',
    ],
    tipsEn: [
      'Arrive early to get a good spot',
      'Town bars and restaurants are minutes away on foot',
      'Has showers, bathrooms, and picnic areas',
      'Perfect for socializing and meeting people',
      'Can get packed on weekends and holidays',
    ],
    parkingEs: 'Estacionamiento de pago disponible. Llega temprano — hoy está lleno.',
    parkingEn: 'Paid parking available. Arrive early — busy today.',
    bestForEs: ['Grupos', 'Socializar', 'Familias', 'Acceso fácil'],
    bestForEn: ['Groups', 'Socializing', 'Families', 'Easy access'],
    lat: 17.9989,
    lng: -67.1548,
    mapLink: 'https://maps.google.com/?q=Balneario+Boqueron+Puerto+Rico',
  },
]

// ── ATTRACTIONS ──────────────────────────────────────────
export const attractions: Attraction[] = [
  { slug: 'faro', emoji: '🏛️', gradient: 'from-[#0d2d3f] to-[#1a7a6e]', nameEs: 'Faro Los Morrillos', nameEn: 'Los Morrillos Lighthouse', subEs: 'Atardecer · Acantilados · Gratis', subEn: 'Sunset · Cliffs · Free' },
  { slug: 'salinas', emoji: '🌊', gradient: 'from-[#c9943a] to-[#e05a3a]', nameEs: 'Las Salinas', nameEn: 'Salt Flats', subEs: 'Salinas · Agua rosada', subEn: 'Salt Flats · Pink water' },
  { slug: 'pueblo', emoji: '🎶', gradient: 'from-[#1a4a5c] to-[#0d2d3f]', nameEs: 'Pueblo de Boquerón', nameEn: 'Boquerón Village', subEs: 'Comida · Vida nocturna', subEn: 'Food · Nightlife · Walk' },
  { slug: 'bosque', emoji: '🌿', gradient: 'from-[#1a3d1a] to-[#2d7a4a]', nameEs: 'Bosque Seco', nameEn: 'Dry Forest Reserve', subEs: 'Naturaleza · Aves · Senderos', subEn: 'Wildlife · Trails · Birds' },
]

// ── EVENTS ───────────────────────────────────────────────
export const events: Event[] = [
  { time: '6:00', ampm: 'pm', nameEs: 'Atardecer en Los Morrillos', nameEn: 'Sunset at Los Morrillos', whereEs: 'Faro · La mejor vista de la isla', whereEn: 'Lighthouse · Best view on the island', type: 'free', labelEs: 'Gratis', labelEn: 'Free' },
  { time: '7:30', ampm: 'pm', nameEs: 'Salsa en Vivo — Shamar Bar', nameEn: 'Live Salsa — Shamar Bar', whereEs: 'Calle de Boquerón · Entrada libre', whereEn: 'Calle de Boquerón · Walk-in welcome', type: 'featured', labelEs: 'Destacado', labelEn: 'Featured' },
  { time: '8:00', ampm: 'pm', nameEs: 'Medallas a $4 hasta las 8pm', nameEn: '$4 Medallas until 8pm', whereEs: 'Pescadores · Happy Hour termina', whereEn: 'Pescadores · Happy hour ends', type: 'free', labelEs: 'Oferta', labelEn: 'Deal' },
  { time: '9:00', ampm: 'pm', nameEs: 'Noche de DJ — Galloway\'s', nameEn: 'DJ Night — Galloway\'s', whereEs: 'Frente al mar · Abierto hasta medianoche', whereEn: 'Waterfront · Open to midnight', type: 'featured', labelEs: 'Patrocinado', labelEn: 'Sponsored' },
]

// ── RESTAURANTS ──────────────────────────────────────────
export const restaurants: Restaurant[] = [
  { num: '01', name: 'El Bohío', typeEs: 'Mariscos', typeEn: 'Seafood', price: '$$', noteEs: 'Cerca de la playa', noteEn: 'Walk from beach', status: 'open', statusEs: 'Abierto', statusEn: 'Open', stars: '★★★★½' },
  { num: '02', name: 'Shamar Bar & Grill', typeEs: 'Bar + Comida', typeEn: 'Bar + Food', price: '$', noteEs: 'Música en vivo hoy', noteEn: 'Live music tonight', status: 'open', statusEs: 'Abierto', statusEn: 'Open', stars: '★★★★☆', sponsored: true, highlight: true },
  { num: '03', name: 'Pizza Boquerón', typeEs: 'Pizza · Casual', typeEn: 'Pizza · Casual', price: '$', noteEs: '', noteEn: '', status: 'closing', statusEs: 'Cierra 9pm', statusEn: 'Closes 9pm', stars: '★★★☆☆' },
]

// ── PLANS ────────────────────────────────────────────────
export const plans: Plan[] = [
  { icon: '👨‍👩‍👧', nameEs: 'Sábado Familiar', nameEn: 'Family Saturday', descEs: 'Buyé → Faro → cena temprano', descEn: 'Buyé → Lighthouse → early dinner', color: '#1a7a6e' },
  { icon: '🌅', nameEs: 'Atardecer + Cena', nameEn: 'Sunset + Dinner', descEs: 'Los Morrillos 6pm → Shamar', descEn: 'Los Morrillos 6pm → Shamar', color: '#e05a3a' },
  { icon: '🚗', nameEs: 'Plan de Lunes', nameEn: 'Monday Plan', descEs: 'Sin multitudes, los mejores sitios', descEn: 'Off-season picks, no crowds', color: '#c9943a' },
  { icon: '💑', nameEs: 'Noche Romántica', nameEn: 'Date Night', descEs: 'Playa Sucia → salinas → tragos', descEn: 'Playa Sucia → salt flats → drinks', color: '#0d2d3f' },
]

// ── STATUS LABELS ─────────────────────────────────────────
export const statusLabel: Record<Status, { es: string; en: string; color: string }> = {
  great: { es: '● Excelente', en: '● Great',  color: '#16a34a' },
  good:  { es: '● Ventoso',   en: '● Windy',  color: '#c9943a' },
  busy:  { es: '● Lleno',     en: '● Busy',   color: '#e05a3a' },
}

// ── UI STRINGS ────────────────────────────────────────────
export const ui = {
  siteTagline: { es: 'Tu Guía en Tiempo Real · Boquerón y Alrededores', en: 'Your Real-Time Guide · Boquerón & Beyond' },
  live:        { es: 'En Vivo', en: 'Live' },
  bestBeaches: { es: 'Mejores Playas Hoy', en: 'Best Beaches Today' },
  seeAll:      { es: 'Ver todas →', en: 'See all →' },
  attractions: { es: 'Atracciones Cercanas', en: 'Nearby Attractions' },
  explore:     { es: 'Explorar →', en: 'Explore →' },
  tonight:     { es: 'Esta Noche', en: 'Tonight' },
  openNow:     { es: 'Abierto Ahora', en: 'Open Right Now' },
  fullList:    { es: 'Ver lista →', en: 'Full list →' },
  quickPlans:  { es: 'Planes Rápidos', en: 'Quick Plans' },
  more:        { es: 'Más →', en: 'More →' },
  bizHed:      { es: '¿Tienes un negocio en Boquerón?', en: 'Own a business in Boquerón?' },
  bizSub:      { es: 'Llega a visitantes que deciden a dónde ir en este momento.', en: 'Get in front of visitors deciding where to go right now.' },
  modalHed:    { es: 'Registra Tu Negocio', en: 'List Your Business' },
  modalSub:    { es: 'Llega a los visitantes que están decidiendo dónde comer, tomar, y explorar — ahora mismo, en su teléfono.', en: 'Reach visitors actively deciding where to eat, drink, and explore — right now, on their phone.' },
  close:       { es: 'Cerrar', en: 'Close' },
  // beach detail
  backHome:    { es: '← Inicio', en: '← Home' },
  todayStatus: { es: 'Condición Hoy', en: "Today's Status" },
  insiderTips: { es: 'Tips del Local', en: 'Insider Tips' },
  parking:     { es: 'Estacionamiento', en: 'Parking' },
  bestFor:     { es: 'Ideal Para', en: 'Best For' },
  directions:  { es: 'Cómo Llegar', en: 'Get Directions' },
  otherBeaches:{ es: 'Otras Playas', en: 'Other Beaches' },
  // nav
  navToday:    { es: 'Hoy', en: 'Today' },
  navBeaches:  { es: 'Playas', en: 'Beaches' },
  navFood:     { es: 'Comida', en: 'Food' },
  navTonight:  { es: 'Noche', en: 'Tonight' },
  navMap:      { es: 'Mapa', en: 'Map' },
  // mode tabs
  tabBeaches:  { es: '🏖️ Playas', en: '🏖️ Beaches' },
  tabFamily:   { es: '👨‍👩‍👧 Familia', en: '👨‍👩‍👧 Family' },
  tabSunset:   { es: '🌅 Atardecer', en: '🌅 Sunset' },
  tabFood:     { es: '🍽️ Comida', en: '🍽️ Food' },
  tabNight:    { es: '🎶 Nightlife', en: '🎶 Nightlife' },
  tabCouple:   { es: '💑 Pareja', en: '💑 Couples' },
}


// ── TONIGHT PAGE DATA ─────────────────────────────────────
export type EventCategory = 'music' | 'food' | 'nature' | 'nightlife' | 'family' | 'deal'

export interface FullEvent {
  id: string
  time: string
  ampm: 'am' | 'pm'
  nameEs: string
  nameEn: string
  whereEs: string
  whereEn: string
  descEs: string
  descEn: string
  category: EventCategory
  type: 'free' | 'featured' | 'sponsored'
  labelEs: string
  labelEn: string
  recurs?: string  // e.g. 'Todos los sábados' / 'Every Saturday'
  recursEn?: string
}

export const fullEvents: FullEvent[] = [
  {
    id: 'sunset-morrillos',
    time: '6:00', ampm: 'pm',
    nameEs: 'Atardecer en Los Morrillos',
    nameEn: 'Sunset at Los Morrillos',
    whereEs: 'Faro Los Morrillos · Cabo Rojo',
    whereEn: 'Los Morrillos Lighthouse · Cabo Rojo',
    descEs: 'El mejor atardecer de Puerto Rico. Llega antes de las 6:15 para encontrar estacionamiento y caminar hasta el faro. Las vistas desde los acantilados son espectaculares.',
    descEn: 'The best sunset in Puerto Rico. Arrive before 6:15 to find parking and walk to the lighthouse. Views from the cliffs are spectacular.',
    category: 'nature',
    type: 'free',
    labelEs: 'Gratis',
    labelEn: 'Free',
    recurs: 'Todos los días',
    recursEn: 'Every day',
  },
  {
    id: 'salsa-shamar',
    time: '7:30', ampm: 'pm',
    nameEs: 'Salsa en Vivo — Shamar Bar',
    nameEn: 'Live Salsa — Shamar Bar',
    whereEs: 'Shamar Bar & Grill · Calle de Boquerón',
    whereEn: 'Shamar Bar & Grill · Calle de Boquerón',
    descEs: 'La mejor noche de salsa en vivo de Boquerón. Sin cover. Llega temprano para conseguir mesa, se llena rápido los sábados.',
    descEn: 'The best live salsa night in Boquerón. No cover charge. Arrive early to get a table — it fills up fast on Saturdays.',
    category: 'music',
    type: 'featured',
    labelEs: 'Destacado',
    labelEn: 'Featured',
    recurs: 'Todos los sábados',
    recursEn: 'Every Saturday',
  },
  {
    id: 'happy-hour-pescadores',
    time: '5:00', ampm: 'pm',
    nameEs: 'Happy Hour — Pescadores',
    nameEn: 'Happy Hour — Pescadores',
    whereEs: 'Pescadores Restaurant · Frente al mar',
    whereEn: 'Pescadores Restaurant · Waterfront',
    descEs: 'Medallas a $4 y mojitos a $6. Termina a las 8pm. Perfecta vista al mar mientras dura el atardecer.',
    descEn: '$4 Medallas and $6 mojitos. Ends at 8pm. Perfect sea view while the sunset lasts.',
    category: 'deal',
    type: 'free',
    labelEs: 'Oferta',
    labelEn: 'Deal',
    recurs: 'Lunes a Sábado',
    recursEn: 'Mon to Sat',
  },
  {
    id: 'dj-galloways',
    time: '9:00', ampm: 'pm',
    nameEs: 'Noche de DJ — Galloway\'s',
    nameEn: 'DJ Night — Galloway\'s',
    whereEs: 'Galloway\'s Bar · Frente al mar',
    whereEn: 'Galloway\'s Bar · Waterfront',
    descEs: 'Música electrónica y reggaeton hasta medianoche. El spot más popular del fin de semana entre visitantes. Sin cover antes de las 10pm.',
    descEn: 'Electronic music and reggaeton until midnight. The most popular weekend spot for visitors. No cover before 10pm.',
    category: 'nightlife',
    type: 'sponsored',
    labelEs: 'Patrocinado',
    labelEn: 'Sponsored',
    recurs: 'Vie y Sáb',
    recursEn: 'Fri & Sat',
  },
  {
    id: 'mariscos-boqueron',
    time: '12:00', ampm: 'pm',
    nameEs: 'Kioscos de Mariscos — Pueblo',
    nameEn: 'Seafood Kiosks — Village',
    whereEs: 'Calle José De Diego · Pueblo de Boquerón',
    whereEn: 'Calle José De Diego · Boquerón Village',
    descEs: 'Los kioscos del pueblo abren al mediodía con ostiones frescos, empanadillas y alcapurrias. El ambiente del pueblo es único los sábados.',
    descEn: 'Village kiosks open at noon with fresh oysters, empanadillas, and alcapurrias. The village vibe on Saturdays is unmatched.',
    category: 'food',
    type: 'free',
    labelEs: 'Gratis',
    labelEn: 'Free',
    recurs: 'Fines de semana',
    recursEn: 'Weekends',
  },
  {
    id: 'kayak-salinas',
    time: '8:00', ampm: 'am',
    nameEs: 'Kayak en Las Salinas',
    nameEn: 'Kayaking at the Salt Flats',
    whereEs: 'Las Salinas de Cabo Rojo',
    whereEn: 'Cabo Rojo Salt Flats',
    descEs: 'La mejor hora para kayak en las salinas rosadas. Temperatura fresca, poca gente, y los flamencos aparecen temprano en la mañana.',
    descEn: 'Best time to kayak the pink salt flats. Cool temperature, few people, and flamingos appear early in the morning.',
    category: 'nature',
    type: 'free',
    labelEs: 'Actividad',
    labelEn: 'Activity',
    recurs: 'Todos los días',
    recursEn: 'Every day',
  },
  {
    id: 'trivia-night',
    time: '8:00', ampm: 'pm',
    nameEs: 'Noche de Trivia — El Bohío',
    nameEn: 'Trivia Night — El Bohío',
    whereEs: 'El Bohío Restaurant · Boquerón',
    whereEn: 'El Bohío Restaurant · Boquerón',
    descEs: 'Trivia bilingüe con premios. Equipos de 2-6 personas. Reserva tu mesa con anticipación — se llena.',
    descEn: 'Bilingual trivia with prizes. Teams of 2-6 people. Reserve your table in advance — it fills up.',
    category: 'food',
    type: 'featured',
    labelEs: 'Destacado',
    labelEn: 'Featured',
    recurs: 'Todos los sábados',
    recursEn: 'Every Saturday',
  },
]

export const categoryMeta: Record<EventCategory, { es: string; en: string; icon: string; color: string }> = {
  music:     { es: 'Música',     en: 'Music',     icon: '🎶', color: '#7c3aed' },
  food:      { es: 'Comida',     en: 'Food',      icon: '🍽️', color: '#c9943a' },
  nature:    { es: 'Naturaleza', en: 'Nature',    icon: '🌿', color: '#16a34a' },
  nightlife: { es: 'Nightlife',  en: 'Nightlife', icon: '🌙', color: '#0d2d3f' },
  family:    { es: 'Familia',    en: 'Family',    icon: '👨‍👩‍👧', color: '#2ba99a' },
  deal:      { es: 'Ofertas',    en: 'Deals',     icon: '🏷️', color: '#e05a3a' },
}


// ── FULL RESTAURANT DATA ──────────────────────────────────
export type FoodCategory = 'mariscos' | 'bar' | 'casual' | 'kiosko' | 'cafe' | 'internacional'
export type PriceRange = '$' | '$$' | '$$$'

export interface FullRestaurant {
  id: string
  name: string
  emoji: string
  category: FoodCategory
  price: PriceRange
  descEs: string
  descEn: string
  taglineEs: string
  taglineEn: string
  hoursEs: string
  hoursEn: string
  status: 'open' | 'closing' | 'closed'
  statusEs: string
  statusEn: string
  locationEs: string
  locationEn: string
  stars: number
  mustTryEs: string
  mustTryEn: string
  mapLink: string
  sponsored?: boolean
  featured?: boolean
  phoneNote?: string
}

export const fullRestaurants: FullRestaurant[] = [
  {
    id: 'el-bohio',
    name: 'El Bohío',
    emoji: '🦞',
    category: 'mariscos',
    price: '$$',
    taglineEs: 'El mejor mofongo de mariscos del área.',
    taglineEn: 'The best seafood mofongo in the area.',
    descEs: 'Clásico restaurante de mariscos frente al mar de Boquerón. El mofongo de langosta es el plato estrella. Reserva si vas un sábado — siempre está lleno.',
    descEn: 'Classic waterfront seafood restaurant in Boquerón. The lobster mofongo is the signature dish. Reserve ahead on Saturdays — always packed.',
    hoursEs: 'Mar-Dom: 11am – 10pm · Cerrado lunes',
    hoursEn: 'Tue-Sun: 11am – 10pm · Closed Mondays',
    status: 'open',
    statusEs: 'Abierto',
    statusEn: 'Open',
    locationEs: 'Frente al Balneario · Boquerón',
    locationEn: 'Across from Balneario · Boquerón',
    stars: 4.5,
    mustTryEs: 'Mofongo de langosta · Asopao de camarones',
    mustTryEn: 'Lobster mofongo · Shrimp asopao',
    mapLink: 'https://maps.google.com/?q=El+Bohio+Boqueron+Puerto+Rico',
  },
  {
    id: 'shamar',
    name: 'Shamar Bar & Grill',
    emoji: '🎶',
    category: 'bar',
    price: '$',
    taglineEs: 'Salsa en vivo, tragos fríos, ambiente inigualable.',
    taglineEn: 'Live salsa, cold drinks, unmatched atmosphere.',
    descEs: 'El bar más animado de Boquerón los fines de semana. Música en vivo los sábados a las 7:30pm. Comida sencilla pero buena — las alitas y los tostones son los favoritos.',
    descEn: 'The liveliest bar in Boquerón on weekends. Live music Saturdays at 7:30pm. Simple but good food — wings and tostones are the crowd favorites.',
    hoursEs: 'Todos los días: 12pm – 1am',
    hoursEn: 'Daily: 12pm – 1am',
    status: 'open',
    statusEs: 'Abierto',
    statusEn: 'Open',
    locationEs: 'Calle de Boquerón · Centro',
    locationEn: 'Calle de Boquerón · Village center',
    stars: 4.0,
    mustTryEs: 'Alitas BBQ · Medalla bien fría · Tostones',
    mustTryEn: 'BBQ wings · Ice cold Medalla · Tostones',
    mapLink: 'https://maps.google.com/?q=Shamar+Bar+Boqueron+Puerto+Rico',
    sponsored: true,
    featured: true,
  },
  {
    id: 'galloways',
    name: "Galloway's",
    emoji: '🌊',
    category: 'bar',
    price: '$$',
    taglineEs: 'Cócteles frente al mar, DJ los fines de semana.',
    taglineEn: 'Cocktails on the water, DJ on weekends.',
    descEs: 'El spot más popular entre turistas en Boquerón. Terraza frente al mar, cócteles tropicales y DJ los viernes y sábados a partir de las 9pm. Buen ambiente para grupos.',
    descEn: 'The most popular tourist spot in Boquerón. Waterfront terrace, tropical cocktails, and DJ on Fridays and Saturdays from 9pm. Great group atmosphere.',
    hoursEs: 'Jue-Dom: 2pm – 12am · Vie-Sáb hasta 1am',
    hoursEn: 'Thu-Sun: 2pm – 12am · Fri-Sat until 1am',
    status: 'open',
    statusEs: 'Abierto',
    statusEn: 'Open',
    locationEs: 'Frente al mar · Boquerón',
    locationEn: 'Waterfront · Boquerón',
    stars: 4.0,
    mustTryEs: 'Piña colada · Mojito de coco',
    mustTryEn: 'Piña colada · Coconut mojito',
    mapLink: 'https://maps.google.com/?q=Galloways+Boqueron+Puerto+Rico',
    sponsored: true,
  },
  {
    id: 'pescadores',
    name: 'Pescadores',
    emoji: '🐟',
    category: 'mariscos',
    price: '$$',
    taglineEs: 'Pescado fresco del día, happy hour imperdible.',
    taglineEn: 'Fresh catch of the day, unmissable happy hour.',
    descEs: 'Restaurante de mariscos local con el mejor pescado fresco de la zona. Happy hour de 5pm a 8pm con Medallas a $4. Ambiente más tranquilo que el resto del pueblo — ideal para cenar en pareja.',
    descEn: 'Local seafood restaurant with the freshest fish in the area. Happy hour 5pm to 8pm with $4 Medallas. Quieter vibe than the rest of the village — ideal for a dinner date.',
    hoursEs: 'Lun-Dom: 11am – 10pm',
    hoursEn: 'Mon-Sun: 11am – 10pm',
    status: 'open',
    statusEs: 'Abierto · Happy Hour 5-8pm',
    statusEn: 'Open · Happy Hour 5-8pm',
    locationEs: 'Frente al mar · Boquerón',
    locationEn: 'Waterfront · Boquerón',
    stars: 4.5,
    mustTryEs: 'Pescado frito entero · Camarones al ajillo',
    mustTryEn: 'Whole fried fish · Garlic shrimp',
    mapLink: 'https://maps.google.com/?q=Pescadores+Boqueron+Puerto+Rico',
  },
  {
    id: 'kioscos-combate',
    name: 'Kioscos de Combate',
    emoji: '🌮',
    category: 'kiosko',
    price: '$',
    taglineEs: 'Frituras locales y mariscos frescos a pie de playa.',
    taglineEn: 'Local fried food and fresh seafood right at the beach.',
    descEs: 'Una fila de kioscos a la entrada de Playa Combate. Empanadillas, alcapurrias, bacalaítos y mariscos frescos. El mejor spot para comer algo rápido y económico antes del atardecer.',
    descEn: 'A row of kiosks at the entrance to Combate Beach. Empanadillas, alcapurrias, codfish fritters, and fresh seafood. The best spot for a quick cheap bite before the sunset.',
    hoursEs: 'Vie-Dom: 11am – 8pm',
    hoursEn: 'Fri-Sun: 11am – 8pm',
    status: 'open',
    statusEs: 'Abierto',
    statusEn: 'Open',
    locationEs: 'Entrada Playa Combate · 6 min de Boquerón',
    locationEn: 'Combate Beach entrance · 6 min from Boquerón',
    stars: 4.0,
    mustTryEs: 'Alcapurrias · Empanadillas de jueyes',
    mustTryEn: 'Alcapurrias · Crab empanadillas',
    mapLink: 'https://maps.google.com/?q=Combate+Beach+Kiosks+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'pizza-boqueron',
    name: 'Pizza Boquerón',
    emoji: '🍕',
    category: 'casual',
    price: '$',
    taglineEs: 'Pizza sencilla, perfecta después de la playa.',
    taglineEn: 'Simple pizza, perfect after the beach.',
    descEs: 'Opción casual y económica en el pueblo. Ideal si vienes con niños o quieres algo diferente a los mariscos. Porciones generosas.',
    descEn: 'Casual and affordable option in the village. Ideal if you\'re with kids or want something other than seafood. Generous portions.',
    hoursEs: 'Todos los días: 12pm – 9pm',
    hoursEn: 'Daily: 12pm – 9pm',
    status: 'closing',
    statusEs: 'Cierra a las 9pm',
    statusEn: 'Closes at 9pm',
    locationEs: 'Calle de Boquerón · Centro',
    locationEn: 'Calle de Boquerón · Village center',
    stars: 3.0,
    mustTryEs: 'Pizza de pepperoni · Calzone de pollo',
    mustTryEn: 'Pepperoni pizza · Chicken calzone',
    mapLink: 'https://maps.google.com/?q=Pizza+Boqueron+Puerto+Rico',
  },
  {
    id: 'cafe-boqueron',
    name: 'Café Boquerón',
    emoji: '☕',
    category: 'cafe',
    price: '$',
    taglineEs: 'Café puertorriqueño y desayuno criollo.',
    taglineEn: 'Puerto Rican coffee and local breakfast.',
    descEs: 'El mejor café de la zona. Desayuno criollo con mallorca, huevos y café de la isla. Abre temprano — perfecto antes de ir a Playa Sucia.',
    descEn: 'The best coffee in the area. Local breakfast with mallorca, eggs, and island coffee. Opens early — perfect before heading to Playa Sucia.',
    hoursEs: 'Lun-Dom: 6:30am – 2pm',
    hoursEn: 'Mon-Sun: 6:30am – 2pm',
    status: 'open',
    statusEs: 'Abierto',
    statusEn: 'Open',
    locationEs: 'Pueblo de Boquerón · Centro',
    locationEn: 'Boquerón Village · Center',
    stars: 4.5,
    mustTryEs: 'Café con leche · Mallorca con queso',
    mustTryEn: 'Café con leche · Mallorca with cheese',
    mapLink: 'https://maps.google.com/?q=Cafe+Boqueron+Puerto+Rico',
  },
]

export const foodCategoryMeta: Record<FoodCategory, { es: string; en: string; icon: string }> = {
  mariscos:      { es: 'Mariscos',      en: 'Seafood',       icon: '🦞' },
  bar:           { es: 'Bares',         en: 'Bars',          icon: '🍹' },
  casual:        { es: 'Casual',        en: 'Casual',        icon: '🍽️' },
  kiosko:        { es: 'Kioscos',       en: 'Kiosks',        icon: '🌮' },
  cafe:          { es: 'Café',          en: 'Café',          icon: '☕' },
  internacional: { es: 'Internacional', en: 'International', icon: '🌍' },
}


// ── MAP PINS ──────────────────────────────────────────────
export type PinType = 'beach' | 'restaurant' | 'bar' | 'attraction' | 'event'

export interface MapPin {
  id: string
  type: PinType
  nameEs: string
  nameEn: string
  tagEs: string
  tagEn: string
  lat: number
  lng: number
  emoji: string
  color: string
  svgPin: string
  status?: 'open' | 'closing' | 'closed' | 'great' | 'good' | 'busy'
  mapLink: string
}

export const mapPins: MapPin[] = [
  // ── BEACHES ──
  {
    id: 'playa-sucia',
    svgPin: '/pins/beach-sucia.svg',
    type: 'beach',
    nameEs: 'Playa Sucia',
    nameEn: 'Playa Sucia',
    tagEs: '🟢 Excelente hoy',
    tagEn: '🟢 Great today',
    lat: 17.9441, lng: -67.1893,
    emoji: '🏖️', color: '#1a9b8a',
    status: 'great',
    mapLink: 'https://maps.google.com/?q=Playa+Sucia+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'playa-buye',
    svgPin: '/pins/beach-buye.svg',
    type: 'beach',
    nameEs: 'Playa Buyé',
    nameEn: 'Playa Buyé',
    tagEs: '🟢 Calmado hoy',
    tagEn: '🟢 Calm today',
    lat: 17.9823, lng: -67.1654,
    emoji: '🏖️', color: '#1a9b8a',
    status: 'great',
    mapLink: 'https://maps.google.com/?q=Playa+Buye+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'combate',
    svgPin: '/pins/beach-combate.svg',
    type: 'beach',
    nameEs: 'Playa Combate',
    nameEn: 'Combate Beach',
    tagEs: '🟡 Algo ventoso',
    tagEn: '🟡 Slightly windy',
    lat: 17.9612, lng: -67.1901,
    emoji: '🏖️', color: '#c9943a',
    status: 'good',
    mapLink: 'https://maps.google.com/?q=Combate+Beach+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'balneario',
    svgPin: '/pins/beach-balneario.svg',
    type: 'beach',
    nameEs: 'Balneario Boquerón',
    nameEn: 'Balneario Boquerón',
    tagEs: '🔴 Lleno hoy',
    tagEn: '🔴 Busy today',
    lat: 17.9989, lng: -67.1548,
    emoji: '🏖️', color: '#e05a3a',
    status: 'busy',
    mapLink: 'https://maps.google.com/?q=Balneario+Boqueron+Puerto+Rico',
  },
  // ── RESTAURANTS & BARS ──
  {
    id: 'map-el-bohio',
    svgPin: '/pins/food-mariscos.svg',
    type: 'restaurant',
    nameEs: 'El Bohío',
    nameEn: 'El Bohío',
    tagEs: 'Mariscos · $$ · Abierto',
    tagEn: 'Seafood · $$ · Open',
    lat: 17.9995, lng: -67.1552,
    emoji: '🦞', color: '#c9943a',
    status: 'open',
    mapLink: 'https://maps.google.com/?q=El+Bohio+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-shamar',
    svgPin: '/pins/food-bar.svg',
    type: 'bar',
    nameEs: 'Shamar Bar & Grill',
    nameEn: 'Shamar Bar & Grill',
    tagEs: 'Bar · $ · Música en vivo hoy',
    tagEn: 'Bar · $ · Live music tonight',
    lat: 17.9992, lng: -67.1558,
    emoji: '🎶', color: '#7c3aed',
    status: 'open',
    mapLink: 'https://maps.google.com/?q=Shamar+Bar+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-galloways',
    svgPin: '/pins/food-bar.svg',
    type: 'bar',
    nameEs: "Galloway's",
    nameEn: "Galloway's",
    tagEs: 'Bar · $$ · DJ esta noche',
    tagEn: 'Bar · $$ · DJ tonight',
    lat: 17.9988, lng: -67.1545,
    emoji: '🌊', color: '#7c3aed',
    status: 'open',
    mapLink: 'https://maps.google.com/?q=Galloways+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-pescadores',
    svgPin: '/pins/food-mariscos.svg',
    type: 'restaurant',
    nameEs: 'Pescadores',
    nameEn: 'Pescadores',
    tagEs: 'Mariscos · $$ · Happy Hour 5-8pm',
    tagEn: 'Seafood · $$ · Happy Hour 5-8pm',
    lat: 17.9990, lng: -67.1540,
    emoji: '🐟', color: '#c9943a',
    status: 'open',
    mapLink: 'https://maps.google.com/?q=Pescadores+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-kioscos',
    svgPin: '/pins/food-kiosko.svg',
    type: 'restaurant',
    nameEs: 'Kioscos Combate',
    nameEn: 'Combate Kiosks',
    tagEs: 'Frituras · $ · Abierto',
    tagEn: 'Local food · $ · Open',
    lat: 17.9608, lng: -67.1905,
    emoji: '🌮', color: '#c9943a',
    status: 'open',
    mapLink: 'https://maps.google.com/?q=Combate+Beach+Kiosks+Cabo+Rojo',
  },
  // ── ATTRACTIONS ──
  {
    id: 'map-faro',
    svgPin: '/pins/attraction-faro.svg',
    type: 'attraction',
    nameEs: 'Faro Los Morrillos',
    nameEn: 'Los Morrillos Lighthouse',
    tagEs: '🌅 Atardecer · Gratis · Hoy a las 6:48pm',
    tagEn: '🌅 Sunset · Free · Today at 6:48pm',
    lat: 17.9397, lng: -67.1921,
    emoji: '🏛️', color: '#0d2d3f',
    mapLink: 'https://maps.google.com/?q=Los+Morrillos+Lighthouse+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'map-salinas',
    svgPin: '/pins/attraction-salinas.svg',
    type: 'attraction',
    nameEs: 'Las Salinas',
    nameEn: 'Salt Flats',
    tagEs: 'Salinas rosadas · Kayak · Flamencos',
    tagEn: 'Pink salt flats · Kayak · Flamingos',
    lat: 17.9550, lng: -67.1820,
    emoji: '🌊', color: '#e05a3a',
    mapLink: 'https://maps.google.com/?q=Cabo+Rojo+Salt+Flats+Puerto+Rico',
  },
  {
    id: 'map-bosque',
    svgPin: '/pins/attraction-bosque.svg',
    type: 'attraction',
    nameEs: 'Bosque Seco',
    nameEn: 'Dry Forest Reserve',
    tagEs: 'Naturaleza · Senderos · Aves',
    tagEn: 'Nature · Trails · Birds',
    lat: 17.9700, lng: -67.1750,
    emoji: '🌿', color: '#16a34a',
    mapLink: 'https://maps.google.com/?q=Bosque+Seco+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'map-pueblo',
    svgPin: '/pins/attraction-pueblo.svg',
    type: 'attraction',
    nameEs: 'Pueblo de Boquerón',
    nameEn: 'Boquerón Village',
    tagEs: 'Comida · Bares · Ambiente',
    tagEn: 'Food · Bars · Atmosphere',
    lat: 17.9993, lng: -67.1555,
    emoji: '🎶', color: '#1a4a5c',
    mapLink: 'https://maps.google.com/?q=Boqueron+Village+Puerto+Rico',
  },
  // ── TONIGHT EVENTS ──
  {
    id: 'map-sunset-event',
    svgPin: '/pins/event-sunset.svg',
    type: 'event',
    nameEs: 'Atardecer — 6:00pm',
    nameEn: 'Sunset — 6:00pm',
    tagEs: 'Gratis · Faro Los Morrillos',
    tagEn: 'Free · Los Morrillos Lighthouse',
    lat: 17.9397, lng: -67.1925,
    emoji: '🌅', color: '#c9943a',
    mapLink: 'https://maps.google.com/?q=Los+Morrillos+Lighthouse+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'map-salsa-event',
    svgPin: '/pins/event-salsa.svg',
    type: 'event',
    nameEs: 'Salsa en Vivo — 7:30pm',
    nameEn: 'Live Salsa — 7:30pm',
    tagEs: 'Destacado · Shamar Bar · Sin cover',
    tagEn: 'Featured · Shamar Bar · No cover',
    lat: 17.9991, lng: -67.1560,
    emoji: '💃', color: '#7c3aed',
    mapLink: 'https://maps.google.com/?q=Shamar+Bar+Boqueron+Puerto+Rico',
  },

  // ── ADDITIONAL BOQUERÓN & CABO ROJO PINS ──────────────
  // Beaches
  {
    id: 'map-joyuda',
    svgPin: '/pins/beach-buye.svg',
    type: 'beach' as PinType,
    nameEs: 'Playa Joyuda',
    nameEn: 'Joyuda Beach',
    tagEs: '🟢 Tranquila · Mariscos cerca',
    tagEn: '🟢 Calm · Seafood nearby',
    lat: 18.0742, lng: -67.1720,
    emoji: '🏖️', color: '#1a9b8a',
    status: 'great' as const,
    mapLink: 'https://maps.google.com/?q=Playa+Joyuda+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'map-playuela',
    svgPin: '/pins/beach-sucia.svg',
    type: 'beach' as PinType,
    nameEs: 'Playuela',
    nameEn: 'Playuela Beach',
    tagEs: '🟢 Remota · Vista al faro',
    tagEn: '🟢 Remote · Lighthouse views',
    lat: 17.9520, lng: -67.1850,
    emoji: '🏖️', color: '#1a9b8a',
    status: 'great' as const,
    mapLink: 'https://maps.google.com/?q=Playuela+Beach+Cabo+Rojo+Puerto+Rico',
  },
  // More Boquerón restaurants
  {
    id: 'map-blue-iguana',
    svgPin: '/pins/food-bar.svg',
    type: 'bar' as PinType,
    nameEs: 'Blue Iguana',
    nameEn: 'Blue Iguana',
    tagEs: 'Bar · $$ · Vista al mar',
    tagEn: 'Bar · $$ · Ocean view',
    lat: 17.9986, lng: -67.1542,
    emoji: '🍹', color: '#7c3aed',
    status: 'open' as const,
    mapLink: 'https://maps.google.com/?q=Blue+Iguana+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-pika-pika',
    svgPin: '/pins/food-mariscos.svg',
    type: 'restaurant' as PinType,
    nameEs: 'Pika Pika',
    nameEn: 'Pika Pika',
    tagEs: 'Comida · $ · Centro Boquerón',
    tagEn: 'Food · $ · Boquerón center',
    lat: 17.9991, lng: -67.1550,
    emoji: '🍽️', color: '#c9943a',
    status: 'open' as const,
    mapLink: 'https://maps.google.com/?q=Pika+Pika+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-marios',
    svgPin: '/pins/food-mariscos.svg',
    type: 'restaurant' as PinType,
    nameEs: "Mario's Café",
    nameEn: "Mario's Café",
    tagEs: 'Mariscos · $$ · Boquerón',
    tagEn: 'Seafood · $$ · Boquerón',
    lat: 17.9994, lng: -67.1546,
    emoji: '🦞', color: '#c9943a',
    status: 'open' as const,
    mapLink: 'https://maps.google.com/?q=Marios+Cafe+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-kioscos-boqueron',
    svgPin: '/pins/food-kiosko.svg',
    type: 'restaurant' as PinType,
    nameEs: 'Kioscos del Pueblo',
    nameEn: 'Village Kiosks',
    tagEs: 'Ostiones · Frituras · $ · Boquerón',
    tagEn: 'Oysters · Fried food · $ · Boquerón',
    lat: 17.9988, lng: -67.1556,
    emoji: '🌮', color: '#c9943a',
    status: 'open' as const,
    mapLink: 'https://maps.google.com/?q=Kioscos+Boqueron+Puerto+Rico',
  },
  // More attractions
  {
    id: 'map-refugio',
    svgPin: '/pins/attraction-bosque.svg',
    type: 'attraction' as PinType,
    nameEs: 'Refugio de Vida Silvestre',
    nameEn: 'Wildlife Refuge',
    tagEs: 'Naturaleza · Aves · Senderos',
    tagEn: 'Nature · Birds · Trails',
    lat: 18.0050, lng: -67.1600,
    emoji: '🌿', color: '#16a34a',
    mapLink: 'https://maps.google.com/?q=Refugio+de+Vida+Silvestre+Boqueron+Puerto+Rico',
  },
  {
    id: 'map-cabo-rojo-town',
    svgPin: '/pins/attraction-pueblo.svg',
    type: 'attraction' as PinType,
    nameEs: 'Pueblo de Cabo Rojo',
    nameEn: 'Cabo Rojo Town',
    tagEs: 'Plaza · Historia · Comercios',
    tagEn: 'Plaza · History · Shops',
    lat: 18.0863, lng: -67.1466,
    emoji: '🏛️', color: '#0d2d3f',
    mapLink: 'https://maps.google.com/?q=Cabo+Rojo+Puerto+Rico+town',
  },
  {
    id: 'map-punta-ostiones',
    svgPin: '/pins/beach-sucia.svg',
    type: 'beach' as PinType,
    nameEs: 'Punta Ostiones',
    nameEn: 'Punta Ostiones',
    tagEs: '🟢 Tranquila · Kitesurf',
    tagEn: '🟢 Calm · Kite surfing',
    lat: 18.0320, lng: -67.1780,
    emoji: '🏖️', color: '#1a9b8a',
    status: 'great' as const,
    mapLink: 'https://maps.google.com/?q=Punta+Ostiones+Cabo+Rojo+Puerto+Rico',
  },
  {
    id: 'map-el-faro-restaurant',
    svgPin: '/pins/food-mariscos.svg',
    type: 'restaurant' as PinType,
    nameEs: 'El Faro Restaurant',
    nameEn: 'El Faro Restaurant',
    tagEs: 'Mariscos · $$ · Joyuda',
    tagEn: 'Seafood · $$ · Joyuda',
    lat: 18.0738, lng: -67.1725,
    emoji: '🦞', color: '#c9943a',
    status: 'open' as const,
    mapLink: 'https://maps.google.com/?q=El+Faro+Restaurant+Joyuda+Puerto+Rico',
  },
]

export const pinTypeMeta: Record<PinType, { es: string; en: string; color: string; emoji: string }> = {
  beach:      { es: 'Playas',      en: 'Beaches',      color: '#1a9b8a', emoji: '🏖️' },
  restaurant: { es: 'Comida',      en: 'Food',         color: '#c9943a', emoji: '🍽️' },
  bar:        { es: 'Bares',       en: 'Bars',         color: '#7c3aed', emoji: '🍹' },
  attraction: { es: 'Atracciones', en: 'Attractions',  color: '#0d2d3f', emoji: '📍' },
  event:      { es: 'Eventos',     en: 'Events',       color: '#e05a3a', emoji: '🎉' },
}
