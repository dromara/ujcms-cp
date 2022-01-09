<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('role.name')" name="Q_Contains_name"></query-item>
        <query-item :label="$t('role.description')" name="Q_Contains_description"></query-item>
      </query-form>
    </div>
    <div>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">{{ $t('add') }}</el-button>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0" icon="el-icon-delete" size="small">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <list-move class="ml-2" :disabled="selection.length <= 0 || filtered || perm('role:update')" @move="(type) => move(selection, type)" />
      <column-setting name="role" class="ml-2" />
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      @selection-change="(rows) => (selection = rows)"
      @row-dblclick="(row) => handleEdit(row.id)"
      @sort-change="handleSort"
      class="mt-3 shadow bg-white"
    >
      <column-list name="role">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column property="id" label="ID" width="60" sortable="custom"></el-table-column>
        <el-table-column property="name" :label="$t('role.name')" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column property="description" :label="$t('role.description')" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('table.action')">
          <template #default="{row}">
            <el-button type="text" size="small" @click="handleEdit(row.id)">{{ $t('edit') }}</el-button>
            <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
              <template #reference>
                <el-button type="text" size="small">{{ $t('delete') }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </column-list>
    </el-table>
    <role-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" @finished="fetchData" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { perm } from '@/store/useCurrentUser';
import { deleteRole, queryRoleList, updateRoleOrder } from '@/api/user';
import { moveList, toParams, resetParams } from '@/utils/common';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import RoleForm from './RoleForm.vue';

export default defineComponent({
  components: { RoleForm, ColumnList, ColumnSetting, QueryForm, QueryItem, ListMove },
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
        data.value = await queryRoleList({ ...toParams(params.value), Q_OrderBy: sort.value });
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
      await deleteRole(ids);
      fetchData();
      ElMessage.success(t('success'));
    };
    const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
      const list = moveList(selected, data.value, type);
      await updateRoleOrder(list.map((item) => item.id));
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
