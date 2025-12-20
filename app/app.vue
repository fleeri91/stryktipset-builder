<script setup lang="ts">
import { Header } from './components/header'
import { SidebarMenu } from './components/sidebar-menu'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const open = ref(false)
</script>

<!-- app.vue -->
<template>
  <NuxtLayout>
    <SidebarProvider
      :open="open"
      @update:open="open = $event"
      :style="{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      }"
    >
      <NuxtLoadingIndicator />
      <SidebarMenu />
      <SidebarInset>
        <Header />
        <main class="flex flex-1 flex-col">
          <div class="@container/main flex flex-1 flex-col gap-2">
            <NuxtPage />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  </NuxtLayout>
</template>
