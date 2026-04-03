<script setup lang="ts">
const { dammCategories, addDammCategory, updateDammCategory, removeDammCategory } = useOrders()

const search = ref('')
const exportOpen = ref(false)
const addModalOpen = ref(false)
const deleteModalOpen = ref(false)
const lockedModalOpen = ref(false)
const editingId = ref('')
const deletingId = ref('')
const categoryName = ref('')

const filteredCategories = computed(() => {
  const query = search.value.trim().toLowerCase()
  return dammCategories.value.filter(item => !query || item.name.toLowerCase().includes(query))
})

const openAddModal = () => {
  editingId.value = ''
  categoryName.value = ''
  addModalOpen.value = true
}

const openEditModal = (id: string) => {
  const category = dammCategories.value.find(item => item.id === id)
  if (!category) {
    return
  }

  editingId.value = id
  categoryName.value = category.name
  addModalOpen.value = true
}

const submitCategory = () => {
  const name = categoryName.value.trim()
  if (!name) {
    return
  }

  if (editingId.value) {
    updateDammCategory(editingId.value, { name })
  } else {
    addDammCategory({
      id: `damm-cat-${Date.now()}`,
      name,
      items: 0,
    })
  }

  addModalOpen.value = false
  editingId.value = ''
  categoryName.value = ''
}

const askDelete = (id: string) => {
  deletingId.value = id
  deleteModalOpen.value = true
}

const confirmDelete = () => {
  const category = dammCategories.value.find(item => item.id === deletingId.value)
  if (!category) {
    return
  }

  if (category.locked) {
    deleteModalOpen.value = false
    lockedModalOpen.value = true
    return
  }

  removeDammCategory(category.id)
  deleteModalOpen.value = false
  deletingId.value = ''
}

const exportRows = (type: 'csv' | 'json') => {
  const rows = filteredCategories.value
  const filename = `damm-categories.${type}`
  const content = type === 'json'
    ? JSON.stringify(rows, null, 2)
    : [
        ['id', 'name', 'items'].join(','),
        ...rows.map(item => [item.id, item.name, item.items].join(',')),
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

const closeOverlays = () => {
  exportOpen.value = false
}

useHead({
  title: 'Damm Category',
})
</script>

<template>
  <section class="dashboard-card" @click="closeOverlays">
    <div class="section-bar">
      <h1 class="section-title">Damm Category</h1>

      <div class="toolbar">
        <label class="search-box">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m21 21-4.35-4.35" />
            <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
          </svg>
          <input v-model="search" type="text" placeholder="Search">
        </label>

        <button class="primary-link" type="button" @click.stop="openAddModal">
          Add Category
        </button>

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
            <th>Category Name</th>
            <th>Number of items</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in filteredCategories" :key="category.id">
            <td class="col-check"><input type="checkbox"></td>
            <td>{{ category.name }}</td>
            <td>{{ category.items }}</td>
            <td class="col-action">
              <div class="category-actions">
                <button class="icon-button icon-button--table" type="button" @click.stop="openEditModal(category.id)">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                    <path d="m12 6 4 4" />
                  </svg>
                </button>
                <button class="icon-button icon-button--table" type="button" @click.stop="askDelete(category.id)">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 7h14" />
                    <path d="M9 7V5h6v2" />
                    <path d="M8 7v12" />
                    <path d="M16 7v12" />
                    <path d="M6 7l1 13h10l1-13" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-bar">
      <div class="page-chip">1 of 1</div>
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

    <div v-if="addModalOpen" class="modal-overlay" @click="addModalOpen = false">
      <div class="modal-card" @click.stop>
        <div class="modal-card__header">
          <h3>{{ editingId ? 'Edit Damm Category' : 'Add Damm Category' }}</h3>
          <button class="modal-card__close" type="button" @click="addModalOpen = false">x</button>
        </div>
        <label class="field-block field-block--compact">
          <span>Category Name</span>
          <input v-model="categoryName" type="text" placeholder="Enter category">
        </label>
        <button class="primary-button primary-button--inline modal-card__submit" type="button" @click="submitCategory">
          Submit
        </button>
      </div>
    </div>

    <div v-if="deleteModalOpen" class="modal-overlay" @click="deleteModalOpen = false">
      <div class="modal-card modal-card--confirm" @click.stop>
        <div class="modal-card__header">
          <h3>Delete Category</h3>
          <button class="modal-card__close" type="button" @click="deleteModalOpen = false">x</button>
        </div>
        <p class="modal-card__text">Do you really want to delete this category?</p>
        <div class="inline-actions inline-actions--footer">
          <button class="ghost-button" type="button" @click="deleteModalOpen = false">Decline</button>
          <button class="primary-button primary-button--inline" type="button" @click="confirmDelete">Yes, Delete</button>
        </div>
      </div>
    </div>

    <div v-if="lockedModalOpen" class="modal-overlay" @click="lockedModalOpen = false">
      <div class="modal-card modal-card--confirm modal-card--illustrated" @click.stop>
        <div class="modal-card__header">
          <h3>Delete Category</h3>
          <button class="modal-card__close" type="button" @click="lockedModalOpen = false">x</button>
        </div>
        <div class="modal-card__illustration">
          <div class="modal-card__bin"></div>
        </div>
        <p class="modal-card__text">There are some products inside this category. So, you can't delete this category. To delete this category delete all the items first.</p>
        <button class="primary-button primary-button--inline modal-card__submit" type="button" @click="lockedModalOpen = false">Ok! Got it</button>
      </div>
    </div>
  </section>
</template>
