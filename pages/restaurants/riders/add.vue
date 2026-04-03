<script setup lang="ts">
const route = useRoute()
const { getRiderById, addRider, updateRider } = useRiders()

const editId = computed(() => typeof route.query.edit === 'string' ? route.query.edit : '')
const existingRider = computed(() => editId.value ? getRiderById(editId.value) : undefined)

const form = reactive({
  name: existingRider.value?.name || 'Chelsie Johnson',
  email: existingRider.value?.email || 'example@bindirigu.com',
  phone: existingRider.value?.phone || '(+233) 01532548623',
  birthDate: existingRider.value?.birthDate || '12/05/2020',
  paymentMethod: existingRider.value?.paymentMethod || 'Visa Debit',
  birthPlace: existingRider.value?.birthPlace || 'Asafoatse Nettey',
  birthCertificate: 'Upload file',
  nidCard: 'yournid.pdf',
  address: existingRider.value?.address || 'G. P. O., Asafoatse Nettey Road, Accra...',
  attendance: existingRider.value?.shift || '10:00 AM - 3:00 PM',
  photo: existingRider.value?.photo || '/avatars/chelsie-johnson.svg',
})

const saveRider = async () => {
  const id = editId.value || form.name.toLowerCase().replaceAll(' ', '-')
  const payload = {
    id,
    name: form.name,
    phone: form.phone,
    email: form.email,
    address: form.address,
    shift: form.attendance,
    photo: form.photo,
    birthDate: form.birthDate,
    birthPlace: form.birthPlace,
    gender: 'Male' as const,
    userId: existingRider.value?.userId || `${395000 + Math.floor(Math.random() * 200)}`,
    paymentMethod: form.paymentMethod,
    currentBalance: existingRider.value?.currentBalance || 0,
    earningThisMonth: existingRider.value?.earningThisMonth || 0,
    totalOrders: existingRider.value?.totalOrders || 0,
    isActive: existingRider.value?.isActive ?? true,
    documents: existingRider.value?.documents || [
      { id: `${id}-birth`, title: 'Birth Certificate', fileName: 'Businesslicense.pdf' },
      { id: `${id}-nid`, title: 'NID CARD', fileName: 'NID_card.pdf' },
    ],
    stats: existingRider.value?.stats || [
      { id: 'week-1', label: 'Week 1', value: 5 },
      { id: 'week-2', label: 'Week 2', value: 6 },
      { id: 'week-3', label: 'Week 3', value: 4, active: true },
      { id: 'week-4', label: 'Week 4', value: 7 },
    ],
  }

  if (existingRider.value) updateRider(existingRider.value.id, payload)
  else addRider(payload)

  await navigateTo('/restaurants/riders')
}

useHead({ title: computed(() => existingRider.value ? 'Edit Rider' : 'Add Rider') })
</script>

<template>
  <section class="dashboard-card dashboard-card--form">
    <div class="section-bar section-bar--stacked">
      <h1 class="section-title">{{ existingRider ? 'Edit Rider' : 'Add Rider' }}</h1>
    </div>

    <div class="customer-upload-strip rider-form__upload">
      <div class="profile-avatar profile-avatar--large rider-form__avatar">
        <img :src="form.photo" :alt="form.name">
      </div>
      <button class="primary-link" type="button">Upload new picture</button>
      <button class="ghost-button ghost-button--soft" type="button">Remove</button>
    </div>

    <form class="restaurant-form rider-form" @submit.prevent="saveRider">
      <div class="field-block">
        <span>Name</span>
        <input v-model="form.name" type="text">
      </div>

      <div class="double-grid">
        <div class="field-block">
          <span>Email</span>
          <input v-model="form.email" type="email">
        </div>
        <div class="field-block">
          <span>Phone Number</span>
          <input v-model="form.phone" type="text">
        </div>
      </div>

      <div class="double-grid">
        <div class="field-block">
          <span>Date of Birth</span>
          <input v-model="form.birthDate" type="text">
        </div>
        <div class="field-block">
          <span>Payment Method</span>
          <select v-model="form.paymentMethod">
            <option>Visa Debit</option>
            <option>Cash</option>
            <option>Master Card</option>
          </select>
        </div>
      </div>

      <div class="field-block">
        <span>Birth Place</span>
        <input v-model="form.birthPlace" type="text">
      </div>

      <div class="field-block">
        <span>Birth Certificate</span>
        <div class="file-row">
          <input :value="form.birthCertificate" type="text" readonly>
          <button class="file-button" type="button">Choose file</button>
        </div>
      </div>

      <div class="field-block">
        <span>NID Card</span>
        <div class="file-row">
          <input :value="form.nidCard" type="text" readonly>
          <button class="file-button" type="button">Choose file</button>
        </div>
      </div>

      <div class="field-block">
        <span>Address</span>
        <textarea v-model="form.address" rows="4"></textarea>
      </div>

      <div class="field-block">
        <span>Attendance</span>
        <select v-model="form.attendance">
          <option>10:00 AM - 3:00 PM</option>
          <option>4:00 PM - 10:00 PM</option>
          <option>10:00 PM - 4:00 AM</option>
          <option>4:00 AM - 10:00 AM</option>
        </select>
      </div>

      <button class="primary-button primary-button--submit" type="submit">{{ existingRider ? 'Update Rider' : 'Add Rider' }}</button>
    </form>
  </section>
</template>
