export interface SaleRecord {
  id: string
  name: string
  image: string
  category: string
  price: string
  salesCount: number
  period: 'This Week' | 'This Month' | 'This Year'
}

export interface WalletRecord {
  id: string
  type: 'Earning' | 'Withdraw'
  orderId: string
  date: string
  amount: number
  balance: number
}

const salesSeed = (): SaleRecord[] => [
  { id: 'sale-1', name: 'Beef onion pizza', image: '/menu/beef-onion-pizza.svg', category: 'Pizza', price: 'GHC 24.00', salesCount: 70, period: 'This Week' },
  { id: 'sale-2', name: 'Cheese Pizza', image: '/menu/cheese-pizza.svg', category: 'Pizza', price: 'GHC 24.00', salesCount: 89, period: 'This Week' },
  { id: 'sale-3', name: 'Chicken burger', image: '/menu/chicken-burger.svg', category: 'Burger', price: 'GHC 24.00', salesCount: 69, period: 'This Month' },
  { id: 'sale-4', name: 'Beef burger', image: '/menu/beef-burger.svg', category: 'Burger', price: 'GHC 24.00', salesCount: 40, period: 'This Month' },
  { id: 'sale-5', name: 'Beef special pizza', image: '/menu/beef-special-pizza.svg', category: 'Pizza', price: 'GHC 24.00', salesCount: 90, period: 'This Year' },
  { id: 'sale-6', name: 'Cheese Pizza', image: '/menu/cheese-pizza.svg', category: 'Appetizer', price: 'GHC 24.00', salesCount: 70, period: 'This Year' },
]

const walletSeed = (): WalletRecord[] => [
  { id: 'wallet-1', type: 'Earning', orderId: '#10234', date: '2 Feb 2022', amount: 240, balance: 700 },
  { id: 'wallet-2', type: 'Withdraw', orderId: '#10234', date: '2 Feb 2022', amount: -200, balance: 500 },
  { id: 'wallet-3', type: 'Earning', orderId: '#10234', date: '2 Feb 2022', amount: 120, balance: 620 },
  { id: 'wallet-4', type: 'Earning', orderId: '#10234', date: '2 Feb 2022', amount: 200, balance: 820 },
  { id: 'wallet-5', type: 'Earning', orderId: '#10234', date: '2 Feb 2022', amount: 450, balance: 1270 },
  { id: 'wallet-6', type: 'Withdraw', orderId: '#10234', date: '2 Feb 2022', amount: -200, balance: 1070 },
]

export const useFinance = () => {
  const sales = useState<SaleRecord[]>('finance-sales', salesSeed)
  const wallet = useState<WalletRecord[]>('finance-wallet', walletSeed)

  return {
    sales,
    wallet,
  }
}
