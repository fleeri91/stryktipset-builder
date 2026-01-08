<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

import { useCurrentResults } from '~/pages/result/composables'

const { type, data, pending, error } = useCurrentResults()

console.log(data)
</script>

<template>
  <PageHeader title="Resultat" />
  <PageSection>
    <ResultTabs v-model="type" :data="data" :pending="pending" :error="error" />
  </PageSection>
</template>
