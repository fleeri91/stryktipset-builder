<script setup lang="ts">
import { useResultDetails } from '~/pages/result/composables'
import type { EventType } from '~~/shared/types/SvenskaSpel/EventType'

definePageMeta({
  layout: 'centered',
})

const route = useRoute()

const type = computed(() => route.params.eventType as EventType)
const drawNumber = computed(() => route.params.drawNumber as string)

const { data, pending, error } = useResultDetails(type, drawNumber)

const events = computed(() => data.value?.events ?? [])
</script>

<template>
  <div>
    <PageHeader title="Resultat" />
    <PageSection>
      <ResultBong :events="events" :pending="pending" :error="error" />
    </PageSection>
  </div>
</template>
