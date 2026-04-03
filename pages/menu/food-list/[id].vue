<script setup lang="ts">
const route = useRoute()
const { getFoodById } = useMenu()

const food = computed(() => getFoodById(String(route.params.id)))

if (!food.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Food not found',
  })
}

useHead({
  title: computed(() => `${food.value?.name || 'Food'} Details`),
})
</script>

<template>
  <section class="dashboard-card dashboard-card--detail">
    <div class="section-bar">
      <h1 class="section-title">Food Details</h1>

      <div class="overview-actions">
        <span class="toggle-label">{{ food?.status }}</span>
        <NuxtLink class="primary-link primary-link--edit" :to="`/menu/food-list/add?edit=${food?.id}`">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 20h4l10-10-4-4L4 16v4Z" />
            <path d="m12 6 4 4" />
          </svg>
          Edit
        </NuxtLink>
      </div>
    </div>

    <div class="food-detail-grid">
      <div>
        <div class="overview-media overview-media--food">
          <img :src="food?.image" :alt="food?.name">
        </div>

        <div class="detail-copy">
          <h2>{{ food?.name }}</h2>
          <p class="detail-meta">{{ food?.price }}   5.0 (23 Reviews)   23 Sales</p>
        </div>

        <div class="info-list">
          <div class="info-row info-row--stacked">
            <span>Details</span>
            <strong>{{ food?.description }}</strong>
          </div>
          <div class="info-row">
            <span>Category</span>
            <strong>{{ food?.category }}</strong>
          </div>
          <div class="info-row">
            <span>Status</span>
            <strong>{{ food?.status }}</strong>
          </div>
        </div>
      </div>

      <div class="dashboard-card dashboard-card--side">
        <h2 class="section-title section-title--tight">Review & Ratings</h2>
        <div class="review-list">
          <div class="review-item">
            <img src="/avatars/ralph-edwards.svg" alt="Ralph Edwards" class="table-avatar">
            <div>
              <strong>Ralph Edwards</strong>
              <p>I'm very much happy. Food is good.</p>
            </div>
          </div>
          <div class="review-item">
            <img src="/avatars/ralph-edwards.svg" alt="Ralph Edwards" class="table-avatar">
            <div>
              <strong>Beef onion pizza</strong>
              <p>I'm very much happy. Food is good.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
