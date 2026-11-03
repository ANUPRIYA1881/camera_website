/**
 * Demo catalogue.
 * - Images are stills cut from the supplied footage (see ASSET_MAP.md).
 * - Prices are placeholders and are labelled "Demo price" in the UI.
 * - Specs only contain what is visible in the supplied footage/photos.
 *   A spec with no `value` renders as "Awaiting spec sheet" — never invented.
 */
export type Category = 'cameras' | 'lenses' | 'accessories'
export type IconKey = 'bag' | 'card' | 'tripod' | 'battery'

export interface Variant {
  id: string
  label: string
  price: number
  includes: string[]
}
export interface SpecRow {
  label: string
  value?: string
}
export interface ProductImage {
  src: string
  alt: string
}
export interface Product {
  id: string
  name: string
  category: Category
  kind: string
  tagline: string
  description: string
  images: ProductImage[]
  icon?: IconKey
  variants: Variant[]
  specs: SpecRow[]
  compat: string
}

const SPEC_PENDING = undefined

export const PRODUCTS: Product[] = [
  {
    id: 'l1',
    name: 'LUMIXA L1',
    category: 'cameras',
    kind: 'Mirrorless camera',
    tagline: 'Hand-built feel, shown with a standard zoom.',
    description:
      'The L1 is the body at the centre of the LUMIXA imaging system: a textured grip, dedicated top-plate dials and a hinged rear monitor, designed so every control is found by touch.',
    images: [
      { src: '/img/cam-front.jpg', alt: 'LUMIXA L1 mirrorless camera with standard zoom lens, front view on a dark stage' },
      { src: '/img/cam-three-quarter.jpg', alt: 'LUMIXA L1 camera in three-quarter view' },
      { src: '/img/cam-side.jpg', alt: 'LUMIXA L1 camera side profile showing lens and grip' },
      { src: '/img/cam-rear.jpg', alt: 'LUMIXA L1 camera rear view with hinged monitor and viewfinder' },
    ],
    variants: [
      { id: 'body', label: 'Body only', price: 1899, includes: ['Camera body'] },
      { id: 'kit', label: 'Kit with standard zoom', price: 2399, includes: ['Camera body', 'LX Standard Zoom lens'] },
    ],
    specs: [
      { label: 'Viewfinder', value: 'Eye-level viewfinder with eyecup' },
      { label: 'Rear display', value: 'Hinged rear monitor' },
      { label: 'Controls', value: 'Top-plate dials, rear command dial, joystick, AF-ON and Q buttons' },
      { label: 'Grip', value: 'Textured, with strap lugs' },
      { label: 'Sensor type and resolution', value: SPEC_PENDING },
      { label: 'Video recording', value: SPEC_PENDING },
      { label: 'Autofocus system', value: SPEC_PENDING },
      { label: 'Lens mount', value: SPEC_PENDING },
    ],
    compat: 'Lens compatibility has not been published. The kit option pairs the L1 with the LX Standard Zoom.',
  },
  {
    id: 'c1',
    name: 'LUMIXA C1 Cine Rig',
    category: 'cameras',
    kind: 'Cinema camera',
    tagline: 'A shoulder-ready rig with an on-board monitor.',
    description:
      'The C1 is the rig-ready member of the family, presented with a top handle, an articulated monitor and a baseplate for support.',
    images: [
      { src: '/img/cine-rig-podium.jpg', alt: 'LUMIXA C1 cinema camera rig with monitor on an illuminated turntable' },
    ],
    variants: [{ id: 'rig', label: 'Camera package', price: 4950, includes: ['Camera', 'On-board monitor', 'Baseplate'] }],
    specs: [
      { label: 'Monitor', value: 'On-board monitor on an articulating arm' },
      { label: 'Support', value: 'Baseplate with top handle' },
      { label: 'Sensor type and resolution', value: SPEC_PENDING },
      { label: 'Video recording', value: SPEC_PENDING },
      { label: 'Lens mount', value: SPEC_PENDING },
    ],
    compat: 'Lens compatibility has not been published.',
  },
  {
    id: 'lx-standard',
    name: 'LX Standard Zoom',
    category: 'lenses',
    kind: 'Zoom lens',
    tagline: 'The everyday lens supplied with the L1 kit.',
    description:
      'A zoom lens with a ribbed rubberised barrel and a manual focus ring, designed as the first lens for the L1.',
    images: [
      { src: '/img/lens-front.jpg', alt: 'Front element of the LX Standard Zoom lens with coloured coating reflections' },
      { src: '/img/cam-side.jpg', alt: 'LX Standard Zoom lens mounted on the LUMIXA L1' },
    ],
    variants: [{ id: 'std', label: 'Lens only', price: 649, includes: ['Lens'] }],
    specs: [
      { label: 'Barrel', value: 'Ribbed rubberised grip' },
      { label: 'Focus', value: 'Manual focus ring' },
      { label: 'Focal range and maximum aperture', value: SPEC_PENDING },
      { label: 'Mount', value: SPEC_PENDING },
    ],
    compat: 'Supplied with the L1 kit. Other pairings have not been published.',
  },
  {
    id: 'lx-manual',
    name: 'LX Manual Focus Zoom',
    category: 'lenses',
    kind: 'Zoom lens',
    tagline: 'Distance scale and an AF/MF switch on the barrel.',
    description:
      'A lens built for deliberate focusing, with an engraved distance scale and a physical AF/MF switch within reach of your thumb.',
    images: [
      { src: '/img/lens-aperture.jpg', alt: 'LX Manual Focus Zoom lens barrel with engraved distance scale' },
    ],
    variants: [{ id: 'mf', label: 'Lens only', price: 849, includes: ['Lens'] }],
    specs: [
      { label: 'Focus scale', value: 'Engraved distance scale' },
      { label: 'Focus mode', value: 'AF/MF switch on the barrel' },
      { label: 'Focal range and maximum aperture', value: SPEC_PENDING },
      { label: 'Mount', value: SPEC_PENDING },
    ],
    compat: 'Compatibility has not been published.',
  },
  {
    id: 'lx-prime',
    name: 'LX Iris Prime',
    category: 'lenses',
    kind: 'Prime lens',
    tagline: 'A visible iris of precisely cut blades.',
    description:
      'The LX Iris Prime is named for its diaphragm: a ring of blades that opens and closes with a mechanical sweep.',
    images: [
      { src: '/img/lens-barrel.jpg', alt: 'LX Iris Prime lens showing its aperture blades through the front element' },
    ],
    variants: [{ id: 'prime', label: 'Lens only', price: 729, includes: ['Lens'] }],
    specs: [
      { label: 'Aperture', value: 'Multi-blade iris diaphragm' },
      { label: 'Focal length and maximum aperture', value: SPEC_PENDING },
      { label: 'Mount', value: SPEC_PENDING },
    ],
    compat: 'Compatibility has not been published.',
  },
  {
    id: 'acc-bag',
    name: 'LUMIXA Everyday Camera Bag',
    category: 'accessories',
    kind: 'Camera bags',
    tagline: 'Carry a body and a lens or two.',
    description: 'A padded bag for carrying a camera body and lenses between locations.',
    images: [],
    icon: 'bag',
    variants: [{ id: 'bag', label: 'Standard', price: 189, includes: ['Camera bag'] }],
    specs: [{ label: 'Dimensions and capacity', value: SPEC_PENDING }],
    compat: 'Fit for specific cameras has not been published.',
  },
  {
    id: 'acc-card',
    name: 'LUMIXA Memory Card',
    category: 'accessories',
    kind: 'Memory cards',
    tagline: 'Storage for stills and video.',
    description: 'A memory card for the L1 and C1.',
    images: [],
    icon: 'card',
    variants: [{ id: 'card', label: 'Single card', price: 59, includes: ['Memory card'] }],
    specs: [{ label: 'Capacity and speed class', value: SPEC_PENDING }],
    compat: 'Supported card types have not been published.',
  },
  {
    id: 'acc-tripod',
    name: 'LUMIXA Field Tripod',
    category: 'accessories',
    kind: 'Tripods',
    tagline: 'A steady base for long exposures and video.',
    description: 'A tripod for holding a camera still on location.',
    images: [],
    icon: 'tripod',
    variants: [{ id: 'tripod', label: 'Tripod', price: 279, includes: ['Tripod'] }],
    specs: [{ label: 'Load rating and height', value: SPEC_PENDING }],
    compat: 'Mounting details have not been published.',
  },
  {
    id: 'acc-battery',
    name: 'LUMIXA Spare Battery',
    category: 'accessories',
    kind: 'Batteries',
    tagline: 'Keep a second one in your pocket.',
    description: 'A spare battery for a full day of shooting.',
    images: [],
    icon: 'battery',
    variants: [{ id: 'battery', label: 'Single battery', price: 79, includes: ['Battery'] }],
    specs: [{ label: 'Capacity and shot count', value: SPEC_PENDING }],
    compat: 'Supported cameras have not been published.',
  },
]

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)
export const lowestPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price))

export const ACCESSORY_TABS = [
  { id: 'lenses', label: 'Lenses' },
  { id: 'bags', label: 'Camera bags' },
  { id: 'cards', label: 'Memory cards' },
  { id: 'tripods', label: 'Tripods' },
  { id: 'batteries', label: 'Batteries' },
] as const
export type AccessoryTab = (typeof ACCESSORY_TABS)[number]['id']

export const tabForProduct = (p: Product): AccessoryTab | null => {
  if (p.category === 'lenses') return 'lenses'
  switch (p.icon) {
    case 'bag': return 'bags'
    case 'card': return 'cards'
    case 'tripod': return 'tripods'
    case 'battery': return 'batteries'
    default: return null
  }
}
