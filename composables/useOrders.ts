export type OrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'Cancelled'
  | 'Delivered'
  | 'On the way'
  | 'Complete'

export type TimelineState = 'done' | 'current' | 'upcoming'

export interface OrderLine {
  id: string
  name: string
  image: string
  quantity: number
  price: number
}

export interface OrderStep {
  label: string
  time: string
  state: TimelineState
}

export interface OrderRecord {
  id: string
  tableId: string
  vendor: 'Bindirigu' | 'Damm'
  customerId: string
  customerName: string
  customerAvatar: string
  restaurant: string
  restaurantShort: string
  date: string
  time: string
  period: 'This Week' | 'This Month' | 'This Year'
  price: number
  status: OrderStatus
  details: string
  address: string
  extraAddress: string
  deliveryGuy: {
    name: string
    phone: string
    avatar: string
  }
  items: OrderLine[]
  couponStatus: string
  rewardStatus: string
  deliveryFee: number
  feesTax: number
  subtotal: number
  timeline: OrderStep[]
  estimatedDelivery: string
  map: {
    pickupLat: number
    pickupLng: number
    dropoffLat: number
    dropoffLng: number
  }
}

export interface DammProduct {
  id: string
  name: string
  image: string
  category: string
  alcohol: string
  weight: string
  price: string
  status: 'Active' | 'Deactive'
  manufacture: 'Local Suppliers' | 'International Favs'
}

export interface DammCategory {
  id: string
  name: string
  items: number
  locked?: boolean
}

const avatarMap: Record<string, string> = {
  'ronald-richards': '/avatars/ronald-richards.png?v=2',
  'chelsie-johnson': '/avatars/chelsie-johnson.png?v=2',
  'darrell-steward': '/avatars/darrell-steward.png?v=2',
  'albert-flores': '/avatars/albert-flores.png?v=2',
  'wade-warren': '/avatars/wade-warren.png?v=2',
  'esther-howard': '/avatars/esther-howard.png?v=2',
  'cameron-williamson': '/avatars/cameron-williamson.png?v=2',
  'brooklyn-simmons': '/avatars/brooklyn-simmons.png?v=2',
  'leslie-alexander': '/avatars/esther-howard.png?v=2',
  'ralph-edwards': '/avatars/ronald-richards.png?v=2',
  'kathryn-murphy': '/avatars/brooklyn-simmons.png?v=2',
  'jacob-jones': '/avatars/darrell-steward.png?v=2',
  'floyd-miles': '/avatars/albert-flores.png?v=2',
  'jane-cooper': '/avatars/esther-howard.png?v=2',
  'jenny-wilson': '/avatars/brooklyn-simmons.png?v=2',
  'courtney-henry': '/avatars/cameron-williamson.png?v=2',
  'dianne-russell': '/avatars/albert-flores.png?v=2',
  'devon-lane': '/avatars/darrell-steward.png?v=2',
}

const avatar = (slug: string) => avatarMap[slug] || `/avatars/${slug}.svg`

const money = (amount: number) => `GHC ${amount.toFixed(2)}`

const dammProductsSeed = (): DammProduct[] => [
  { id: 'damm-1', name: 'Smirnoff Ice', image: '/damm/smirnoff-ice.svg', category: 'Liquor', alcohol: '28%', weight: '750ml', price: 'GHC 24.00', status: 'Active', manufacture: 'Local Suppliers' },
  { id: 'damm-2', name: 'Rosewood Origin', image: '/damm/rosewood-origin.svg', category: 'Wine', alcohol: '28%', weight: '750ml', price: 'GHC 24.00', status: 'Deactive', manufacture: 'International Favs' },
  { id: 'damm-3', name: 'Jack Daniels', image: '/damm/jack-daniels.svg', category: 'Beer', alcohol: '28%', weight: '750ml', price: 'GHC 24.00', status: 'Active', manufacture: 'Local Suppliers' },
  { id: 'damm-4', name: 'Belvedere', image: '/damm/belvedere.svg', category: 'Spirits', alcohol: '28%', weight: '750ml', price: 'GHC 24.00', status: 'Deactive', manufacture: 'International Favs' },
  { id: 'damm-5', name: 'Gulder', image: '/damm/gulder.svg', category: 'Beer', alcohol: '28%', weight: '750ml', price: 'GHC 24.00', status: 'Active', manufacture: 'Local Suppliers' },
  { id: 'damm-6', name: 'Heineken', image: '/damm/heineken.svg', category: 'Liquor', alcohol: '28%', weight: '750ml', price: 'GHC 24.00', status: 'Deactive', manufacture: 'International Favs' },
]

