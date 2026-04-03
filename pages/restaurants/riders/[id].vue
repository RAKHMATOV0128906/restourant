<script setup lang="ts">
const route = useRoute()
const { riders, getRiderById, getDeliveriesByRider, getRiderDeliveryById, updateRider } = useRiders()
const rider = computed(() => getRiderById(String(route.params.id)))
if (!rider.value) throw createError({ statusCode: 404, statusMessage: 'Rider not found' })

const activeTab = computed(() => String(route.query.tab || 'overview') as RiderProfileTab)
const detailId = computed(() => typeof route.query.detail === 'string' ? route.query.detail : '')
const detailDelivery = computed(() => detailId.value ? getRiderDeliveryById(detailId.value) : undefined)
const deliveries = computed(() => getDeliveriesByRider(String(route.params.id)))
const vendor = ref<RiderDeliveryVendor>('Bindirigu')
const search = ref('')
const filterOpen = ref(false)
const filterDraft = reactive({ date: '', complete: true, cancelled: true })
const appliedFilter = reactive({ date: '', complete: false, cancelled: false })
const tabs = [{ label: 'Overview', value: 'overview' }, { label: 'Deliveries', value: 'deliveries' }, { label: 'Earnings', value: 'earnings' }, { label: 'Review & Rating', value: 'reviews' }]

const filteredDeliveries = computed(() => {
  const query = search.value.trim().toLowerCase()
  return deliveries.value.filter((item) => {
    const matchesVendor = item.vendor === vendor.value
    const matchesSearch = !query || [item.orderId, item.restaurant].some(value => value.toLowerCase().includes(query))
    const matchesDate = !appliedFilter.date || item.date === appliedFilter.date
    const statuses = [appliedFilter.complete ? 'Complete' : '', appliedFilter.cancelled ? 'Cancelled' : ''].filter(Boolean)
    const matchesStatus = statuses.length === 0 || statuses.includes(item.status)
    return matchesVendor && matchesSearch && matchesDate && matchesStatus
  })
})

