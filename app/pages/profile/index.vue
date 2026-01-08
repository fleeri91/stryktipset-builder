<script setup lang="ts">
definePageMeta({
  layout: 'narrow',
})

import { useUserProfile } from '~/pages/profile/composables'

const { state, isUpdatingName, updateName } = useUserProfile()
</script>

<template>
  <PageHeader title="Profil" />
  <PageSection>
    <ProfileSettings
      :name="state.name"
      :is-updating="isUpdatingName"
      @update:name="state.name = $event"
      @submit="updateName"
    />
  </PageSection>
</template>
