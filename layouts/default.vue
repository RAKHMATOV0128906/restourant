<script setup lang="ts">
const route = useRoute()
const { userName } = useAuth()

type NavItem = {
  title: string
  to?: string
  icon: string
  children?: { title: string, to: string }[]
}

const iconPaths: Record<string, string[]> = {
  overview: ['M6 12a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z', 'M12 9v3l2 2'],
  list: ['M7 8h10', 'M7 12h10', 'M7 16h10'],
  food: ['m5 18 4-12 3 6 3-6 4 12', 'M9 13h6'],
  order: ['M7 3h7l5 5v13H7Z', 'M14 3v5h5', 'M10 13h4', 'M10 17h4'],
  sales: ['M6 18V9', 'M12 18V5', 'M18 18v-7'],
  wallet: ['M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z', 'M15 12h5'],
  reviews: ['M6 8h12', 'M6 12h12', 'M6 16h12'],
  ads: ['M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11Z', 'm8 15 3-3 2 2 3-4 2 5'],
  customer: ['M7 18a5 5 0 1 1 10 0', 'M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  restaurant: ['M5 5h14', 'M7 5v14', 'M17 5v14', 'M5 19h14'],
  rider: ['M5 16h11', 'M16 10h3l2 3v3h-2', 'M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  employee: ['M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M19 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  dashboard: ['M4 12 12 4l8 8', 'M7 12v7h10v-7'],
  mail: ['M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z', 'm5 7 7 5 7-5'],
  bell: ['M12 4a4 4 0 0 1 4 4v2.4c0 .54.17 1.07.47 1.52L18 14v1H6v-1l1.53-2.08c.3-.45.47-.98.47-1.52V8a4 4 0 0 1 4-4Z', 'M10 18a2 2 0 0 0 4 0'],
  back: ['m15 18-6-6 6-6'],
}

const customerNav: NavItem[] = [
  { title: 'Dashboard', to: '/restaurants', icon: 'dashboard' },
  { title: 'Overview', to: '/customers/chelsie-johnson', icon: 'overview' },
  { title: 'Customer List', to: '/customers', icon: 'list' },
  {
    title: 'Food Menu',
    icon: 'food',
    children: [
      { title: 'Food List', to: '/menu/food-list' },
      { title: 'Category', to: '/menu/category' },
      { title: 'Extra', to: '/menu/extra' },
    ],
  },
  {
    title: 'Order',
    icon: 'order',
    children: [
      { title: 'Damm Order List', to: '/orders' },
      { title: 'Order History', to: '/orders/history' },
      { title: 'Extra', to: '/orders/extra' },
    ],
  },
  { title: 'Sales', to: '/sales', icon: 'sales' },
  { title: 'Wallet', to: '/wallet', icon: 'wallet' },
  { title: 'Reviews And Rating', to: '/reviews', icon: 'reviews' },
  { title: 'Advertisement', to: '/advertisement', icon: 'ads' },
]

const managementNav: NavItem[] = [
  { title: 'Dashboard', to: '/restaurants', icon: 'dashboard' },
  { title: 'Customer Management', to: '/customers', icon: 'customer' },
  {
    title: 'Restaurant Manage..',
    icon: 'restaurant',
    children: [
      { title: 'Restaurant List', to: '/restaurants' },
      { title: 'New Restaurant Request', to: '/restaurants/add' },
    ],
  },
  {
    title: 'Rider Management',
    icon: 'rider',
    children: [
      { title: 'Rider List', to: '/restaurants/riders' },
      { title: 'Rider Attendance', to: '/restaurants/riders/shift' },
    ],
  },
  {
    title: 'Order Management',
    icon: 'order',
    children: [
      { title: 'Damm Order List', to: '/orders' },
      { title: 'Order History', to: '/orders/history' },
      { title: 'Extra', to: '/orders/extra' },
    ],
  },
  { title: 'Advertisement', to: '/restaurants/advertisement', icon: 'ads' },
  { title: 'Employee Management', to: '/restaurants', icon: 'employee' },
]

const shellMode = computed(() =>
  route.path.startsWith('/restaurants') ? 'management' : 'customer',
)

const sidebarSections = computed(() =>
  shellMode.value === 'management' ? managementNav : customerNav,
)

const brandTitle = computed(() =>
  shellMode.value === 'management' ? 'BistroPulse' : 'Kalavuna Restaurant',
)

const brandLogo = computed(() =>
  shellMode.value === 'management'
    ? '/branding/bistropulse-logo.svg'
    : '/branding/kalavuna-logo.svg',
)

const topAvatarSrc = computed(() => '/avatars/chelsie-johnson.png')

const topAvatarLabel = computed(() =>
  (userName.value || 'CJ')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
)

const messageOpen = ref(false)
const notificationOpen = ref(false)
const notificationTabs = ['All', 'Customer', 'Rider', 'Help & Support'] as const
const notificationTab = ref<'All' | 'Customer' | 'Rider' | 'Help & Support'>('All')

const messageItems = [
  {
    id: 'msg-1',
    title: 'New restaurant request',
    body: 'Star Valley Restaurant sent updated business files.',
    time: '2 min ago',
  },
  {
    id: 'msg-2',
    title: 'Customer support',
    body: 'A customer asked about order delivery details.',
    time: '18 min ago',
  },
]

const notificationItems = [
  {
    id: 'not-1',
    title: 'Orion created an account',
    body: '1 hour ago',
    time: '1 hour ago',
    group: 'Customer',
    avatar: '/avatars/ronald-richards.svg',
    tone: 'customer',
  },
  {
    id: 'not-2',
    title: 'Orion created an account',
    body: '1 hour ago',
    time: '1 hour ago',
    group: 'Customer',
    avatar: '/avatars/devon-lane.svg',
    tone: 'rider',
  },
  {
    id: 'not-3',
    title: 'Orion created an account',
    body: '1 hour ago',
    time: '1 hour ago',
    group: 'Customer',
    avatar: '/avatars/esther-howard.svg',
    tone: 'customer',
  },
  {
    id: 'not-4',
    title: 'Order has been canceled',
    body: '1 day ago',
    time: '1 day ago',
    group: 'Rider',
    avatar: '',
    tone: 'dark',
  },
  {
    id: 'not-5',
    title: 'Invoice has been Downloaded',
    body: '20th July 2021',
    time: '20th July 2021',
    group: 'Customer',
    avatar: '',
    tone: 'purple',
  },
  {
    id: 'not-6',
    title: 'Jamison ask a question',
    body: '1 hour ago',
    time: '1 hour ago',
    group: 'Help & Support',
    avatar: '',
    tone: 'orange',
  },
]

const filteredNotificationItems = computed(() =>
  notificationTab.value === 'All'
    ? notificationItems
    : notificationItems.filter(item => item.group === notificationTab.value),
)

const closeTopbarMenus = () => {
  messageOpen.value = false
  notificationOpen.value = false
}

const toggleMessages = () => {
  messageOpen.value = !messageOpen.value
  notificationOpen.value = false
}

const toggleNotifications = () => {
  notificationOpen.value = !notificationOpen.value
  messageOpen.value = false
}

const setNotificationTab = (tab: typeof notificationTabs[number]) => {
  notificationTab.value = tab
}

const breadcrumbs = computed(() => {
  if (route.path === '/customers') {
    return ['Customer List']
  }

  if (route.path === '/sales') {
    return ['Sales']
  }

  if (route.path === '/wallet') {
    return ['Wallet']
  }

  if (route.path === '/reviews') {
    return ['Extra list']
  }

  if (route.path === '/advertisement') {
    return ['Restaurant Management', 'Advertisement list']
  }

  if (route.path === '/restaurants/riders') {
    return ['Rider Management', 'Rider List']
  }

  if (route.path === '/restaurants/riders/shift') {
    return ['Rider Management', 'Rider Shift']
  }

  if (route.path === '/restaurants/riders/add') {
    return ['Rider Management', 'Add Rider']
  }

  if (route.path.startsWith('/restaurants/riders/')) {
    const tab = String(route.query.tab || 'overview')
    if (tab === 'deliveries' && route.query.detail) return ['Rider Management', 'Rider List', 'Rider delivery details']
    if (tab === 'deliveries') return ['Rider Management', 'Rider List', 'Rider delivery details']
    if (tab === 'earnings') return ['Rider Management', 'Rider List', 'Earnings']
    if (tab === 'reviews') return ['Rider Management', 'Rider List', 'Review & Rating']
    return ['Rider Management', 'Rider List', 'Overview']
  }

  if (route.path === '/advertisement/add') {
    return ['Restaurant Management', 'Add Advertisement']
  }

  if (route.path === '/orders') {
    return ['Damm Management', 'Damm List']
  }

  if (route.path === '/orders/history') {
    return ['Damm Management', 'Damm List']
  }

  if (route.path === '/orders/extra') {
    return ['Damm Management', 'Damm List']
  }

  if (route.path === '/orders/add') {
    return ['Damm Management', 'Damm List', 'Add Product']
  }

  if (route.path.startsWith('/orders/')) {
    return ['Order', 'Damm Order List', 'Order Details']
  }

  if (route.path === '/menu/food-list') {
    return ['Food Menu', 'Food List']
  }

  if (route.path === '/menu/food-list/add') {
    return ['Restaurant Management', 'Food Menu', 'Add Food']
  }

  if (route.path.startsWith('/menu/food-list/')) {
    return ['Restaurant Management', 'Food Menu', 'Food Details']
  }

  if (route.path === '/menu/category') {
    return ['Restaurant Management', 'Food Menu', 'Food Category']
  }

  if (route.path === '/menu/extra') {
    return ['Restaurant Management', 'Extra list']
  }

  if (route.path === '/menu/extra/add') {
    return ['Restaurant Management', 'Add Extra']
  }

  if (route.path === '/customers/add') {
    return ['Customer List', route.query.edit ? 'Customer Profile' : 'Add Customer']
  }

  if (route.path.startsWith('/customers/')) {
    const tab = String(route.query.tab || 'overview')
    if (tab === 'orders') return ['Customer Management', 'Customer List', 'Customer Profile', 'Orders']
    if (tab === 'favorites') return ['Customer Management', 'Customer List', 'Customer Profile', 'Fav Restaurants']
    if (tab === 'reviews') return ['Customer Management', 'Customer List', 'Customer Profile', 'Review & Rating']
    if (tab === 'rewards') return ['Customer Management', 'Customer List', 'Customer Profile', 'Reward Point']
    return ['Customer Management', 'Customer List', 'Customer Profile', 'Overview']
  }

  if (route.path === '/restaurants/add') {
    return ['Restaurant Management', 'Restaurant List', 'Add Restaurant']
  }

  if (route.path === '/restaurants/advertisement') {
    return ['Restaurant Management', 'Advertisement list']
  }

  if (route.path === '/restaurants/advertisement/add') {
    return ['Restaurant Management', 'Add Advertisement']
  }

  if (route.path.startsWith('/restaurants/')) {
    return ['Restaurant Management', 'Food Menu', 'Food Details']
  }

  return ['Restaurant Management', 'Restaurant List']
})

const brandLink = computed(() =>
  shellMode.value === 'management' ? '/restaurants' : '/customers',
)

const isSectionActive = (item: NavItem) => {
  if (item.to) {
    if (item.to === '/customers') {
      return route.path === '/customers'
    }

    if (item.to === '/restaurants') {
      return route.path === '/restaurants' || route.path.startsWith('/restaurants/advertisement')
    }

    if (item.to.includes('/customers/') && item.to.includes('?tab=')) {
      const [path, queryString] = item.to.split('?')
      const params = new URLSearchParams(queryString)
      return route.path === path && String(route.query.tab || '') === (params.get('tab') || '')
    }

    return route.path === item.to
  }

  return item.children?.some(child => route.fullPath.startsWith(child.to)) || false
}

const isChildActive = (to: string) => route.fullPath.startsWith(to)
</script>

<template>
  <div class="app-shell" @click="closeTopbarMenus">
    <aside class="sidebar" :class="{ 'sidebar--management': shellMode === 'management' }">
      <NuxtLink class="brand-block brand-block--sidebar" :to="brandLink">
        <div class="brand-back">
          <svg viewBox="0 0 24 24" fill="none">
            <path :d="iconPaths.back[0]" />
          </svg>
        </div>
        <div
          v-if="shellMode === 'management'"
          class="brand-logo brand-logo--full"
        >

          <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2351 0.0785633C17.9003 0.228454 17.7694 0.453068 17.7694 0.878421C17.7694 1.77821 19.0564 1.93495 19.3388 1.06943C19.5648 0.377019 18.9008 -0.219228 18.2351 0.0785633ZM20.1302 0.710624C20.2034 1.82463 21.3482 2.10054 21.3558 1.00598C21.3569 0.839512 21.3921 0.5541 21.4338 0.371711C21.5064 0.0560126 21.4996 0.040095 21.29 0.040095C21.108 0.040095 21.0881 0.0622033 21.1748 0.168099C21.4043 0.447541 21.1768 1.39044 20.8553 1.49191C20.4259 1.62743 20.1859 1.03185 20.3859 0.326834C20.46 0.0659621 20.4499 0.040095 20.2766 0.040095C20.0937 0.040095 20.0878 0.0668465 20.1302 0.710624ZM18.9161 0.295883C19.1843 0.515634 19.2066 1.14305 18.9526 1.33097C18.5109 1.65772 18.0316 1.37275 18.0316 0.783137C18.0316 0.195734 18.4873 -0.0551883 18.9161 0.295883ZM22.2499 0.719468C22.2372 1.06391 22.173 1.39398 22.0949 1.51446C21.9662 1.71299 21.9702 1.72029 22.2062 1.72029C22.4392 1.72029 22.4494 1.70304 22.4177 1.36656C22.3745 0.90893 22.5209 0.907603 22.7508 1.36369C22.9038 1.667 23.1475 1.89715 23.3153 1.89715C23.3429 1.89715 23.2443 1.72802 23.0963 1.52154C22.8291 1.14814 22.8286 1.14526 23.0085 1.02433C23.4316 0.740248 23.2043 0.297652 22.5775 0.185344L22.2715 0.130517L22.2499 0.719468ZM16.8292 0.275764C16.7686 0.300304 16.7387 0.352258 16.7625 0.391167C16.7861 0.430077 16.7605 0.592789 16.7055 0.752628L16.6054 1.04312L16.4058 0.789991C16.2961 0.650713 16.226 0.50458 16.2498 0.465228C16.2994 0.384093 16.0968 0.369943 15.9121 0.441572C15.8238 0.475839 15.8988 0.600749 16.177 0.88196C16.5166 1.22574 16.5606 1.3135 16.5291 1.58587C16.4956 1.87637 16.5094 1.89715 16.7378 1.89715C16.8724 1.89715 16.9826 1.85735 16.9826 1.80872C16.9826 1.76008 16.9463 1.72029 16.9022 1.72029C16.6174 1.72029 16.8112 0.598538 17.143 0.327496C17.2883 0.208778 17.0781 0.174068 16.8292 0.275764ZM22.8695 0.436487C23.0574 0.626614 22.953 0.924405 22.6984 0.924405C22.4851 0.924405 22.428 0.748649 22.5432 0.44533C22.6094 0.270679 22.703 0.268026 22.8695 0.436487ZM25.0749 0.75705C25.1553 0.888813 24.8542 1.91439 24.6964 2.04593C24.5637 2.15647 25.2655 2.42773 25.684 2.42773C26.2398 2.42773 26.5667 1.50186 26.1497 1.10878C25.8685 0.843933 24.9427 0.540837 25.0749 0.75705ZM13.8136 0.995373C13.4724 1.11984 13.2235 1.26221 13.2235 1.33274C13.2235 1.4687 13.3673 1.50053 13.413 1.37474C13.4289 1.33053 13.5164 1.28078 13.6071 1.2642C13.823 1.22463 14.2328 2.34063 14.0671 2.51727C13.9891 2.60039 14.0155 2.61012 14.1851 2.56038C14.4327 2.48765 14.6255 2.3393 14.4721 2.3393C14.4183 2.3393 14.2876 2.076 14.1816 1.75411C13.9777 1.13399 14.0265 0.961548 14.3818 1.04755C14.5302 1.08358 14.6054 0.88218 14.4692 0.813204C14.4332 0.795075 14.1381 0.876875 13.8136 0.995373ZM26.016 1.21225C26.3687 1.63473 25.9867 2.29774 25.4338 2.22279C24.9698 2.15979 24.9538 2.03333 25.2952 1.12514C25.3953 0.858525 25.7572 0.902298 26.016 1.21225ZM12.1585 2.41977C12.1432 2.91079 12.1504 3.30961 12.1744 3.30607C12.3095 3.28618 12.5504 3.14668 12.4586 3.14137C12.235 3.12877 12.3405 2.70209 12.6008 2.56591C12.8526 2.43437 13.2491 2.63776 13.0779 2.81064C12.9621 2.92803 13.2814 2.86679 13.4473 2.74012C13.6077 2.6172 13.6081 2.61012 13.4563 2.60747C13.368 2.60592 13.0462 2.36207 12.7411 2.06583L12.1865 1.52706L12.1585 2.41977ZM27.1275 1.87946C26.7636 2.24755 26.7595 2.69236 27.1166 3.0536C27.8592 3.80483 28.9841 2.77217 28.2817 1.98381C27.9156 1.57305 27.4702 1.53281 27.1275 1.87946ZM28.085 1.98558C28.4463 2.35102 28.1578 3.13673 27.6634 3.13386C27.0576 3.13032 26.8631 2.38241 27.3642 1.98359C27.6438 1.76118 27.8638 1.76185 28.085 1.98558ZM12.699 2.34262C12.699 2.37821 12.6203 2.42795 12.5241 2.45338C12.3775 2.49207 12.3493 2.45603 12.3493 2.22898C12.3493 1.96369 12.353 1.96148 12.5241 2.11822C12.6203 2.20621 12.699 2.30725 12.699 2.34262ZM17.5071 2.56878C5.85153 4.28213 -0.725791 17.0472 4.55857 27.6984C7.08372 32.7879 11.6945 36.1516 17.4853 37.1287C18.3564 37.2758 17.4833 36.5281 16.5702 36.3452C6.13892 34.2549 0.296594 22.3866 4.90432 12.6475C10.188 1.4802 25.243 -0.365582 32.8553 9.22056C40.6286 19.0094 35.8298 33.1323 23.6563 36.2933C23.2329 36.4032 22.762 37.0043 23.099 37.0043C23.4056 37.0043 25.2762 36.4808 26.0507 36.1781C37.3053 31.7813 40.8301 17.5954 32.9539 8.39683C29.155 3.96024 23.2353 1.7267 17.5071 2.56878ZM29.287 2.78853C28.8705 3.03393 28.7748 3.62398 29.0901 4.00313C29.6221 4.64249 30.5328 4.28854 30.5328 3.44226C30.5328 2.91543 29.76 2.50998 29.287 2.78853ZM9.28541 3.17719C9.02337 3.34609 8.85836 3.48537 8.91912 3.4867C9.04107 3.48913 9.66831 4.43224 9.66831 4.61309C9.66831 4.76298 9.73104 4.75679 9.99133 4.58081C10.7571 4.06282 10.8981 3.599 10.4328 3.12833C10.1006 2.79251 9.86698 2.80246 9.28541 3.17719ZM30.0913 2.95589C30.5699 3.21521 30.2052 4.19635 29.6304 4.19635C29.3699 4.19635 29.1063 3.88198 29.1148 3.58132C29.1299 3.04741 29.6477 2.7158 30.0913 2.95589ZM10.258 3.30519C10.5451 3.59569 10.5764 3.80063 10.3777 4.08758C10.0632 4.54168 9.92948 4.51338 9.55423 3.91315L9.20739 3.35803L9.48888 3.20615C9.87637 2.99701 9.96445 3.00828 10.258 3.30519ZM31.1659 3.8906C30.9915 4.01419 30.9786 4.07719 31.0287 4.5618C31.0831 5.0884 31.0807 5.09614 30.874 5.06651C30.7092 5.04286 30.6646 4.98405 30.6674 4.79326C30.6714 4.51227 30.5772 4.47779 30.4521 4.71434C30.262 5.07337 30.9686 5.44633 31.2315 5.12554C31.306 5.03468 31.3215 4.84411 31.2807 4.51493C31.242 4.20033 31.2547 4.01573 31.3183 3.97616C31.4584 3.88839 31.6863 4.1119 31.6249 4.27683C31.5829 4.38913 31.6041 4.38493 31.73 4.25693C32.0141 3.96798 31.5145 3.64366 31.1659 3.8906ZM7.78374 4.33431C7.27801 4.61176 7.20261 5.27941 7.63534 5.64751C8.44289 6.33506 9.43162 5.21088 8.68439 4.45479C8.40268 4.17005 8.14566 4.13556 7.78374 4.33431ZM8.50955 4.63166C8.82798 4.95377 8.85464 5.36077 8.57075 5.56195C7.95246 6.00013 7.18294 5.08929 7.71599 4.55008C7.95968 4.30358 8.21057 4.32922 8.50955 4.63166ZM32.3396 4.52068C32.2541 4.60712 32.2683 4.74551 32.357 4.69002C32.3986 4.66393 32.4976 4.715 32.5767 4.80365C32.7343 4.97985 32.2052 5.724 31.8198 5.86836C31.661 5.92783 31.6647 5.94154 31.8782 6.08303C32.0246 6.18008 32.1064 6.19733 32.1064 6.13123C32.1064 5.82658 32.912 5.0705 33.0763 5.22083C33.1657 5.30263 33.2177 5.4041 33.1919 5.44611C33.1661 5.48833 33.1845 5.52282 33.2326 5.52282C33.4555 5.52282 33.3974 5.32274 33.0977 5.05988C32.9168 4.90093 32.6984 4.70152 32.6123 4.6164C32.4373 4.44308 32.4215 4.43755 32.3396 4.52068ZM5.88693 5.97183C5.34383 6.52121 5.71559 7.37987 6.49647 7.37987C6.74037 7.37987 7.27889 6.83425 7.27889 6.58709C7.27889 5.81486 6.41823 5.43439 5.88693 5.97183ZM20.0003 5.90197C19.6382 6.10934 19.2595 6.66513 19.257 6.99299C19.2557 7.16565 19.197 7.18444 18.5343 7.22534C14.5256 7.47228 10.0764 12.286 10.0764 16.376V17.1957H20.3483H30.6202V16.376C30.6202 12.5692 27.0886 8.40766 22.9407 7.32681C22.3611 7.17582 22.3303 7.15459 22.2855 6.87537C22.131 5.91192 20.8988 5.38708 20.0003 5.90197ZM33.7674 5.88406C33.7674 6.01781 33.0206 6.80109 32.8361 6.86078C32.7778 6.87979 32.8577 7.0361 33.0269 7.23285C33.2509 7.49373 33.3604 7.55894 33.4992 7.51451C33.7202 7.44354 33.7424 7.29144 33.5235 7.34936C33.212 7.43182 32.9887 7.03963 33.233 6.83956C33.4564 6.65673 33.6799 6.73875 33.6799 7.0036C33.6799 7.11148 33.7044 7.11568 33.8111 7.02615C33.9503 6.9092 33.9957 6.71686 33.8646 6.79888C33.6458 6.93573 33.5711 6.57427 33.7733 6.3565L33.9796 6.13432L34.1288 6.33462C34.211 6.44471 34.2593 6.56586 34.2362 6.60367C34.1671 6.71686 34.2633 6.68127 34.3664 6.55547C34.4398 6.46594 34.3813 6.35871 34.1149 6.09541C33.9005 5.88362 33.7674 5.8027 33.7674 5.88406ZM6.78999 6.07551C7.1318 6.38458 7.16699 6.70536 6.88943 6.98591C6.61209 7.26668 6.29496 7.23109 5.98943 6.88532C5.45267 6.27758 6.18919 5.53255 6.78999 6.07551ZM21.1939 6.81878C21.5027 7.10153 21.3947 7.20301 20.7854 7.20301C20.1833 7.20301 20.0983 7.12873 20.3618 6.83403C20.5421 6.63263 20.9816 6.62445 21.1939 6.81878ZM34.9038 7.14796C34.9038 7.28171 34.0312 7.99889 33.8686 7.99889C33.7158 7.99889 33.7468 8.12955 33.9422 8.3084C34.0836 8.43795 34.117 8.44347 34.117 8.33758C34.117 8.26551 34.2154 8.11318 34.3356 7.99889C34.5128 7.83043 34.5541 7.81849 34.5541 7.9361C34.5541 8.13154 34.8717 8.29159 35.1292 8.22616C35.4609 8.14192 35.4933 7.79373 35.2081 7.37722C34.9464 6.99542 34.9038 6.96336 34.9038 7.14796ZM4.49148 7.60007C4.33652 7.81849 4.26484 7.97568 4.33215 7.94937C4.47989 7.89211 5.46753 8.68312 5.39563 8.80074C5.36787 8.84606 5.37749 8.8832 5.41682 8.8832C5.50774 8.8832 5.72979 8.53014 5.6404 8.52749C5.29356 8.51732 5.0761 7.91046 5.41945 7.91046C5.5272 7.91046 5.53156 7.8857 5.44305 7.77781C5.32897 7.63875 5.13686 7.59012 5.21663 7.72055C5.36831 7.96904 5.03436 8.10368 4.79133 7.89211L4.54459 7.67744L4.77231 7.49616C4.9736 7.33588 5.00048 7.20301 4.83132 7.20301C4.79942 7.20301 4.64643 7.38164 4.49148 7.60007ZM35.2004 7.60824C35.3265 7.94074 35.045 8.16713 34.7642 7.95932C34.604 7.84082 34.604 7.83374 34.7655 7.65312C34.9626 7.43293 35.1274 7.41591 35.2004 7.60824ZM2.92337 9.25903C-4.09892 21.0834 2.11189 36.1993 15.3408 39.4806C16.6032 39.7936 18.3914 40.0299 19.2245 39.9939L19.8489 39.9667L19.1989 39.0663L18.5487 38.1656L18.0498 38.1079C4.95874 36.592 -2.40318 21.761 4.33609 10.4809C4.61015 10.0224 4.80423 9.62071 4.76707 9.58844C4.43684 9.30059 3.44593 8.52948 3.4068 8.52948C3.37927 8.52948 3.16181 8.85777 2.92337 9.25903ZM36.0147 9.29131C35.283 9.76353 35.252 9.79625 35.3665 9.97643C42.2494 20.7991 35.9878 35.3519 23.365 37.8702L22.0987 38.1229L21.4271 39.0448L20.7557 39.9667L21.0715 39.9952C21.572 40.0403 23.5369 39.7582 24.6564 39.4806C37.8186 36.2159 44.0592 21.1939 37.1562 9.39168C36.9643 9.06338 36.8017 8.79499 36.7952 8.79521C36.7886 8.79543 36.4374 9.01872 36.0147 9.29131ZM15.1467 9.53759C15.1467 9.55704 15.0049 9.78586 14.8314 10.0461C13.7727 11.6343 13.138 13.7741 13.1365 15.7587L13.1361 16.4883H12.0416H10.9473L10.9999 16.2451C11.4346 14.243 11.9911 12.9424 12.984 11.6086C13.6366 10.7321 15.1467 9.28578 15.1467 9.53759ZM9.11472 18.4377C9.11472 18.6997 9.1722 18.8536 9.32934 19.0125L9.54396 19.2296H20.3046H31.0652L31.2798 19.0125C31.4369 18.8536 31.4944 18.6997 31.4944 18.4377V18.08H20.3046H9.11472V18.4377ZM9.37698 19.9963C9.37698 20.3487 9.87725 22.0218 10.3111 23.1206C11.8486 27.014 14.8205 31.9677 19.7401 38.837C20.3529 39.6928 20.2727 39.6656 20.6516 39.1452C26.6609 30.8955 30.6827 23.6885 31.1911 20.2603L31.252 19.8486H28.4122H25.5725L25.4593 20.2687C24.0462 25.5151 16.6829 25.5785 15.192 20.3571L15.0469 19.8486H12.212C9.62285 19.8486 9.37698 19.8615 9.37698 19.9963Z" fill="#2F80ED"/>
          </svg>

        </div>
        <img
          v-else
          class="brand-logo brand-logo--image"
          :src="brandLogo"
          :alt="brandTitle"
        >
        <div class="brand-copy">
          <strong>{{ brandTitle }}</strong>
        </div>
      </NuxtLink>

      <nav class="sidebar-nav">
        <div
          v-for="section in sidebarSections"
          :key="section.title"
          class="sidebar-group"
        >
          <NuxtLink
            v-if="section.to"
            :to="section.to"
            class="sidebar-link"
            :class="{ 'sidebar-link--active': isSectionActive(section) }"
          >
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  v-for="path in iconPaths[section.icon]"
                  :key="path"
                  :d="path"
                />
              </svg>
            </span>
            <span>{{ section.title }}</span>
          </NuxtLink>

          <div
            v-else
            class="sidebar-link sidebar-link--parent"
            :class="{ 'sidebar-link--active': isSectionActive(section) }"
          >
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  v-for="path in iconPaths[section.icon]"
                  :key="path"
                  :d="path"
                />
              </svg>
            </span>
            <span>{{ section.title }}</span>
            <span class="sidebar-link__chevron">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m8 10 4 4 4-4" />
              </svg>
            </span>
          </div>

          <div v-if="section.children" class="sidebar-submenu">
            <NuxtLink
              v-for="child in section.children"
              :key="child.title"
              :to="child.to"
              class="sidebar-sublink"
              :class="{ 'sidebar-sublink--active': isChildActive(child.to) }"
            >
              {{ child.title }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </aside>

    <div class="main-panel">
      <header class="topbar">
        <div class="breadcrumb">
          <span class="breadcrumb-bar"></span>
          <template v-for="(item, index) in breadcrumbs" :key="`${item}-${index}`">
            <span>{{ item }}</span>
            <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">&gt;</span>
          </template>
        </div>

        <div class="topbar-actions">
          <div class="popover-anchor">
            <button class="icon-button" type="button" aria-label="Messages" @click.stop="toggleMessages">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  v-for="path in iconPaths.mail"
                  :key="path"
                  :d="path"
                />
              </svg>
              <span class="status-dot status-dot--red"></span>
            </button>

            <div v-if="messageOpen" class="topbar-card" @click.stop>
              <div class="topbar-card__title">Messages</div>
              <div class="topbar-card__list">
                <div v-for="item in messageItems" :key="item.id" class="topbar-card__item">
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.body }}</p>
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="popover-anchor">
            <button class="icon-button" type="button" aria-label="Notifications" @click.stop="toggleNotifications">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  v-for="path in iconPaths.bell"
                  :key="path"
                  :d="path"
                />
              </svg>
              <span class="status-dot status-dot--orange"></span>
            </button>

          </div>

          <div class="top-avatar">
            <img :src="topAvatarSrc" :alt="userName || 'User avatar'">
          </div>
        </div>
      </header>

      <main class="content-area">
        <slot />
      </main>
    </div>

    <div v-if="notificationOpen" class="notification-overlay" @click="closeTopbarMenus">
      <aside class="notification-drawer" @click.stop>
        <div class="notification-drawer__header">
          <h2>Notification</h2>
          <button class="notification-drawer__close" type="button" @click="closeTopbarMenus">x</button>
        </div>
        <div class="notification-drawer__tabs">
          <button
            v-for="tab in notificationTabs"
            :key="tab"
            class="notification-drawer__tab"
            :class="{ 'notification-drawer__tab--active': notificationTab === tab }"
            type="button"
            @click="setNotificationTab(tab)"
          >
            {{ tab }}
          </button>
        </div>
        <div class="notification-drawer__list">
          <div
            v-for="item in filteredNotificationItems"
            :key="item.id"
            class="notification-drawer__item"
          >
            <div class="notification-drawer__icon" :class="`notification-drawer__icon--${item.tone}`">
              <img v-if="item.avatar" :src="item.avatar" :alt="item.title">
              <span v-else>{{ item.tone === 'dark' ? '!' : item.tone === 'purple' ? 'i' : '?' }}</span>
            </div>
            <div class="notification-drawer__copy">
              <strong>{{ item.title }}</strong>
              <span>{{ item.body }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
