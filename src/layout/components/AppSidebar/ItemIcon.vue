<template>
  <template v-if="icon">
    <i v-if="icon.includes('el-icon')" :class="icon" class="inline-block"></i>
    <i v-else class="inline-block">
      <svg class="w-4 h-4 fill-current" style="margin-left:5px;margin-right:8px;">
        <use :xlink:href="'#icon-' + icon" />
      </svg>
    </i>
  </template>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ItemIcon',
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
});
</script>
