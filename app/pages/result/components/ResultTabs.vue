<script setup lang="ts">
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import type { ResultsHistoryRoot } from '~~/shared/types/SvenskaSpel/ResultsHistory'

interface Props {
  data?: ResultsHistoryRoot | null
  pending?: boolean
}

defineProps<Props>()

const type = defineModel<EventType>({ required: true })
</script>

<template>
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

        <div v-else-if="data?.resultDates.length">
          <ResultHistoryList :results="data.resultDates">
            <template #default="{ result }">
              <ResultHistoryItem :result="result" />
            </template>
          </ResultHistoryList>
        </div>

        <div v-else>
          <p class="text-muted-foreground py-8 text-center">
            Inga resultat hittades
          </p>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
