<script setup lang="ts">
import { useUserProfile } from '~/pages/profile/composables'

definePageMeta({
  layout: 'narrow',
})

const { state, isUpdatingName, updateName } = useUserProfile()
</script>

<template>
  <div>
    <PageHeader title="Profil" />
    <PageSection>
      <ProfileSettings
        :name="state.name"
        :is-updating="isUpdatingName"
        @update:name="state.name = $event"
        @submit="updateName"
      />
    </PageSection>
  </div>
</template>
