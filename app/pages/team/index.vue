<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mt-12 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Lag</h1>

      <Button variant="outline" asChild>
        <NuxtLink to="team/create"> Skapa </NuxtLink>
      </Button>
    </div>
  </div>
</template>
