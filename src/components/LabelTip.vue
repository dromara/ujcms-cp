<template>
  <div class="inline-flex items-center" style="max-width: calc(100% - 16px)">
    <div class="text-clip overflow-hidden whitespace-nowrap" :title="label ?? $t(message)">{{ label ?? $t(message) }}</div>
    <el-tooltip v-if="help" :content="tooltip ?? $t(message + '.tooltip')" placement="top">
      <el-icon class="text-base align-text-top"><QuestionFilled /></el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue';

defineProps({
  label: { type: String },
  tooltip: { type: String },
  help: { type: Boolean, default: false },
  message: { type: String, required: true },
});
</script>
