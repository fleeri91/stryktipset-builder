<script setup lang="ts">
import { ProfileSettings, useUserProfile } from '~/features/user'

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
