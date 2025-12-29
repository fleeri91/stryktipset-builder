<script setup lang="ts">
import type { ResultsHistoryRoot } from '~~/shared/types/SvenskaSpel/ResultsHistory'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'

const type = ref<EventType>(EventType.Stryktipset)

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)

const { data, pending, error } = await useFetch<ResultsHistoryRoot>(
  '/api/results',
  {
    query: {
      type,
      year,
      month,
    },
    watch: [type, year, month],
  }
)
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mt-12 space-y-4">
      <h1 class="text-3xl font-bold">Resultat</h1>

      <Tabs v-model="type">
        <TabsList class="w-full">
          <TabsTrigger :value="EventType.Stryktipset" class="capitalize">
            {{ EventType.Stryktipset }}
          </TabsTrigger>
          <TabsTrigger :value="EventType.Europatipset" class="capitalize">
            {{ EventType.Europatipset }}
          </TabsTrigger>
        </TabsList>
        <TabsContent :value="type">
          <div class="mt-4">
            <div v-if="pending">
              <ResultHistoryLoading :count="4" />
            </div>

            <div v-else-if="error">
              <ErrorState title="Något gick fel" description="Försök igen" />
            </div>

            <div v-else-if="data?.resultDates.length">
              <ResultHistoryList :results="data.resultDates">
                <template #default="{ result }">
                  <ResultHistoryItem :result="result" />
                </template>
              </ResultHistoryList>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
