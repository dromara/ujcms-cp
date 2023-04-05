<script lang="ts">
export default { name: 'OrgList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { currentUser, perm } from '@/store/useCurrentUser';
import { ElMessage } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { moveTreeList, toParams, resetParams } from '@/utils/common';
import { deleteOrg, queryOrgList, updateOrgOrder } from '@/api/user';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import OrgForm from './OrgForm.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const table = ref<any>();
const data = ref<Array<any>>([]);
const selection = ref<Array<any>>([]);
const loading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));
const filtered = ref<boolean>(false);
const parentId = ref<number>(1);
const showGlobalData = ref<boolean>(false);

const fetchData = async () => {
  loading.value = true;
  try {
    data.value = await queryOrgList({ ...toParams(params.value), current: !showGlobalData.value, Q_OrderBy: sort.value });
    filtered.value = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0 || sort.value !== undefined;
    parentId.value = data.value[0]?.id;
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

const handleAdd = (pid?: number) => {
  beanId.value = undefined;
  if (pid != null) {
    parentId.value = pid;
  }
  formVisible.value = true;
};
const handleEdit = (id: number) => {
  beanId.value = id;
  formVisible.value = true;
};
const handleDelete = async (ids: number[]) => {
  await deleteOrg(ids);
  fetchData();
  ElMessage.success(t('success'));
};
const deletable = (bean: any) => bean.id > 1;

const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
  const list = moveTreeList(selected, data.value, type);
  await updateOrgOrder(list);
  await fetchData();
  selected.forEach((row) => {
    table.value.toggleRowSelection(data.value.find((item) => item.id === row.id));
  });
};
</script>

<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('org.name')" name="Q_Contains_name"></query-item>
        <query-item :label="$t('org.address')" name="Q_Contains_address"></query-item>
        <query-item :label="$t('org.phone')" name="Q_Contains_phone"></query-item>
        <query-item :label="$t('org.contacts')" name="Q_Contains_contacts"></query-item>
      </query-form>
    </div>
    <div>
      <el-button type="primary" :icon="Plus" @click="() => handleAdd()">{{ $t('add') }}</el-button>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0" :icon="Delete">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <list-move class="ml-2" :disabled="selection.length <= 0 || filtered || perm('org:update')" @move="(type) => move(selection, type)" />
      <el-checkbox v-if="currentUser.globalPermission" v-model="showGlobalData" class="ml-2 align-middle" :label="$t('globalData')" border @change="() => fetchData()" />
      <column-setting name="org" class="ml-2" />
    </div>
    <div class="app-block mt-3">
      <el-table
        ref="table"
        v-loading="loading"
        row-key="id"
        :data="data"
        @selection-change="(rows) => (selection = rows)"
        @row-dblclick="(row) => handleEdit(row.id)"
        @sort-change="handleSort"
      >
        <column-list name="org">
          <el-table-column type="selection" :selectable="deletable" width="45"></el-table-column>
          <el-table-column property="id" label="ID" width="64" sortable="custom"></el-table-column>
          <el-table-column property="name" :label="$t('org.name')" sortable="custom" min-width="120" show-overflow-tooltip>
            <template #default="{ row }">{{ row.names.join(' / ') }}</template>
          </el-table-column>
          <el-table-column property="address" :label="$t('org.address')" sortable="custom" display="none" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column property="phone" :label="$t('org.phone')" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column property="contacts" :label="$t('org.contacts')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('table.action')">
            <template #default="{ row }">
              <el-button type="primary" :disabled="perm('org:create')" size="small" link @click="() => handleAdd(row.id)">{{ $t('addChild') }}</el-button>
              <el-button type="primary" :disabled="perm('org:update')" size="small" link @click="() => handleEdit(row.id)">{{ $t('edit') }}</el-button>
              <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete([row.id])">
                <template #reference>
                  <el-button type="primary" :disabled="!deletable(row) || perm('org:delete')" size="small" link>{{ $t('delete') }}</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </column-list>
      </el-table>
    </div>
    <org-form v-model="formVisible" :bean-id="beanId" :bean-ids="beanIds" :parent-id="parentId" :show-global-data="showGlobalData" @finished="fetchData" />
  </div>
</template>
