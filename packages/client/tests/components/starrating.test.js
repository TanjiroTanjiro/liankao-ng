
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from '../../src/components/StarRating.vue'

describe('StarRating Component', () => {
  it('should render with default value 0', () => {
    const wrapper = mount(StarRating)
    expect(wrapper.vm.localValue).toBe(0)
  })

  it('should render with provided value', () => {
    const wrapper = mount(StarRating, {
      props: {
        modelValue: 3
      }
    })
    expect(wrapper.vm.localValue).toBe(3)
  })

  it('should emit update:modelValue when rating changes', async () => {
    const wrapper = mount(StarRating, {
      props: {
        modelValue: 0
      }
    })

    await wrapper.vm.handleChange(4)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([4])
  })

  it('should emit change event when rating changes', async () => {
    const wrapper = mount(StarRating, {
      props: {
        modelValue: 0
      }
    })

    await wrapper.vm.handleChange(5)

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0]).toEqual([5])
  })

  it('should update localValue when modelValue prop changes', async () => {
    const wrapper = mount(StarRating, {
      props: {
        modelValue: 2
      }
    })

    await wrapper.setProps({ modelValue: 4 })

    expect(wrapper.vm.localValue).toBe(4)
  })

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(StarRating, {
      props: {
        modelValue: 3,
        disabled: true
      }
    })

    const elRate = wrapper.findComponent({ name: 'ElRate' })
    expect(elRate.exists()).toBe(true)
    expect(elRate.props('disabled')).toBe(true)
  })
})
