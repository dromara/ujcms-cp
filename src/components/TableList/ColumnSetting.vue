<template>
  <el-dropdown class="align-middle" trigger="click" :hide-on-click="false">
    <span>
      <el-tooltip :content="$t('table.columnsSetting')" placement="top">
        <el-icon class="text-base"><Setting /></el-icon>
      </el-tooltip>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-button type="primary" @click="resetColumns" link>{{ $t('table.columnsReset') }}</el-button>
        </el-dropdown-item>
        <el-dropdown-item v-for="(column, index) in settings" :key="column.title" :divided="index === 0">
          <el-checkbox v-model="column.display">{{ column.title }}</el-checkbox>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { toRefs, watch } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import { getColumnOrigins, getColumnSettings, mergeColumns, storeColumnSettings } from './useColumns';

const props = defineProps({ name: { type: String, required: true } });
const { name } = toRefs(props);
const settings = getColumnSettings(name.value);
const origins = getColumnOrigins(name.value);
watch(settings, () => storeColumnSettings(), { deep: true });
const resetColumns = () => {
  settings.value = mergeColumns([], origins.value);
};
</script>
