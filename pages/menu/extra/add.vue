<script setup lang="ts">
import type { ExtraItem, MenuStatus } from '~/composables/useMenu'

const route = useRoute()
const { extras, addExtra, updateExtra } = useMenu()

const editingId = computed(() => String(route.query.edit || ''))
const editingExtra = computed(() => extras.value.find(item => item.id === editingId.value))

const form = reactive({
  name: '',
  price: 'GHC 30.00',
  status: 'Active' as MenuStatus,
})

const imagePreview = ref('')

watchEffect(() => {
  if (!editingExtra.value) {
    return
  }

  form.name = editingExtra.value.name
  form.price = editingExtra.value.price
  form.status = editingExtra.value.status
  imagePreview.value = editingExtra.value.image
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

const clearImage = () => {
  imagePreview.value = ''
}

const handleSubmit = async () => {
  const id = editingExtra.value?.id || `extra-${Date.now()}`
  const payload: ExtraItem = {
    id,
    name: form.name,
    image: imagePreview.value || '/menu/pepsi.svg',
    price: form.price,
    status: form.status,
  }

  if (editingExtra.value) {
    updateExtra(id, payload)
  } else {
    addExtra(payload)
  }

  await navigateTo('/menu/extra')
}

useHead({
  title: computed(() => editingExtra.value ? 'Edit Extra Food' : 'Add Extra Food'),
})
</script>

<template>
  <section class="dashboard-card dashboard-card--form">
    <div class="section-bar section-bar--stacked">
      <h1 class="section-title">{{ editingExtra ? 'Edit Extra Food' : 'Add Extra Food' }}</h1>
    </div>

    <form class="restaurant-form restaurant-form--compact" @submit.prevent="handleSubmit">
      <div class="upload-strip">
        <div class="image-dropzone image-dropzone--small" :class="{ 'image-dropzone--filled': imagePreview }">
          <img v-if="imagePreview" :src="imagePreview" alt="Extra image">
          <span v-else>+</span>
        </div>

        <div class="upload-controls">
          <label class="primary-link primary-link--button">
            + Food Image
            <input type="file" accept="image/*" hidden @change="onImageSelected">
          </label>
          <button class="ghost-button ghost-button--soft" type="button" @click="clearImage">
            Remove
          </button>
        </div>
      </div>

      <div class="form-layout">
        <label class="field-block field-block--full">
          <span>Food Name</span>
          <input v-model="form.name" type="text" placeholder="Cheese Pizza" required>
        </label>

        <label class="field-block field-block--full">
          <span>Price</span>
          <input v-model="form.price" type="text" placeholder="GHC 30.00" required>
        </label>
      </div>

      <button class="primary-button primary-button--submit" type="submit">
        {{ editingExtra ? 'Update Extra Food' : 'Add Extra Food' }}
      </button>
    </form>
  </section>
</template>
