<script setup lang="ts">
const route = useRoute()
const { getOrderById, money } = useOrders()
const deliverymanOpen = ref(false)
const deliverymanSearch = ref('')

const order = computed(() => getOrderById(String(route.params.id)))
const mapEmbedUrl = computed(() => {
  if (!order.value) {
    return ''
  }

  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = order.value.map
  const minLat = Math.min(pickupLat, dropoffLat) - 0.02
  const maxLat = Math.max(pickupLat, dropoffLat) + 0.02
  const minLng = Math.min(pickupLng, dropoffLng) - 0.02
  const maxLng = Math.max(pickupLng, dropoffLng) + 0.02

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${dropoffLat}%2C${dropoffLng}`
})

if (!order.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Order not found',
  })
}

const timelineClass = (state: 'done' | 'current' | 'upcoming') => ({
  'timeline-step': true,
  'timeline-step--done': state === 'done',
  'timeline-step--current': state === 'current',
})

const totalOrders = computed(() => order.value?.customerId === 'chelsie-johnson' ? 39 : 12)
const deliverymanAreas = ['Nettey', 'Accra', 'Abra', 'Juapong', 'Tema'] as const
const deliverymen = [
  { id: 'ronald', name: 'Ronald Richards', phone: '+880160000770', avatar: '/avatars/ronald-richards.svg' },
  { id: 'chelsie', name: 'Chelsie Johnson', phone: '+880160000770', avatar: '/avatars/chelsie-johnson.svg' },
  { id: 'darrell', name: 'Darrell Steward', phone: '+880160000770', avatar: '/avatars/darrell-steward.svg' },
  { id: 'albert', name: 'Albert Flores', phone: '+880160000770', avatar: '/avatars/albert-flores.svg' },
  { id: 'wade', name: 'Wade Warren', phone: '+880160000770', avatar: '/avatars/wade-warren.svg' },
  { id: 'esther', name: 'Esther Howard', phone: '+880160000770', avatar: '/avatars/esther-howard.svg' },
  { id: 'cameron', name: 'Cameron Williamson', phone: '+880160000770', avatar: '/avatars/cameron-williamson.svg' },
  { id: 'brooklyn', name: 'Brooklyn Simmons', phone: '+880160000770', avatar: '/avatars/brooklyn-simmons.svg' },
]

const filteredDeliverymen = computed(() => {
  const query = deliverymanSearch.value.trim().toLowerCase()
  return deliverymen.filter(item => !query || item.name.toLowerCase().includes(query))
})

useHead({
  title: computed(() => `Order ${order.value?.id || ''}`),
})
</script>

<template>
  <section class="detail-grid detail-grid--order" @click="deliverymanOpen = false">
    <div class="order-detail-column">
      <div class="dashboard-card order-detail-topbar">
        <div class="order-detail-meta">
          <div class="order-detail-headline">
            <strong>Order Id #{{ order?.id }}</strong>
            <span class="status-badge" :class="`status-badge--${String(order?.status).toLowerCase().replaceAll(' ', '-')}`">
              {{ order?.status }}
            </span>
            <div class="order-user-inline">
              <img :src="order?.deliveryGuy.avatar" :alt="order?.deliveryGuy.name" class="table-avatar">
              <span>{{ order?.deliveryGuy.name }}</span>
            </div>
            <span>{{ order?.date }}</span>
            <span>{{ order?.time }}</span>
          </div>

          <div class="order-detail-actions">
            <div class="popover-anchor">
              <button class="toolbar-button" type="button" @click.stop="deliverymanOpen = !deliverymanOpen">
                Assign Deliveryman
                <svg class="caret-icon" viewBox="0 0 24 24" fill="none">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div v-if="deliverymanOpen" class="deliveryman-card" @click.stop>
                <h3>Deliveryman</h3>
                <label class="search-box search-box--wide">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m21 21-4.35-4.35" />
                    <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
                  </svg>
                  <input v-model="deliverymanSearch" type="text" placeholder="Search">
                </label>
                <div class="deliveryman-chip-row">
                  <button v-for="area in deliverymanAreas" :key="area" class="deliveryman-chip" type="button">{{ area }}</button>
                </div>
                <div class="deliveryman-list">
                  <button
                    v-for="item in filteredDeliverymen"
                    :key="item.id"
                    class="deliveryman-item"
                    type="button"
                  >
                    <img :src="item.avatar" :alt="item.name" class="table-avatar">
                    <div>
                      <strong>{{ item.name }}</strong>
                      <span>{{ item.phone }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div class="order-detail-selects">
              <button class="toolbar-button" type="button">Payment</button>
              <button class="toolbar-button" type="button">Status</button>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card order-tracking-grid">
        <div class="order-status-panel">
          <h3 class="section-title section-title--small">Order Status</h3>
          <div class="timeline-list">
            <div v-for="step in order?.timeline" :key="step.label" :class="timelineClass(step.state)">
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
            <span>Estimated delivery time {{ order?.estimatedDelivery }}</span>
          </div>
          <div class="tracking-map">
            <iframe
              v-if="mapEmbedUrl"
              :src="mapEmbedUrl"
              class="tracking-map__frame"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Order tracking map"
            />
          </div>
        </div>
      </div>

      <div class="dashboard-card order-summary-card">
        <h3 class="section-title section-title--small">Summary</h3>
        <div class="order-summary-copy">
          <strong>{{ order?.restaurantShort }}</strong>
        </div>

        <div class="summary-list">
          <div v-for="item in order?.items" :key="item.id" class="summary-item">
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
          <div class="summary-row"><span>Coupon Code</span><strong>{{ order?.couponStatus }}</strong></div>
          <div class="summary-row"><span>Reward Points</span><strong>{{ order?.rewardStatus }}</strong></div>
          <div class="summary-row"><span>Subtotal</span><strong>{{ order ? money(order.subtotal) : '' }}</strong></div>
          <div class="summary-row"><span>Delivery Fee</span><strong>{{ order ? money(order.deliveryFee) : '' }}</strong></div>
          <div class="summary-row"><span>Fees &amp; Estimated Tax</span><strong>{{ order ? money(order.feesTax) : '' }}</strong></div>
          <div class="summary-row summary-row--total"><span>Total</span><strong>{{ order ? money(order.subtotal + order.deliveryFee + order.feesTax) : '' }}</strong></div>
        </div>
      </div>
    </div>

    <div class="detail-side order-side">
      <div class="dashboard-card dashboard-card--side">
        <h3 class="section-title section-title--small">Customer info</h3>
        <div class="profile-card">
          <div class="profile-avatar">
            <img :src="order?.customerAvatar" :alt="order?.customerName">
          </div>
          <h3>{{ order?.customerName }}</h3>
          <p>{{ order?.customerId }}@bindirigu.com</p>
          <span class="count-chip">Total Order {{ totalOrders }}</span>
        </div>

        <div class="info-list">
          <div class="info-row">
            <span>Phone Number</span>
            <strong>+88 01600-009770</strong>
          </div>
          <div class="info-row">
            <span>Location</span>
            <strong>{{ order?.address }}</strong>
          </div>
        </div>
      </div>

      <div class="dashboard-card dashboard-card--side">
        <h3 class="section-title section-title--small">Deliver To</h3>
        <div class="mini-info">
          <span>Current Address</span>
          <strong>{{ order?.address }}</strong>
        </div>
        <div class="mini-info">
          <span>Add Direction</span>
          <strong>{{ order?.extraAddress }}</strong>
        </div>
        <div class="mini-info">
          <span>Delivery Guy</span>
          <div class="order-delivery-user">
            <img :src="order?.deliveryGuy.avatar" :alt="order?.deliveryGuy.name" class="table-avatar">
            <div>
              <strong>{{ order?.deliveryGuy.name }}</strong>
              <span>{{ order?.deliveryGuy.phone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
