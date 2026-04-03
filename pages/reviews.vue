<script setup lang="ts">
useHead({ title: 'Reviews' })

const { foods } = useMenu()

type ReviewStatus = 'Active' | 'Disabled'

type ReviewRow = {
  id: string
  name: string
  date: string
  review: string
  rating: string
  status: ReviewStatus
}

const search = ref('')
const exportOpen = ref(false)
const actionMenuId = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const reviewRows = useState<ReviewRow[]>('reviews-page-rows', () =>
  foods.value.map((item, index) => ({
    id: `review-${index + 1}`,
    name: item.name,
    date: 'Feb 08, 2022',
    review: "I'm very much happy. Food is good.",
    rating: '4.8',
    status: 'Active',
  })),
)

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  const rows = reviewRows.value.filter(item =>
    !query || [item.name, item.review, item.date].some(value => value.toLowerCase().includes(query)),
  )

  return [...rows].sort((a, b) =>
    sortDirection.value === 'asc'
      ? Number(a.rating) - Number(b.rating)
      : Number(b.rating) - Number(a.rating),
  )
})

const closeMenus = () => {
  exportOpen.value = false
  actionMenuId.value = null
}

const exportRows = (type: 'csv' | 'json') => {
  const rows = filteredRows.value
  const filename = `reviews.${type}`
  const content = type === 'json'
    ? JSON.stringify(rows, null, 2)
    : [['name', 'date', 'review', 'rating', 'status'], ...rows.map(item => [item.name, item.date, item.review, item.rating, item.status])].map(row => row.join(',')).join('\n')

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

const disableRow = (id: string) => {
  reviewRows.value = reviewRows.value.map(item =>
    item.id === id ? { ...item, status: item.status === 'Active' ? 'Disabled' : 'Active' } : item,
  )
  actionMenuId.value = null
}

const viewDetails = (id: string) => {
  const food = foods.value.find((_, index) => `review-${index + 1}` === id)
  actionMenuId.value = null
  if (food) navigateTo(`/menu/food-list/${food.id}`)
}
</script>

<template>
  <section class="dashboard-card" @click.self="closeMenus">
    <div class="section-bar">
      <h1 class="section-title">Reviews</h1>

      <div class="toolbar">
        <label class="search-box">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m21 21-4.35-4.35" />
            <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
          </svg>
          <input v-model="search" type="text" placeholder="Search">
        </label>

        <div class="popover-anchor">
          <button class="toolbar-button toolbar-button--dark" type="button" @click.stop="exportOpen = !exportOpen">
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

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-check"><input type="checkbox"></th>
            <th>Name</th>
            <th>Date</th>
            <th>Review</th>
            <th>
              <button class="sort-button" type="button" @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'">
                <span>Ratings</span>
                <span>{{ sortDirection === 'asc' ? '↑↓' : '↓↑' }}</span>
              </button>
            </th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredRows" :key="item.id">
            <td class="col-check"><input type="checkbox"></td>
            <td>{{ item.name }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.review }}</td>
            <td>
              <span class="rating-value">
                <svg class="rating-star" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3.6 2.57 5.2 5.73.84-4.15 4.05.98 5.71L12 16.7l-5.13 2.7.98-5.71L3.7 9.64l5.73-.84L12 3.6Z" />
                </svg>
                {{ item.rating }}
              </span>
            </td>
            <td class="col-action">
              <div class="action-anchor">
                <button class="icon-button icon-button--table" type="button" @click.stop="actionMenuId = actionMenuId === item.id ? null : item.id">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                </button>

                <div v-if="actionMenuId === item.id" class="row-menu" @click.stop>
                  <button type="button" @click="viewDetails(item.id)">View Details</button>
                  <button type="button" @click="disableRow(item.id)">
                    {{ item.status === 'Active' ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </div>
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
