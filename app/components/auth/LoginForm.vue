<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-vue-next'

const { loggedIn } = useUserSession()

// Omdirigera om redan inloggad
watchEffect(() => {
  if (loggedIn.value) {
    navigateTo('/')
  }
})

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string({
        required_error: 'E-postadress är obligatorisk',
      })
      .email('Vänligen ange en giltig e-postadress'),
    password: z
      .string({
        required_error: 'Lösenord är obligatoriskt',
      })
      .min(1, 'Lösenord krävs'),
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
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: values.email,
        password: values.password,
      },
    })

    // Användaren är nu inloggad via setUserSession på servern
    await navigateTo('/', { external: true })
  } catch (err: any) {
    error.value =
      err.data?.statusMessage ||
      'Inloggningen misslyckades. Kontrollera dina uppgifter.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-center text-2xl font-bold"> Logga in </CardTitle>
        <CardDescription class="text-center">
          Ange din e-postadress och lösenord för att logga in
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <Alert v-if="error" variant="destructive">
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>E-postadress</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="johan@exempel.se"
                  v-bind="componentField"
                  :disabled="isLoading"
                  autocomplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <div class="flex items-center justify-between">
                <FormLabel>Lösenord</FormLabel>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  v-bind="componentField"
                  :disabled="isLoading"
                  autocomplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <button
            type="submit"
            :disabled="isLoading"
            class="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <Loader2
              v-if="isLoading"
              aria-hidden="true"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isLoading ? 'Loggar in...' : 'Logga in' }}
          </button>
        </form>
      </CardContent>

      <CardFooter class="flex justify-center">
        <p class="text-sm text-gray-600">
          Har du inget konto?
          <NuxtLink
            to="/register"
            class="font-medium text-blue-500 underline hover:no-underline"
          >
            Skapa konto
          </NuxtLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
