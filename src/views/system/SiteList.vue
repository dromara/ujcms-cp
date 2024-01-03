<script lang="ts">
export default { name: 'SiteList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { currentUser, perm } from '@/stores/useCurrentUser';
import { moveTreeList, toParams, resetParams } from '@/utils/common';
import { toTree, flatTree } from '@/utils/tree';
import { deleteSite, querySiteList, updateSiteOrder } from '@/api/system';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import SiteForm from './SiteForm.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const table = ref<any>();
const data = ref<any[]>([]);
const selection = ref<any[]>([]);
const loading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => flatTree(data.value).map((row) => row.id));
const filtered = ref<boolean>(false);
const parentId = ref<number>();
const showGlobalData = ref<boolean>(false);

const fetchData = async () => {
  loading.value = true;
  try {
    data.value = await querySiteList({ ...toParams(params.value), current: !showGlobalData.value, Q_OrderBy: sort.value });
    filtered.value = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0 || sort.value !== undefined;
    if (!filtered.value) {
      data.value = toTree(data.value);
    }
    parentId.value = showGlobalData.value ? undefined : data.value[0]?.id;
  } finally {
    loading.value = false;
  }
};
onMounted(fetchData);

const handleSort = ({ column, prop, order }: { column: any; prop: string; order: string }) => {
  if (prop && order) {
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
  await deleteSite(ids);
  fetchData();
  ElMessage.success(t('success'));
};
const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
  const list = moveTreeList(selected, flatTree(data.value), type);
  await updateSiteOrder(list);
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
        <query-item :label="$t('site.name')" name="Q_Contains_name"></query-item>
      </query-form>
    </div>
    <div>
      <el-button type="primary" :disabled="perm('site:create')" :icon="Plus" @click="() => handleAdd()">{{ $t('add') }}</el-button>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('site:delete')" :icon="Delete">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <list-move class="ml-2" :disabled="selection.length <= 0 || filtered || perm('site:update')" @move="(type) => move(selection, type)" />
      <el-checkbox v-if="currentUser.globalPermission" v-model="showGlobalData" class="ml-2 align-middle" :label="$t('globalData')" :border="true" @change="() => fetchData()" />
      <column-setting name="site" class="ml-2" />
    </div>
    <div class="mt-3 app-block">
      <el-table
        ref="table"
        v-loading="loading"
        row-key="id"
        default-expand-all
        :data="data"
        @selection-change="(rows) => (selection = rows)"
        @row-dblclick="(row) => handleEdit(row.id)"
        @sort-change="handleSort"
      >
        <column-list name="site">
          <el-table-column type="selection" width="38"></el-table-column>
          <el-table-column property="name" :label="$t('site.name')" sortable="custom" min-width="120px" show-overflow-tooltip>
            <template #default="{ row }">{{ filtered ? row.names.join(' / ') : row.name }}</template>
          </el-table-column>
          <el-table-column property="url" :label="$t('site.url')" min-width="120px" show-overflow-tooltip></el-table-column>
          <el-table-column property="domain" :label="$t('site.domain')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="subDir" :label="$t('site.subDir')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="theme" :label="$t('site.theme')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="mobileTheme" :label="$t('site.mobileTheme')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="org.name" :label="$t('site.org')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="status" :label="$t('site.status')" sortable="custom" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="success" size="small">{{ $t(`site.status.${row.status}`) }}</el-tag>
              <el-tag v-if="row.status === 1" type="danger" size="small">{{ $t(`site.status.${row.status}`) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column property="id" label="ID" width="80" sortable="custom"></el-table-column>
          <el-table-column :label="$t('table.action')">
            <template #default="{ row }">
              <el-button type="primary" :disabled="perm('site:create')" size="small" link @click="() => handleAdd(row.id)">{{ $t('addChild') }}</el-button>
              <el-button type="primary" :disabled="perm('site:update')" size="small" link @click="() => handleEdit(row.id)">{{ $t('edit') }}</el-button>
              <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete([row.id])">
                <template #reference>
                  <el-button type="primary" :disabled="perm('site:delete')" size="small" link>{{ $t('delete') }}</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </column-list>
      </el-table>
    </div>
    <site-form v-model="formVisible" :bean-id="beanId" :bean-ids="beanIds" :parent-id="parentId" :show-global-data="showGlobalData" @finished="fetchData" />
  </div>
</template>
