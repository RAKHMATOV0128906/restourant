<script setup lang="ts">
const route = useRoute()
const { customers, getCustomerById, updateCustomer } = useCustomers()
const { getOrdersByCustomer, getOrderById, money } = useOrders()
const { restaurants } = useRestaurants()

const customer = computed(() => getCustomerById(String(route.params.id)))
const activeTab = computed(() => String(route.query.tab || 'overview'))
const customerOrders = computed(() => getOrdersByCustomer(String(route.params.id)))

const customerOrderSearch = ref('')
const customerOrderFilterOpen = ref(false)
const customerOrderStatus = ref<'All' | 'Pending' | 'Preparing' | 'Cancelled' | 'Delivered' | 'On the way'>('All')
const customerOrderStatusDraft = ref<'All' | 'Pending' | 'Preparing' | 'Cancelled' | 'Delivered' | 'On the way'>('All')
const customerOrderStatusOptions = ['All', 'Pending', 'Preparing', 'Cancelled', 'Delivered', 'On the way'] as const

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Orders', value: 'orders' },
  { label: 'Fav Restaurants', value: 'favorites' },
  { label: 'Review & Rating', value: 'reviews' },
  { label: 'Reward Point', value: 'rewards' },
]

const favoriteRestaurants = computed(() =>
  restaurants.value.slice(0, 6).map((item, index) => ({
    ...item,
    badge: index % 2 === 0 ? '10% OFF' : '15% OFF',
    duration: '15-20 min',
  })),
)

const reviewEntries = [
  {
    id: 'review-1',
    orderCode: '#B001350',
    restaurant: 'Star Valley Restaurant',
    items: [
      {
        id: 'food-a',
        name: 'Beef onion pizza',
        image: '/menu/beef-onion-pizza.svg',
        comment: 'The Beef onion pizza is one of the best dishes from Star Valley.',
      },
      {
        id: 'food-b',
        name: 'Cheese pizza',
        image: '/menu/cheese-pizza.svg',
        comment: 'No comment',
      },
    ],
    stars: 4,
    note: 'Good',
    time: 'Sat, Nov 28 - 08:30 PM',
    reply: '',
    repliedAt: '',
  },
  {
    id: 'review-2',
    orderCode: '#B001350',
    restaurant: 'Star Valley Restaurant',
    items: [
      {
        id: 'food-c',
        name: 'Beef onion pizza',
        image: '/menu/beef-onion-pizza.svg',
        comment: 'The Beef onion pizza is one of the best dishes from Star Valley.',
      },
    ],
    stars: 4,
    note: 'Good',
    time: 'Sat, Nov 28 - 08:30 PM',
    reply: '',
    repliedAt: '',
  },
  {
    id: 'review-3',
    orderCode: '#B001350',
    restaurant: 'Star Valley Restaurant',
    items: [
      {
        id: 'food-d',
        name: 'Beef onion pizza',
        image: '/menu/beef-onion-pizza.svg',
        comment: 'The Beef onion pizza is one of the best dishes from Star Valley.',
      },
    ],
    stars: 4,
    note: 'Good',
    time: 'Sat, Nov 28 - 08:30 PM',
    reply: '',
    repliedAt: '',
  },
  {
    id: 'review-4',
    orderCode: '#B001465',
    restaurant: 'The Cafe Rio',
    items: [
      {
        id: 'food-e',
        name: 'Beef onion pizza',
        image: '/menu/beef-onion-pizza.svg',
        comment: 'The Beef onion pizza is one of the best dishes from Star Valley.',
      },
    ],
    stars: 5,
    note: 'Good',
    time: 'Sat, Nov 28 - 08:30 PM',
    reply: 'Thank you sir.',
    repliedAt: 'Sat, Nov 28 - 08:30 PM',
  },
]

const rewardEarningRows = [
  { id: 'reward-1', restaurant: 'Star Valley Restaurant', spent: 'Spent GHC 80', points: '120 Points' },
  { id: 'reward-2', restaurant: 'Burger King', spent: 'Spent GHC 80', points: '120 Points' },
  { id: 'reward-3', restaurant: 'The Chef Squad', spent: 'Spent GHC 80', points: '120 Points' },
  { id: 'reward-4', restaurant: 'Habib Restaurant', spent: 'Spent GHC 80', points: '120 Points' },
]

