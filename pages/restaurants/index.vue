<script setup lang="ts">
import type { RestaurantItem, RestaurantStatus } from '~/composables/useRestaurants'

const { restaurants, updateRestaurant } = useRestaurants()

const search = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = 6
const filterOpen = ref(false)
const actionMenuId = ref<string | null>(null)
const exportOpen = ref(false)
const selectedRows = ref<string[]>([])

const filters = reactive({
  location: '',
  rating: '',
  status: '',
})

const filterDraft = reactive({
  location: '',
  rating: '',
  status: '',
})

const locationOptions = computed(() =>
  [...new Set(restaurants.value.map(item => item.location))],
)

const ratingOptions = [
  { label: '4.0+', value: '4' },
  { label: '4.5+', value: '4.5' },
  { label: '4.8+', value: '4.8' },
]

const statusOptions: RestaurantStatus[] = ['Open', 'Closed']

const hasActiveFilters = computed(() =>
  Boolean(filters.location || filters.rating || filters.status),
)

const filterChips = computed(() => {
  const chips: string[] = []

  if (filters.location) {
    chips.push(filters.location)
  }

  if (filters.rating) {
    chips.push(`Rating ${filters.rating}+`)
  }

  if (filters.status) {
    chips.push(filters.status)
  }

  return chips
})

const filteredRestaurants = computed(() => {
  const query = search.value.trim().toLowerCase()

  return restaurants.value
    .filter((restaurant) => {
      const matchesSearch =
        !query ||
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.representative.toLowerCase().includes(query) ||
        restaurant.location.toLowerCase().includes(query) ||
        restaurant.phone.toLowerCase().includes(query)

      const matchesLocation =
        !filters.location || restaurant.location === filters.location

      const matchesStatus =
        !filters.status || restaurant.status === filters.status

      const matchesRating =
        !filters.rating || restaurant.rating >= Number(filters.rating)

      return matchesSearch && matchesLocation && matchesStatus && matchesRating
    })
    .sort((a, b) => {
      const multiplier = sortDirection.value === 'asc' ? 1 : -1
      return a.name.localeCompare(b.name) * multiplier
    })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRestaurants.value.length / pageSize)),
)

const visibleRestaurants = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRestaurants.value.slice(start, start + pageSize)
})

const allVisibleSelected = computed(() =>
  visibleRestaurants.value.length > 0 &&
  visibleRestaurants.value.every(item => selectedRows.value.includes(item.id)),
)

watch(
  [search, () => filters.location, () => filters.rating, () => filters.status],
  () => {
    currentPage.value = 1
  },
)

watch(filteredRestaurants, (items) => {
  if ((currentPage.value - 1) * pageSize >= items.length && currentPage.value > 1) {
    currentPage.value = totalPages.value
  }
})

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const clearFilter = () => {
  filterDraft.location = ''
  filterDraft.rating = ''
  filterDraft.status = ''
  filters.location = ''
  filters.rating = ''
  filters.status = ''
  filterOpen.value = false
}

const applyFilter = () => {
  filters.location = filterDraft.location
  filters.rating = filterDraft.rating
  filters.status = filterDraft.status
  filterOpen.value = false
}

const toggleActionMenu = (id: string) => {
  exportOpen.value = false
  actionMenuId.value = actionMenuId.value === id ? null : id
}

const deactivate = (restaurant: RestaurantItem) => {
  updateRestaurant(restaurant.id, {
    status: restaurant.status === 'Open' ? 'Closed' : 'Open',
  })
  actionMenuId.value = null
}

const toggleAllRows = () => {
  if (allVisibleSelected.value) {
    selectedRows.value = selectedRows.value.filter(
      id => !visibleRestaurants.value.some(item => item.id === id),
    )
    return
  }

  const merged = new Set([...selectedRows.value, ...visibleRestaurants.value.map(item => item.id)])
  selectedRows.value = [...merged]
}

const toggleRow = (id: string) => {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(item => item !== id)
    return
  }

  selectedRows.value = [...selectedRows.value, id]
}

const closeMenus = () => {
  actionMenuId.value = null
  exportOpen.value = false
  filterOpen.value = false
}

const openFilter = () => {
  filterDraft.location = filters.location
  filterDraft.rating = filters.rating
  filterDraft.status = filters.status
  filterOpen.value = !filterOpen.value
  exportOpen.value = false
  actionMenuId.value = null
}

