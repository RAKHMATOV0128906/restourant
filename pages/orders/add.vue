<script setup lang="ts">
import type { DammProduct } from '~/composables/useOrders'

const route = useRoute()
const { dammProducts, addDammProduct, updateDammProduct, getDammProductById } = useOrders()

const editingId = computed(() => String(route.query.edit || ''))
const editingProduct = computed(() => getDammProductById(editingId.value))

const form = reactive({
  name: '',
  category: 'Wine',
  alcohol: '28%',
  weight: '740ml',
  price: 'GHC 0.00',
  manufacture: 'Local Suppliers' as 'Local Suppliers' | 'International Favs',
  status: 'Active' as 'Active' | 'Deactive',
})

const imagePreview = ref('')

watchEffect(() => {
  if (!editingProduct.value) {
    return
  }

  form.name = editingProduct.value.name
  form.category = editingProduct.value.category
  form.alcohol = editingProduct.value.alcohol
  form.weight = editingProduct.value.weight
  form.price = editingProduct.value.price
  form.manufacture = editingProduct.value.manufacture
  form.status = editingProduct.value.status
  imagePreview.value = editingProduct.value.image
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

const submit = async () => {
  const id = editingProduct.value?.id || `damm-${Date.now()}`
  const payload: DammProduct = {
    id,
    name: form.name,
    image: imagePreview.value || '/damm/smirnoff-ice.svg',
    category: form.category,
    alcohol: form.alcohol,
    weight: form.weight,
    price: form.price,
    status: form.status,
    manufacture: form.manufacture,
  }

  if (editingProduct.value) {
    updateDammProduct(id, payload)
  } else {
    addDammProduct(payload)
  }

  await navigateTo('/orders/extra')
}

useHead({
  title: computed(() => editingProduct.value ? 'Edit Product' : 'Add Product'),
})
</script>

<template>
  <section class="dashboard-card dashboard-card--form">
    <div class="section-bar section-bar--stacked">
      <h1 class="section-title">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h1>
    </div>

    <form class="restaurant-form restaurant-form--compact" @submit.prevent="submit">
      <div class="customer-upload-strip customer-upload-strip--compact">
        <div class="customer-avatar-upload customer-avatar-upload--large" :class="{ 'customer-avatar-upload--filled': imagePreview }">
          <img v-if="imagePreview" :src="imagePreview" alt="Product image">
          <svg v-else viewBox="0 0 24 24" fill="none">
            <path d="M10 4h4v4h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3V4Z" />
            <path d="M12 11v4" />
            <path d="M10 13h4" />
          </svg>
        </div>

        <div class="upload-controls upload-controls--top">
          <label class="primary-link primary-link--button">
            + Product Image
            <input type="file" accept="image/*" hidden @change="onImageSelected">
          </label>
          <button class="ghost-button ghost-button--soft" type="button" @click="clearImage">Remove</button>
        </div>
      </div>

      <div class="form-layout">
        <label class="field-block field-block--full">
          <span>Product Name</span>
          <input v-model="form.name" type="text" placeholder="Smirnoff Ice" required>
        </label>

        <label class="field-block field-block--full">
          <span>Category</span>
          <select v-model="form.category">
            <option>Wine</option>
            <option>Beer</option>
            <option>Liquor</option>
            <option>Spirits</option>
          </select>
        </label>

        <label class="field-block field-block--full">
          <span>Alcohol Percentage</span>
          <input v-model="form.alcohol" type="text" placeholder="28%">
        </label>

        <div class="double-grid">
          <label class="field-block field-block--full">
            <span>Weight</span>
            <input v-model="form.weight" type="text" placeholder="740ml">
          </label>

          <label class="field-block field-block--full">
            <span>Price</span>
            <input v-model="form.price" type="text" placeholder="GHC 0.00">
          </label>
        </div>

        <label class="field-block field-block--full">
          <span>Manufacture</span>
          <div class="radio-row">
            <label class="radio-line" :class="{ 'radio-line--checked': form.manufacture === 'Local Suppliers' }">
              <input v-model="form.manufacture" type="radio" value="Local Suppliers">
              <span>Local Suppliers</span>
            </label>
            <label class="radio-line" :class="{ 'radio-line--checked': form.manufacture === 'International Favs' }">
              <input v-model="form.manufacture" type="radio" value="International Favs">
              <span>International Favs</span>
            </label>
          </div>
        </label>
      </div>

      <button class="primary-button primary-button--submit" type="submit">
        {{ editingProduct ? 'Update Product' : 'Add Product' }}
      </button>
    </form>
  </section>
</template>
