<template>
  <main class="container">
    <h1>Vue 测试页面</h1>
    <p>qnq</p>
    <button @click="count++">当前计数：{{ count }}</button>
  </main>
</template>

<script setup>
import { ref } from "vue";

const count = ref(0);
</script>
