<script setup lang="ts">
import type { CustomerItem } from '~/composables/useCustomers'

const { customers, updateCustomer } = useCustomers()

const search = ref('')
const currentPage = ref(1)
const pageSize = 10
const exportOpen = ref(false)
const actionMenuId = ref<string | null>(null)
const selectedRows = ref<string[]>([])
const sortDirection = ref<'asc' | 'desc'>('asc')
const filterOpen = ref(false)

const filteredCustomers = computed(() => {
  const query = search.value.trim().toLowerCase()

  return customers.value
    .filter((customer) => {
      if (!query) {
        return true
      }

      return [customer.name, customer.phone, customer.email, customer.location]
        .some(value => value.toLowerCase().includes(query))
    })
    .sort((a, b) => {
      const multiplier = sortDirection.value === 'asc' ? 1 : -1
      return a.name.localeCompare(b.name) * multiplier
    })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCustomers.value.length / pageSize)))

const visibleCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCustomers.value.slice(start, start + pageSize)
})

const allVisibleSelected = computed(() =>
  visibleCustomers.value.length > 0 &&
  visibleCustomers.value.every(item => selectedRows.value.includes(item.id)),
)

watch(search, () => {
  currentPage.value = 1
})

watch(filteredCustomers, (items) => {
  if ((currentPage.value - 1) * pageSize >= items.length && currentPage.value > 1) {
    currentPage.value = totalPages.value
  }
})

const closeMenus = () => {
  exportOpen.value = false
  actionMenuId.value = null
  filterOpen.value = false
}

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const toggleAllRows = () => {
  if (allVisibleSelected.value) {
    selectedRows.value = selectedRows.value.filter(
      id => !visibleCustomers.value.some(item => item.id === id),
    )
    return
  }

  const merged = new Set([...selectedRows.value, ...visibleCustomers.value.map(item => item.id)])
  selectedRows.value = [...merged]
}

const toggleRow = (id: string) => {
  selectedRows.value = selectedRows.value.includes(id)
    ? selectedRows.value.filter(item => item !== id)
    : [...selectedRows.value, id]
}

const toggleActionMenu = (id: string) => {
  exportOpen.value = false
  filterOpen.value = false
  actionMenuId.value = actionMenuId.value === id ? null : id
}

const toggleStatus = (customer: CustomerItem) => {
  updateCustomer(customer.id, {
    status: customer.status === 'Active' ? 'Disabled' : 'Active',
  })
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
  link.click()
  URL.revokeObjectURL(url)
}

const exportCsv = () => {
  const header = ['Name', 'Phone', 'Email', 'Location', 'Created', 'Status']
  const rows = filteredCustomers.value.map(customer => [
    customer.name,
    customer.phone,
    customer.email,
    customer.location,
    customer.joinedAt,
    customer.status,
  ])

  downloadFile([header, ...rows].map(row => row.join(',')).join('\n'), 'customers.csv', 'text/csv;charset=utf-8;')
  exportOpen.value = false
}

useHead({
  title: 'Customer List',
})
</script>

<template>
  <section class="dashboard-card" @click.self="closeMenus">
    <div class="section-bar">
      <h1 class="section-title">Customer</h1>

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
            :class="{ 'toolbar-button--active': filterOpen }"
            type="button"
            @click.stop="filterOpen = !filterOpen; exportOpen = false; actionMenuId = null"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16l-6 7v6l-4 1v-7L4 5Z" />
            </svg>
            <span>Filter</span>
          </button>

          <div v-if="filterOpen" class="menu-card menu-card--filter" @click.stop>
            <p>Location</p>
            <p>Rating</p>
            <p>Status</p>
            <div class="menu-card__actions">
              <button type="button" @click="filterOpen = false">Clear</button>
              <button type="button" @click="filterOpen = false">Apply</button>
            </div>
          </div>
        </div>

        <NuxtLink class="primary-link" to="/customers/add">
          Add Customer
        </NuxtLink>

        <div class="popover-anchor">
          <button
            class="toolbar-button toolbar-button--dark"
            type="button"
            @click.stop="exportOpen = !exportOpen; actionMenuId = null"
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
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table data-table--customers">
        <thead>
          <tr>
            <th class="col-check">
              <input type="checkbox" :checked="allVisibleSelected" @change="toggleAllRows">
            </th>
            <th>
              <button class="sort-button" type="button" @click="toggleSort">
                Name
                <span>{{ sortDirection === 'asc' ? 'A-Z' : 'Z-A' }}</span>
              </button>
            </th>
            <th>Phone</th>
            <th>Email</th>
            <th>Location</th>
            <th>Created</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="customer in visibleCustomers" :key="customer.id">
            <td class="col-check">
              <input
                type="checkbox"
                :checked="selectedRows.includes(customer.id)"
                @change="toggleRow(customer.id)"
              >
            </td>
            <td>
              <NuxtLink :to="`/customers/${customer.id}`" class="customer-cell">
                <img :src="customer.avatar" :alt="customer.name" class="table-avatar">
                <span>{{ customer.name }}</span>
              </NuxtLink>
            </td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.location }}</td>
            <td>{{ customer.joinedAt }}</td>
            <td class="col-action">
              <div class="action-anchor">
                <button
                  class="icon-button icon-button--table"
                  type="button"
                  @click.stop="toggleActionMenu(customer.id)"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                </button>

                <div v-if="actionMenuId === customer.id" class="row-menu" @click.stop>
                  <NuxtLink :to="`/customers/${customer.id}`">View</NuxtLink>
                  <NuxtLink :to="`/customers/add?edit=${customer.id}`">Edit</NuxtLink>
                  <button type="button" @click="toggleStatus(customer)">
                    {{ customer.status === 'Active' ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!visibleCustomers.length" class="empty-state">
        No customers found for the current search.
      </div>
    </div>

    <div class="pagination-bar">
      <div class="page-chip">{{ currentPage }} of {{ totalPages }}</div>

      <div class="pagination-actions">
        <button class="page-button" type="button" :disabled="currentPage === 1" @click="currentPage -= 1">
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
        <button class="page-button" type="button" :disabled="currentPage === totalPages" @click="currentPage += 1">
          &gt;
        </button>
      </div>
    </div>
  </section>
</template>
