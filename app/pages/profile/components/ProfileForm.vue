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
  <Form class="space-y-4" @submit="emit('submit')">
    <h2 class="text-xl font-semibold">Namn</h2>
    <FormField name="name">
      <FormItem>
        <FormLabel>Namn</FormLabel>
        <FormControl>
          <Input
            :model-value="name"
            :disabled="isUpdating"
            @update:model-value="emit('update:name', $event.toString())"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" :disabled="isUpdating">
      {{ isUpdating ? 'Uppdaterar...' : 'Uppdatera namn' }}
    </Button>
  </Form>
</template>
