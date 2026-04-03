<script setup lang="ts">
const { riders, updateRider } = useRiders()

const search = ref('')
const filterOpen = ref(false)
const exportOpen = ref(false)
const actionMenuId = ref<string | null>(null)
const selectedRows = ref<string[]>([])
const shiftFilter = ref('All')
const shiftDraft = ref('All')
const shifts = ['All', '10:00 AM - 3:00 PM', '4:00 PM - 10:00 PM'] as const

const filteredRiders = computed(() => {
  const query = search.value.trim().toLowerCase()

  return riders.value.filter((item) => {
    const matchesShift = shiftFilter.value === 'All' || item.shift === shiftFilter.value
    const matchesQuery = !query || [item.name, item.phone, item.address].some(value => value.toLowerCase().includes(query))
    return matchesShift && matchesQuery
  })
})

const allSelected = computed(() =>
  filteredRiders.value.length > 0 && filteredRiders.value.every(item => selectedRows.value.includes(item.id)),
)

const toggleRows = () => {
  if (allSelected.value) {
    selectedRows.value = selectedRows.value.filter(id => !filteredRiders.value.some(item => item.id === id))
    return
  }

  selectedRows.value = [...new Set([...selectedRows.value, ...filteredRiders.value.map(item => item.id)])]
}

const toggleRow = (id: string) => {
  selectedRows.value = selectedRows.value.includes(id)
    ? selectedRows.value.filter(item => item !== id)
    : [...selectedRows.value, id]
}

const applyFilter = () => {
  shiftFilter.value = shiftDraft.value
  filterOpen.value = false
}

const clearFilter = () => {
  shiftDraft.value = 'All'
  shiftFilter.value = 'All'
  filterOpen.value = false
}

const exportCsv = () => {
  if (!import.meta.client) {
    return
  }
  const content = [['Rider Name', 'Phone', 'Shift', 'Address'], ...filteredRiders.value.map(item => [item.name, item.phone, item.shift, item.address])]
    .map(row => row.join(','))
    .join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'riders.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  exportOpen.value = false
}

const toggleDisabled = (id: string) => {
  const rider = riders.value.find(item => item.id === id)
  if (!rider) {
    return
  }
  updateRider(id, { isActive: !rider.isActive })
  actionMenuId.value = null
}

useHead({ title: 'Rider List' })
</script>

<template>
  <section class="dashboard-card">
    <div class="section-bar">
      <h1 class="section-title">Riders</h1>
      <div class="toolbar">
        <label class="search-box">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m21 21-4.35-4.35" />
            <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
          </svg>
          <input v-model="search" type="text" placeholder="Search">
        </label>

        <div class="popover-anchor">
          <button class="toolbar-button" :class="{ 'toolbar-button--active': filterOpen }" type="button" @click.stop="shiftDraft = shiftFilter; filterOpen = !filterOpen; exportOpen = false">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16l-6 7v6l-4 1v-7L4 5Z" /></svg>
            <span>Filter</span>
          </button>
          <div v-if="filterOpen" class="menu-card menu-card--filter rider-filter-card" @click.stop>
            <h3>Filter</h3>
            <div class="field-block field-block--compact">
              <span>Shift</span>
              <select v-model="shiftDraft">
                <option v-for="item in shifts" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div class="menu-card__actions">
              <button type="button" @click="clearFilter">Clear Filter</button>
              <button type="button" @click="applyFilter">Apply Filter</button>
            </div>
          </div>
        </div>

        <NuxtLink class="primary-link" to="/restaurants/riders/add">Add Rider</NuxtLink>

        <div class="popover-anchor">
          <button class="toolbar-button toolbar-button--dark" type="button" @click.stop="exportOpen = !exportOpen; filterOpen = false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3v11" />
              <path d="m8 10 4 4 4-4" />
              <path d="M5 21h14" />
            </svg>
            <span>Export</span>
            <svg class="caret-icon" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-if="exportOpen" class="menu-card" @click.stop>
            <button type="button" @click="exportCsv">Download CSV</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table rider-table">
        <thead>
          <tr>
            <th class="col-check"><input type="checkbox" :checked="allSelected" @change="toggleRows"></th>
            <th>Rider Name</th>
            <th>Photo</th>
            <th>Phone</th>
            <th>Shift</th>
            <th>Address</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredRiders" :key="item.id">
            <td class="col-check"><input type="checkbox" :checked="selectedRows.includes(item.id)" @change="toggleRow(item.id)"></td>
            <td><NuxtLink class="table-link" :to="`/restaurants/riders/${item.id}`">{{ item.name }}</NuxtLink></td>
            <td><img :src="item.photo" :alt="item.name" class="table-avatar"></td>
            <td>{{ item.phone.replace('+', '') }}</td>
            <td>{{ item.shift }}</td>
            <td>{{ item.address }}</td>
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
                  <NuxtLink :to="`/restaurants/riders/${item.id}`">View</NuxtLink>
                  <NuxtLink :to="`/restaurants/riders/add?edit=${item.id}`">Edit</NuxtLink>
                  <button type="button" @click="toggleDisabled(item.id)">{{ item.isActive ? 'Disable' : 'Enable' }}</button>
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
