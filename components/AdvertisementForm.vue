<script setup lang="ts">
const route = useRoute()
const { addAdvertisement } = useAdvertisement()

const activeSlot = ref<'Slot A' | 'Slot B' | 'Slot C' | 'Slot D'>('Slot A')
const chooseSlot = ref('Slot A')
const budget = ref('')

const slotStorageMap = {
  'Slot A': 'Slot 01',
  'Slot B': 'Slot 02',
  'Slot C': 'Slot 03',
  'Slot D': 'Slot 04',
} as const

const amounts = {
  'Slot A': ['580', '557', '500'],
  'Slot B': ['520', '500', '450'],
  'Slot C': ['490', '470', '430'],
  'Slot D': ['450', '430', '400'],
}

const setSlot = (slot: 'Slot A' | 'Slot B' | 'Slot C' | 'Slot D') => {
  activeSlot.value = slot
  chooseSlot.value = slot
}

const submit = async () => {
  addAdvertisement({
    id: `ad-${Date.now()}`,
    slot: slotStorageMap[chooseSlot.value as keyof typeof slotStorageMap],
    restaurant: 'Sun valley restaurant',
    banner: '/ads/we-love-you.svg',
    date: 'Feb 08 - Mar 08, 2022',
    price: budget.value,
    bidPrice: budget.value || '₵ 500.00',
    position: '3rd',
    status: 'Pending',
    category: 'Pizza',
    rating: '5.00',
    owner: route.path.startsWith('/restaurants') ? 'Bindirigu' : 'Kalavuna Restaurant',
  })

  await navigateTo(route.path.startsWith('/restaurants') ? '/restaurants/advertisement' : '/advertisement')
}
</script>

<template>
  <section class="dashboard-card dashboard-card--form">
    <div class="section-bar section-bar--stacked">
      <h1 class="section-title">Add Advertisement</h1>
    </div>

    <form class="restaurant-form advertisement-form" @submit.prevent="submit">
      <div class="pill-row advertisement-form__slots">
        <button
          v-for="slot in ['Slot A', 'Slot B', 'Slot C', 'Slot D']"
          :key="slot"
          class="pill-button"
          :class="{ 'pill-button--active': activeSlot === slot }"
          type="button"
          @click="setSlot(slot as typeof activeSlot)"
        >
          {{ slot }}
        </button>
      </div>

      <div class="ad-bid-card">
        <strong>Amount to bid</strong>
        <div class="ad-bid-list">
          <div class="ad-bid-row">
            <span>First Place</span>
            <strong>&cent; {{ amounts[activeSlot][0] }}</strong>
          </div>
          <div class="ad-bid-row">
            <span>Second Place</span>
            <strong>&cent; {{ amounts[activeSlot][1] }}</strong>
          </div>
          <div class="ad-bid-row">
            <span>Third Place</span>
            <strong>&cent; {{ amounts[activeSlot][2] }}</strong>
          </div>
        </div>
      </div>

      <div class="form-layout advertisement-form__fields">
        <h3 class="ad-subtitle">Bid now for an advertisement</h3>
        <label class="field-block field-block--full">
          <span>Choose Slot</span>
          <select v-model="chooseSlot">
            <option>Slot A</option>
            <option>Slot B</option>
            <option>Slot C</option>
            <option>Slot D</option>
          </select>
        </label>

        <label class="field-block field-block--full">
          <span>Enter Your Budget</span>
          <input v-model="budget" type="text" placeholder="GHC 30.00">
        </label>
      </div>

      <button class="primary-button primary-button--submit" type="submit">Submit</button>
    </form>
  </section>
</template>
