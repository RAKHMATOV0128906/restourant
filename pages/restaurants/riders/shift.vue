<script setup lang="ts">
const { riderAttendance, updateAttendance } = useRiders()
const search = ref('')
const filterOpen = ref(false)
const exportOpen = ref(false)
const rowMenuId = ref<string | null>(null)
const selectedRows = ref<string[]>([])
const attendanceModalOpen = ref(false)
const checkInModalOpen = ref(false)
const confirmModalOpen = ref(false)
const currentAttendanceId = ref<string | null>(null)
const attendanceDraft = ref('10:00 AM - 3:00 PM')
const filterDraft = reactive({ shift: '10:00 AM - 3:00 PM', area: 'Asafoatse Nettey Road, Accra' })
const appliedFilter = reactive({ shift: '', area: '' })
const shiftTabs = ['10:00 AM - 4:00 PM', '4:00 PM - 10:00 PM', '10:00 PM - 4:00 AM', '4:00 AM - 10:00 AM']
const shiftTab = ref(shiftTabs[0])

const filteredAttendance = computed(() => {
  const query = search.value.trim().toLowerCase()
  return riderAttendance.value.filter((item) => {
    const matchesSearch = !query || [item.riderName, item.area].some(value => value.toLowerCase().includes(query))
    const matchesArea = !appliedFilter.area || item.area.toLowerCase().includes(appliedFilter.area.toLowerCase())
    const matchesShift = !appliedFilter.shift || item.shift === appliedFilter.shift
    return matchesSearch && matchesArea && matchesShift
  })
})

const allSelected = computed(() => filteredAttendance.value.length > 0 && filteredAttendance.value.every(item => selectedRows.value.includes(item.id)))

const toggleRows = () => {
  if (allSelected.value) {
    selectedRows.value = selectedRows.value.filter(id => !filteredAttendance.value.some(item => item.id === id))
    return
  }
  selectedRows.value = [...new Set([...selectedRows.value, ...filteredAttendance.value.map(item => item.id)])]
}

const toggleRow = (id: string) => {
  selectedRows.value = selectedRows.value.includes(id) ? selectedRows.value.filter(item => item !== id) : [...selectedRows.value, id]
}

const openCheckIn = (id: string) => { currentAttendanceId.value = id; checkInModalOpen.value = true; rowMenuId.value = null }
const openConfirm = (id: string) => { currentAttendanceId.value = id; confirmModalOpen.value = true; rowMenuId.value = null }
const submitCheckIn = () => {
  const row = riderAttendance.value.find(item => item.id === currentAttendanceId.value)
  if (row) updateAttendance(row.id, { running: false, timer: '03:50:12' })
  checkInModalOpen.value = false
}
const submitConfirm = () => {
  const row = riderAttendance.value.find(item => item.id === currentAttendanceId.value)
  if (row) updateAttendance(row.id, { running: true, timer: '00:00:00' })
  confirmModalOpen.value = false
}
const applyFilter = () => { appliedFilter.shift = filterDraft.shift; appliedFilter.area = filterDraft.area; filterOpen.value = false }
const clearFilter = () => { filterDraft.shift = '10:00 AM - 3:00 PM'; filterDraft.area = ''; appliedFilter.shift = ''; appliedFilter.area = ''; filterOpen.value = false }
const exportCsv = () => {
  if (!import.meta.client) return
  const content = [['Rider Name', 'Time', 'Area'], ...filteredAttendance.value.map(item => [item.riderName, item.shift, item.area])].map(row => row.join(',')).join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'rider-attendance.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  exportOpen.value = false
}

useHead({ title: 'Rider Shift' })
</script>

