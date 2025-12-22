<script setup lang="ts">
import { SidebarMenu } from './components/sidebar-menu'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

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
        <NuxtPage />
      </NuxtLayout>
    </SidebarInset>
  </SidebarProvider>
</template>
