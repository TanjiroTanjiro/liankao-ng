
<template>
  <div class="star-rating">
    <el-rate
      v-model="localValue"
      :max="5"
      :allow-half="false"
      :disabled="disabled"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElRate } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.star-rating {
  display: inline-block;
}
</style>
