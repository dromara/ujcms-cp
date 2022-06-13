<template>
  <el-dialog :title="$t('menu.personal.homepage.generatedKey')" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :width="820">
    <el-input :model-value="values" autosize :readonly="true" v-loading="loading" type="textarea" />
    <el-button class="mt-2" @click.prevent="fetchHomepageGeneratedKey" v-loading="loading" type="primary">{{ $t('refresh') }}</el-button>
  </el-dialog>
</template>

<script lang="ts">
export default { name: 'HomepageEnvironment' };
</script>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue';
import { queryHomepageGeneratedKey } from '@/api/personal';

const props = defineProps({ modelValue: { type: Boolean, required: true } });
defineEmits({ 'update:modelValue': null });

const { modelValue: visible } = toRefs(props);
const loading = ref<boolean>(false);
const values = ref<any>({});

const fetchHomepageGeneratedKey = async () => {
  loading.value = true;
  try {
    values.value = await queryHomepageGeneratedKey();
  } finally {
    loading.value = false;
  }
};
watch(visible, async () => {
  if (visible.value) {
    fetchHomepageGeneratedKey();
  }
});
</script>
