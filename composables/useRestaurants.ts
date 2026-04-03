export type RestaurantStatus = 'Open' | 'Closed'

export interface RestaurantDocument {
  label: string
  fileName: string
}

export interface RestaurantItem {
  id: string
  name: string
  representative: string
  phone: string
  location: string
  established: string
  workPeriod: string
  size: string
  paymentMethod: string
  rating: number
  status: RestaurantStatus
  image: string
  documents: RestaurantDocument[]
}

const initialRestaurants = (): RestaurantItem[] => [
  {
    id: 'sun-valley-1',
    name: 'Sun valley restaurant',
    representative: 'Darrell Steward',
    phone: '(406) 555-0120',
    location: 'Aueduase',
    established: '01 January 2024',
    workPeriod: '9:00 AM - 10:00 PM',
    size: 'Large',
    paymentMethod: 'Cash in hand',
    rating: 4.8,
    status: 'Open',
    image: '/restaurants/sun-valley-1.svg',
    documents: [
      { label: 'License', fileName: 'BusinessLicense.pdf' },
      { label: 'NID Card', fileName: 'Nidcard.pdf' },
    ],
  },
  {
    id: 'moon-valley-1',
    name: 'Moon valley restaurant',
    representative: 'Darrell Steward',
    phone: '(480) 555-0103',
    location: 'Asafoatse Nettey Road, Accra',
    established: '03 January 2024',
    workPeriod: '9:00 AM - 9:30 PM',
    size: 'Medium',
    paymentMethod: 'Card',
    rating: 5,
    status: 'Closed',
    image: '/restaurants/moon-valley-1.svg',
    documents: [
      { label: 'License', fileName: 'MoonLicense.pdf' },
      { label: 'NID Card', fileName: 'MoonNID.pdf' },
    ],
  },
  {
    id: 'sun-valley-2',
    name: 'Sun valley restaurant',
    representative: 'Darrell Steward',
    phone: '(603) 555-0123',
    location: 'Aueduase',
    established: '05 January 2024',
    workPeriod: '8:00 AM - 9:00 PM',
    size: 'Large',
    paymentMethod: 'Cash in hand',
    rating: 4.5,
    status: 'Open',
    image: '/restaurants/sun-valley-2.svg',
    documents: [
      { label: 'License', fileName: 'SunLicense.pdf' },
      { label: 'NID Card', fileName: 'SunNID.pdf' },
    ],
  },
  {
    id: 'moon-valley-2',
    name: 'Moon valley restaurant',
    representative: 'Darrell Steward',
    phone: '(704) 555-0127',
    location: 'Nettey Road, Accra',
    established: '07 January 2024',
    workPeriod: '10:00 AM - 11:00 PM',
    size: 'Small',
    paymentMethod: 'Card',
    rating: 4.9,
    status: 'Open',
    image: '/restaurants/moon-valley-2.svg',
    documents: [
      { label: 'License', fileName: 'MoonRoadLicense.pdf' },
      { label: 'NID Card', fileName: 'MoonRoadNID.pdf' },
    ],
  },
  {
    id: 'sun-valley-3',
    name: 'Sun valley restaurant',
    representative: 'Darrell Steward',
    phone: '(239) 555-0108',
    location: 'Asafoatse',
    established: '08 January 2024',
    workPeriod: '9:00 AM - 10:00 PM',
    size: 'Large',
    paymentMethod: 'Cash in hand',
    rating: 4.2,
    status: 'Open',
    image: '/restaurants/sun-valley-3.svg',
    documents: [
      { label: 'License', fileName: 'AsafoatseLicense.pdf' },
      { label: 'NID Card', fileName: 'AsafoatseNID.pdf' },
    ],
  },
  {
    id: 'star-valley-1',
    name: 'Star valley restaurant',
    representative: 'Darrell Steward',
    phone: '(316) 555-0116',
    location: 'Asafoatse Nettey Road, Accra',
    established: '01 January 2024',
    workPeriod: '9:00 AM - 10:00 PM',
    size: 'Large',
    paymentMethod: 'Card',
    rating: 4.8,
    status: 'Closed',
    image: '/restaurants/star-valley-1.svg',
    documents: [
      { label: 'License', fileName: 'BusinessLicense.pdf' },
      { label: 'NID Card', fileName: 'Nidcard.pdf' },
    ],
  },
]

export const useRestaurants = () => {
  const restaurants = useState<RestaurantItem[]>('restaurants', initialRestaurants)

  const addRestaurant = (restaurant: RestaurantItem) => {
    restaurants.value = [restaurant, ...restaurants.value]
  }

  const updateRestaurant = (id: string, update: Partial<RestaurantItem>) => {
    restaurants.value = restaurants.value.map((restaurant) =>
      restaurant.id === id
        ? { ...restaurant, ...update }
        : restaurant,
    )
  }

  const getRestaurantById = (id: string) =>
    restaurants.value.find((restaurant) => restaurant.id === id)

  return {
    restaurants,
    addRestaurant,
    updateRestaurant,
    getRestaurantById,
  }
}
