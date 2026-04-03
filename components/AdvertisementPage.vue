<script setup lang="ts">
const { advertisements, updateAdvertisement } = useAdvertisement()

const route = useRoute()
const search = ref('')
const filterOpen = ref(false)
const exportOpen = ref(false)
const actionMenuId = ref<string | null>(null)
const slotFilter = ref('All')
const categoryDraft = ref('Pizza')
const ratingDraft = ref('5.00')
const appliedCategory = ref('')
const appliedRating = ref('')

const isManagement = computed(() => route.path.startsWith('/restaurants'))
const customerSlotOptions = ['All', 'Slot 01', 'Slot 02', 'Slot 03', 'Slot 03', 'Slot 03'] as const
const managementSlotOptions = ['All', 'Slot 01', 'Slot 02', 'Slot 03', 'Slot 03', 'Slot 03'] as const

const filteredAds = computed(() =>
  advertisements.value.filter((item) => {
    const query = search.value.trim().toLowerCase()
    const matchesSearch = !query || [item.slot, item.restaurant, item.date, item.owner].some(value => value.toLowerCase().includes(query))
    const matchesSlot = slotFilter.value === 'All' || item.slot === slotFilter.value
    const matchesCategory = !appliedCategory.value || item.category === appliedCategory.value
    const matchesRating = !appliedRating.value || item.rating === appliedRating.value
    return matchesSearch && matchesSlot && matchesCategory && matchesRating
  }),
)

const customerRows = computed(() =>
  filteredAds.value.map((item, index) => ({
    ...item,
    status: index === 0 || index === 2 || index === 4 ? 'Active' : index === 5 ? 'Owned' : 'Cancelled',
  })),
)

const closeMenus = () => {
  filterOpen.value = false
  exportOpen.value = false
  actionMenuId.value = null
}

const exportRows = (type: 'csv' | 'json') => {
  const rows = filteredAds.value
  const filename = `advertisement.${type}`
  const content = type === 'json'
    ? JSON.stringify(rows, null, 2)
    : [['slot', 'restaurant', 'date', 'price', 'status'], ...rows.map(item => [item.slot, item.restaurant, item.date, item.price, item.status])].map(row => row.join(',')).join('\n')

  const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  exportOpen.value = false
}

const applyFilter = () => {
  appliedCategory.value = categoryDraft.value
  appliedRating.value = ratingDraft.value
  filterOpen.value = false
}

const clearFilter = () => {
  categoryDraft.value = 'Pizza'
  ratingDraft.value = '5.00'
  appliedCategory.value = ''
  appliedRating.value = ''
  filterOpen.value = false
}

const approveAd = (id: string) => {
  updateAdvertisement(id, { status: 'Active' })
  actionMenuId.value = null
}

const commentAd = (id: string) => {
  updateAdvertisement(id, { status: 'Pending' })
  actionMenuId.value = null
}
</script>

