<template>
  <el-button-group>
    <el-button :disabled="disabled" icon="el-icon-top" size="small" @click="$emit('move', 'top')">{{ $t('moveTop') }}</el-button>
    <el-button :disabled="disabled" icon="el-icon-arrow-up" size="small" @click="$emit('move', 'up')">{{ $t('moveUp') }}</el-button>
    <el-button :disabled="disabled" icon="el-icon-arrow-down" size="small" @click="$emit('move', 'down')">{{ $t('moveDown') }}</el-button>
    <el-button :disabled="disabled" icon="el-icon-bottom" size="small" @click="$emit('move', 'bottom')">{{ $t('moveBottom') }}</el-button>
  </el-button-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ListMove',
  props: {
    disabled: { type: Boolean, required: true },
  },
  emits: {
    move: null,
  },
});
</script>
