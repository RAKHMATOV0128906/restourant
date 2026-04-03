export type RiderProfileTab = 'overview' | 'deliveries' | 'earnings' | 'reviews'
export type RiderDeliveryStatus = 'Pending' | 'Accepted' | 'Pick Up' | 'Dropoff' | 'Complete' | 'Cancelled'
export type RiderDeliveryVendor = 'Bindirigu' | 'Damm'
export type RiderTimelineState = 'done' | 'current' | 'upcoming'

export interface RiderDocument {
  id: string
  title: string
  fileName: string
}

export interface RiderStatsBar {
  id: string
  label: string
  value: number
  active?: boolean
}

export interface RiderItem {
  id: string
  name: string
  phone: string
  email: string
  address: string
  shift: string
  photo: string
  birthDate: string
  birthPlace: string
  gender: 'Male' | 'Female'
  userId: string
  paymentMethod: string
  currentBalance: number
  earningThisMonth: number
  totalOrders: number
  isActive: boolean
  documents: RiderDocument[]
  stats: RiderStatsBar[]
}

export interface RiderDeliveryStep {
  label: string
  time: string
  state: RiderTimelineState
}

export interface RiderDeliveryLine {
  id: string
  name: string
  image: string
  quantity: number
  price: number
}

export interface RiderDeliveryRecord {
  id: string
  riderId: string
  orderId: string
  vendor: RiderDeliveryVendor
  restaurant: string
  date: string
  status: RiderDeliveryStatus
  paid: boolean
  customerName: string
  customerAvatar: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  pickupLabel: string
  pickupAddress: string
  dropoffLabel: string
  dropoffAddress: string
  driverName: string
  driverPhone: string
  driverAvatar: string
  estimatedLabel: string
  estimatedValue: string
  items: RiderDeliveryLine[]
  subtotal: number
  deliveryFee: number
  feesTax: number
  couponStatus: string
  rewardStatus: string
  timeline: RiderDeliveryStep[]
  map: {
    pickupLat: number
    pickupLng: number
    dropoffLat: number
    dropoffLng: number
  }
}

export interface RiderAttendanceRecord {
  id: string
  riderId: string
  riderName: string
  image: string
  shift: string
  area: string
  timer: string
  running: boolean
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
  'jenny-wilson': '/avatars/brooklyn-simmons.png?v=2',
  'dianne-russell': '/avatars/albert-flores.png?v=2',
  'devon-lane': '/avatars/darrell-steward.png?v=2',
  'ralph-edwards': '/avatars/ronald-richards.png?v=2',
}

const avatar = (slug: string) => avatarMap[slug] || `/avatars/${slug}.svg`

