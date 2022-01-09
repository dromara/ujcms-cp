<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('dictType.name')" name="Q_Contains_name"></query-item>
      </query-form>
    </div>
    <div>
      <el-button type="primary" :disabled="perm('dictType:create')" icon="el-icon-plus" size="small" @click="handleAdd()">{{ $t('add') }}</el-button>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('dictType:delete')" icon="el-icon-delete" size="small">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <list-move :disabled="selection.length <= 0 || filtered || perm('org:update')" @move="(type) => move(selection, type)" class="ml-2" />
      <column-setting name="dictType" class="ml-2" />
    </div>
    <div class="app-block mt-3">
      <el-table ref="table" v-loading="loading" :data="data" @selection-change="(rows) => (selection = rows)" @row-dblclick="(row) => handleEdit(row.id)" @sort-change="handleSort">
        <column-list name="dictType">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column property="id" label="ID" width="60" sortable="custom"></el-table-column>
          <el-table-column property="name" :label="$t('dictType.name')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="alias" :label="$t('dictType.alias')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="scope" :label="$t('dictType.scope')" sortable="custom" :formatter="(row) => $t(`model.scope.${row.scope}`)" />
          <el-table-column property="sys" :label="$t('dictType.sys')" sortable="custom" :formatter="(row) => $t(row.sys ? 'yes' : 'no')" />
          <el-table-column :label="$t('table.action')">
            <template #default="{row}">
              <el-space>
                <el-link type="primary" :disabled="perm('dictType:update')" @click="handleEdit(row.id)" class="text-xs" href="javascript:">{{ $t('edit') }}</el-link>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                  <template #reference>
                    <el-link type="primary" :disabled="perm('dictType:delete')" class="text-xs" href="javascript:">{{ $t('delete') }}</el-link>
                  </template>
                </el-popconfirm>
              </el-space>
            </template>
          </el-table-column>
        </column-list>
      </el-table>
    </div>
    <dict-type-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" @finished="fetchData" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { perm } from '@/store/useCurrentUser';
import { moveList, toParams, resetParams } from '@/utils/common';
import { deleteDictType, queryDictTypeList, updateDictTypeOrder } from '@/api/config';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import DictTypeForm from './DictTypeForm.vue';

export default defineComponent({
  components: { DictTypeForm, ColumnList, ColumnSetting, QueryForm, QueryItem, ListMove },
  setup() {
    const { t } = useI18n();
    const params = ref<any>({});
    const sort = ref<any>(undefined);
    const table = ref<any>(null);
    const data = ref<Array<any>>([]);
    const selection = ref<Array<any>>([]);
    const loading = ref<boolean>(false);
    const formVisible = ref<boolean>(false);
    const beanId = ref<number | null>(null);
    const beanIds = computed(() => data.value.map((row) => row.id));
    const filtered = ref<boolean>(false);
    const fetchData = async () => {
      loading.value = true;
      try {
        data.value = await queryDictTypeList({ ...toParams(params.value), Q_OrderBy: sort.value });
        filtered.value = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0 || sort.value !== undefined;
      } finally {
        loading.value = false;
      }
    };
    onMounted(fetchData);

    const handleSort = ({ column, prop, order }: { column: any; prop: string; order: string }) => {
      if (prop) {
        sort.value = (column.sortBy ?? prop) + (order === 'descending' ? '_desc' : '');
      } else {
        sort.value = undefined;
      }
      fetchData();
    };
    const handleSearch = () => fetchData();
    const handleReset = () => {
      table.value.clearSort();
      resetParams(params.value);
      sort.value = undefined;
      fetchData();
    };

    const handleAdd = () => {
      beanId.value = null;
      formVisible.value = true;
    };
    const handleEdit = (id: number) => {
      beanId.value = id;
      formVisible.value = true;
    };
    const handleDelete = async (ids: number[]) => {
      await deleteDictType(ids);
      fetchData();
      ElMessage.success(t('success'));
    };
    const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
      const list = moveList(selected, data.value, type);
      await updateDictTypeOrder(list.map((item) => item.id));
    };
    return {
      params,
      filtered,
      table,
      data,
      selection,
      loading,
      formVisible,
      beanId,
      beanIds,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSearch,
      handleSort,
      handleReset,
      fetchData,
      perm,
      move,
    };
  },
});
</script>
