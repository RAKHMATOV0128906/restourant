export type MenuStatus = 'Active' | 'Deactive'

export interface FoodItem {
  id: string
  name: string
  image: string
  category: string
  price: string
  status: MenuStatus
  description?: string
}

export interface CategoryItem {
  id: string
  name: string
  items: number
}

export interface ExtraItem {
  id: string
  name: string
  image: string
  price: string
  status: MenuStatus
}

const foodsSeed = (): FoodItem[] => [
  {
    id: 'food-1',
    name: 'Beef onion pizza',
    image: '/menu/beef-onion-pizza.png',
    category: 'Pizza',
    price: 'GHC 24.00',
    status: 'Active',
    description: 'Black olives, onion, mushroom, tomato, jalapeno, extra cheese base',
  },
  {
    id: 'food-2',
    name: 'Cheese Pizza',
    image: '/menu/cheese-pizza.png',
    category: 'Pizza',
    price: 'GHC 24.00',
    status: 'Deactive',
    description: 'Mozzarella cheese, tomato sauce and herbs',
  },
  {
    id: 'food-3',
    name: 'Chicken burger',
    image: '/menu/chicken-burger.png',
    category: 'Burger',
    price: 'GHC 24.00',
    status: 'Active',
    description: 'Fried chicken, lettuce, sauce and soft bun',
  },
  {
    id: 'food-4',
    name: 'Beef burger',
    image: '/menu/beef-burger.png',
    category: 'Burger',
    price: 'GHC 24.00',
    status: 'Deactive',
    description: 'Beef patty, lettuce, tomato and onion',
  },
  {
    id: 'food-5',
    name: 'Beef special pizza',
    image: '/menu/beef-onion-pizza.png',
    category: 'Pizza',
    price: 'GHC 24.00',
    status: 'Active',
    description: 'Spicy beef, peppers and tomato sauce',
  },
  {
    id: 'food-6',
    name: 'Cheese Pizza',
    image: '/menu/cheese-pizza.png',
    category: 'Appetizer',
    price: 'GHC 24.00',
    status: 'Deactive',
    description: 'Cheese slices and sauce starter',
  },
]

const categoriesSeed = (): CategoryItem[] => [
  { id: 'cat-1', name: 'Smirnoff Ice', items: 3 },
  { id: 'cat-2', name: 'Rosewood Origin', items: 2 },
  { id: 'cat-3', name: 'Jack Daniels', items: 2 },
  { id: 'cat-4', name: 'Belvedere', items: 5 },
  { id: 'cat-5', name: 'Gulder', items: 5 },
  { id: 'cat-6', name: 'Heineken', items: 6 },
]

const extrasSeed = (): ExtraItem[] => [
  { id: 'extra-1', name: 'Pepsi, 0.5 L', image: '/menu/pepsi.png', price: 'GHC 24.00', status: 'Active' },
  { id: 'extra-2', name: 'Bottle water', image: '/menu/water.png', price: 'GHC 24.00', status: 'Deactive' },
  { id: 'extra-3', name: 'Fries', image: '/menu/fries.png', price: 'GHC 24.00', status: 'Active' },
  { id: 'extra-4', name: 'Pepsi, 0.5 L', image: '/menu/pepsi.png', price: 'GHC 24.00', status: 'Deactive' },
  { id: 'extra-5', name: 'Bottle water', image: '/menu/water.png', price: 'GHC 24.00', status: 'Active' },
  { id: 'extra-6', name: 'Fries', image: '/menu/fries.png', price: 'GHC 24.00', status: 'Deactive' },
]

export const useMenu = () => {
  const foods = useState<FoodItem[]>('menu-foods', foodsSeed)
  const categories = useState<CategoryItem[]>('menu-categories', categoriesSeed)
  const extras = useState<ExtraItem[]>('menu-extras', extrasSeed)

  const getFoodById = (id: string) =>
    foods.value.find(item => item.id === id)

  const getExtraById = (id: string) =>
    extras.value.find(item => item.id === id)

  const addFood = (food: FoodItem) => {
    foods.value = [food, ...foods.value]
  }

  const updateFood = (id: string, update: Partial<FoodItem>) => {
    foods.value = foods.value.map(item =>
      item.id === id ? { ...item, ...update } : item,
    )
  }

  const removeFood = (id: string) => {
    foods.value = foods.value.filter(item => item.id !== id)
  }

  const addExtra = (extra: ExtraItem) => {
    extras.value = [extra, ...extras.value]
  }

  const updateExtra = (id: string, update: Partial<ExtraItem>) => {
    extras.value = extras.value.map(item =>
      item.id === id ? { ...item, ...update } : item,
    )
  }

  const removeExtra = (id: string) => {
    extras.value = extras.value.filter(item => item.id !== id)
  }

  const addCategory = (category: CategoryItem) => {
    categories.value = [category, ...categories.value]
  }

  const updateCategory = (id: string, update: Partial<CategoryItem>) => {
    categories.value = categories.value.map(item =>
      item.id === id ? { ...item, ...update } : item,
    )
  }

  const removeCategory = (id: string) => {
    categories.value = categories.value.filter(item => item.id !== id)
  }

  return {
    foods,
    categories,
    extras,
    getFoodById,
    getExtraById,
    addFood,
    updateFood,
    removeFood,
    addExtra,
    updateExtra,
    removeExtra,
    addCategory,
    updateCategory,
    removeCategory,
  }
}
