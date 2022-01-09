<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="typeId" @tab-click="fetchData()" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="type in typeList" :key="type.id" :name="String(type.id)" :label="type.name"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-0">
      <div class="mb-3">
        <query-form :params="params" @search="handleSearch" @reset="handleReset">
          <query-item :label="$t('dict.name')" name="Q_Contains_name"></query-item>
        </query-form>
      </div>
      <div>
        <el-button type="primary" :disabled="perm('dict:create')" icon="el-icon-plus" size="small" @click="handleAdd()">{{ $t('add') }}</el-button>
        <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
          <template #reference>
            <el-button :disabled="selection.length <= 0 || perm('dict:delete')" icon="el-icon-delete" size="small">{{ $t('delete') }}</el-button>
          </template>
        </el-popconfirm>
        <list-move :disabled="selection.length <= 0 || filtered || perm('org:update')" @move="(type) => move(selection, type)" class="ml-2" />
        <column-setting name="dict" class="ml-2" />
      </div>
      <div class="app-block mt-3">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          @selection-change="(rows) => (selection = rows)"
          @row-dblclick="(row) => handleEdit(row.id)"
          @sort-change="handleSort"
        >
          <column-list name="dict">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column property="id" label="ID" width="60" sortable="custom"></el-table-column>
            <el-table-column property="name" :label="$t('dict.name')" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column property="value" :label="$t('dict.value')" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column property="enabled" :label="$t('dict.enabled')" sortable="custom" :formatter="(row) => $t(row.enabled ? 'yes' : 'no')" />
            <el-table-column :label="$t('table.action')">
              <template #default="{row}">
                <el-space>
                  <el-link type="primary" :disabled="perm('dict:update')" @click="handleEdit(row.id)" class="text-xs" href="javascript:">{{ $t('edit') }}</el-link>
                  <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                    <template #reference>
                      <el-link type="primary" :disabled="perm('dict:delete')" class="text-xs" href="javascript:">{{ $t('delete') }}</el-link>
                    </template>
                  </el-popconfirm>
                </el-space>
              </template>
            </el-table-column>
          </column-list>
        </el-table>
      </div>
      <dict-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" :type="dictType" @finished="fetchData" />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { perm } from '@/store/useCurrentUser';
import { moveList, toParams, resetParams } from '@/utils/common';
import { deleteDict, queryDictList, updateDictOrder, queryDictTypeList } from '@/api/config';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import DictForm from './DictForm.vue';

export default defineComponent({
  components: { DictForm, ColumnList, ColumnSetting, QueryForm, QueryItem, ListMove },
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
    const typeList = ref<any[]>([]);
    const typeId = ref<string | null>(null);
    const dictType = computed(() => typeList.value.find((item) => item.id === Number(typeId.value)));
    const fetchData = async () => {
      loading.value = true;
      try {
        data.value = await queryDictList({ ...toParams(params.value), typeId: Number(typeId.value), Q_OrderBy: sort.value });
        filtered.value = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0 || sort.value !== undefined;
      } finally {
        loading.value = false;
      }
    };
    const fetchDictTypeList = async () => {
      typeList.value = await queryDictTypeList();
      typeId.value = String(typeList.value[0].id);
    };
    onMounted(async () => {
      await fetchDictTypeList();
      fetchData();
    });

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
      await deleteDict(ids);
      fetchData();
      ElMessage.success(t('success'));
    };
    const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
      const list = moveList(selected, data.value, type);
      await updateDictOrder(list.map((item) => item.id));
    };
    return {
      params,
      filtered,
      table,
      data,
      typeList,
      typeId,
      dictType,
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

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    float: right;
    margin-right: 1px;
  }
}
</style>
