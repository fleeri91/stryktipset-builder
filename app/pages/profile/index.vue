<script setup lang="ts">
import { useUserProfile } from '~/pages/profile/composables'

const { state, isUpdatingName, updateName } = useUserProfile()
</script>

<template>
  <ProfileSettings
    :name="state.name"
    :is-updating="isUpdatingName"
    @update:name="state.name = $event"
    @submit="updateName"
  />
</template>
