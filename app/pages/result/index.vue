<script setup lang="ts">
import { ResultTabs, useCurrentResults } from '~/features/results'

const { type, data, pending, error } = useCurrentResults()
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mt-12 space-y-4">
      <h1 class="text-3xl font-bold">Resultat</h1>

      <ResultTabs
        v-model="type"
        :data="data"
        :pending="pending"
        :error="error"
      />
    </div>
  </div>
</template>