const rewardUseRows = [
  { id: 'use-1', title: 'Get GHC 50 on your mobile wallet', subtitle: '1000 Points' },
  { id: 'use-2', title: 'Get GHC 50 on your mobile wallet', subtitle: '1000 Points' },
  { id: 'use-3', title: 'Get GHC 50 on your mobile wallet', subtitle: '1000 Points' },
  { id: 'use-4', title: 'Get GHC 50 on your mobile wallet', subtitle: '1000 Points' },
  { id: 'use-5', title: 'Get GHC 50 on your mobile wallet', subtitle: '1000 Points' },
]

const selectedOrder = computed(() => {
  const detailId = typeof route.query.detail === 'string' ? route.query.detail : ''
  return detailId ? getOrderById(detailId) : undefined
})

const selectedOrderMapUrl = computed(() => {
  if (!selectedOrder.value) {
    return ''
  }

  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = selectedOrder.value.map
  const minLat = Math.min(pickupLat, dropoffLat) - 0.02
  const maxLat = Math.max(pickupLat, dropoffLat) + 0.02
  const minLng = Math.min(pickupLng, dropoffLng) - 0.02
  const maxLng = Math.max(pickupLng, dropoffLng) + 0.02

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${dropoffLat}%2C${dropoffLng}`
})

if (!customer.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Customer not found',
  })
}

const formatPhone = (phone?: string) => {
  if (!phone) {
    return ''
  }

  if (phone.startsWith('+')) {
    return phone
  }

  return `+${phone}`
}

const setTab = async (tab: string) => {
  await navigateTo({
    path: route.path,
    query: tab === 'overview' ? {} : { tab },
  })
}

const openOrderDetail = async (id: string) => {
  await navigateTo({
    path: route.path,
    query: {
      tab: 'orders',
      detail: id,
    },
  })
}

const closeOrderDetail = async () => {
  await navigateTo({
    path: route.path,
    query: {
      tab: 'orders',
    },
  })
}

const filteredCustomerOrders = computed(() => {
  const query = customerOrderSearch.value.trim().toLowerCase()

  return customerOrders.value.filter((order) => {
    const matchesStatus = customerOrderStatus.value === 'All' || order.status === customerOrderStatus.value
    const matchesQuery = !query || [
      order.tableId,
      order.details,
      order.customerName,
    ].some(value => value.toLowerCase().includes(query))

    return matchesStatus && matchesQuery
  })
})

const toggleCustomerOrderFilter = () => {
  customerOrderStatusDraft.value = customerOrderStatus.value
  customerOrderFilterOpen.value = !customerOrderFilterOpen.value
}

const applyCustomerOrderFilter = () => {
  customerOrderStatus.value = customerOrderStatusDraft.value
  customerOrderFilterOpen.value = false
}

const clearCustomerOrderFilter = () => {
  customerOrderStatusDraft.value = 'All'
  customerOrderStatus.value = 'All'
  customerOrderFilterOpen.value = false
}

const toggleStatus = () => {
  if (!customer.value) {
    return
  }

  updateCustomer(customer.value.id, {
    status: customer.value.status === 'Active' ? 'Disabled' : 'Active',
  })
}

useHead({
  title: computed(() => `${customer.value?.name || 'Customer'} Overview`),
})
</script>

<template>
  <section class="customer-profile-layout">
    <aside class="dashboard-card customer-sidebar-card">
      <div class="section-bar section-bar--stacked">
        <h2 class="section-title">Customer Profile</h2>
      </div>

      <label class="search-box search-box--wide">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m21 21-4.35-4.35" />
          <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
        </svg>
        <input type="text" placeholder="Search">
      </label>

      <div class="customer-stack">
        <NuxtLink
          v-for="item in customers"
          :key="item.id"
          :to="`/customers/${item.id}`"
          class="customer-stack__item"
          :class="{ 'customer-stack__item--active': item.id === customer?.id }"
        >
          <img :src="item.avatar" :alt="item.name" class="customer-stack__avatar">
          <div>
            <strong>{{ item.name }}</strong>
            <span>{{ formatPhone(item.phone) }}</span>
          </div>
        </NuxtLink>
      </div>
    </aside>

    <div class="customer-profile-main">
      <div class="customer-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="customer-tab"
          :class="{ 'customer-tab--active': activeTab === tab.value }"
          type="button"
          @click="setTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'overview'" class="dashboard-card customer-overview-card">
        <div class="customer-overview-top">
          <span class="status-badge">{{ customer?.status }}</span>
          <label class="switch">
            <input type="checkbox" :checked="customer?.status === 'Active'" @change="toggleStatus">
            <span></span>
          </label>
        </div>

        <div class="customer-overview-body">
          <div class="customer-hero">
            <div class="profile-avatar profile-avatar--large">
              <img :src="customer?.avatar" :alt="customer?.name">
            </div>
            <h2>{{ customer?.name }}</h2>
            <p>{{ customer?.email }}</p>
            <NuxtLink class="primary-link primary-link--edit" :to="`/customers/add?edit=${customer?.id}`">
              Edit profile
            </NuxtLink>
          </div>

          <div class="info-list info-list--solid">
            <div class="info-row">
              <span>Phone Number</span>
              <strong>{{ formatPhone(customer?.phone) }}</strong>
            </div>
            <div class="info-row">
              <span>University</span>
              <strong>{{ customer?.university }}</strong>
            </div>
            <div class="info-row">
              <span>Location</span>
              <strong>{{ customer?.location }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'orders' && selectedOrder" class="customer-order-detail">
        <div class="dashboard-card customer-order-topbar">
          <div class="customer-order-topbar__headline">
            <div class="customer-order-title">
              <strong>Order Id #{{ selectedOrder.id }}</strong>
              <span class="status-badge" :class="`status-badge--${selectedOrder.status.toLowerCase().replaceAll(' ', '-')}`">
                {{ selectedOrder.status }}
              </span>
              <div class="order-user-inline">
                <img :src="selectedOrder.deliveryGuy.avatar" :alt="selectedOrder.deliveryGuy.name" class="table-avatar">
                <span>{{ selectedOrder.deliveryGuy.name }}</span>
              </div>
            </div>
            <div class="customer-order-topbar__actions">
              <button class="toolbar-button" type="button" @click="closeOrderDetail">Back to orders</button>
              <button class="toolbar-button" type="button">Payment</button>
              <button class="toolbar-button" type="button">Status</button>
            </div>
          </div>
        </div>

        <div class="customer-order-grid">
          <div class="dashboard-card customer-order-tracking">
            <div class="order-status-panel">
              <h3 class="section-title section-title--small">Order Status</h3>
              <div class="timeline-list">
                <div
                  v-for="step in selectedOrder.timeline"
                  :key="step.label"
                  class="timeline-step"
                  :class="{
                    'timeline-step--done': step.state === 'done',
                    'timeline-step--current': step.state === 'current',
                  }"
                >
                  <span class="timeline-dot"></span>
                  <div>
                    <strong>{{ step.label }}</strong>
                    <span>{{ step.time }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="order-map-panel">
              <div class="order-map-head">
                <h3 class="section-title section-title--small">Order Tracking</h3>
                <span>Estimated delivery time {{ selectedOrder.estimatedDelivery }}</span>
              </div>
              <div class="tracking-map tracking-map--compact">
                <iframe
                  v-if="selectedOrderMapUrl"
                  :src="selectedOrderMapUrl"
                  class="tracking-map__frame"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Customer order tracking map"
                />
              </div>
            </div>
          </div>

          <div class="dashboard-card customer-order-summary">
            <div class="summary-list">
              <div v-for="item in selectedOrder.items" :key="item.id" class="summary-item">
                <div class="summary-item__info">
                  <img :src="item.image" :alt="item.name" class="summary-image">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.quantity }} item{{ item.quantity > 1 ? 's' : '' }}</span>
                  </div>
                </div>
                <strong>{{ money(item.price) }}</strong>
              </div>
            </div>

            <div class="summary-totals">
              <div class="summary-row"><span>Coupon Code</span><strong>{{ selectedOrder.couponStatus }}</strong></div>
              <div class="summary-row"><span>Reward Points</span><strong>{{ selectedOrder.rewardStatus }}</strong></div>
              <div class="summary-row"><span>Subtotal</span><strong>{{ money(selectedOrder.subtotal) }}</strong></div>
              <div class="summary-row"><span>Delivery Fee</span><strong>{{ money(selectedOrder.deliveryFee) }}</strong></div>
              <div class="summary-row"><span>Fees &amp; Estimated Tax</span><strong>{{ money(selectedOrder.feesTax) }}</strong></div>
              <div class="summary-row summary-row--total"><span>Total</span><strong>{{ money(selectedOrder.subtotal + selectedOrder.deliveryFee + selectedOrder.feesTax) }}</strong></div>
            </div>
          </div>

          <div class="dashboard-card dashboard-card--side customer-order-deliver">
            <h3 class="section-title section-title--small">Deliver To</h3>
            <div class="mini-info">
              <span>Current Address</span>
              <strong>{{ selectedOrder.address }}</strong>
            </div>
            <div class="mini-info">
              <span>Add Direction</span>
              <strong>{{ selectedOrder.extraAddress }}</strong>
            </div>
            <div class="mini-info">
              <span>Delivery Guy</span>
              <div class="order-delivery-user">
                <img :src="selectedOrder.deliveryGuy.avatar" :alt="selectedOrder.deliveryGuy.name" class="table-avatar">
                <div>
                  <strong>{{ selectedOrder.deliveryGuy.name }}</strong>
                  <span>{{ selectedOrder.deliveryGuy.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'orders'" class="dashboard-card customer-orders-card">
        <div class="section-bar">
          <h2 class="section-title section-title--tight">Orders</h2>
          <div class="toolbar">
            <label class="search-box">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m21 21-4.35-4.35" />
                <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
              </svg>
              <input v-model="customerOrderSearch" type="text" placeholder="Search">
            </label>
            <div class="popover-anchor">
              <button
                class="toolbar-button"
                :class="{ 'toolbar-button--active': customerOrderFilterOpen }"
                type="button"
                @click.stop="toggleCustomerOrderFilter"
              >
                Filter
              </button>
              <div v-if="customerOrderFilterOpen" class="menu-card menu-card--filter order-filter-card" @click.stop>
                <h3>Filter</h3>
                <p class="menu-label">Status</p>
                <div class="order-filter-statuses">
                  <label v-for="item in customerOrderStatusOptions" :key="item" class="check-option">
                    <input
                      type="radio"
                      name="customer-order-status"
                      :checked="customerOrderStatusDraft === item"
                      @change="customerOrderStatusDraft = item"
                    >
                    <span>{{ item }}</span>
                  </label>
                </div>
                <div class="menu-card__actions">
                  <button type="button" @click="clearCustomerOrderFilter">Clear Filter</button>
                  <button type="button" @click="applyCustomerOrderFilter">Apply Filter</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pill-row">
          <button class="pill-button pill-button--active" type="button">Bindirigu</button>
          <button class="pill-button" type="button">Damm</button>
        </div>

        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th class="col-check"><input type="checkbox"></th>
                <th>Order id</th>
                <th>Details</th>
                <th>Date</th>
                <th>Status</th>
                <th class="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredCustomerOrders" :key="order.id">
                <td class="col-check"><input type="checkbox"></td>
                <td>{{ order.tableId }}</td>
                <td>{{ order.details }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <span
                    class="status-text"
                    :class="{
                      'status-text--pending': order.status === 'Pending',
                      'status-text--preparing': order.status === 'Preparing',
                      'status-text--cancelled': order.status === 'Cancelled',
                      'status-text--delivered': order.status === 'Delivered' || order.status === 'Complete',
                      'status-text--ontheway': order.status === 'On the way',
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="col-action">
                  <button class="icon-button icon-button--table" type="button" @click="openOrderDetail(order.id)">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                      <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                      <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="activeTab === 'favorites'" class="customer-favorites-grid">
        <article v-for="item in favoriteRestaurants" :key="item.id" class="dashboard-card favorite-card">
          <div class="favorite-card__media">
            <img :src="item.image" :alt="item.name">
            <span class="favorite-card__badge">{{ item.badge }}</span>
            <button class="favorite-card__heart" type="button" aria-label="Favorite">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 20.5 4.9 13.7a4.8 4.8 0 0 1 6.8-6.8l.3.3.3-.3a4.8 4.8 0 1 1 6.8 6.8L12 20.5Z" />
              </svg>
            </button>
          </div>
          <div class="favorite-card__body">
            <div class="favorite-card__title-row">
              <strong>{{ item.name }}</strong>
              <span class="favorite-card__rating">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3.6 2.57 5.21 5.75.84-4.16 4.05.98 5.73L12 16.72l-5.14 2.71.98-5.73-4.16-4.05 5.75-.84L12 3.6Z" />
                </svg>
                {{ item.rating }}
              </span>
            </div>
            <div class="favorite-card__meta">
              <span>{{ item.duration }}</span>
              <span class="favorite-card__dot"></span>
              <span>{{ item.location }}</span>
            </div>
          </div>
        </article>
      </div>

      <div v-else-if="activeTab === 'reviews'" class="dashboard-card customer-reviews-card">
        <div class="customer-review-feed">
          <article v-for="entry in reviewEntries" :key="entry.id" class="review-feed-card">
            <div class="review-feed-card__top">
              <div class="review-feed-card__heading">
                <span class="review-feed-card__code">{{ entry.orderCode }}</span>
                <h3>{{ entry.restaurant }}</h3>
              </div>
              <div class="review-feed-card__meta">
                <span class="review-feed-card__time">{{ entry.time }}</span>
                <button class="review-feed-card__more" type="button">...</button>
              </div>
            </div>

            <div v-for="item in entry.items" :key="item.id" class="review-feed-item">
              <img :src="item.image" :alt="item.name" class="menu-thumb">
              <div class="review-feed-item__copy">
                <strong>{{ item.name }}</strong>
                <p>{{ item.comment }}</p>
              </div>
            </div>

            <div class="review-feed-card__bottom">
              <span></span>
              <div class="review-stars">
                <svg
                  v-for="star in 5"
                  :key="`${entry.id}-${star}`"
                  class="review-stars__star"
                  :class="{ 'review-stars__star--active': star <= entry.stars }"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="m12 3.6 2.57 5.21 5.75.84-4.16 4.05.98 5.73L12 16.72l-5.14 2.71.98-5.73-4.16-4.05 5.75-.84L12 3.6Z" />
                </svg>
                <span class="review-stars__label">({{ entry.note }})</span>
              </div>
            </div>

            <div v-if="entry.reply" class="review-reply">
              <span>&gt;</span>
              <strong>{{ entry.reply }}</strong>
              <span>Replied {{ entry.repliedAt }}</span>
            </div>
          </article>
        </div>
      </div>

      <div v-else-if="activeTab === 'rewards'" class="customer-reward-grid">
        <div class="dashboard-card reward-panel">
          <h2 class="section-title section-title--tight">Available Points</h2>
          <div class="reward-balance-card">
            <div class="reward-balance-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3 18.5 5.4V11c0 4.13-2.57 7.6-6.5 9-3.93-1.4-6.5-4.87-6.5-9V5.4L12 3Z" />
                <path d="m9.6 11.5 1.7 1.7 3.4-3.7" />
              </svg>
            </div>
            <div>
              <span>Reward Points</span>
              <strong>2770</strong>
            </div>
          </div>

          <div class="reward-section">
            <h3>How to earn points?</h3>
            <div class="reward-earn-list">
              <div v-for="item in rewardEarningRows" :key="item.id" class="reward-earn-item">
                <div>
                  <strong>{{ item.restaurant }}</strong>
                  <span>{{ item.spent }}</span>
                </div>
                <span class="count-chip">{{ item.points }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-card reward-panel">
          <h2 class="section-title section-title--tight">Use Points</h2>
          <div class="reward-use-list">
            <div v-for="item in rewardUseRows" :key="item.id" class="reward-use-item">
              <div class="reward-use-item__icon">Earn Cash</div>
              <div>
                <strong>{{ item.title }}</strong>
                <span>{{ item.subtitle }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="dashboard-card customer-placeholder-card">
        <h2 class="section-title section-title--tight">{{ tabs.find(item => item.value === activeTab)?.label }}</h2>
        <p class="customer-placeholder-copy">
          {{ customer?.name }} uchun bu bo'lim mock data bilan tayyorlandi. Asosiy fokus overview va add/edit flowga qaratildi.
        </p>
      </div>
    </div>
  </section>
</template>
