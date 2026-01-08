<script setup lang="ts">
import 'vue-sonner/style.css'

const { loggedIn, user } = useUserSession()
</script>

<!-- app.vue -->
<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': '0',
    }"
  >
    <NuxtLoadingIndicator />
    <template v-if="loggedIn && user">
      <SidebarNav />
    </template>
    <SidebarInset class="from-sidebar to-background bg-radial">
      <NuxtLayout>
        <Toaster />
        <NuxtPage />
      </NuxtLayout>
    </SidebarInset>
  </SidebarProvider>
</template>
