<script setup lang="ts">
import type { FoodItem, MenuStatus } from '~/composables/useMenu'

const route = useRoute()
const { foods, addFood, updateFood } = useMenu()

const editingId = computed(() => String(route.query.edit || ''))
const editingFood = computed(() => foods.value.find(item => item.id === editingId.value))

const form = reactive({
  category: 'Pizza',
  name: '',
  description: '',
  price: 'GHC 0.00',
  status: 'Active' as MenuStatus,
})

const imagePreview = ref('')

watchEffect(() => {
  if (!editingFood.value) {
    return
  }

  form.category = editingFood.value.category
  form.name = editingFood.value.name
  form.description = editingFood.value.description || ''
  form.price = editingFood.value.price
  form.status = editingFood.value.status
  imagePreview.value = editingFood.value.image
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
  const id = editingFood.value?.id || `food-${Date.now()}`
  const payload: FoodItem = {
    id,
    name: form.name,
    image: imagePreview.value || '/menu/beef-onion-pizza.svg',
    category: form.category,
    price: form.price,
    status: form.status,
    description: form.description,
  }

  if (editingFood.value) {
    updateFood(id, payload)
  } else {
    addFood(payload)
  }

  await navigateTo(`/menu/food-list/${id}`)
}

useHead({
  title: computed(() => editingFood.value ? 'Edit Food' : 'Add Food'),
})
</script>

<template>
  <section class="dashboard-card dashboard-card--form">
    <div class="section-bar section-bar--stacked">
      <h1 class="section-title">{{ editingFood ? 'Edit Food' : 'Add Food' }}</h1>
    </div>

    <form class="restaurant-form" @submit.prevent="handleSubmit">
      <div class="upload-strip">
        <div class="image-dropzone" :class="{ 'image-dropzone--filled': imagePreview }">
          <img v-if="imagePreview" :src="imagePreview" alt="Food image">
          <span v-else>+ Add Photo</span>
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
          <span>Category</span>
          <select v-model="form.category">
            <option>Pizza</option>
            <option>Burger</option>
            <option>Appetizer</option>
          </select>
        </label>

        <label class="field-block field-block--full">
          <span>Food Name</span>
          <input v-model="form.name" type="text" placeholder="Cheese Pizza" required>
        </label>

        <label class="field-block field-block--full">
          <span>Description</span>
          <textarea v-model="form.description" rows="4" placeholder="Write ingredients. Separate by comma (,)" />
        </label>

        <label class="field-block field-block--full">
          <span>Price</span>
          <input v-model="form.price" type="text" placeholder="GHC 0.00" required>
        </label>
      </div>

      <button class="primary-button primary-button--submit" type="submit">
        {{ editingFood ? 'Update Food' : 'Add Food' }}
      </button>
    </form>
  </section>
</template>
