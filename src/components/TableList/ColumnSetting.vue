<template>
  <el-dropdown trigger="click" :hide-on-click="false">
    <el-tooltip :content="$t('table.columnsSetting')" placement="top"><i class="el-icon-setting text-base align-middle"></i></el-tooltip>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-button @click="resetColumns" type="text">{{ $t('table.columnsReset') }}</el-button>
        </el-dropdown-item>
        <el-dropdown-item v-for="(column, index) in settings" :key="column.title" :divided="index === 0">
          <el-checkbox v-model="column.display">{{ column.title }}</el-checkbox>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch } from 'vue';
import { getColumnOrigins, getColumnSettings, mergeColumns, storeColumnSettings } from './useColumns';

export default defineComponent({
  name: 'ColumnSetting',
  props: { name: { type: String, required: true } },
  setup(props) {
    const { name } = toRefs(props);
    const settings = getColumnSettings(name.value);
    const origins = getColumnOrigins(name.value);
    watch(settings, () => storeColumnSettings(), { deep: true });
    const resetColumns = () => {
      settings.value = mergeColumns([], origins.value);
    };
    return { settings, resetColumns };
  },
});
</script>
