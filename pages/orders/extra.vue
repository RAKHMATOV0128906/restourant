<script setup lang="ts">
const { dammProducts, removeDammProduct, updateDammProduct } = useOrders()

const search = ref('')
const filterOpen = ref(false)
const exportOpen = ref(false)
const actionMenuId = ref<string | null>(null)
const categoryDraft = ref('All')
const statusDraft = ref('All')
const appliedCategory = ref('All')
const appliedStatus = ref('All')

const categoryOptions = computed(() => ['All', ...new Set(dammProducts.value.map(item => item.category))])
const statusOptions = ['All', 'Active', 'Deactive'] as const

const filteredProducts = computed(() =>
  dammProducts.value.filter((item) => {
    const query = search.value.trim().toLowerCase()
    const matchesQuery = !query || [item.name, item.category, item.weight, item.price].some(value => value.toLowerCase().includes(query))
    const matchesCategory = appliedCategory.value === 'All' || item.category === appliedCategory.value
    const matchesStatus = appliedStatus.value === 'All' || item.status === appliedStatus.value
    return matchesQuery && matchesCategory && matchesStatus
  }),
)

const closeMenus = () => {
  filterOpen.value = false
  exportOpen.value = false
  actionMenuId.value = null
}

const openFilter = () => {
  categoryDraft.value = appliedCategory.value
  statusDraft.value = appliedStatus.value
  filterOpen.value = !filterOpen.value
  exportOpen.value = false
}

const applyFilter = () => {
  appliedCategory.value = categoryDraft.value
  appliedStatus.value = statusDraft.value
  filterOpen.value = false
}

const clearFilter = () => {
  categoryDraft.value = 'All'
  statusDraft.value = 'All'
  appliedCategory.value = 'All'
  appliedStatus.value = 'All'
  filterOpen.value = false
}

const toggleActionMenu = (id: string) => {
  actionMenuId.value = actionMenuId.value === id ? null : id
}

const toggleStatus = (id: string) => {
  const product = dammProducts.value.find(item => item.id === id)
  if (!product) {
    return
  }

  updateDammProduct(id, {
    status: product.status === 'Active' ? 'Deactive' : 'Active',
  })
  actionMenuId.value = null
}

const deleteProduct = (id: string) => {
  removeDammProduct(id)
  actionMenuId.value = null
}

const exportRows = (type: 'csv' | 'json') => {
  const rows = filteredProducts.value
  const filename = `damm-list.${type}`
  const content = type === 'json'
    ? JSON.stringify(rows, null, 2)
    : [
        ['id', 'name', 'category', 'alcohol', 'weight', 'price', 'status'].join(','),
        ...rows.map(item => [item.id, item.name, item.category, item.alcohol, item.weight, item.price, item.status].join(',')),
      ].join('\n')

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

useHead({
  title: 'Damm List',
})
</script>

<template>
  <section class="dashboard-card" @click.self="closeMenus">
    <h2 class="wallet-page-title damm-page-title">Damm list</h2>

    <div class="dashboard-card dashboard-card--inner">
      <div class="section-bar">
        <h1 class="section-title">Damm</h1>

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

            <div v-if="filterOpen" class="menu-card menu-card--filter damm-filter-card" @click.stop>
              <h3>Filter</h3>
              <p class="menu-label">Price Range</p>
              <div class="range-line">
                <span class="range-dot"></span>
                <span class="range-track"></span>
                <span class="range-dot"></span>
                <strong>GHC 0- GHC 1000</strong>
              </div>
              <label class="field-block field-block--compact">
                <span>Category</span>
                <select v-model="categoryDraft">
                  <option v-for="item in categoryOptions" :key="item">{{ item }}</option>
                </select>
              </label>
              <label class="field-block field-block--compact">
                <span>Status</span>
                <select v-model="statusDraft">
                  <option v-for="item in statusOptions" :key="item">{{ item }}</option>
                </select>
              </label>
              <div class="menu-card__actions">
                <button type="button" @click="clearFilter">Clear Filter</button>
                <button type="button" @click="applyFilter">Apply Filter</button>
              </div>
            </div>
          </div>

          <NuxtLink class="primary-link" to="/orders/add">Add Food</NuxtLink>

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

      <div v-if="appliedCategory !== 'All' || appliedStatus !== 'All'" class="filter-summary">
        <span>Filtered by</span>
        <div class="filter-chips">
          <span class="filter-chip">Price Range-GHC 0- GHC 1000</span>
          <span v-if="appliedCategory !== 'All'" class="filter-chip">{{ appliedCategory }}</span>
          <span v-if="appliedStatus !== 'All'" class="filter-chip">{{ appliedStatus }}</span>
          <button class="clear-link" type="button" @click="clearFilter">Clear all</button>
        </div>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-check"><input type="checkbox"></th>
              <th>Name</th>
              <th>Image</th>
              <th>Category</th>
              <th>Alc %</th>
              <th>Weight</th>
              <th>Price</th>
              <th>Status</th>
              <th class="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredProducts" :key="item.id">
              <td class="col-check"><input type="checkbox"></td>
              <td>{{ item.name }}</td>
              <td><img :src="item.image" :alt="item.name" class="menu-thumb damm-thumb"></td>
              <td>{{ item.category }}</td>
              <td>{{ item.alcohol }}</td>
              <td>{{ item.weight }}</td>
              <td>{{ item.price }}</td>
              <td>
                <span class="status-text" :class="item.status === 'Active' ? 'status-text--open' : 'status-text--closed'">
                  {{ item.status }}
                </span>
              </td>
              <td class="col-action">
                <div class="action-anchor">
                  <button class="icon-button icon-button--table" type="button" @click.stop="toggleActionMenu(item.id)">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                      <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                      <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    </svg>
                  </button>
                  <div v-if="actionMenuId === item.id" class="row-menu" @click.stop>
                    <NuxtLink to="/orders/12009">View</NuxtLink>
                    <NuxtLink :to="`/orders/add?edit=${item.id}`">Edit</NuxtLink>
                    <button type="button" @click="toggleStatus(item.id)">{{ item.status === 'Active' ? 'Deactivate' : 'Activate' }}</button>
                    <button type="button" @click="deleteProduct(item.id)">Delete</button>
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
    </div>
  </section>
</template>
