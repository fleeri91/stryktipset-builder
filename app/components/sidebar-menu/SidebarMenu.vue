<script setup lang="ts">
import { Home, LogOut } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const menuItems = [
  {
    title: 'Hem',
    url: '#',
    icon: Home,
  },
]
const actionItems = [
  {
    title: 'Logga ut',
    url: '#',
    icon: LogOut,
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
                <a :href="item.url" :title="item.title">
                  <component :is="item.icon" class="size-5!" />
                  <span class="text-xs">{{ item.title }}</span>
                </a>
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
                <a :href="item.url" :title="item.title">
                  <component :is="item.icon" class="size-5!" />
                  <span class="text-xs">{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
