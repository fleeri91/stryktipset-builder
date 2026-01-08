<script setup lang="ts">
definePageMeta({
  layout: 'centered',
})

import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import { useResultDetails } from '~/pages/result/composables'

const route = useRoute()

const type = computed(() => route.params.eventType as EventType)
const drawNumber = computed(() => route.params.drawNumber as string)

const { data, pending, error } = useResultDetails(type, drawNumber)

const events = computed(() => data.value?.events ?? [])
</script>

<template>
  <PageHeader title="Resultat" />
  <PageSection>
    <ResultBong :events="events" :pending="pending" :error="error" />
  </PageSection>
</template>
