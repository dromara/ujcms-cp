<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('storage.name')" name="Q_Contains_name"></query-item>
      </query-form>
    </div>
    <div>
      <el-button type="primary" :disabled="perm('storage:create')" icon="el-icon-plus" size="small" @click="handleAdd">{{ $t('add') }}</el-button>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('storage:delete')" icon="el-icon-delete" size="small">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <list-move :disabled="selection.length <= 0 || filtered || perm('org:update')" @move="(type) => move(selection, type)" class="ml-2" />
      <column-setting name="storage" class="ml-2" />
    </div>
    <div class="app-block mt-3">
      <el-table ref="table" v-loading="loading" :data="data" @selection-change="(rows) => (selection = rows)" @row-dblclick="(row) => handleEdit(row.id)" @sort-change="handleSort">
        <column-list name="storage">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column property="id" label="ID" width="60" sortable="custom"></el-table-column>
          <el-table-column property="name" :label="$t('storage.name')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="description" :label="$t('storage.description')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="path" :label="$t('storage.path')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="url" :label="$t('storage.url')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="type" :label="$t('storage.type')" sortable="custom" :formatter="(row) => $t(`storage.type.${row.type}`)" />
          <el-table-column property="mode" :label="$t('storage.mode')" sortable="custom" :formatter="(row) => $t(`storage.mode.${row.mode}`)" />
          <el-table-column property="scope" :label="$t('storage.scope')" sortable="custom" :formatter="(row) => $t(`storage.scope.${row.scope}`)" />
          <el-table-column :label="$t('table.action')">
            <template #default="{row}">
              <el-space>
                <el-link type="primary" :disabled="perm('storage:update')" @click="handleEdit(row.id)" class="text-xs" href="javascript:">{{ $t('edit') }}</el-link>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                  <template #reference>
                    <el-link type="primary" :disabled="perm('storage:delete')" class="text-xs" href="javascript:">{{ $t('delete') }}</el-link>
                  </template>
                </el-popconfirm>
              </el-space>
            </template>
          </el-table-column>
        </column-list>
      </el-table>
    </div>
    <storage-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" @finished="fetchData" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { perm } from '@/store/useCurrentUser';
import { moveList, toParams, resetParams } from '@/utils/common';
import { deleteStorage, queryStorageList, updateStorageOrder } from '@/api/system';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import StorageForm from './StorageForm.vue';

export default defineComponent({
  components: { StorageForm, ColumnList, ColumnSetting, QueryForm, QueryItem, ListMove },
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
        data.value = await queryStorageList({ ...toParams(params.value), Q_OrderBy: sort.value });
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
      await deleteStorage(ids);
      fetchData();
      ElMessage.success(t('success'));
    };
    const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
      const list = moveList(selected, data.value, type);
      await updateStorageOrder(list.map((item) => item.id));
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
