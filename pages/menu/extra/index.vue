<script setup lang="ts">
const { extras, removeExtra, updateExtra } = useMenu()

const actionMenuId = ref<string | null>(null)
const filterOpen = ref(false)
const exportOpen = ref(false)
const search = ref('')
const selectedStatus = ref('All')
const statusOptions = ['All', 'Active', 'Deactive'] as const

const filteredExtras = computed(() =>
  extras.value.filter((extra) => {
    const query = search.value.trim().toLowerCase()
    const matchesQuery = !query || [extra.name, extra.price].some(value => value.toLowerCase().includes(query))
    const matchesStatus = selectedStatus.value === 'All' || extra.status === selectedStatus.value
    return matchesQuery && matchesStatus
  }),
)

const toggleActionMenu = (id: string) => {
  actionMenuId.value = actionMenuId.value === id ? null : id
}

const closeMenus = () => {
  actionMenuId.value = null
  filterOpen.value = false
  exportOpen.value = false
}

const clearFilter = () => {
  selectedStatus.value = 'All'
  filterOpen.value = false
}

const removeExtraItem = (id: string) => {
  removeExtra(id)
  actionMenuId.value = null
}

const toggleExtraStatus = (id: string) => {
  const extra = extras.value.find(item => item.id === id)
  if (!extra) {
    return
  }

  updateExtra(id, {
    status: extra.status === 'Active' ? 'Deactive' : 'Active',
  })
  actionMenuId.value = null
}

const exportRows = (type: 'csv' | 'json') => {
  const rows = filteredExtras.value
  const filename = `extra-list.${type}`
  const content = type === 'json'
    ? JSON.stringify(rows, null, 2)
    : [
        ['id', 'name', 'price', 'status'].join(','),
        ...rows.map(item => [item.id, item.name, item.price, item.status].join(',')),
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
  title: 'Extra List',
})
</script>

<template>
  <section class="dashboard-card" @click="closeMenus">
    <div class="section-bar">
      <h1 class="section-title">Extra</h1>

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

          <div v-if="filterOpen" class="menu-card menu-card--filter order-filter-card" @click.stop>
            <h3>Filter</h3>
            <label class="field-block field-block--compact">
              <span>Status</span>
              <select v-model="selectedStatus">
                <option v-for="item in statusOptions" :key="item">{{ item }}</option>
              </select>
            </label>
            <div class="menu-card__actions">
              <button type="button" @click="clearFilter">Clear Filter</button>
              <button type="button" @click="filterOpen = false">Apply Filter</button>
            </div>
          </div>
        </div>

        <NuxtLink class="primary-link" to="/menu/extra/add">
          Add Food
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

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-check"><input type="checkbox"></th>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Status</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="extra in filteredExtras" :key="extra.id">
            <td class="col-check"><input type="checkbox"></td>
            <td>{{ extra.name }}</td>
            <td><img class="menu-thumb" :src="extra.image" :alt="extra.name"></td>
            <td>{{ extra.price }}</td>
            <td>
              <span class="status-text" :class="extra.status === 'Active' ? 'status-text--open' : 'status-text--closed'">
                {{ extra.status }}
              </span>
            </td>
            <td class="col-action">
              <div class="action-anchor">
                <button class="icon-button icon-button--table" type="button" @click.stop="toggleActionMenu(extra.id)">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                </button>

                <div v-if="actionMenuId === extra.id" class="row-menu" @click.stop>
                  <NuxtLink :to="`/menu/extra/add?edit=${extra.id}`">Edit</NuxtLink>
                  <button type="button" @click="removeExtraItem(extra.id)">Delete</button>
                  <button type="button" @click="toggleExtraStatus(extra.id)">
                    {{ extra.status === 'Active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredExtras.length">
            <td colspan="6" class="empty-state">No extra items found.</td>
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
