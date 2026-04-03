export type CustomerGender = 'Male' | 'Female'
export type CustomerTab = 'overview' | 'orders' | 'favorites' | 'reviews' | 'rewards'

export interface CustomerItem {
  id: string
  name: string
  phone: string
  email: string
  location: string
  university: string
  isStudent: boolean
  gender: CustomerGender
  status: 'Active' | 'Disabled'
  avatar: string
  joinedAt: string
  favoriteRestaurants: number
  orders: number
  rewardPoints: number
}

const avatarMap: Record<string, string> = {
  'chelsie-johnson': '/avatars/chelsie-johnson.png?v=2',
  'ronald-richards': '/avatars/ronald-richards.png?v=2',
  'darrell-steward': '/avatars/darrell-steward.png?v=2',
  'albert-flores': '/avatars/albert-flores.png?v=2',
  'wade-warren': '/avatars/wade-warren.png?v=2',
  'esther-howard': '/avatars/esther-howard.png?v=2',
  'cameron-williamson': '/avatars/cameron-williamson.png?v=2',
  'brooklyn-simmons': '/avatars/brooklyn-simmons.png?v=2',
  'jenny-wilson': '/avatars/brooklyn-simmons.png?v=2',
  'dianne-russell': '/avatars/albert-flores.png?v=2',
  'devon-lane': '/avatars/darrell-steward.png?v=2',
}

const avatar = (slug: string) => avatarMap[slug] || `/avatars/${slug}.svg`

const initialCustomers = (): CustomerItem[] => [
  {
    id: 'chelsie-johnson',
    name: 'Chelsie Johnson',
    phone: '880160000770',
    email: 'chelsie@ui8.net',
    location: 'Corner Street 5th London...',
    university: 'University of Ghana',
    isStudent: true,
    gender: 'Male',
    status: 'Active',
      avatar: avatar('chelsie-johnson'),
    joinedAt: '2 Feb 2022',
    favoriteRestaurants: 12,
    orders: 20,
    rewardPoints: 420,
  },
  {
    id: 'ronald-richards',
    name: 'Ronald Richards',
    phone: '+880160000770',
    email: 'ronald@bidirigu.com',
    location: 'Beverly Hills, California',
    university: 'Stanford University',
    isStudent: false,
    gender: 'Male',
    status: 'Active',
      avatar: avatar('ronald-richards'),
    joinedAt: '18 Jan 2022',
    favoriteRestaurants: 8,
    orders: 14,
    rewardPoints: 250,
  },
  {
    id: 'darrell-steward',
    name: 'Darrell Steward',
    phone: '+880160000770',
    email: 'darrell@bidirigu.com',
    location: 'Accra Central, Ghana',
    university: 'UG Business School',
    isStudent: true,
    gender: 'Male',
    status: 'Active',
      avatar: avatar('darrell-steward'),
    joinedAt: '4 Mar 2022',
    favoriteRestaurants: 7,
    orders: 11,
    rewardPoints: 210,
  },
  {
    id: 'albert-flores',
    name: 'Albert Flores',
    phone: '+880160000770',
    email: 'albert@bidirigu.com',
    location: 'Oxford Street, London',
    university: 'Kingston University',
    isStudent: false,
    gender: 'Male',
    status: 'Disabled',
      avatar: avatar('albert-flores'),
    joinedAt: '9 Apr 2022',
    favoriteRestaurants: 3,
    orders: 5,
    rewardPoints: 70,
  },
  {
    id: 'wade-warren',
    name: 'Wade Warren',
    phone: '+880160000770',
    email: 'wade@bidirigu.com',
    location: 'Sunset Boulevard, LA',
    university: 'UCLA',
    isStudent: false,
    gender: 'Male',
    status: 'Active',
      avatar: avatar('wade-warren'),
    joinedAt: '16 May 2022',
    favoriteRestaurants: 15,
    orders: 24,
    rewardPoints: 510,
  },
  {
    id: 'esther-howard',
    name: 'Esther Howard',
    phone: '+880160000770',
    email: 'esther@bidirigu.com',
    location: 'Teshie, Accra',
    university: 'Ashesi University',
    isStudent: true,
    gender: 'Female',
    status: 'Active',
      avatar: avatar('esther-howard'),
    joinedAt: '1 Jun 2022',
    favoriteRestaurants: 5,
    orders: 9,
    rewardPoints: 160,
  },
  {
    id: 'cameron-williamson',
    name: 'Cameron Williamson',
    phone: '+880160000770',
    email: 'cameron@bidirigu.com',
    location: 'Tema Community 5',
    university: 'Central University',
    isStudent: false,
    gender: 'Male',
    status: 'Active',
      avatar: avatar('cameron-williamson'),
    joinedAt: '28 Jun 2022',
    favoriteRestaurants: 9,
    orders: 12,
    rewardPoints: 180,
  },
  {
    id: 'brooklyn-simmons',
    name: 'Brooklyn Simmons',
    phone: '+880160000770',
    email: 'brooklyn@bidirigu.com',
    location: 'East Legon, Accra',
    university: 'Lancaster Ghana',
    isStudent: true,
    gender: 'Female',
    status: 'Active',
      avatar: avatar('brooklyn-simmons'),
    joinedAt: '11 Jul 2022',
    favoriteRestaurants: 10,
    orders: 18,
    rewardPoints: 360,
  },
  {
    id: 'jenny-wilson',
    name: 'Jenny Wilson',
    phone: '+880160000770',
    email: 'jenny@bidirigu.com',
    location: 'Labone, Accra',
    university: 'University of Ghana',
    isStudent: false,
    gender: 'Female',
    status: 'Active',
      avatar: avatar('jenny-wilson'),
    joinedAt: '7 Aug 2022',
    favoriteRestaurants: 4,
    orders: 6,
    rewardPoints: 90,
  },
  {
    id: 'dianne-russell',
    name: 'Dianne Russell',
    phone: '+880160000770',
    email: 'dianne@bidirigu.com',
    location: 'Osu, Accra',
    university: 'BlueCrest University',
    isStudent: true,
    gender: 'Female',
    status: 'Active',
      avatar: avatar('dianne-russell'),
    joinedAt: '1 Sep 2022',
    favoriteRestaurants: 11,
    orders: 17,
    rewardPoints: 390,
  },
  {
    id: 'devon-lane',
    name: 'Devon Lane',
    phone: '+880160000770',
    email: 'devon@bidirigu.com',
    location: 'Airport Residential, Accra',
    university: 'Academic City',
    isStudent: false,
    gender: 'Male',
    status: 'Disabled',
      avatar: avatar('devon-lane'),
    joinedAt: '14 Oct 2022',
    favoriteRestaurants: 2,
    orders: 3,
    rewardPoints: 40,
  },
]

export const useCustomers = () => {
  const customers = useState<CustomerItem[]>('customers', initialCustomers)

  const addCustomer = (customer: CustomerItem) => {
    customers.value = [customer, ...customers.value]
  }

  const updateCustomer = (id: string, update: Partial<CustomerItem>) => {
    customers.value = customers.value.map(customer =>
      customer.id === id ? { ...customer, ...update } : customer,
    )
  }

  const getCustomerById = (id: string) =>
    customers.value.find(customer => customer.id === id)

  return {
    customers,
    addCustomer,
    updateCustomer,
    getCustomerById,
  }
}
