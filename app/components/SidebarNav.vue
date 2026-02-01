<script setup lang="ts">
import { Home, LogOut, Medal, Users, User } from 'lucide-vue-next'

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
  {
    title: 'Mitt konto',
    url: '/profile',
    icon: User,
  },
]

const isLoggingOut = ref(false)

const handleLogout = async () => {
  if (isLoggingOut.value) return

  isLoggingOut.value = true

  try {
    await clear()
    await navigateTo('/login', { external: true })
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
  <Sidebar
    collapsible="none"
    class="bg-background fixed bottom-0 left-0 z-50 h-20 w-full border-t lg:sticky lg:top-0 lg:h-screen lg:w-24 lg:border-t-0 lg:border-r"
  >
    <SidebarContent class="h-full lg:h-auto lg:gap-2">
      <SidebarGroup class="h-full justify-center lg:h-auto lg:justify-start">
        <SidebarGroupContent>
          <SidebarMenu
            class="flex flex-row justify-around lg:flex-col lg:justify-start"
          >
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton
                as-child
                class="h-auto flex-col gap-1 py-2 lg:py-3"
              >
                <NuxtLink :to="item.url" :title="item.title">
                  <component :is="item.icon" class="size-5!" />
                  <span class="text-xs">{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup class="hidden lg:mt-auto lg:block">
        <SidebarGroupContent>
          <SidebarMenu
            class="flex flex-row justify-around lg:flex-col lg:justify-start"
          >
            <SidebarMenuItem v-for="item in actionItems" :key="item.title">
              <SidebarMenuButton
                as-child
                class="h-auto flex-col gap-1 py-2 lg:py-3"
              >
                <button
                  :title="item.title"
                  :disabled="isLoggingOut"
                  class="disabled:opacity-50"
                  @click="item.action"
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
