<template>
  {{ label ?? $t(message) }}
  <el-tooltip :content="tooltip ?? $t(message + '.tooltip')" placement="top">
    <el-icon class="text-base align-text-top"><question-filled /></el-icon>
  </el-tooltip>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';

defineProps({
  label: { type: String },
  tooltip: { type: String },
  message: { type: String, required: true },
});
</script>