const riderSeed = (): RiderItem[] => [
  { id: 'ronald-richards', name: 'Ronald Richards', phone: '+880160000770', email: 'ronald@bindirigu.com', address: 'Asafoatse Nettey Road, Accra...', shift: '10:00 AM - 3:00 PM', photo: avatar('ronald-richards'), birthDate: '14/01/1997', birthPlace: 'Asafoatse Nettey', gender: 'Male', userId: '395001', paymentMethod: 'Visa Debit', currentBalance: 244.8, earningThisMonth: 1246.2, totalOrders: 92, isActive: true, documents: [{ id: 'birth-1', title: 'Birth Certificate', fileName: 'Businesslicense.pdf' }, { id: 'nid-1', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 6 }, { id: 'week-2', label: 'Week 2', value: 5 }, { id: 'week-3', label: 'Week 3', value: 4, active: true }, { id: 'week-4', label: 'Week 4', value: 7 }] },
  { id: 'chelsie-johnson', name: 'Chelsie Johnson', phone: '+880160000770', email: 'chelsiejohnson@bindirigu.com', address: 'Asafoatse Nettey Road, Accra...', shift: '10:00 AM - 3:00 PM', photo: avatar('chelsie-johnson'), birthDate: '24/04/1997', birthPlace: 'Asafoatse Nettey', gender: 'Male', userId: '395003', paymentMethod: 'Visa Debit', currentBalance: 276.8, earningThisMonth: 1276.8, totalOrders: 102, isActive: true, documents: [{ id: 'birth-2', title: 'Birth Certificate', fileName: 'Businesslicense.pdf' }, { id: 'nid-2', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 6 }, { id: 'week-2', label: 'Week 2', value: 5 }, { id: 'week-3', label: 'Week 3', value: 4, active: true }, { id: 'week-4', label: 'Week 4', value: 7 }] },
  { id: 'darrell-steward', name: 'Darrell Steward', phone: '+880160000770', email: 'darrell@bindirigu.com', address: 'Cantomments Road, Osu', shift: '10:00 AM - 3:00 PM', photo: avatar('darrell-steward'), birthDate: '11/09/1998', birthPlace: 'Bantuma Road', gender: 'Male', userId: '395010', paymentMethod: 'Master Card', currentBalance: 231.4, earningThisMonth: 1182.4, totalOrders: 89, isActive: true, documents: [{ id: 'birth-3', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-3', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 5 }, { id: 'week-2', label: 'Week 2', value: 6 }, { id: 'week-3', label: 'Week 3', value: 5, active: true }, { id: 'week-4', label: 'Week 4', value: 6 }] },
  { id: 'albert-flores', name: 'Albert Flores', phone: '+880160000770', email: 'albert@bindirigu.com', address: 'Asafoatse Nettey Road, Accra', shift: '10:00 AM - 3:00 PM', photo: avatar('albert-flores'), birthDate: '02/12/1996', birthPlace: 'Elmina', gender: 'Male', userId: '395011', paymentMethod: 'Cash', currentBalance: 190.5, earningThisMonth: 860.2, totalOrders: 75, isActive: true, documents: [{ id: 'birth-4', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-4', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 3 }, { id: 'week-2', label: 'Week 2', value: 6 }, { id: 'week-3', label: 'Week 3', value: 5, active: true }, { id: 'week-4', label: 'Week 4', value: 4 }] },
  { id: 'wade-warren', name: 'Wade Warren', phone: '+880160000770', email: 'wade@bindirigu.com', address: 'Major Kobbina Drive, Kumasi', shift: '10:00 AM - 3:00 PM', photo: avatar('wade-warren'), birthDate: '12/03/1995', birthPlace: 'Kumasi', gender: 'Male', userId: '395012', paymentMethod: 'Visa Debit', currentBalance: 288.7, earningThisMonth: 1320.8, totalOrders: 115, isActive: false, documents: [{ id: 'birth-5', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-5', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 6 }, { id: 'week-2', label: 'Week 2', value: 4 }, { id: 'week-3', label: 'Week 3', value: 6, active: true }, { id: 'week-4', label: 'Week 4', value: 7 }] },
  { id: 'esther-howard', name: 'Esther Howard', phone: '+880160000770', email: 'esther@bindirigu.com', address: 'Rain Tree Street, Kumasi', shift: '10:00 AM - 3:00 PM', photo: avatar('esther-howard'), birthDate: '30/07/1998', birthPlace: 'Kumasi', gender: 'Female', userId: '395013', paymentMethod: 'Cash', currentBalance: 212.3, earningThisMonth: 980.6, totalOrders: 84, isActive: true, documents: [{ id: 'birth-6', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-6', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 5 }, { id: 'week-2', label: 'Week 2', value: 5 }, { id: 'week-3', label: 'Week 3', value: 4, active: true }, { id: 'week-4', label: 'Week 4', value: 6 }] },
  { id: 'cameron-williamson', name: 'Cameron Williamson', phone: '+880160000770', email: 'cameron@bindirigu.com', address: 'Asafoatse Nettey Road, Accra', shift: '10:00 AM - 3:00 PM', photo: avatar('cameron-williamson'), birthDate: '18/11/1994', birthPlace: 'Accra', gender: 'Male', userId: '395014', paymentMethod: 'Visa Debit', currentBalance: 302.5, earningThisMonth: 1440.3, totalOrders: 118, isActive: true, documents: [{ id: 'birth-7', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-7', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 6 }, { id: 'week-2', label: 'Week 2', value: 6 }, { id: 'week-3', label: 'Week 3', value: 5, active: true }, { id: 'week-4', label: 'Week 4', value: 7 }] },
  { id: 'brooklyn-simmons', name: 'Brooklyn Simmons', phone: '+880160000770', email: 'brooklyn@bindirigu.com', address: 'Bantuma Road, Elmina', shift: '10:00 AM - 3:00 PM', photo: avatar('brooklyn-simmons'), birthDate: '10/08/1996', birthPlace: 'Elmina', gender: 'Female', userId: '395015', paymentMethod: 'Cash', currentBalance: 220.1, earningThisMonth: 1008.5, totalOrders: 80, isActive: true, documents: [{ id: 'birth-8', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-8', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 4 }, { id: 'week-2', label: 'Week 2', value: 5 }, { id: 'week-3', label: 'Week 3', value: 4, active: true }, { id: 'week-4', label: 'Week 4', value: 5 }] },
  { id: 'jenny-wilson', name: 'Jenny Wilson', phone: '+880160000770', email: 'jenny@bindirigu.com', address: 'Major Kobbina Drive, Kumasi', shift: '10:00 AM - 3:00 PM', photo: avatar('jenny-wilson'), birthDate: '05/05/1997', birthPlace: 'Kumasi', gender: 'Female', userId: '395016', paymentMethod: 'Visa Debit', currentBalance: 208.4, earningThisMonth: 1011.8, totalOrders: 82, isActive: true, documents: [{ id: 'birth-9', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-9', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 5 }, { id: 'week-2', label: 'Week 2', value: 4 }, { id: 'week-3', label: 'Week 3', value: 4, active: true }, { id: 'week-4', label: 'Week 4', value: 5 }] },
  { id: 'dianne-russell', name: 'Dianne Russell', phone: '+880160000770', email: 'dianne@bindirigu.com', address: 'Asafoatse Nettey Road, Accra', shift: '10:00 AM - 3:00 PM', photo: avatar('dianne-russell'), birthDate: '03/01/1998', birthPlace: 'Accra', gender: 'Female', userId: '395017', paymentMethod: 'Cash', currentBalance: 186.9, earningThisMonth: 894.6, totalOrders: 74, isActive: true, documents: [{ id: 'birth-10', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-10', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 4 }, { id: 'week-2', label: 'Week 2', value: 5 }, { id: 'week-3', label: 'Week 3', value: 4, active: true }, { id: 'week-4', label: 'Week 4', value: 6 }] },
  { id: 'devon-lane', name: 'Devon Lane', phone: '+880160000770', email: 'devon@bindirigu.com', address: 'Cantomments Road, Osu', shift: '10:00 AM - 3:00 PM', photo: avatar('devon-lane'), birthDate: '09/09/1997', birthPlace: 'Osu', gender: 'Male', userId: '395018', paymentMethod: 'Cash', currentBalance: 170.2, earningThisMonth: 812.1, totalOrders: 61, isActive: false, documents: [{ id: 'birth-11', title: 'Birth Certificate', fileName: 'Birth_certificate.pdf' }, { id: 'nid-11', title: 'NID CARD', fileName: 'NID_card.pdf' }], stats: [{ id: 'week-1', label: 'Week 1', value: 3 }, { id: 'week-2', label: 'Week 2', value: 4 }, { id: 'week-3', label: 'Week 3', value: 4, active: true }, { id: 'week-4', label: 'Week 4', value: 5 }] },
]

const deliverySeed = (): RiderDeliveryRecord[] => [
  { id: 'delivery-12009', riderId: 'chelsie-johnson', orderId: '12009', vendor: 'Bindirigu', restaurant: 'Sun Vally Restaurant', date: 'Nov 28, 2021', status: 'Pending', paid: true, customerName: 'Chelsie Johnson', customerAvatar: avatar('chelsie-johnson'), customerEmail: 'chelsiejohnson@bindirigu.com', customerPhone: '+88 01600-009770', customerAddress: 'Asafoatse Nettey Road, Accra...', pickupLabel: 'Pickup', pickupAddress: 'Star Valley Restaurant G. P. O., Asafoatse Nettey Road, Accra...', dropoffLabel: 'Drop-off', dropoffAddress: 'Asafoatse Nettey Road, Road no 2 / A, Flat 39, 5th floor', driverName: 'John Doe', driverPhone: '+880 12345 6789', driverAvatar: avatar('ronald-richards'), estimatedLabel: 'Pending', estimatedValue: '', items: [{ id: 'line-1', name: 'Beef onion pizza', image: '/menu/beef-onion-pizza.png', quantity: 2, price: 80 }, { id: 'line-2', name: 'Cheese pizza', image: '/menu/cheese-pizza.png', quantity: 1, price: 30 }], subtotal: 165, deliveryFee: 2.4, feesTax: 1, couponStatus: 'Not Applied', rewardStatus: 'Not Used', timeline: [{ label: 'Pending', time: '10:34 AM', state: 'current' }, { label: 'Accepted', time: '00:00', state: 'upcoming' }, { label: 'Pick Up', time: '00:00', state: 'upcoming' }, { label: 'Dropoff', time: '00:00', state: 'upcoming' }, { label: 'Complete', time: '00:00', state: 'upcoming' }], map: { pickupLat: 41.3111, pickupLng: 69.2797, dropoffLat: 41.2995, dropoffLng: 69.2401 } },
  { id: 'delivery-12010', riderId: 'chelsie-johnson', orderId: '12010', vendor: 'Bindirigu', restaurant: 'Sun Vally Restaurant', date: 'Nov 28, 2021', status: 'Accepted', paid: true, customerName: 'Chelsie Johnson', customerAvatar: avatar('chelsie-johnson'), customerEmail: 'chelsiejohnson@bindirigu.com', customerPhone: '+88 01600-009770', customerAddress: 'Asafoatse Nettey Road, Accra...', pickupLabel: 'Pickup', pickupAddress: 'Star Valley Restaurant G. P. O., Asafoatse Nettey Road, Accra...', dropoffLabel: 'Drop-off', dropoffAddress: 'Asafoatse Nettey Road, Road no 2 / A, Flat 39, 5th floor', driverName: 'John Doe', driverPhone: '+880 12345 6789', driverAvatar: avatar('ronald-richards'), estimatedLabel: 'Accepted', estimatedValue: '', items: [{ id: 'line-3', name: 'Beef onion pizza', image: '/menu/beef-onion-pizza.png', quantity: 2, price: 80 }, { id: 'line-4', name: 'Cheese pizza', image: '/menu/cheese-pizza.png', quantity: 1, price: 30 }], subtotal: 165, deliveryFee: 2.4, feesTax: 1, couponStatus: 'Not Applied', rewardStatus: 'Not Used', timeline: [{ label: 'Pending', time: '10:34 AM', state: 'done' }, { label: 'Accepted', time: '10:40 AM', state: 'current' }, { label: 'Pick Up', time: '00:00', state: 'upcoming' }, { label: 'Dropoff', time: '00:00', state: 'upcoming' }, { label: 'Complete', time: '00:00', state: 'upcoming' }], map: { pickupLat: 41.3111, pickupLng: 69.2797, dropoffLat: 41.2995, dropoffLng: 69.2401 } },
  { id: 'delivery-12011', riderId: 'chelsie-johnson', orderId: '12011', vendor: 'Bindirigu', restaurant: 'Sun Vally Restaurant', date: 'Nov 28, 2021', status: 'Pick Up', paid: true, customerName: 'Chelsie Johnson', customerAvatar: avatar('chelsie-johnson'), customerEmail: 'chelsiejohnson@bindirigu.com', customerPhone: '+88 01600-009770', customerAddress: 'Asafoatse Nettey Road, Accra...', pickupLabel: 'Pickup', pickupAddress: 'Star Valley Restaurant G. P. O., Asafoatse Nettey Road, Accra...', dropoffLabel: 'Drop-off', dropoffAddress: 'Asafoatse Nettey Road, Road no 2 / A, Flat 39, 5th floor', driverName: 'John Doe', driverPhone: '+880 12345 6789', driverAvatar: avatar('ronald-richards'), estimatedLabel: 'Estimated pickup time', estimatedValue: '10:56 AM', items: [{ id: 'line-5', name: 'Beef onion pizza', image: '/menu/beef-onion-pizza.png', quantity: 2, price: 80 }, { id: 'line-6', name: 'Cheese pizza', image: '/menu/cheese-pizza.png', quantity: 1, price: 30 }], subtotal: 165, deliveryFee: 2.4, feesTax: 1, couponStatus: 'Not Applied', rewardStatus: 'Not Used', timeline: [{ label: 'Pending', time: '10:34 AM', state: 'done' }, { label: 'Accepted', time: '10:40 AM', state: 'done' }, { label: 'Pick Up', time: '00:00', state: 'current' }, { label: 'Dropoff', time: '00:00', state: 'upcoming' }, { label: 'Complete', time: '00:00', state: 'upcoming' }], map: { pickupLat: 41.3111, pickupLng: 69.2797, dropoffLat: 41.2995, dropoffLng: 69.2401 } },
  { id: 'delivery-12012', riderId: 'chelsie-johnson', orderId: '12012', vendor: 'Bindirigu', restaurant: 'Sun Vally Restaurant', date: 'Nov 28, 2021', status: 'Complete', paid: true, customerName: 'Chelsie Johnson', customerAvatar: avatar('chelsie-johnson'), customerEmail: 'chelsiejohnson@bindirigu.com', customerPhone: '+88 01600-009770', customerAddress: 'Asafoatse Nettey Road, Accra...', pickupLabel: 'Pickup', pickupAddress: 'Star Valley Restaurant G. P. O., Asafoatse Nettey Road, Accra...', dropoffLabel: 'Drop-off', dropoffAddress: 'Asafoatse Nettey Road, Road no 2 / A, Flat 39, 5th floor', driverName: 'John Doe', driverPhone: '+880 12345 6789', driverAvatar: avatar('ronald-richards'), estimatedLabel: 'Complete', estimatedValue: '', items: [{ id: 'line-7', name: 'Beef onion pizza', image: '/menu/beef-onion-pizza.png', quantity: 2, price: 80 }, { id: 'line-8', name: 'Cheese pizza', image: '/menu/cheese-pizza.png', quantity: 1, price: 30 }], subtotal: 165, deliveryFee: 2.4, feesTax: 1, couponStatus: 'Not Applied', rewardStatus: 'Not Used', timeline: [{ label: 'Pending', time: '10:34 AM', state: 'done' }, { label: 'Accepted', time: '10:40 AM', state: 'done' }, { label: 'Pick Up', time: '11:00 AM', state: 'done' }, { label: 'Dropoff', time: '11:35 AM', state: 'done' }, { label: 'Complete', time: '00:00', state: 'current' }], map: { pickupLat: 41.3111, pickupLng: 69.2797, dropoffLat: 41.2995, dropoffLng: 69.2401 } },
  { id: 'delivery-12013', riderId: 'chelsie-johnson', orderId: '12013', vendor: 'Bindirigu', restaurant: 'Sun Vally Restaurant', date: 'Nov 28, 2021', status: 'Cancelled', paid: false, customerName: 'Chelsie Johnson', customerAvatar: avatar('chelsie-johnson'), customerEmail: 'chelsiejohnson@bindirigu.com', customerPhone: '+88 01600-009770', customerAddress: 'Asafoatse Nettey Road, Accra...', pickupLabel: 'Pickup', pickupAddress: 'Star Valley Restaurant G. P. O., Asafoatse Nettey Road, Accra...', dropoffLabel: 'Drop-off', dropoffAddress: 'Asafoatse Nettey Road, Road no 2 / A, Flat 39, 5th floor', driverName: 'John Doe', driverPhone: '+880 12345 6789', driverAvatar: avatar('ronald-richards'), estimatedLabel: 'Cancelled', estimatedValue: '', items: [{ id: 'line-9', name: 'Beef onion pizza', image: '/menu/beef-onion-pizza.png', quantity: 1, price: 80 }], subtotal: 165, deliveryFee: 2.4, feesTax: 1, couponStatus: 'Not Applied', rewardStatus: 'Not Used', timeline: [{ label: 'Pending', time: '10:34 AM', state: 'done' }, { label: 'Accepted', time: '10:40 AM', state: 'done' }, { label: 'Pick Up', time: '00:00', state: 'upcoming' }, { label: 'Dropoff', time: '00:00', state: 'upcoming' }, { label: 'Complete', time: '00:00', state: 'upcoming' }], map: { pickupLat: 41.3111, pickupLng: 69.2797, dropoffLat: 41.2995, dropoffLng: 69.2401 } },
  { id: 'delivery-12014', riderId: 'chelsie-johnson', orderId: '12014', vendor: 'Damm', restaurant: 'Sun Vally Restaurant', date: 'Nov 28, 2021', status: 'Dropoff', paid: true, customerName: 'Chelsie Johnson', customerAvatar: avatar('chelsie-johnson'), customerEmail: 'chelsiejohnson@bindirigu.com', customerPhone: '+88 01600-009770', customerAddress: 'Asafoatse Nettey Road, Accra...', pickupLabel: 'Pickup', pickupAddress: 'Star Valley Restaurant G. P. O., Asafoatse Nettey Road, Accra...', dropoffLabel: 'Drop-off', dropoffAddress: 'Asafoatse Nettey Road, Road no 2 / A, Flat 39, 5th floor', driverName: 'John Doe', driverPhone: '+880 12345 6789', driverAvatar: avatar('ronald-richards'), estimatedLabel: 'Dropoff', estimatedValue: '', items: [{ id: 'line-10', name: 'Beef onion pizza', image: '/menu/beef-onion-pizza.png', quantity: 2, price: 80 }, { id: 'line-11', name: 'Cheese pizza', image: '/menu/cheese-pizza.png', quantity: 1, price: 30 }], subtotal: 165, deliveryFee: 2.4, feesTax: 1, couponStatus: 'Not Applied', rewardStatus: 'Not Used', timeline: [{ label: 'Pending', time: '10:34 AM', state: 'done' }, { label: 'Accepted', time: '10:40 AM', state: 'done' }, { label: 'Pick Up', time: '11:00 AM', state: 'done' }, { label: 'Dropoff', time: '11:36 AM', state: 'current' }, { label: 'Complete', time: '00:00', state: 'upcoming' }], map: { pickupLat: 41.3111, pickupLng: 69.2797, dropoffLat: 41.2995, dropoffLng: 69.2401 } },
]

const attendanceSeed = (): RiderAttendanceRecord[] => [
  { id: 'attendance-1', riderId: 'dianne-russell', riderName: 'Dianne Russell', image: avatar('dianne-russell'), shift: '10:00 AM - 3:00 PM', area: 'Asafoatse Nettey Road, Accra', timer: '00:00:00', running: true },
  { id: 'attendance-2', riderId: 'jenny-wilson', riderName: 'Leslie Alexander', image: avatar('jenny-wilson'), shift: '10:00 AM - 3:00 PM', area: 'Bantuma Road, Elmina', timer: '03:50:12', running: false },
  { id: 'attendance-3', riderId: 'ralph-edwards', riderName: 'Ralph Edwards', image: avatar('ralph-edwards'), shift: '10:00 AM - 3:00 PM', area: 'Cantomments Road, Osu', timer: '00:00:00', running: true },
  { id: 'attendance-4', riderId: 'brooklyn-simmons', riderName: 'Jane Cooper', image: avatar('brooklyn-simmons'), shift: '10:00 AM - 3:00 PM', area: 'Asafoatse Nettey Road, Accra', timer: '00:00:00', running: true },
  { id: 'attendance-5', riderId: 'esther-howard', riderName: 'Leslie Alexander', image: avatar('esther-howard'), shift: '10:00 AM - 3:00 PM', area: 'Major Kobbina Drive, Kumasi', timer: '00:00:00', running: true },
  { id: 'attendance-6', riderId: 'devon-lane', riderName: 'Jane Cooper', image: avatar('devon-lane'), shift: '10:00 AM - 3:00 PM', area: 'Rain Tree Street, Kumasi', timer: '00:00:00', running: true },
]

export const useRiders = () => {
  const riders = useState<RiderItem[]>('riders', riderSeed)
  const riderDeliveries = useState<RiderDeliveryRecord[]>('rider-deliveries', deliverySeed)
  const riderAttendance = useState<RiderAttendanceRecord[]>('rider-attendance', attendanceSeed)

  const getRiderById = (id: string) => riders.value.find(item => item.id === id)
  const getDeliveriesByRider = (riderId: string) => riderDeliveries.value.filter(item => item.riderId === riderId)
  const getRiderDeliveryById = (id: string) => riderDeliveries.value.find(item => item.id === id || item.orderId === id)

  const addRider = (rider: RiderItem) => {
    riders.value = [rider, ...riders.value]
  }

  const updateRider = (id: string, patch: Partial<RiderItem>) => {
    riders.value = riders.value.map(item => item.id === id ? { ...item, ...patch } : item)
  }

  const updateAttendance = (id: string, patch: Partial<RiderAttendanceRecord>) => {
    riderAttendance.value = riderAttendance.value.map(item => item.id === id ? { ...item, ...patch } : item)
  }

  return {
    riders,
    riderDeliveries,
    riderAttendance,
    getRiderById,
    getDeliveriesByRider,
    getRiderDeliveryById,
    addRider,
    updateRider,
    updateAttendance,
  }
}
