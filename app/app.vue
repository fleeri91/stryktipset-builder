<script setup lang="ts">
import { SidebarMenu } from './components/sidebar-menu'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const { loggedIn, user } = useUserSession()
</script>

<!-- app.vue -->
<template>
  <NuxtLayout>
    <SidebarProvider>
      <NuxtLoadingIndicator />
      <template v-if="loggedIn && user">
        <SidebarMenu />
      </template>
      <SidebarInset>
        <main class="flex flex-1 flex-col">
          <div class="@container/main flex flex-1 flex-col gap-2">
            <NuxtPage />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  </NuxtLayout>
</template>
