<script setup lang="ts">
import { SidebarMenu } from './components/sidebar-menu'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

const { loggedIn, user } = useUserSession()
</script>

<!-- app.vue -->
<template>
  <SidebarProvider>
    <NuxtLoadingIndicator />
    <template v-if="loggedIn && user">
      <SidebarMenu />
    </template>
    <SidebarInset>
      <NuxtLayout>
        <Toaster />
        <NuxtPage />
      </NuxtLayout>
    </SidebarInset>
  </SidebarProvider>
</template>
