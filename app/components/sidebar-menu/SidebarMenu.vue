<script setup lang="ts">
import { Home, LogOut, Medal, Settings, Users } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const { clear } = useUserSession()

const menuItems = [
  {
    title: 'Hem',
    url: '/',
    icon: Home,
  },
  {
    title: 'Lag',
    url: '/team',
    icon: Users,
  },
  {
    title: 'Resultat',
    url: '/result',
    icon: Medal,
  },
]

const isLoggingOut = ref(false)

const handleLogout = async () => {
  if (isLoggingOut.value) return

  isLoggingOut.value = true

  try {
    await clear()
    await navigateTo('/register', { external: true })
  } catch (error) {
    console.error('Logout error:', error)
    isLoggingOut.value = false
  }
}

const actionItems = [
  {
    title: 'Logga ut',
    icon: LogOut,
    action: handleLogout,
  },
]
</script>

<template>
  <Sidebar collapsible="none" class="h-screen w-24">
    <SidebarContent class="gap-2">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton as-child class="h-auto flex-col gap-1 py-3">
                <NuxtLink :to="item.url" :title="item.title">
                  <component :is="item.icon" class="size-5!" />
                  <span class="text-xs">{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in actionItems" :key="item.title">
              <SidebarMenuButton as-child class="h-auto flex-col gap-1 py-3">
                <button
                  @click="item.action"
                  :title="item.title"
                  :disabled="isLoggingOut"
                  class="disabled:opacity-50"
                >
                  <component :is="item.icon" class="size-5!" />
                  <span class="text-xs">
                    {{ isLoggingOut ? 'Loggar ut...' : item.title }}
                  </span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
