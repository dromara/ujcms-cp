<script setup lang="ts">
import { toRefs, watch, ref } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import { getColumnOrigins, getColumnSettings, mergeColumns, storeColumnSettings } from './useColumns';

const props = defineProps({ name: { type: String, required: true } });
const { name } = toRefs(props);
const settings = getColumnSettings(name.value);
const origins = getColumnOrigins(name.value);
const visible = ref<boolean>(false);
watch(settings, () => storeColumnSettings(), { deep: true });
const resetColumns = () => {
  settings.value = mergeColumns([], origins.value);
};
</script>

<template>
  <div class="inline-flex align-middle">
    <el-tooltip :content="$t('table.columnsSetting')" placement="top">
      <el-icon class="cursor-pointer text-lg text-gray-regular" @click="() => (visible = true)"><Setting /></el-icon>
    </el-tooltip>
    <el-drawer v-model="visible" :title="$t('table.columnsSetting')" :size="375">
      <el-button class="mb-1" round @click="resetColumns">{{ $t('reset') }}</el-button>
      <ul>
        <li v-for="(column, index) in settings" :key="column.title" :divided="index === 0">
          <el-checkbox v-model="column.display">{{ column.title }}</el-checkbox>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>