<template>
  <section class="dashboard-card">
    <div class="section-bar">
      <h1 class="section-title">Attendance</h1>
      <div class="toolbar">
        <label class="search-box"><svg viewBox="0 0 24 24" fill="none"><path d="m21 21-4.35-4.35" /><path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" /></svg><input v-model="search" type="text" placeholder="Search"></label>
        <div class="popover-anchor">
          <button class="toolbar-button" :class="{ 'toolbar-button--active': filterOpen }" type="button" @click.stop="filterOpen = !filterOpen; exportOpen = false"><svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16l-6 7v6l-4 1v-7L4 5Z" /></svg><span>Filter</span></button>
          <div v-if="filterOpen" class="menu-card menu-card--filter rider-filter-card" @click.stop>
            <h3>Filter</h3>
            <div class="field-block field-block--compact"><span>Shift</span><select v-model="filterDraft.shift"><option>10:00 AM - 3:00 PM</option><option>4:00 PM - 10:00 PM</option><option>10:00 PM - 4:00 AM</option><option>4:00 AM - 10:00 AM</option></select></div>
            <div class="field-block field-block--compact"><span>Area</span><input v-model="filterDraft.area" type="text"></div>
            <div class="menu-card__actions"><button type="button" @click="clearFilter">Clear Filter</button><button type="button" @click="applyFilter">Apply Filter</button></div>
          </div>
        </div>
        <button class="primary-link" type="button" @click="attendanceModalOpen = true">Add Rider to Shift</button>
        <div class="popover-anchor">
          <button class="toolbar-button toolbar-button--dark" type="button" @click.stop="exportOpen = !exportOpen; filterOpen = false"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v11" /><path d="m8 10 4 4 4-4" /><path d="M5 21h14" /></svg><span>Export</span><svg class="caret-icon" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" /></svg></button>
          <div v-if="exportOpen" class="menu-card" @click.stop><button type="button" @click="exportCsv">Download CSV</button></div>
        </div>
      </div>
    </div>

    <div class="pill-row"><button v-for="item in shiftTabs" :key="item" class="pill-button" :class="{ 'pill-button--active': shiftTab === item }" type="button" @click="shiftTab = item">{{ item }}</button></div>

    <div class="table-card">
      <table class="data-table rider-table">
        <thead><tr><th class="col-check"><input type="checkbox" :checked="allSelected" @change="toggleRows"></th><th>Rider Name</th><th>Image</th><th>Time</th><th>Area</th><th>Action</th></tr></thead>
        <tbody>
          <tr v-for="item in filteredAttendance" :key="item.id">
            <td class="col-check"><input type="checkbox" :checked="selectedRows.includes(item.id)" @change="toggleRow(item.id)"></td>
            <td>{{ item.riderName }}</td>
            <td><img :src="item.image" :alt="item.riderName" class="table-avatar"></td>
            <td>{{ item.shift }}</td>
            <td>{{ item.area }}</td>
            <td><div class="rider-attendance-actions"><span class="rider-timer">{{ item.timer }}</span><button class="attendance-play" :class="{ 'attendance-play--stop': !item.running }" type="button" @click="item.running ? openCheckIn(item.id) : openConfirm(item.id)"><span v-if="item.running">▶</span><span v-else>■</span></button><div class="action-anchor"><button class="icon-button icon-button--table" type="button" @click.stop="rowMenuId = rowMenuId === item.id ? null : item.id"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /><path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /><path d="M12 21.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /></svg></button><div v-if="rowMenuId === item.id" class="row-menu" @click.stop><button type="button" @click="attendanceModalOpen = true">Edit Shift</button></div></div></div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-bar"><div class="page-chip">1 of 2</div><div class="pagination-actions"><button class="page-button" type="button">&lt;</button><button class="page-button page-button--active" type="button">1</button><button class="page-button" type="button">2</button><button class="page-button" type="button">3</button><button class="page-button" type="button">4</button><button class="page-button" type="button">5</button><button class="page-button" type="button">&gt;</button></div></div>

    <div v-if="attendanceModalOpen" class="modal-overlay" @click="attendanceModalOpen = false"><div class="modal-card" @click.stop><div class="modal-card__header"><h3>Rider Attendance</h3><button class="modal-card__close" type="button" @click="attendanceModalOpen = false">×</button></div><div class="field-block"><span>Attendance</span><select v-model="attendanceDraft"><option>10:00 AM - 3:00 PM</option><option>4:00 PM - 10:00 PM</option><option>10:00 PM - 4:00 AM</option><option>4:00 AM - 10:00 AM</option></select></div><button class="primary-button modal-card__submit" type="button" @click="attendanceModalOpen = false">Submit</button></div></div>
    <div v-if="checkInModalOpen" class="modal-overlay" @click="checkInModalOpen = false"><div class="modal-card" @click.stop><div class="modal-card__header"><h3>Rider Check in</h3><button class="modal-card__close" type="button" @click="checkInModalOpen = false">×</button></div><div class="field-block"><span>Secret Code</span><input type="text" placeholder="Enter secret code"></div><button class="primary-button modal-card__submit" type="button" @click="submitCheckIn">Submit</button></div></div>
    <div v-if="confirmModalOpen" class="modal-overlay" @click="confirmModalOpen = false"><div class="modal-card modal-card--confirm" @click.stop><div class="modal-card__header"><h3>Confirm</h3></div><p class="modal-card__text">Are you sure that this rider wants to check out for today's shift?</p><div class="inline-actions inline-actions--footer"><button class="ghost-button" type="button" @click="confirmModalOpen = false">Cancel</button><button class="primary-button primary-button--inline" type="button" @click="submitConfirm">Confirm</button></div></div></div>
  </section>
</template>
