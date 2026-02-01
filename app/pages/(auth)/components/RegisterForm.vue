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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-vue-next'

const { loggedIn } = useUserSession()

watchEffect(() => {
  if (loggedIn.value) {
    navigateTo('/')
  }
})

const formSchema = toTypedSchema(
  z
    .object({
      name: z
        .string({
          required_error: 'Namn är obligatoriskt',
        })
        .min(2, 'Namnet måste innehålla minst 2 tecken'),
      email: z
        .string({
          required_error: 'E-postadress är obligatorisk',
        })
        .email('Vänligen ange en giltig e-postadress'),
      password: z
        .string({
          required_error: 'Lösenord är obligatoriskt',
        })
        .min(8, 'Lösenordet måste innehålla minst 8 tecken'),
      confirmPassword: z.string({
        required_error: 'Bekräfta lösenord är obligatoriskt',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Lösenorden matchar inte',
      path: ['confirmPassword'],
    })
)

const form = useForm({
  validationSchema: formSchema,
})

const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = form.handleSubmit(async (values) => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
    })

    reloadNuxtApp({ path: '/' })
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      typeof error.data === 'object' &&
      error.data !== null &&
      'statusMessage' in error.data &&
      typeof error.data.statusMessage === 'string'
    ) {
      errorMessage.value = error.data.statusMessage
    } else {
      errorMessage.value = 'Registreringen misslyckades. Vänligen försök igen.'
    }
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
          Skapa konto
        </CardTitle>
        <CardDescription class="text-sm">
          Fyll i dina uppgifter för att komma igång
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <form class="space-y-4" @submit="onSubmit">
          <Alert v-if="errorMessage" variant="destructive">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Namn</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Ditt namn"
                  v-bind="componentField"
                  :disabled="isLoading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>E-postadress</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@exempel.se"
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
                  autocomplete="new-password"
                />
              </FormControl>
              <FormDescription class="text-xs">
                Minst 8 tecken
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel>Bekräfta lösenord</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  v-bind="componentField"
                  :disabled="isLoading"
                  autocomplete="new-password"
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
            {{ isLoading ? 'Skapar konto...' : 'Skapa konto' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="flex flex-col gap-4 border-t pt-6">
        <p class="text-muted-foreground text-center text-sm">
          Har du redan ett konto?
          <NuxtLink
            to="/login"
            class="text-primary font-medium underline-offset-4 hover:underline"
          >
            Logga in
          </NuxtLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
