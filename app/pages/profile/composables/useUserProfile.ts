import { reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

export const useUserProfile = () => {
  const { user, fetch: fetchUser } = useUserSession()

  const state = reactive({
    name: user.value?.name ?? '',
  })

  watch(
    user,
    (u) => {
      if (!u) return
      state.name = u.name ?? ''
    },
    { immediate: true }
  )

  const isUpdatingName = ref(false)

  async function updateName() {
    if (!state.name || state.name.length < 2) {
      toast.error('Namn måste vara minst 2 tecken')
      return
    }

    isUpdatingName.value = true

    try {
      await $fetch('/api/user', {
        method: 'PUT',
        body: { name: state.name },
      })

      // Refresh the user session to get updated data
      await fetchUser()

      toast.success('Namn uppdaterat')
    } catch (err: any) {
      toast.error('Kunde inte uppdatera namn')
      console.error(err)
    } finally {
      isUpdatingName.value = false
    }
  }

  return {
    user,
    state,
    isUpdatingName,
    updateName,
  }
}
