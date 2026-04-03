<script setup lang="ts">
import type { RestaurantItem, RestaurantStatus } from '~/composables/useRestaurants'

const route = useRoute()
const { restaurants, addRestaurant, updateRestaurant } = useRestaurants()

const editingId = computed(() => String(route.query.edit || ''))
const editingRestaurant = computed(() =>
  restaurants.value.find(item => item.id === editingId.value),
)

const form = reactive({
  name: '',
  representative: '',
  phone: '(+233) 01532548623',
  established: '2020-05-12',
  workPeriod: '9:00 AM - 10:00 PM',
  size: 'Large',
  paymentMethod: 'Cash in hand',
  location: 'G. P. O., Asafoatse Nettey Road, Accra...',
  status: 'Open' as RestaurantStatus,
})

const imagePreview = ref('')
const businessLicenseName = ref('')
const ownerNidName = ref('yournid.pdf')

watchEffect(() => {
  if (!editingRestaurant.value) {
    return
  }

  form.name = editingRestaurant.value.name
  form.representative = editingRestaurant.value.representative
  form.phone = editingRestaurant.value.phone
  form.established = '2024-01-01'
  form.workPeriod = editingRestaurant.value.workPeriod
  form.size = editingRestaurant.value.size
  form.paymentMethod = editingRestaurant.value.paymentMethod
  form.location = editingRestaurant.value.location
  form.status = editingRestaurant.value.status
  imagePreview.value = editingRestaurant.value.image
  businessLicenseName.value = editingRestaurant.value.documents[0]?.fileName || ''
  ownerNidName.value = editingRestaurant.value.documents[1]?.fileName || 'yournid.pdf'
})

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const onImageSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  imagePreview.value = await readFileAsDataUrl(file)
}

const onBusinessLicenseSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  businessLicenseName.value = input.files?.[0]?.name || ''
}

const onOwnerNidSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  ownerNidName.value = input.files?.[0]?.name || 'yournid.pdf'
}

const clearImage = () => {
  imagePreview.value = ''
}

const handleSubmit = async () => {
  const id =
    editingRestaurant.value?.id ||
    `${form.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

  const payload: RestaurantItem = {
    id,
    name: form.name,
    representative: form.representative,
    phone: form.phone,
    location: form.location,
    established: new Date(form.established).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    workPeriod: form.workPeriod,
    size: form.size,
    paymentMethod: form.paymentMethod,
    rating: editingRestaurant.value?.rating || 4.8,
    status: form.status,
    image:
      imagePreview.value ||
      '/restaurants/star-valley-1.svg',
    documents: [
      { label: 'License', fileName: businessLicenseName.value || 'BusinessLicense.pdf' },
      { label: 'NID Card', fileName: ownerNidName.value || 'Nidcard.pdf' },
    ],
  }

  if (editingRestaurant.value) {
    updateRestaurant(editingRestaurant.value.id, payload)
  } else {
    addRestaurant(payload)
  }

  await navigateTo(`/restaurants/${id}`)
}

useHead({
  title: computed(() => editingRestaurant.value ? 'Edit Restaurant' : 'Add Restaurant'),
})
</script>

<template>
  <section class="dashboard-card dashboard-card--form">
    <div class="section-bar section-bar--stacked">
      <h1 class="section-title">{{ editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant' }}</h1>
    </div>

    <form class="restaurant-form" @submit.prevent="handleSubmit">
      <div class="upload-strip">
        <div class="image-dropzone" :class="{ 'image-dropzone--filled': imagePreview }">
          <img v-if="imagePreview" :src="imagePreview" alt="Restaurant">
          <span v-else>+ Add Photo</span>
        </div>

        <div class="upload-controls">
          <label class="primary-link primary-link--button">
            + Restaurant Image
            <input type="file" accept="image/*" hidden @change="onImageSelected">
          </label>
          <button class="ghost-button ghost-button--soft" type="button" @click="clearImage">
            Remove
          </button>
        </div>
      </div>

      <div class="form-layout">
        <label class="field-block field-block--full">
          <span>Restaurant Name</span>
          <input v-model="form.name" type="text" placeholder="Sun valley restaurant" required>
        </label>

        <label class="field-block field-block--full">
          <span>Representative Name</span>
          <input v-model="form.representative" type="text" placeholder="Darrell Steward" required>
        </label>

        <label class="field-block field-block--full">
          <span>Phone Number</span>
          <input v-model="form.phone" type="text" required>
        </label>

        <label class="field-block field-block--full">
          <span>Business License</span>
          <div class="file-field">
            <span>{{ businessLicenseName || 'Upload file' }}</span>
            <label class="file-button">
              Choose file
              <input type="file" hidden @change="onBusinessLicenseSelected">
            </label>
          </div>
        </label>

        <label class="field-block field-block--full">
          <span>Owner NID</span>
          <div class="file-field">
            <span>{{ ownerNidName }}</span>
            <label class="file-button">
              Choose file
              <input type="file" hidden @change="onOwnerNidSelected">
            </label>
          </div>
        </label>

        <div class="triplet-grid">
          <label class="field-block">
            <span>Established</span>
            <input v-model="form.established" type="date">
          </label>

          <label class="field-block">
            <span>Working Period</span>
            <select v-model="form.workPeriod">
              <option>9:00 AM - 10:00 PM</option>
              <option>8:00 AM - 9:00 PM</option>
              <option>10:00 AM - 11:00 PM</option>
            </select>
          </label>

          <label class="field-block">
            <span>Large</span>
            <select v-model="form.paymentMethod">
              <option>Cash in hand</option>
              <option>Card payment</option>
              <option>Bank transfer</option>
            </select>
          </label>
        </div>

        <label class="field-block field-block--full">
          <span>Location</span>
          <textarea v-model="form.location" rows="4" required />
        </label>
      </div>

      <button class="primary-button primary-button--submit" type="submit">
        {{ editingRestaurant ? 'Update Restaurant' : 'Add Restaurant' }}
      </button>
    </form>
  </section>
</template>
