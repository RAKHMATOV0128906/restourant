<script setup lang="ts">
const { sales } = useFinance()

const period = ref<'All' | 'This Week' | 'This Month' | 'This Year'>('All')
const search = ref('')
const exportOpen = ref(false)
const filterOpen = ref(false)
const selectedRows = ref<string[]>([])
const categoryFilter = ref('All')
const categoryDraft = ref('All')
const durationDraft = ref<'All' | 'This Week' | 'This Month' | 'This Year'>('All')
const periodDraft = ref<'All' | 'This Week' | 'This Month' | 'This Year'>('All')

const categories = ['All', 'Pizza', 'Burger', 'Appetizer']

const visibleSales = computed(() => {
  const query = search.value.trim().toLowerCase()
  return sales.value.filter((item) => {
    const matchesPeriod = period.value === 'All' || item.period === period.value
    const matchesCategory = categoryFilter.value === 'All' || item.category === categoryFilter.value
    const matchesQuery = !query || [item.name, item.category].some(value => value.toLowerCase().includes(query))
    return matchesPeriod && matchesCategory && matchesQuery
  })
})

const allSelected = computed(() =>
  visibleSales.value.length > 0 && visibleSales.value.every(item => selectedRows.value.includes(item.id)),
)

const openFilter = () => {
  categoryDraft.value = categoryFilter.value
  periodDraft.value = period.value
  filterOpen.value = !filterOpen.value
  exportOpen.value = false
}

const applyFilter = () => {
  categoryFilter.value = categoryDraft.value
  period.value = periodDraft.value
  filterOpen.value = false
}

const clearFilter = () => {
  categoryDraft.value = 'All'
  categoryFilter.value = 'All'
  periodDraft.value = 'All'
  period.value = 'All'
  filterOpen.value = false
}

const toggleAllRows = () => {
  if (allSelected.value) {
    selectedRows.value = selectedRows.value.filter(id => !visibleSales.value.some(item => item.id === id))
    return
  }

  selectedRows.value = [...new Set([...selectedRows.value, ...visibleSales.value.map(item => item.id)])]
}

const toggleRow = (id: string) => {
  selectedRows.value = selectedRows.value.includes(id)
    ? selectedRows.value.filter(item => item !== id)
    : [...selectedRows.value, id]
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
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const exportCsv = () => {
  const rows = visibleSales.value.map(item => [item.name, item.category, item.price, `${item.salesCount} Sales`])
  downloadFile(
    [['Name', 'Category', 'Price', 'Number of Sales'], ...rows].map(row => row.join(',')).join('\n'),
    'sales.csv',
    'text/csv;charset=utf-8;',
  )
  exportOpen.value = false
}

useHead({
  title: 'Sales',
})
</script>

<template>
  <section class="dashboard-card">
    <div class="section-bar">
      <h1 class="section-title">Sales</h1>
      <div class="toolbar">
        <label class="search-box">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m21 21-4.35-4.35" />
            <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
          </svg>
          <input v-model="search" type="text" placeholder="Search">
        </label>

        <div class="popover-anchor">
          <button class="toolbar-button" :class="{ 'toolbar-button--active': filterOpen }" type="button" @click.stop="openFilter">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16l-6 7v6l-4 1v-7L4 5Z" />
            </svg>
            <span>Filter</span>
          </button>
          <div v-if="filterOpen" class="menu-card menu-card--filter order-filter-card" @click.stop>
            <h3>Filter</h3>
            <p class="menu-label">Category</p>
            <label class="field-block field-block--compact">
              <select v-model="categoryDraft">
                <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>
            <p class="menu-label">Duration</p>
            <label class="field-block field-block--compact">
              <select v-model="periodDraft">
                <option value="All">All</option>
                <option value="This Week">This week</option>
                <option value="This Month">This month</option>
                <option value="This Year">This year</option>
              </select>
            </label>
            <div class="menu-card__actions">
              <button type="button" @click="clearFilter">Clear Filter</button>
              <button type="button" @click="applyFilter">Apply Filter</button>
            </div>
          </div>
        </div>

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
            <button type="button" @click="exportCsv">Download CSV</button>
          </div>
        </div>
      </div>
    </div>

    <div class="pill-row">
      <button class="pill-button" :class="{ 'pill-button--active': period === 'All' }" type="button" @click="period = 'All'">All</button>
      <button class="pill-button" :class="{ 'pill-button--active': period === 'This Week' }" type="button" @click="period = 'This Week'">This Week</button>
      <button class="pill-button" :class="{ 'pill-button--active': period === 'This Month' }" type="button" @click="period = 'This Month'">This Month</button>
      <button class="pill-button" :class="{ 'pill-button--active': period === 'This Year' }" type="button" @click="period = 'This Year'">This Year</button>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-check"><input type="checkbox" :checked="allSelected" @change="toggleAllRows"></th>
            <th>Name</th>
            <th>Image</th>
            <th>Category</th>
            <th>Price</th>
            <th>Number Of Sales</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in visibleSales" :key="item.id">
            <td class="col-check"><input type="checkbox" :checked="selectedRows.includes(item.id)" @change="toggleRow(item.id)"></td>
            <td>{{ item.name }}</td>
            <td><img :src="item.image" :alt="item.name" class="menu-thumb"></td>
            <td>{{ item.category }}</td>
            <td>{{ item.price }}</td>
            <td><span class="sales-count">{{ item.salesCount }} Sales</span></td>
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
      <div class="page-chip">1 of 9</div>
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