<template>
  <section class="dashboard-card" @click.self="closeMenus">
    <div class="section-bar">
      <h1 class="section-title">Advertisement</h1>

      <div class="toolbar">
        <label class="search-box">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m21 21-4.35-4.35" />
            <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
          </svg>
          <input v-model="search" type="text" placeholder="Search">
        </label>

        <div class="popover-anchor">
          <button class="toolbar-button" :class="{ 'toolbar-button--active': filterOpen }" type="button" @click.stop="filterOpen = !filterOpen; exportOpen = false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16l-6 7v6l-4 1v-7L4 5Z" />
            </svg>
            <span>Filter</span>
          </button>

          <div v-if="filterOpen" class="menu-card menu-card--filter ad-filter-card" @click.stop>
            <h3>Filter</h3>
            <label class="field-block field-block--compact">
              <span>{{ isManagement ? 'Category' : 'Category' }}</span>
              <select v-model="categoryDraft">
                <option>Pizza</option>
                <option>Burger</option>
                <option>Drinks</option>
              </select>
            </label>
            <label class="field-block field-block--compact">
              <span>{{ isManagement ? 'Ratings' : 'Ratings' }}</span>
              <select v-model="ratingDraft">
                <option>5.00</option>
                <option>4.80</option>
                <option>4.50</option>
              </select>
            </label>
            <div class="menu-card__actions">
              <button type="button" @click="clearFilter">Clear Filter</button>
              <button type="button" @click="applyFilter">Apply Filter</button>
            </div>
          </div>
        </div>

        <NuxtLink class="primary-link" :to="isManagement ? '/restaurants/advertisement/add' : '/advertisement/add'">
          {{ isManagement ? 'Add Advertisement' : 'Add Food' }}
        </NuxtLink>

        <div class="popover-anchor">
          <button class="toolbar-button toolbar-button--dark" type="button" @click.stop="exportOpen = !exportOpen; filterOpen = false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3v11" />
              <path d="m8 10 4 4 4-4" />
              <path d="M5 21h14" />
            </svg>
            <span>Export</span>
            <svg class="caret-icon" viewBox="0 0 24 24" fill="none">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div v-if="exportOpen" class="menu-card" @click.stop>
            <button type="button" @click="exportRows('csv')">Export CSV</button>
            <button type="button" @click="exportRows('json')">Export JSON</button>
          </div>
        </div>
      </div>
    </div>

    <div class="pill-row advertisement-slots">
      <button
        v-for="(item, index) in (isManagement ? managementSlotOptions : customerSlotOptions)"
        :key="`${item}-${index}`"
        class="pill-button"
        :class="{ 'pill-button--active': slotFilter === item }"
        type="button"
        @click="slotFilter = item"
      >
        {{ item }}
      </button>
    </div>

    <div v-if="appliedCategory || appliedRating" class="filter-summary">
      <span>Filtered by</span>
      <div class="filter-chips">
        <span v-if="appliedCategory" class="filter-chip">{{ appliedCategory }}</span>
        <span v-if="appliedRating" class="filter-chip">{{ appliedRating }}</span>
        <button class="clear-link" type="button" @click="clearFilter">Clear all</button>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table advertisement-table">
        <thead>
          <tr v-if="isManagement">
            <th class="col-check"><input type="checkbox"></th>
            <th>Slot Name</th>
            <th>Restaurant</th>
            <th>Banner</th>
            <th>Date</th>
            <th>Bid Price</th>
            <th>Position</th>
            <th>Status</th>
            <th class="col-action">Action</th>
          </tr>
          <tr v-else>
            <th class="col-check"><input type="checkbox"></th>
            <th>Slot Name</th>
            <th>Banner</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody v-if="isManagement">
          <tr v-for="item in filteredAds" :key="item.id">
            <td class="col-check"><input type="checkbox"></td>
            <td>{{ item.slot.replace('01', 'A').replace('02', 'B').replace('03', 'C').replace('04', 'D') }}</td>
            <td>{{ item.restaurant }}</td>
            <td>
              <span v-if="!item.banner" class="ad-banner-empty">No Banner</span>
              <img v-else :src="item.banner" :alt="item.slot" class="ad-banner-thumb">
            </td>
            <td>{{ item.date }}</td>
            <td>{{ item.bidPrice }}</td>
            <td>{{ item.position }}</td>
            <td><span class="status-text status-text--pending">{{ item.status }}</span></td>
            <td class="col-action">
              <div class="action-anchor">
                <button class="icon-button icon-button--table" type="button" @click.stop="actionMenuId = actionMenuId === item.id ? null : item.id">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                </button>
                <div v-if="actionMenuId === item.id" class="row-menu" @click.stop>
                  <button type="button" @click="approveAd(item.id)">Approve</button>
                  <button type="button" @click="commentAd(item.id)">Comment</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="item in customerRows" :key="item.id">
            <td class="col-check"><input type="checkbox"></td>
            <td>{{ item.slot.replace('01', 'A').replace('02', 'B').replace('03', 'C').replace('04', 'D') }}</td>
            <td><img :src="item.banner || '/ads/we-love-you.svg'" :alt="item.slot" class="ad-banner-thumb"></td>
            <td>{{ item.date }}</td>
            <td>{{ item.price }}</td>
            <td>
              <span
                class="status-text"
                :class="{
                  'status-text--open': item.status === 'Active',
                  'status-text--cancelled': item.status === 'Cancelled',
                  'status-text--ontheway': item.status === 'Owned',
                }"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="col-action">
              <button class="icon-button icon-button--table" type="button">
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

    <div class="pagination-bar">
      <div class="page-chip">1 of 2</div>
      <div class="pagination-actions">
        <button class="page-button" type="button">&lt;</button>
        <button class="page-button page-button--active" type="button">1</button>
        <button class="page-button" type="button">2</button>
        <button class="page-button" type="button">3</button>
        <button class="page-button" type="button">4</button>
        <button class="page-button" type="button">5</button>
        <button class="page-button" type="button">&gt;</button>
      </div>
    </div>
  </section>
</template>