const currentDelivery = computed(() => detailDelivery.value || deliveries.value[0])
const mapEmbedUrl = computed(() => {
  const current = currentDelivery.value
  if (!current) return ''
  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = current.map
  const minLat = Math.min(pickupLat, dropoffLat) - 0.02
  const maxLat = Math.max(pickupLat, dropoffLat) + 0.02
  const minLng = Math.min(pickupLng, dropoffLng) - 0.02
  const maxLng = Math.max(pickupLng, dropoffLng) + 0.02
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${dropoffLat}%2C${dropoffLng}`
})

const reviews = [
  { id: 'review-1', restaurant: 'Star Valley Restaurant', text: 'Very careful rider. Delivery was smooth and quick.', rating: 4.8, date: 'Feb 08, 2022' },
  { id: 'review-2', restaurant: 'Moon Valley Restaurant', text: 'Helpful and friendly during dropoff.', rating: 4.6, date: 'Feb 08, 2022' },
  { id: 'review-3', restaurant: 'Sun Valley Restaurant', text: 'Professional rider with accurate timing.', rating: 4.9, date: 'Feb 08, 2022' },
]

const setTab = async (tab: RiderProfileTab) => navigateTo({ path: route.path, query: tab === 'overview' ? {} : { tab } })
const openDelivery = async (id: string) => navigateTo({ path: route.path, query: { tab: 'deliveries', detail: id } })
const closeDetail = async () => navigateTo({ path: route.path, query: { tab: 'deliveries' } })
const toggleActive = () => updateRider(rider.value!.id, { isActive: !rider.value!.isActive })
const applyFilter = () => { appliedFilter.date = filterDraft.date; appliedFilter.complete = filterDraft.complete; appliedFilter.cancelled = filterDraft.cancelled; filterOpen.value = false }
const clearFilter = () => { filterDraft.date = ''; filterDraft.complete = true; filterDraft.cancelled = true; appliedFilter.date = ''; appliedFilter.complete = false; appliedFilter.cancelled = false; filterOpen.value = false }

useHead({ title: computed(() => `${rider.value?.name || 'Rider'} Profile`) })
</script>

<template>
  <section class="customer-profile-layout rider-layout">
    <aside class="dashboard-card customer-sidebar-card">
      <div class="section-bar section-bar--stacked"><h2 class="section-title">Rider Profile</h2></div>
      <label class="search-box search-box--wide"><svg viewBox="0 0 24 24" fill="none"><path d="m21 21-4.35-4.35" /><path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" /></svg><input type="text" placeholder="Search"></label>
      <div class="customer-stack">
        <NuxtLink v-for="item in riders" :key="item.id" :to="`/restaurants/riders/${item.id}`" class="customer-stack__item" :class="{ 'customer-stack__item--active': item.id === rider?.id }">
          <img :src="item.photo" :alt="item.name" class="customer-stack__avatar">
          <div><strong>{{ item.name }}</strong><span>{{ item.phone }}</span></div>
        </NuxtLink>
      </div>
    </aside>

    <div class="customer-profile-main">
      <div class="customer-tabs"><button v-for="tab in tabs" :key="tab.value" class="customer-tab" :class="{ 'customer-tab--active': activeTab === tab.value }" type="button" @click="setTab(tab.value as RiderProfileTab)">{{ tab.label }}</button></div>

      <div v-if="activeTab === 'overview'" class="rider-overview-grid">
        <div class="dashboard-card rider-profile-card">
          <div class="customer-overview-top"><span class="status-badge">{{ rider?.isActive ? 'Active' : 'Disabled' }}</span><label class="switch"><input type="checkbox" :checked="rider?.isActive" @change="toggleActive"><span></span></label></div>
          <div class="customer-hero"><div class="profile-avatar profile-avatar--large"><img :src="rider?.photo" :alt="rider?.name"></div><h2>{{ rider?.name }}</h2><p>User id: {{ rider?.userId }}</p><NuxtLink class="primary-link primary-link--edit" :to="`/restaurants/riders/add?edit=${rider?.id}`">Edit profile</NuxtLink></div>
          <div class="info-list info-list--solid">
            <div class="info-row"><span>Phone Number</span><strong>{{ rider?.phone }}</strong></div>
            <div class="info-row"><span>Shift</span><strong>{{ rider?.shift }}</strong></div>
            <div class="info-row"><span>Address</span><strong>{{ rider?.address }}</strong></div>
            <div class="info-row"><span>Gender</span><strong>{{ rider?.gender }}</strong></div>
            <div class="info-row"><span>Date of Birth</span><strong>{{ rider?.birthDate }}</strong></div>
            <div class="info-row"><span>User ID</span><strong>{{ rider?.userId }}</strong></div>
          </div>
        </div>

        <div class="rider-side-panel">
          <div class="dashboard-card rider-balance-card"><div class="reward-balance-card__icon rider-wallet-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" /><path d="M15 12h5" /></svg></div><div><span>Current Balance</span><strong>GHC {{ rider?.currentBalance.toFixed(2) }}</strong></div></div>
          <div class="dashboard-card dashboard-card--side"><h3 class="section-title section-title--small">Documents</h3><div class="document-list"><div v-for="item in rider?.documents" :key="item.id" class="document-item"><div class="document-icon"></div><div class="document-copy"><strong>{{ item.title }}</strong><span>{{ item.fileName }}</span></div><button class="icon-button icon-button--download" type="button"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v11" /><path d="m8 10 4 4 4-4" /><path d="M5 21h14" /></svg></button></div></div></div>
          <div class="rider-mini-stats"><div class="dashboard-card rider-mini-stat"><strong>₵ {{ rider?.earningThisMonth.toFixed(2) }}</strong><span>Earing This Month</span></div><div class="dashboard-card rider-mini-stat"><strong>{{ rider?.totalOrders }}</strong><span>Total Order (Dec, 21)</span></div></div>
          <div class="dashboard-card rider-chart-card"><div class="section-bar"><div><strong>Working Statistics</strong><span>Dec, 2021</span></div><button class="toolbar-button" type="button">Weekly</button></div><div class="rider-chart"><div v-for="bar in rider?.stats" :key="bar.id" class="rider-chart__item"><div class="rider-chart__bar-wrap"><div class="rider-chart__bar" :class="{ 'rider-chart__bar--active': bar.active }" :style="{ height: `${bar.value * 14}px` }"></div></div><span>{{ bar.label }}</span></div></div></div>
        </div>
      </div>

      <div v-else-if="activeTab === 'deliveries' && detailDelivery" class="rider-delivery-detail">
        <div class="dashboard-card rider-delivery-topbar"><div class="customer-order-title"><strong>Order Id #{{ detailDelivery.orderId }}</strong><span class="status-badge" :class="`status-badge--${detailDelivery.status.toLowerCase().replaceAll(' ', '-')}`">{{ detailDelivery.status }}</span><span class="status-badge status-badge--delivered">Paid</span><div class="order-user-inline"><img :src="detailDelivery.driverAvatar" :alt="detailDelivery.driverName" class="table-avatar"><span>{{ detailDelivery.driverName }}</span></div></div><button class="toolbar-button" type="button" @click="closeDetail">Back</button></div>
        <div class="dashboard-card rider-delivery-track"><div class="order-status-panel"><h3 class="section-title section-title--small">Rider Status</h3><div class="timeline-list"><div v-for="step in detailDelivery.timeline" :key="step.label" class="timeline-step" :class="{ 'timeline-step--done': step.state === 'done', 'timeline-step--current': step.state === 'current' }"><span class="timeline-dot"></span><div><strong>{{ step.label }}</strong><span>{{ step.time }}</span></div></div></div></div><div class="order-map-panel"><div class="order-map-head"><h3 class="section-title section-title--small">Rider Tracking</h3><span>{{ detailDelivery.estimatedLabel }} <template v-if="detailDelivery.estimatedValue">{{ detailDelivery.estimatedValue }}</template></span></div><div class="tracking-map tracking-map--compact"><iframe v-if="mapEmbedUrl" :src="mapEmbedUrl" class="tracking-map__frame" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Rider tracking map" /></div></div></div>
        <div class="rider-delivery-grid"><div class="dashboard-card order-summary-card"><div class="order-summary-copy"><strong>#{{ detailDelivery.orderId }}</strong><span>{{ detailDelivery.restaurant }}</span></div><div class="summary-list"><div v-for="item in detailDelivery.items" :key="item.id" class="summary-item"><div class="summary-item__info"><img :src="item.image" :alt="item.name" class="summary-image"><div><strong>{{ item.name }}</strong><span>{{ item.quantity }} items</span></div></div><strong>₵ {{ item.price.toFixed(2) }}</strong></div></div><div class="summary-totals"><div class="summary-row"><span>Coupon Code</span><strong>{{ detailDelivery.couponStatus }}</strong></div><div class="summary-row"><span>Reward Points</span><strong>{{ detailDelivery.rewardStatus }}</strong></div><div class="summary-row"><span>Subtotal</span><strong>GHC {{ detailDelivery.subtotal.toFixed(2) }}</strong></div><div class="summary-row"><span>Delivery Fee</span><strong>{{ detailDelivery.deliveryFee.toFixed(2) }}</strong></div><div class="summary-row"><span>Fees &amp; Estimated Tax</span><strong>{{ detailDelivery.feesTax.toFixed(2) }}</strong></div><div class="summary-row summary-row--total"><span>Total</span><strong>GHC {{ (detailDelivery.subtotal + detailDelivery.deliveryFee + detailDelivery.feesTax).toFixed(2) }}</strong></div></div></div><div class="dashboard-card dashboard-card--side"><h3 class="section-title section-title--small">Deliver Details</h3><div class="mini-info"><span>{{ detailDelivery.pickupLabel }}</span><strong>{{ detailDelivery.pickupAddress }}</strong></div><div class="mini-info"><span>{{ detailDelivery.dropoffLabel }}</span><strong>{{ detailDelivery.dropoffAddress }}</strong></div><div class="mini-info"><span>Delivery Guy</span><div class="order-delivery-user"><img :src="detailDelivery.driverAvatar" :alt="detailDelivery.driverName" class="table-avatar"><div><strong>{{ detailDelivery.driverName }}</strong><span>{{ detailDelivery.driverPhone }}</span></div></div></div></div></div>
      </div>

      <div v-else-if="activeTab === 'deliveries'" class="dashboard-card customer-orders-card">
        <div class="section-bar"><h2 class="section-title section-title--tight">Deliveries</h2><div class="toolbar"><label class="search-box"><svg viewBox="0 0 24 24" fill="none"><path d="m21 21-4.35-4.35" /><path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" /></svg><input v-model="search" type="text" placeholder="Search"></label><div class="popover-anchor"><button class="toolbar-button" :class="{ 'toolbar-button--active': filterOpen }" type="button" @click.stop="filterOpen = !filterOpen">Filter</button><div v-if="filterOpen" class="menu-card menu-card--filter rider-filter-card" @click.stop><h3>Filter</h3><div class="field-block field-block--compact"><span>Date</span><input v-model="filterDraft.date" type="text" placeholder="Select Date"></div><div class="order-filter-statuses"><label class="check-option"><input v-model="filterDraft.complete" type="checkbox"><span>Complete</span></label><label class="check-option"><input v-model="filterDraft.cancelled" type="checkbox"><span>Cancelled</span></label></div><div class="menu-card__actions"><button type="button" @click="clearFilter">Clear Filter</button><button type="button" @click="applyFilter">Apply Filter</button></div></div></div></div></div>
        <div class="pill-row"><button class="pill-button" :class="{ 'pill-button--active': vendor === 'Bindirigu' }" type="button" @click="vendor = 'Bindirigu'">Bindirigu</button><button class="pill-button" :class="{ 'pill-button--active': vendor === 'Damm' }" type="button" @click="vendor = 'Damm'">Damm</button></div>
        <div class="table-card"><table class="data-table"><thead><tr><th class="col-check"><input type="checkbox"></th><th>Order id</th><th>Restaurant</th><th>Date</th><th>Status</th><th class="col-action">Action</th></tr></thead><tbody><tr v-for="item in filteredDeliveries" :key="item.id"><td class="col-check"><input type="checkbox"></td><td>{{ item.orderId }}</td><td>{{ item.restaurant }}</td><td>{{ item.date }}</td><td><span class="status-text" :class="{ 'status-text--delivered': item.status === 'Complete', 'status-text--cancelled': item.status === 'Cancelled', 'status-text--pending': item.status === 'Pending', 'status-text--preparing': item.status === 'Pick Up', 'status-text--ontheway': item.status === 'Dropoff' }">{{ item.status }}</span></td><td class="col-action"><button class="icon-button icon-button--table" type="button" @click="openDelivery(item.id)"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /><path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /><path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /></svg></button></td></tr></tbody></table></div>
        <div class="pagination-bar"><div class="page-chip">6 of 6</div><div class="pagination-actions"><button class="page-button" type="button">&lt;</button><button class="page-button page-button--active" type="button">1</button><button class="page-button" type="button">2</button><button class="page-button" type="button">3</button><button class="page-button" type="button">4</button><button class="page-button" type="button">5</button><button class="page-button" type="button">&gt;</button></div></div>
      </div>

      <div v-else-if="activeTab === 'earnings'" class="rider-earnings-grid"><div class="dashboard-card rider-earning-card"><strong>GHC {{ rider?.currentBalance.toFixed(2) }}</strong><span>Current Balance</span></div><div class="dashboard-card rider-earning-card"><strong>₵ {{ rider?.earningThisMonth.toFixed(2) }}</strong><span>Earing This Month</span></div><div class="dashboard-card rider-earning-card"><strong>{{ rider?.totalOrders }}</strong><span>Total Order (Dec, 21)</span></div></div>

      <div v-else class="dashboard-card customer-reviews-card"><div class="customer-review-feed"><article v-for="entry in reviews" :key="entry.id" class="review-feed-card"><div class="review-feed-card__top"><div class="review-feed-card__heading"><span class="review-feed-card__code">{{ entry.restaurant }}</span><h3>{{ entry.text }}</h3></div><div class="review-feed-card__meta"><span class="review-feed-card__time">{{ entry.date }}</span></div></div><div class="review-feed-card__bottom"><div class="review-stars"><svg v-for="star in 5" :key="`${entry.id}-${star}`" class="review-stars__star" :class="{ 'review-stars__star--active': star <= Math.round(entry.rating) }" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3.6 2.57 5.21 5.75.84-4.16 4.05.98 5.73L12 16.72l-5.14 2.71.98-5.73-4.16-4.05 5.75-.84L12 3.6Z" /></svg><span class="review-stars__label">{{ entry.rating }}</span></div></div></article></div></div>
    </div>
  </section>
</template>
