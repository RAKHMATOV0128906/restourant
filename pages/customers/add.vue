<script setup lang="ts">
import type { CustomerGender, CustomerItem } from '~/composables/useCustomers'

const route = useRoute()
const { customers, addCustomer, updateCustomer } = useCustomers()

const editingId = computed(() => String(route.query.edit || ''))
const editingCustomer = computed(() =>
  customers.value.find(item => item.id === editingId.value),
)

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Orders', value: 'orders' },
  { label: 'Fav Restaurants', value: 'favorites' },
  { label: 'Review & Rating', value: 'reviews' },
  { label: 'Reward Point', value: 'rewards' },
]

const form = reactive({
  name: 'Chelsie Jhonson',
  phone: '(+233) 01532548623',
  email: 'example@bindirigu.com',
  location: 'G. P. O., Asafoatse Nettey Road, Accra...',
  university: '',
  isStudent: false,
  gender: 'Male' as CustomerGender,
})

const avatarPreview = ref('')

watchEffect(() => {
  if (!editingCustomer.value) {
    return
  }

  form.name = editingCustomer.value.name
  form.phone = `(+233) ${editingCustomer.value.phone.replace(/^\+?88/, '')}`
  form.email = editingCustomer.value.email
  form.location = editingCustomer.value.location
  form.university = editingCustomer.value.university
  form.isStudent = editingCustomer.value.isStudent
  form.gender = editingCustomer.value.gender
  avatarPreview.value = editingCustomer.value.avatar
})

const universityOptions = [
  'University of Ghana',
  'UG Business School',
  'Ashesi University',
  'Central University',
  'Lancaster Ghana',
]

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const onAvatarSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }

  avatarPreview.value = await readFileAsDataUrl(file)
}

const clearAvatar = () => {
  avatarPreview.value = ''
}

const handleSubmit = async () => {
  const id = editingCustomer.value?.id || form.name.toLowerCase().replace(/\s+/g, '-')

  const payload: CustomerItem = {
    id,
    name: form.name,
    phone: form.phone,
    email: form.email,
    location: form.location,
    university: form.university || 'University of Ghana',
    isStudent: form.isStudent,
    gender: form.gender,
    status: editingCustomer.value?.status || 'Active',
    avatar: avatarPreview.value || editingCustomer.value?.avatar || '/avatars/default-user.svg',
    joinedAt: editingCustomer.value?.joinedAt || '2 Feb 2022',
    favoriteRestaurants: editingCustomer.value?.favoriteRestaurants || 0,
    orders: editingCustomer.value?.orders || 0,
    rewardPoints: editingCustomer.value?.rewardPoints || 0,
  }

  if (editingCustomer.value) {
    updateCustomer(editingCustomer.value.id, payload)
    await navigateTo(`/customers/${editingCustomer.value.id}`)
    return
  }

  addCustomer(payload)
  await navigateTo(`/customers/${id}`)
}

useHead({
  title: computed(() => editingCustomer.value ? 'Edit Customer' : 'Add Customer'),
})
</script>

