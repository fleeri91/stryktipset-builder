<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { toast } from 'vue-sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  middleware: 'auth',
})

const { user } = useUserSession()

const state = reactive({
  name: user.value?.name ?? '',
})

watch(
  user,
  (u) => {
    if (!u) return
    state.name = u.name ?? ''
  },
  { immediate: true }
)

const isUpdatingName = ref(false)

async function onUpdateName() {
  if (!state.name || state.name.length < 2) {
    toast.error('Name must be at least 2 characters')
    return
  }

  isUpdatingName.value = true

  try {
    await $fetch('/api/user', {
      method: 'PUT',
      body: { name: state.name },
    })
    toast.success('Namn uppdaterat')
  } catch (err: any) {
    toast.error('Kunde inte uppdatera namn')
    console.error(err)
  } finally {
    isUpdatingName.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mt-12 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Profil</h1>
    </div>
    <Form @submit="onUpdateName" class="space-y-4">
      <h2 class="text-xl font-semibold">Namn</h2>
      <FormField name="name">
        <FormItem>
          <FormLabel>Namn</FormLabel>
          <FormControl>
            <Input v-model="state.name" :disabled="isUpdatingName" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" :disabled="isUpdatingName">
        {{ isUpdatingName ? 'Uppdaterar...' : 'Uppdatera namn' }}
      </Button>
    </Form>
  </div>
</template>
