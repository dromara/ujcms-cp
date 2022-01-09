<template>
  {{ label ?? $t(message) }} <el-tooltip :content="tooltip ?? $t(message + '.tooltip')" placement="top"><i class="el-icon-question"></i></el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LabelTip',
  props: {
    label: { type: String },
    tooltip: { type: String },
    message: { type: String },
  },
});
</script>
