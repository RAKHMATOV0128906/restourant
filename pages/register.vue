<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)

const validate = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.name.trim()) {
    errors.name = 'Ism kiriting'
  }

  if (!form.email) {
    errors.email = 'Email kiriting'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email formatini tekshiring'
  }

  if (!form.password) {
    errors.password = 'Parol kiriting'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Parolni qayta kiriting'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Parollar mos emas'
  }

  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

const submit = async () => {
  if (!validate()) {
    return
  }

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 700))
  register(form.name.trim(), form.email)
  loading.value = false
  await navigateTo('/restaurants')
}

useHead({
  title: 'Register',
})
</script>

<template>
  <main class="login-shell">
    <section class="login-card auth-card--wide">
      <div class="brand-block brand-block--center">
        <div class="brand-logo">
          <div class="brand-logo__pin"></div>
        </div>
        <div class="brand-copy">
          <strong>BistroPulse</strong>
          <p>Food at your doorstep</p>
        </div>
      </div>

      <div class="login-copy">
        <h1>Email bilan ro'yxatdan o'tish</h1>
        <p>Yangi account ochish uchun ma'lumotlaringizni to'ldiring.</p>
      </div>

      <form class="login-form" @submit.prevent="submit">
        <label class="input-block">
          <span>Ism Familiya</span>
          <input v-model="form.name" type="text" placeholder="Ism Familiya" required>
          <small v-if="errors.name" class="error-text">{{ errors.name }}</small>
        </label>

        <label class="input-block">
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="you@example.com" required>
          <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
        </label>

        <label class="input-block">
          <span>Parol</span>
          <input v-model="form.password" type="password" placeholder="Parol" required>
          <small v-if="errors.password" class="error-text">{{ errors.password }}</small>
        </label>

        <label class="input-block">
          <span>Parolni qayta kiriting</span>
          <input v-model="form.confirmPassword" type="password" placeholder="Parolni qayta kiriting" required>
          <small v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</small>
        </label>

        <button class="primary-button login-button" type="submit" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="auth-footer auth-footer--center">
        Akkauntingiz bormi?
        <NuxtLink to="/">Sign in</NuxtLink>
      </p>
    </section>
  </main>
</template>