const downloadFile = (content: string, filename: string, type: string) => {
  if (!import.meta.client) {
    return
  }

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const exportCsv = () => {
  const header = ['Name', 'Representative', 'Location', 'Phone Number', 'Ratings', 'Status']
  const rows = filteredRestaurants.value.map(restaurant => [
    restaurant.name,
    restaurant.representative,
    restaurant.location,
    restaurant.phone,
    restaurant.rating.toFixed(1),
    restaurant.status,
  ])

  const csv = [header, ...rows].map(row => row.join(',')).join('\n')
  downloadFile(csv, 'restaurants.csv', 'text/csv;charset=utf-8;')
  exportOpen.value = false
}

const exportJson = () => {
  downloadFile(
    JSON.stringify(filteredRestaurants.value, null, 2),
    'restaurants.json',
    'application/json;charset=utf-8;',
  )
  exportOpen.value = false
}

useHead({
  title: 'Restaurant List',
})
</script>

<template>
  <section class="dashboard-card" @click.self="closeMenus">
    <div class="section-bar">
      <div>
        <h1 class="section-title">Restaurants</h1>
      </div>

      <div class="toolbar">
        <label class="search-box">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m21 21-4.35-4.35" />
            <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
          </svg>
          <input v-model="search" type="text" placeholder="Search">
        </label>

        <div class="popover-anchor">
          <button
            class="toolbar-button"
            type="button"
            :class="{ 'toolbar-button--active': filterOpen }"
            @click.stop="openFilter"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16l-6 7v6l-4 1v-7L4 5Z" />
            </svg>
            <span>Filter</span>
          </button>

          <div v-if="filterOpen" class="filter-card" @click.stop>
            <div class="section-title section-title--small">Filter</div>

            <label class="field-block">
              <span>Location</span>
              <select v-model="filterDraft.location">
                <option value="">Select Category</option>
                <option
                  v-for="location in locationOptions"
                  :key="location"
                  :value="location"
                >
                  {{ location }}
                </option>
              </select>
            </label>

            <label class="field-block">
              <span>Rating</span>
              <select v-model="filterDraft.rating">
                <option value="">Select Category</option>
                <option
                  v-for="rating in ratingOptions"
                  :key="rating.value"
                  :value="rating.value"
                >
                  {{ rating.label }}
                </option>
              </select>
            </label>

            <label class="field-block">
              <span>Status</span>
              <select v-model="filterDraft.status">
                <option value="">Select Status</option>
                <option
                  v-for="status in statusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </label>

            <div class="inline-actions">
              <button class="ghost-button" type="button" @click="clearFilter">
                Clear Filter
              </button>
              <button class="primary-button primary-button--inline" type="button" @click="applyFilter">
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        <NuxtLink class="primary-link" to="/restaurants/add">
          Add Restaurant
        </NuxtLink>

        <div class="popover-anchor">
          <button
            class="toolbar-button toolbar-button--dark"
            type="button"
            @click.stop="exportOpen = !exportOpen; filterOpen = false; actionMenuId = null"
          >
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
            <button type="button" @click="exportCsv">
              Download CSV
            </button>
            <button type="button" @click="exportJson">
              Download JSON
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="filter-summary">
      <span>Filtered by</span>
      <div class="filter-chips">
        <span v-for="chip in filterChips" :key="chip" class="filter-chip">{{ chip }}</span>
      </div>
      <button class="clear-link" type="button" @click="clearFilter">
        Clear all
      </button>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-check">
              <input
                type="checkbox"
                :checked="allVisibleSelected"
                @change="toggleAllRows"
              >
            </th>
            <th>
              <button class="sort-button" type="button" @click="toggleSort">
                Name
                <span>{{ sortDirection === 'asc' ? 'A-Z' : 'Z-A' }}</span>
              </button>
            </th>
            <th>Representative</th>
            <th>Location</th>
            <th>Phone Number</th>
            <th>Ratings</th>
            <th>Status</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="restaurant in visibleRestaurants" :key="restaurant.id">
            <td class="col-check">
              <input
                type="checkbox"
                :checked="selectedRows.includes(restaurant.id)"
                @change="toggleRow(restaurant.id)"
              >
            </td>
            <td>{{ restaurant.name }}</td>
            <td>{{ restaurant.representative }}</td>
            <td>{{ restaurant.location }}</td>
            <td>{{ restaurant.phone }}</td>
            <td>
              <span class="rating-value">
                <svg class="rating-star" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3.6 2.58 5.23 5.77.84-4.17 4.07.98 5.75L12 16.78 6.84 19.49l.98-5.75-4.17-4.07 5.77-.84L12 3.6Z" />
                </svg>
                {{ restaurant.rating.toFixed(1) }}
              </span>
            </td>
            <td>
              <span
                class="status-text"
                :class="restaurant.status === 'Open' ? 'status-text--open' : 'status-text--closed'"
              >
                {{ restaurant.status }}
              </span>
            </td>
            <td class="col-action">
              <div class="action-anchor">
                <button
                  class="icon-button icon-button--table"
                  type="button"
                  @click.stop="toggleActionMenu(restaurant.id)"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                </button>

                <div v-if="actionMenuId === restaurant.id" class="row-menu" @click.stop>
                  <NuxtLink :to="`/restaurants/${restaurant.id}`">
                    <svg class="menu-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </NuxtLink>
                  <NuxtLink :to="`/restaurants/add?edit=${restaurant.id}`">
                    <svg class="menu-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                      <path d="m12 6 4 4" />
                    </svg>
                    Edit
                  </NuxtLink>
                  <button type="button" @click="deactivate(restaurant)">
                    <svg class="menu-icon" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="7" width="16" height="10" rx="5" />
                      <circle cx="9" cy="12" r="3" fill="currentColor" stroke="none" />
                    </svg>
                    {{ restaurant.status === 'Open' ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!visibleRestaurants.length" class="empty-state">
        No restaurants found for the current search and filters.
      </div>
    </div>

    <div class="pagination-bar">
      <div class="page-chip">{{ currentPage }} of {{ totalPages }}</div>

      <div class="pagination-actions">
        <button
          class="page-button"
          type="button"
          :disabled="currentPage === 1"
          @click="currentPage -= 1"
        >
          &lt;
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-button"
          :class="{ 'page-button--active': page === currentPage }"
          type="button"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button
          class="page-button"
          type="button"
          :disabled="currentPage === totalPages"
          @click="currentPage += 1"
        >
          &gt;
        </button>
      </div>
    </div>
  </section>
</template>
