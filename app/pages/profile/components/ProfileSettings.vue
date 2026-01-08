<script setup lang="ts">
interface Props {
  name: string
  isUpdating: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'submit'): void
}>()
</script>

<template>
  <ProfileForm
    :name="name"
    :is-updating="isUpdating"
    @update:name="emit('update:name', $event)"
    @submit="emit('submit')"
  />
</template>
