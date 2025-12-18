<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
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

const formSchema = toTypedSchema(
  z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
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
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
    })

    if (response.success) {
      await navigateTo('/')
    }
  } catch (err: any) {
    error.value =
      err.data?.statusMessage || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12"
  >
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-center text-2xl font-bold">
          Create an account
        </CardTitle>
        <CardDescription class="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <Alert v-if="error" variant="destructive">
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>

          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  v-bind="componentField"
                  :disabled="isLoading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  v-bind="componentField"
                  :disabled="isLoading"
                  autocomplete="new-password"
                />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
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

          <button
            type="submit"
            :disabled="isLoading"
            class="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>
      </CardContent>

      <CardFooter class="flex justify-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </NuxtLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
