<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'
import type { TeamRoot } from '~~/shared/types/Team'

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({
        required_error: 'Lagnamn är obligatoriskt',
      })
      .min(2, 'Lagnamnet måste innehålla minst 2 tecken')
      .max(50, 'Lagnamnet får inte överstiga 50 tecken'),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const isLoading = ref(false)
const error = ref('')

const onSubmit = form.handleSubmit(async (values) => {
  error.value = ''
  isLoading.value = true

  try {
    const team = await $fetch<TeamRoot>('/api/team', {
      method: 'POST',
      body: {
        name: values.name,
      },
    })

    navigateTo(`/team/${team._id}`)
  } catch (err: any) {
    error.value =
      err.data?.message ||
      err.data?.statusMessage ||
      'Kunde inte skapa laget. Vänligen försök igen.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-center text-2xl font-bold">
          Skapa nytt lag
        </CardTitle>
        <CardDescription class="text-center">
          Ge ditt lag ett namn för att komma igång
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-4" @submit="onSubmit">
          <Alert v-if="error" variant="destructive">
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>

          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Lagnamn</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="T.ex. Vinnarlaget"
                  v-bind="componentField"
                  :disabled="isLoading"
                  autofocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <button
            type="submit"
            :disabled="isLoading"
            class="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <Loader2
              v-if="isLoading"
              aria-hidden="true"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isLoading ? 'Skapar lag...' : 'Skapa lag' }}
          </button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