<template>
  <section v-if="editingCustomer" class="customer-profile-layout">
    <aside class="dashboard-card customer-sidebar-card">
      <div class="section-bar section-bar--stacked">
        <h2 class="section-title">Customer Profile</h2>
      </div>

      <label class="search-box search-box--wide">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m21 21-4.35-4.35" />
          <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
        </svg>
        <input type="text" placeholder="Search">
      </label>

      <div class="customer-stack">
        <NuxtLink
          v-for="item in customers"
          :key="item.id"
          :to="`/customers/${item.id}`"
          class="customer-stack__item"
          :class="{ 'customer-stack__item--active': item.id === editingCustomer.id }"
        >
          <img :src="item.avatar" :alt="item.name" class="customer-stack__avatar">
          <div>
            <strong>{{ item.name }}</strong>
            <span>+{{ item.phone }}</span>
          </div>
        </NuxtLink>
      </div>
    </aside>

    <div class="customer-profile-main">
      <div class="customer-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="customer-tab"
          :class="{ 'customer-tab--active': tab.value === 'overview' }"
          type="button"
        >
          {{ tab.label }}
        </button>
      </div>

      <section class="dashboard-card dashboard-card--form customer-edit-card">
        <div class="section-bar section-bar--stacked">
          <h1 class="section-title">Edit Customer Information</h1>
        </div>

        <form class="customer-form customer-form--wide" @submit.prevent="handleSubmit">
          <div class="customer-upload-strip customer-upload-strip--compact">
            <div class="customer-avatar-upload customer-avatar-upload--large" :class="{ 'customer-avatar-upload--filled': avatarPreview }">
              <img v-if="avatarPreview" :src="avatarPreview" :alt="form.name">
              <svg v-else viewBox="0 0 24 24" fill="none">
                <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
                <path d="M19 8h4" />
                <path d="M21 6v4" />
              </svg>
            </div>

            <div class="upload-controls upload-controls--top">
              <label class="primary-link primary-link--button">
                + Upload new picture
                <input type="file" accept="image/*" hidden @change="onAvatarSelected">
              </label>
              <button class="ghost-button ghost-button--soft" type="button" @click="clearAvatar">
                Remove
              </button>
            </div>
          </div>

          <div class="form-layout">
            <label class="field-block field-block--full">
              <span>Name</span>
              <input v-model="form.name" type="text" placeholder="Chelsie Jhonson" required>
            </label>

            <label class="checkbox-line checkbox-line--checked">
              <input v-model="form.isStudent" type="checkbox">
              <span>University student</span>
            </label>

            <label v-if="form.isStudent" class="field-block field-block--full">
              <span>Choose university</span>
              <select v-model="form.university">
                <option value="">Select university</option>
                <option v-for="item in universityOptions" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </label>

            <div class="double-grid">
              <label class="field-block">
                <span>Email</span>
                <input v-model="form.email" type="email" placeholder="example@bindirigu.com" required>
              </label>

              <label class="field-block">
                <span>Phone Number</span>
                <input v-model="form.phone" type="text" placeholder="(+233) 01532548623" required>
              </label>
            </div>

            <div class="field-block">
              <span>Gender</span>
              <div class="radio-row">
                <label class="radio-line radio-line--checked">
                  <input v-model="form.gender" type="radio" value="Male">
                  <span>Male</span>
                </label>
                <label class="radio-line">
                  <input v-model="form.gender" type="radio" value="Female">
                  <span>Female</span>
                </label>
              </div>
            </div>

            <label class="field-block field-block--full">
              <span>Location</span>
              <textarea v-model="form.location" rows="4" required></textarea>
            </label>
          </div>

          <div class="inline-actions inline-actions--footer">
            <button class="primary-button primary-button--inline" type="submit">
              Update
            </button>
            <NuxtLink class="ghost-button" :to="`/customers/${editingCustomer.id}`">
              Cancel
            </NuxtLink>
          </div>
        </form>
      </section>
    </div>
  </section>

  <section v-else class="dashboard-card dashboard-card--form dashboard-card--customer-form customer-form-card">
    <div class="section-bar section-bar--stacked">
      <h1 class="section-title">Add Customer</h1>
    </div>

    <form class="customer-form" @submit.prevent="handleSubmit">
      <div class="customer-upload-strip">
        <div class="customer-avatar-upload customer-avatar-upload--large" :class="{ 'customer-avatar-upload--filled': avatarPreview }">
          <img v-if="avatarPreview" :src="avatarPreview" :alt="form.name">
          <svg v-else viewBox="0 0 24 24" fill="none">
            <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            <path d="M19 8h4" />
            <path d="M21 6v4" />
          </svg>
        </div>

        <div class="upload-controls upload-controls--top">
          <label class="primary-link primary-link--button">
            + Upload new picture
            <input type="file" accept="image/*" hidden @change="onAvatarSelected">
          </label>
          <button class="ghost-button ghost-button--soft" type="button" @click="clearAvatar">
            Remove
          </button>
        </div>
      </div>

      <div class="form-layout">
        <label class="field-block field-block--full">
          <span>Name</span>
          <input v-model="form.name" type="text" placeholder="Chelsie Jhonson" required>
        </label>

        <label class="checkbox-line">
          <input v-model="form.isStudent" type="checkbox">
          <span>University student</span>
        </label>

        <label v-if="form.isStudent" class="field-block field-block--full">
          <span>Choose university</span>
          <select v-model="form.university">
            <option value="">Select university</option>
            <option v-for="item in universityOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </label>

        <div class="double-grid">
          <label class="field-block">
            <span>Email</span>
            <input v-model="form.email" type="email" placeholder="example@bindirigu.com" required>
          </label>

          <label class="field-block">
            <span>Phone Number</span>
            <input v-model="form.phone" type="text" placeholder="(+233) 01532548623" required>
          </label>
        </div>

        <div class="field-block">
          <span>Gender</span>
          <div class="radio-row">
            <label class="radio-line radio-line--checked">
              <input v-model="form.gender" type="radio" value="Male">
              <span>Male</span>
            </label>
            <label class="radio-line">
              <input v-model="form.gender" type="radio" value="Female">
              <span>Female</span>
            </label>
          </div>
        </div>

        <label class="field-block field-block--full">
          <span>Location</span>
          <textarea v-model="form.location" rows="4" required></textarea>
        </label>
      </div>

      <button class="primary-button primary-button--inline customer-submit" type="submit">
        Add Customer
      </button>
    </form>
  </section>
</template>
