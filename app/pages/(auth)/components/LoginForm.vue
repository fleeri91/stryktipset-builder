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
  <div class="flex w-full justify-center">
    <Card class="w-full max-w-md shadow-lg">
      <CardHeader class="space-y-2 text-center">
        <CardTitle class="text-2xl font-semibold tracking-tight">
          Logga in
        </CardTitle>
        <CardDescription class="text-sm">
          Ange din e-postadress och lösenord för att fortsätta
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <form class="space-y-4" @submit="onSubmit">
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
              <FormLabel>Lösenord</FormLabel>
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

          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
            {{ isLoading ? 'Loggar in...' : 'Logga in' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="flex flex-col gap-4 border-t pt-6">
        <p class="text-muted-foreground text-center text-sm">
          Har du inget konto?
          <NuxtLink
            to="/register"
            class="text-primary font-medium underline-offset-4 hover:underline"
          >
            Skapa konto
          </NuxtLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
