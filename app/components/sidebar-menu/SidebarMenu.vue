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
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton as-child>
                <a :href="item.url" :title="item.title">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
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
              <SidebarMenuButton as-child>
                <a :href="item.url" :title="item.title">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