const dammCategoriesSeed = (): DammCategory[] => [
  { id: 'damm-cat-1', name: 'Smirnoff Ice', items: 3 },
  { id: 'damm-cat-2', name: 'Rosewood Origin', items: 2 },
  { id: 'damm-cat-3', name: 'Jack Daniels', items: 2, locked: true },
  { id: 'damm-cat-4', name: 'Belvedere', items: 5 },
  { id: 'damm-cat-5', name: 'Gulder', items: 5 },
  { id: 'damm-cat-6', name: 'Heineken', items: 6 },
]

const ordersSeed = (): OrderRecord[] => [
  {
    id: '12009',
    tableId: 'B13789',
    vendor: 'Bindirigu',
    customerId: 'chelsie-johnson',
    customerName: 'Chelsie Johnson',
    customerAvatar: avatar('chelsie-johnson'),
    restaurant: 'Star Valley Restaurant',
    restaurantShort: 'Star Valley Restaurant',
    date: 'Nov 28, 2021',
    time: '08:30 PM',
    period: 'This Week',
    price: 90,
    status: 'On the way',
    details: 'Fufu (1), Banku(2), Bel-Aqua(1)...',
    address: 'G. P. O., Asafoatse Nettey Road, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'John Doe',
      phone: '+880 12345 6789',
      avatar: avatar('ronald-richards'),
    },
    items: [
      { id: 'food-1', name: 'Smirnoff Ice', image: '/damm/smirnoff-ice.svg', quantity: 2, price: 80 },
      { id: 'food-2', name: 'Rosewood Origin', image: '/damm/rosewood-origin.svg', quantity: 1, price: 30 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 165,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Accepted', time: '10:36 AM', state: 'done' },
      { label: 'Being prepared', time: '10:37 AM', state: 'done' },
      { label: 'On the way', time: '10:50 AM', state: 'current' },
      { label: 'Delivered', time: '00:00', state: 'upcoming' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12010',
    tableId: 'B13789',
    vendor: 'Bindirigu',
    customerId: 'dianne-russell',
    customerName: 'Dianne Russell',
    customerAvatar: avatar('dianne-russell'),
    restaurant: 'Louis Vuitton',
    restaurantShort: 'Louis Vuitton',
    date: 'Feb 08, 2022',
    time: '08:30 PM',
    period: 'This Week',
    price: 90,
    status: 'Delivered',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'John Doe',
      phone: '+880 12345 6789',
      avatar: avatar('ronald-richards'),
    },
    items: [
      { id: 'food-1', name: 'Smirnoff Ice', image: '/damm/smirnoff-ice.svg', quantity: 2, price: 80 },
      { id: 'food-4', name: 'Jack Daniels', image: '/damm/jack-daniels.svg', quantity: 1, price: 10 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 165,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Accepted', time: '10:36 AM', state: 'done' },
      { label: 'Being prepared', time: '10:37 AM', state: 'done' },
      { label: 'On the way', time: '10:50 AM', state: 'done' },
      { label: 'Delivered', time: '00:00', state: 'current' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12011',
    tableId: 'B13789',
    vendor: 'Damm',
    customerId: 'leslie-alexander',
    customerName: 'Leslie Alexander',
    customerAvatar: avatar('leslie-alexander'),
    restaurant: 'Queenstown Public House',
    restaurantShort: 'Queenstown Public House',
    date: 'Feb 08, 2022',
    time: '07:50 PM',
    period: 'This Week',
    price: 75,
    status: 'Preparing',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'Jacob Jones',
      phone: '+880 12345 6700',
      avatar: avatar('devon-lane'),
    },
    items: [
      { id: 'food-1', name: 'Smirnoff Ice', image: '/damm/smirnoff-ice.svg', quantity: 1, price: 45 },
      { id: 'food-4', name: 'Jack Daniels', image: '/damm/jack-daniels.svg', quantity: 1, price: 30 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 105,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Accepted', time: '10:36 AM', state: 'done' },
      { label: 'Being prepared', time: '10:37 AM', state: 'current' },
      { label: 'On the way', time: '10:50 AM', state: 'upcoming' },
      { label: 'Delivered', time: '00:00', state: 'upcoming' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12012',
    tableId: 'B13789',
    vendor: 'Damm',
    customerId: 'ralph-edwards',
    customerName: 'Ralph Edwards',
    customerAvatar: avatar('ralph-edwards'),
    restaurant: 'Top of the Mark',
    restaurantShort: 'Top of the Mark',
    date: 'Feb 08, 2022',
    time: '08:10 PM',
    period: 'This Month',
    price: 110,
    status: 'Cancelled',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'Ralph Edwards',
      phone: '+880 12345 6789',
      avatar: avatar('ralph-edwards'),
    },
    items: [
      { id: 'food-1', name: 'Smirnoff Ice', image: '/damm/smirnoff-ice.svg', quantity: 2, price: 80 },
      { id: 'food-2', name: 'Rosewood Origin', image: '/damm/rosewood-origin.svg', quantity: 1, price: 30 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 165,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Cancelled', time: '10:36 AM', state: 'current' },
      { label: 'Being prepared', time: '10:37 AM', state: 'upcoming' },
      { label: 'On the way', time: '10:50 AM', state: 'upcoming' },
      { label: 'Delivered', time: '00:00', state: 'upcoming' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12013',
    tableId: 'B13789',
    vendor: 'Bindirigu',
    customerId: 'jane-cooper',
    customerName: 'Jane Cooper',
    customerAvatar: avatar('esther-howard'),
    restaurant: 'Bean Around the World Cof...',
    restaurantShort: 'Bean Around the World',
    date: 'Feb 08, 2022',
    time: '08:05 PM',
    period: 'This Month',
    price: 80,
    status: 'Delivered',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'Courtney Henry',
      phone: '+880 12345 6720',
      avatar: avatar('brooklyn-simmons'),
    },
    items: [
      { id: 'food-3', name: 'Heineken', image: '/damm/heineken.svg', quantity: 2, price: 80 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 120,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Accepted', time: '10:36 AM', state: 'done' },
      { label: 'Being prepared', time: '10:37 AM', state: 'done' },
      { label: 'On the way', time: '10:50 AM', state: 'done' },
      { label: 'Delivered', time: '00:00', state: 'current' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12014',
    tableId: 'B13789',
    vendor: 'Damm',
    customerId: 'kathryn-murphy',
    customerName: 'Kathryn Murphy',
    customerAvatar: avatar('kathryn-murphy'),
    restaurant: 'Top of the Mark',
    restaurantShort: 'Top of the Mark',
    date: 'Feb 08, 2022',
    time: '07:45 PM',
    period: 'This Year',
    price: 80,
    status: 'On the way',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'John Doe',
      phone: '+880 12345 6789',
      avatar: avatar('ronald-richards'),
    },
    items: [
      { id: 'food-2', name: 'Rosewood Origin', image: '/damm/rosewood-origin.svg', quantity: 2, price: 80 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 120,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Accepted', time: '10:36 AM', state: 'done' },
      { label: 'Being prepared', time: '10:37 AM', state: 'done' },
      { label: 'On the way', time: '10:50 AM', state: 'current' },
      { label: 'Delivered', time: '00:00', state: 'upcoming' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12015',
    tableId: 'B13789',
    vendor: 'Bindirigu',
    customerId: 'jenny-wilson',
    customerName: 'Jenny Wilson',
    customerAvatar: avatar('jenny-wilson'),
    restaurant: 'Mirazur',
    restaurantShort: 'Mirazur',
    date: 'Feb 08, 2022',
    time: '07:10 PM',
    period: 'This Year',
    price: 30,
    status: 'Pending',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'Floyd Miles',
      phone: '+880 12345 6730',
      avatar: avatar('albert-flores'),
    },
    items: [
      { id: 'food-2', name: 'Rosewood Origin', image: '/damm/rosewood-origin.svg', quantity: 1, price: 30 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 60,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'current' },
      { label: 'Accepted', time: '10:36 AM', state: 'upcoming' },
      { label: 'Being prepared', time: '10:37 AM', state: 'upcoming' },
      { label: 'On the way', time: '10:50 AM', state: 'upcoming' },
      { label: 'Delivered', time: '00:00', state: 'upcoming' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12016',
    tableId: 'B13789',
    vendor: 'Damm',
    customerId: 'jacob-jones',
    customerName: 'Jacob Jones',
    customerAvatar: avatar('jacob-jones'),
    restaurant: 'Alain Ducasse au Plaza Athenee',
    restaurantShort: 'Alain Ducasse',
    date: 'Feb 08, 2022',
    time: '06:55 PM',
    period: 'This Year',
    price: 70,
    status: 'Preparing',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'Jacob Jones',
      phone: '+880 12345 6700',
      avatar: avatar('devon-lane'),
    },
    items: [
      { id: 'food-3', name: 'Heineken', image: '/damm/heineken.svg', quantity: 1, price: 24 },
      { id: 'food-4', name: 'Jack Daniels', image: '/damm/jack-daniels.svg', quantity: 1, price: 46 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 100,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Accepted', time: '10:36 AM', state: 'done' },
      { label: 'Being prepared', time: '10:37 AM', state: 'current' },
      { label: 'On the way', time: '10:50 AM', state: 'upcoming' },
      { label: 'Delivered', time: '00:00', state: 'upcoming' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12017',
    tableId: 'B13789',
    vendor: 'Bindirigu',
    customerId: 'courtney-henry',
    customerName: 'Courtney Henry',
    customerAvatar: avatar('brooklyn-simmons'),
    restaurant: 'Fog Harbor Fish House',
    restaurantShort: 'Fog Harbor',
    date: 'Feb 08, 2022',
    time: '06:40 PM',
    period: 'This Year',
    price: 60,
    status: 'Cancelled',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'Courtney Henry',
      phone: '+880 12345 6720',
      avatar: avatar('brooklyn-simmons'),
    },
    items: [
      { id: 'food-1', name: 'Smirnoff Ice', image: '/damm/smirnoff-ice.svg', quantity: 1, price: 60 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 90,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Cancelled', time: '10:36 AM', state: 'current' },
      { label: 'Being prepared', time: '10:37 AM', state: 'upcoming' },
      { label: 'On the way', time: '10:50 AM', state: 'upcoming' },
      { label: 'Delivered', time: '00:00', state: 'upcoming' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
  {
    id: '12018',
    tableId: 'B13789',
    vendor: 'Damm',
    customerId: 'floyd-miles',
    customerName: 'Floyd Miles',
    customerAvatar: avatar('floyd-miles'),
    restaurant: 'Marina Kitchen',
    restaurantShort: 'Marina Kitchen',
    date: 'Feb 08, 2022',
    time: '06:20 PM',
    period: 'This Year',
    price: 79,
    status: 'Delivered',
    details: 'Beef onion pizza (2x), Beef burger...',
    address: 'Current address, Accra, Ghana',
    extraAddress: 'Road, House no, Floor etc..',
    deliveryGuy: {
      name: 'Floyd Miles',
      phone: '+880 12345 6730',
      avatar: avatar('albert-flores'),
    },
    items: [
      { id: 'food-5', name: 'Gulder', image: '/damm/gulder.svg', quantity: 1, price: 79 },
    ],
    couponStatus: 'Not Applied',
    rewardStatus: 'Not Used',
    deliveryFee: 2.4,
    feesTax: 1,
    subtotal: 110,
    timeline: [
      { label: 'Placed', time: '10:34 AM', state: 'done' },
      { label: 'Accepted', time: '10:36 AM', state: 'done' },
      { label: 'Being prepared', time: '10:37 AM', state: 'done' },
      { label: 'On the way', time: '10:50 AM', state: 'done' },
      { label: 'Delivered', time: '00:00', state: 'current' },
    ],
    estimatedDelivery: '12:45:10',
    map: {
      pickupLat: 41.3111,
      pickupLng: 69.2797,
      dropoffLat: 41.2995,
      dropoffLng: 69.2401,
    },
  },
]

export const useOrders = () => {
  const orders = useState<OrderRecord[]>('orders', ordersSeed)
  const dammProducts = useState<DammProduct[]>('damm-products', dammProductsSeed)
  const dammCategories = useState<DammCategory[]>('damm-categories', dammCategoriesSeed)

  const getOrderById = (id: string) =>
    orders.value.find(order => order.id === id)

  const getOrdersByCustomer = (customerId: string) =>
    orders.value.filter(order => order.customerId === customerId)

  const getDammProductById = (id: string) =>
    dammProducts.value.find(item => item.id === id)

  const addDammProduct = (product: DammProduct) => {
    dammProducts.value = [product, ...dammProducts.value]
  }

  const updateDammProduct = (id: string, update: Partial<DammProduct>) => {
    dammProducts.value = dammProducts.value.map(item =>
      item.id === id ? { ...item, ...update } : item,
    )
  }

  const removeDammProduct = (id: string) => {
    dammProducts.value = dammProducts.value.filter(item => item.id !== id)
  }

  const addDammCategory = (category: DammCategory) => {
    dammCategories.value = [category, ...dammCategories.value]
  }

  const updateDammCategory = (id: string, update: Partial<DammCategory>) => {
    dammCategories.value = dammCategories.value.map(item =>
      item.id === id ? { ...item, ...update } : item,
    )
  }

  const removeDammCategory = (id: string) => {
    dammCategories.value = dammCategories.value.filter(item => item.id !== id)
  }

  const deliveredStatuses: OrderStatus[] = ['Delivered', 'Complete']

  return {
    orders,
    dammProducts,
    dammCategories,
    getOrderById,
    getOrdersByCustomer,
    getDammProductById,
    addDammProduct,
    updateDammProduct,
    removeDammProduct,
    addDammCategory,
    updateDammCategory,
    removeDammCategory,
    deliveredStatuses,
    money,
  }
}
