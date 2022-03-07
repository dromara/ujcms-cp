<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('channel.name')" name="Q_Contains_name"></query-item>
      </query-form>
    </div>
    <div>
      <el-button type="primary" :disabled="perm('channel:create')" :icon="Plus" @click="handleAdd(undefined)">{{ $t('add') }}</el-button>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('channel:delete')" :icon="Delete">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <list-move :disabled="selection.length <= 0 || filtered || perm('org:update')" @move="(type) => move(selection, type)" class="ml-2" />
      <column-setting name="channel" class="ml-2" />
    </div>
    <div class="app-block mt-3">
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
        <column-list name="channel">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column property="name" :label="$t('channel.name')" sortable="custom" show-overflow-tooltip>
            <template #default="{ row }">{{ filtered ? row.names.join(' / ') : row.name }}</template>
          </el-table-column>
          <el-table-column property="alias" :label="$t('channel.alias')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="channelModel.name" :label="$t('channel.channelModel')" display="none" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="articleModel.name" :label="$t('channel.articleModel')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="nav" :label="$t('channel.nav')">
            <template #default="{ row }">
              <el-icon v-if="row.nav" class="text-primary"><circle-check /></el-icon>
              <el-icon v-else class="text-secondary"><circle-close /></el-icon>
            </template>
          </el-table-column>
          <el-table-column property="id" label="ID" width="64" sortable="custom"></el-table-column>
          <el-table-column :label="$t('table.action')">
            <template #default="{ row }">
              <el-button type="text" :disabled="perm('channel:create')" @click="handleAdd(row)" size="small">{{ $t('addChild') }}</el-button>
              <el-button type="text" :disabled="perm('channel:update')" @click="handleEdit(row.id)" size="small">{{ $t('edit') }}</el-button>
              <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                <template #reference>
                  <el-button type="text" :disabled="perm('channel:delete')" size="small">{{ $t('delete') }}</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </column-list>
      </el-table>
    </div>
    <channel-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" :parent="parent" @finished="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { perm } from '@/store/useCurrentUser';
import { moveTreeList, toParams, resetParams } from '@/utils/common';
import { toTree, flatTree, findTreeItem } from '@/utils/tree';
import { deleteChannel, queryChannelList, updateChannelOrder } from '@/api/content';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import ChannelForm from './ChannelForm.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const table = ref<any>();
const data = ref<Array<any>>([]);
const selection = ref<Array<any>>([]);
const loading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => flatTree(data.value).map((row) => row.id));
const filtered = ref<boolean>(false);
const parent = ref<any>();

const fetchData = async () => {
  loading.value = true;
  try {
    data.value = await queryChannelList({ ...toParams(params.value), Q_OrderBy: sort.value });
    filtered.value = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0 || sort.value !== undefined;
    if (!filtered.value) {
      data.value = toTree(data.value);
    }
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

const handleAdd = (bean: any) => {
  beanId.value = undefined;
  parent.value = bean;
  formVisible.value = true;
};
const handleEdit = (id: number) => {
  beanId.value = id;
  parent.value = null;
  formVisible.value = true;
};
const handleDelete = async (ids: number[]) => {
  await deleteChannel(ids);
  fetchData();
  ElMessage.success(t('success'));
};
const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
  const list = moveTreeList(selected, flatTree(data.value), type);
  await updateChannelOrder(list);
  await fetchData();
  selected.forEach((row) => {
    table.value.toggleRowSelection(findTreeItem(data.value, (item) => item.id === row.id));
  });
};
</script>
