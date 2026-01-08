<script setup lang="ts">
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import { useResultsData } from '~/pages/result/composables'

definePageMeta({
  layout: 'default',
})

const now = new Date()

const type = ref<EventType>(EventType.Stryktipset)
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)

const { data, pending, error } = useResultsData(type, year, month)
</script>

<template>
  <PageHeader title="Resultat" />

  <PageSection>
    <ResultTabs v-model="type" :data="data" :pending="pending" :error="error" />
  </PageSection>
</template>
