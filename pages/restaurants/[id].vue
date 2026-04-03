<script setup lang="ts">
const route = useRoute()
const { getRestaurantById } = useRestaurants()

const restaurant = computed(() => getRestaurantById(String(route.params.id)))

const representativeImage = computed(() => {
  if ((restaurant.value?.representative || '').toLowerCase().includes('darrell')) {
    return '/avatars/darrell-steward.svg'
  }

  return '/avatars/default-user.svg'
})

if (!restaurant.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Restaurant not found',
  })
}

useHead({
  title: computed(() => `${restaurant.value?.name || 'Restaurant'} Overview`),
})
</script>

<template>
  <section class="detail-grid">
    <div class="dashboard-card dashboard-card--detail">
      <div class="section-bar">
        <h1 class="section-title">Restaurant Overview</h1>

        <div class="overview-actions">
          <span class="toggle-label">Open</span>
          <label class="switch">
            <input type="checkbox" :checked="restaurant?.status === 'Open'">
            <span></span>
          </label>
          <NuxtLink class="primary-link primary-link--edit" :to="`/restaurants/add?edit=${restaurant?.id}`">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 20h4l10-10-4-4L4 16v4Z" />
              <path d="m12 6 4 4" />
            </svg>
            Edit
          </NuxtLink>
        </div>
      </div>

      <div class="overview-media">
        <img :src="restaurant?.image" :alt="restaurant?.name">
      </div>

      <div class="detail-copy">
        <h2>{{ restaurant?.name }}</h2>
        <p class="detail-meta">5.3 km traveled&nbsp;&nbsp;&nbsp; 20 Orders</p>
      </div>

      <div class="info-list">
        <div class="info-row">
          <span>Established</span>
          <strong>Since {{ restaurant?.established }}</strong>
        </div>
        <div class="info-row">
          <span>Payment Method</span>
          <strong>Via {{ restaurant?.paymentMethod }}</strong>
        </div>
        <div class="info-row">
          <span>Working Period</span>
          <strong>{{ restaurant?.workPeriod }}</strong>
        </div>
        <div class="info-row">
          <span>Location</span>
          <strong>{{ restaurant?.location }}</strong>
        </div>
      </div>
    </div>

    <aside class="detail-side">
      <div class="dashboard-card dashboard-card--side">
        <h2 class="section-title section-title--tight">Representitive Info</h2>

        <div class="profile-card">
          <div class="profile-avatar">
            <img :src="representativeImage" :alt="restaurant?.representative">
          </div>
          <h3>{{ restaurant?.representative }}</h3>
        </div>

        <div class="mini-info">
          <span>Phone Number</span>
          <strong>{{ restaurant?.phone }}</strong>
        </div>
        <div class="mini-info">
          <span>Location</span>
          <strong>{{ restaurant?.location }}</strong>
        </div>
      </div>

      <div class="dashboard-card dashboard-card--side">
        <h2 class="section-title section-title--tight">Documents</h2>

        <div class="document-list">
          <div v-for="document in restaurant?.documents" :key="document.label" class="document-item">
            <div class="document-icon"></div>
            <div class="document-copy">
              <strong>{{ document.label }}</strong>
              <span>{{ document.fileName }}</span>
            </div>
            <button class="icon-button icon-button--download" type="button" aria-label="Download file">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3v11" />
                <path d="m8 10 4 4 4-4" />
                <path d="M5 21h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  </section>
</template>
