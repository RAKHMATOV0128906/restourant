<script setup lang="ts">
const { orders, money } = useOrders()

const vendor = ref<'Bindirigu' | 'Damm'>('Damm')
const search = ref('')
const statusFilter = ref<'All' | 'Pending' | 'Preparing' | 'On the way' | 'Delivered' | 'Cancelled'>('All')
const statusDraft = ref<'All' | 'Pending' | 'Preparing' | 'On the way' | 'Delivered' | 'Cancelled'>('All')
const filterOpen = ref(false)
const exportOpen = ref(false)
const actionMenuId = ref<string | null>(null)
const selectedRows = ref<string[]>([])
const statusOptions = ['All', 'Pending', 'Preparing', 'On the way', 'Delivered', 'Cancelled'] as const

const filteredOrders = computed(() => {
  const query = search.value.trim().toLowerCase()

  return orders.value.filter((order) => {
    const matchesVendor = order.vendor === vendor.value
    const matchesStatus = statusFilter.value === 'All' || order.status === statusFilter.value
    const matchesQuery = !query || [
      order.tableId,
      order.customerName,
      order.details,
      order.restaurant,
    ].some(value => value.toLowerCase().includes(query))

    return matchesVendor && matchesStatus && matchesQuery
  })
})

const allSelected = computed(() =>
  filteredOrders.value.length > 0 && filteredOrders.value.every(order => selectedRows.value.includes(order.id)),
)

const closeMenus = () => {
  filterOpen.value = false
  exportOpen.value = false
  actionMenuId.value = null
}

const openFilter = () => {
  statusDraft.value = statusFilter.value
  filterOpen.value = !filterOpen.value
  exportOpen.value = false
  actionMenuId.value = null
}

const toggleRows = () => {
  if (allSelected.value) {
    selectedRows.value = selectedRows.value.filter(id => !filteredOrders.value.some(order => order.id === id))
    return
  }

  selectedRows.value = [...new Set([...selectedRows.value, ...filteredOrders.value.map(order => order.id)])]
}

const toggleRow = (id: string) => {
  selectedRows.value = selectedRows.value.includes(id)
    ? selectedRows.value.filter(item => item !== id)
    : [...selectedRows.value, id]
}

const toggleActionMenu = (id: string) => {
  actionMenuId.value = actionMenuId.value === id ? null : id
  filterOpen.value = false
  exportOpen.value = false
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
  const rows = filteredOrders.value.map(order => [
    order.tableId,
    order.date,
    order.customerName,
    money(order.price),
    order.status,
  ])
  downloadFile(
    [['Order id', 'Date', 'Customer', 'Price', 'Status'], ...rows].map(row => row.join(',')).join('\n'),
    'damm-orders.csv',
    'text/csv;charset=utf-8;',
  )
  exportOpen.value = false
}

const applyFilter = () => {
  statusFilter.value = statusDraft.value
  filterOpen.value = false
}

const clearFilter = () => {
  statusDraft.value = 'All'
  statusFilter.value = 'All'
  filterOpen.value = false
}

const statusClass = (status: string) => ({
  'status-text': true,
  'status-text--pending': status === 'Pending',
  'status-text--preparing': status === 'Preparing',
  'status-text--cancelled': status === 'Cancelled',
  'status-text--delivered': status === 'Delivered' || status === 'Complete',
  'status-text--ontheway': status === 'On the way',
})

useHead({
  title: 'Damm Order List',
})
</script>

<template>
  <section class="dashboard-card" @click.self="closeMenus">
    <div class="section-bar">
      <h1 class="section-title">Orders</h1>

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
            <p class="menu-label">Status</p>
            <div class="order-filter-statuses">
              <label v-for="item in statusOptions.slice(1)" :key="item" class="check-option">
                <input
                  type="radio"
                  name="order-status"
                  :checked="statusDraft === item"
                  @change="statusDraft = item"
                >
                <span>{{ item }}</span>
              </label>
            </div>
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
      <button class="pill-button" :class="{ 'pill-button--active': vendor === 'Bindirigu' }" type="button" @click="vendor = 'Bindirigu'">
        Bindirigu
      </button>
      <button class="pill-button" :class="{ 'pill-button--active': vendor === 'Damm' }" type="button" @click="vendor = 'Damm'">
        Damm
      </button>
    </div>

    <div class="pill-row pill-row--secondary">
      <button
        v-for="item in statusOptions"
        :key="item"
        class="pill-button"
        :class="{ 'pill-button--active': statusFilter === item }"
        type="button"
        @click="statusFilter = item"
      >
        {{ item }}
      </button>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-check">
              <input type="checkbox" :checked="allSelected" @change="toggleRows">
            </th>
            <th>Order id</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Price</th>
            <th>Status</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="col-check">
              <input type="checkbox" :checked="selectedRows.includes(order.id)" @change="toggleRow(order.id)">
            </td>
            <td>{{ order.tableId }}</td>
            <td>{{ order.date }}</td>
            <td>
              <div class="order-customer-cell">
                <img :src="order.customerAvatar" :alt="order.customerName" class="table-avatar">
                <span>{{ order.customerName }}</span>
              </div>
            </td>
            <td>{{ money(order.price) }}</td>
            <td>
              <span :class="statusClass(order.status)">{{ order.status }}</span>
            </td>
            <td class="col-action">
              <div class="action-anchor">
                <button class="icon-button icon-button--table" type="button" @click.stop="toggleActionMenu(order.id)">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                </button>

                <div v-if="actionMenuId === order.id" class="row-menu" @click.stop>
                  <NuxtLink :to="`/orders/${order.id}`">View</NuxtLink>
                  <NuxtLink :to="`/customers/${order.customerId}?tab=orders&detail=${order.id}`">Customer</NuxtLink>
                </div>
              </div>
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
