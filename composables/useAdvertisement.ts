export type AdvertisementStatus = 'Pending' | 'Active' | 'Cancelled' | 'Owned'

export interface AdvertisementItem {
  id: string
  slot: string
  restaurant: string
  banner: string
  date: string
  price: string
  bidPrice: string
  position: string
  status: AdvertisementStatus
  category: string
  rating: string
  owner: string
}

const advertisementSeed = (): AdvertisementItem[] => [
  { id: 'ad-1', slot: 'Slot 01', restaurant: 'Sun valley restaurant', banner: '/ads/we-love-you.svg', date: 'Feb 08 - Mar 08, 2022', price: 'GHC 24.00', bidPrice: '₵ 524.00', position: '1st', status: 'Pending', category: 'Pizza', rating: '5.00', owner: 'Bindirigu' },
  { id: 'ad-2', slot: 'Slot 02', restaurant: 'Moon valley restaurant', banner: '/ads/weekend-deal.svg', date: 'Feb 08 - Mar 08, 2022', price: 'GHC 24.00', bidPrice: '₵ 504.00', position: '2nd', status: 'Pending', category: 'Pizza', rating: '5.00', owner: 'Bindirigu' },
  { id: 'ad-3', slot: 'Slot 03', restaurant: 'Sun light restaurant', banner: '', date: 'Feb 08 - Mar 08, 2022', price: 'GHC 24.00', bidPrice: '₵ 224.00', position: '6th', status: 'Pending', category: 'Burger', rating: '4.80', owner: 'Bindirigu' },
  { id: 'ad-4', slot: 'Slot 03', restaurant: 'Sun valley restaurant', banner: '/ads/we-love-you.svg', date: 'Feb 08 - Mar 08, 2022', price: 'GHC 24.00', bidPrice: '₵ 500.00', position: '3rd', status: 'Pending', category: 'Pizza', rating: '4.50', owner: 'Bindirigu' },
  { id: 'ad-5', slot: 'Slot 03', restaurant: 'Sun valley restaurant', banner: '/ads/weekend-deal.svg', date: 'Feb 08 - Mar 08, 2022', price: 'GHC 24.00', bidPrice: '₵ 400.00', position: '5th', status: 'Pending', category: 'Pizza', rating: '5.00', owner: 'Bindirigu' },
  { id: 'ad-6', slot: 'Slot 03', restaurant: 'Sun valley restaurant', banner: '/ads/weekend-deal.svg', date: 'Feb 08 - Mar 08, 2022', price: 'GHC 24.00', bidPrice: '₵ 450.00', position: '4th', status: 'Pending', category: 'Pizza', rating: '5.00', owner: 'Bindirigu' },
]

export const useAdvertisement = () => {
  const advertisements = useState<AdvertisementItem[]>('advertisements', advertisementSeed)

  const addAdvertisement = (item: AdvertisementItem) => {
    advertisements.value = [item, ...advertisements.value]
  }

  const updateAdvertisement = (id: string, update: Partial<AdvertisementItem>) => {
    advertisements.value = advertisements.value.map(item =>
      item.id === id ? { ...item, ...update } : item,
    )
  }

  return {
    advertisements,
    addAdvertisement,
    updateAdvertisement,
  }
}
