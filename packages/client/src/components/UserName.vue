<template>
  <span class="user-name">{{ displayName }}</span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { UserObject } from '../../../server/src/types/user'
import { getUserDetail } from '../api/user'

const props = defineProps<{
  uid: string | number
  user?: UserObject | null
}>()

const localUser = ref<UserObject | null>(null)
const hasError = ref(false)
let requestVersion = 0

const isValidUserObject = (value: unknown): value is UserObject => {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<UserObject>
  return typeof record.nickname === 'string' && record.nickname.trim().length > 0
}

const fetchUser = async (uid: string | number) => {
  const currentVersion = ++requestVersion
  hasError.value = false
  localUser.value = null

  try {
    const res = await getUserDetail(uid)
    const userData = res?.data
    if (currentVersion !== requestVersion) return

    if (isValidUserObject(userData)) {
      localUser.value = userData
      return
    }
    hasError.value = true
  } catch (error) {
    if (currentVersion !== requestVersion) return
    hasError.value = true
  }
}

watch(
  () => [props.uid, props.user] as const,
  ([uid, user]) => {
    if (isValidUserObject(user)) {
      requestVersion += 1
      localUser.value = user
      hasError.value = false
      return
    }
    void fetchUser(uid)
  },
  { immediate: true }
)

const displayName = computed(() => {
  if (localUser.value?.nickname) return localUser.value.nickname
  if (hasError.value) return 'ErrorUser'
  return ''
})
</script>

<style scoped>
.user-name {
  color: #000;
  font-weight: 700;
}
</style>
