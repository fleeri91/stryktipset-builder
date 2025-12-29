<script setup lang="ts">
import 'vue-sonner/style.css'

const { loggedIn, user } = useUserSession()
</script>

<!-- app.vue -->
<template>
  <SidebarProvider>
    <NuxtLoadingIndicator />
    <template v-if="loggedIn && user">
      <SidebarNav />
    </template>
    <SidebarInset>
      <NuxtLayout>
        <Toaster />
        <NuxtPage />
      </NuxtLayout>
    </SidebarInset>
  </SidebarProvider>
</template>
