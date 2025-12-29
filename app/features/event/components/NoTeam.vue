<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Gå med i ett lag</CardTitle>
        <CardDescription>
          Du behöver vara med i ett lag för att kunna se och delta i evenemang.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <Button asChild class="w-full">
          <NuxtLink to="/team/create">Skapa nytt lag</NuxtLink>
        </Button>
        <Button asChild variant="outline" class="w-full">
          <NuxtLink to="/team">Utforska lag</NuxtLink>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
