<script lang="ts">
export default { name: 'ChannelList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { perm, currentUser } from '@/stores/useCurrentUser';
import { moveTreeList, toParams, resetParams } from '@/utils/common';
import { toTree } from '@/utils/tree';
import { deleteChannel, queryChannelList, queryChannelPermissions, updateChannelOrder } from '@/api/content';
import { queryProcessDefinitionList } from '@/api/system';
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
const parent = ref<any>();
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));
const filtered = ref<boolean>(false);
const channelPermissions = ref<number[]>([]);
const processList = ref<any[]>([]);

const channelTree = ref<any>();
const channelTreeData = ref<any[]>([]);
const channelTreeLoading = ref<boolean>(false);
const channelTreeFilter = ref<string>();
const channel = ref<any>();

const deletable = (bean: any) => currentUser.allChannelPermission || channelPermissions.value.includes(bean.id);

watch(channelTreeFilter, (val) => {
  channelTree.value.filter(val);
});
const fetchChannelTreeData = async () => {
  channelTreeLoading.value = true;
  try {
    channelTreeData.value = toTree(await queryChannelList({ isOnlyParent: true }));
    nextTick(() => {
      if (channelTreeFilter.value != null) {
        channelTree.value.filter(channelTreeFilter.value);
      }
      channelTree.value.setCurrentKey(channel.value?.id);
    });
  } finally {
    channelTreeLoading.value = false;
  }
};
const fetchListData = async () => {
  loading.value = true;
  try {
    const queryed = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0;
    data.value = await queryChannelList({ ...toParams(params.value), parentId: channel.value?.id, isIncludeChildren: queryed, Q_OrderBy: sort.value });
    filtered.value = queryed || sort.value !== undefined;
  } finally {
    loading.value = false;
  }
};
const fetchData = () => {
  fetchChannelTreeData();
  fetchListData();
};
const fetchProcessList = async () => {
  if (currentUser.epRank > 0) {
    processList.value = await queryProcessDefinitionList({ category: 'sys_article', latestVersion: true });
  }
};
const fetchChannelPermissions = async () => {
  channelPermissions.value = await queryChannelPermissions();
};
onMounted(() => {
  fetchData();
  fetchProcessList();
  fetchChannelPermissions();
});

const handleSort = ({ column, prop, order }: { column: any; prop: string; order: string }) => {
  if (prop && order) {
    sort.value = (column.sortBy ?? prop) + (order === 'descending' ? '_desc' : '');
  } else {
    sort.value = undefined;
  }
  fetchData();
};
const handleFinished = () => {
  fetchData();
  fetchChannelPermissions();
};
const handleSearch = () => fetchListData();
const handleReset = () => {
  table.value.clearSort();
  resetParams(params.value);
  sort.value = undefined;
  fetchListData();
};

const handleAdd = (bean: any) => {
  beanId.value = undefined;
  parent.value = bean ?? channel.value;
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
  const list = moveTreeList(selected, data.value, type);
  await updateChannelOrder(list);
  await fetchData();
  selected.forEach(() => {
    table.value.toggleRowSelection(data.value);
  });
};
</script>

<template>
  <el-container>
    <el-aside width="220px" class="pr-3">
      <el-scrollbar class="p-2 bg-white rounded-sm">
        <el-input v-model="channelTreeFilter" :suffix-icon="Search" size="small" />
        <div class="my-1 ml-2">
          <el-button
            :type="channel == null ? 'primary' : undefined"
            link
            @click="
              () => {
                channelTree.setCurrentKey(null);
                channel = undefined;
                handleSearch();
              }
            "
          >
            {{ $t('channel.root') }}
          </el-button>
        </div>
        <el-tree
          ref="channelTree"
          v-loading="channelTreeLoading"
          :data="channelTreeData"
          :props="{ label: 'name' }"
          :expand-on-click-node="false"
          node-key="id"
          highlight-current
          :filter-node-method="
            (value, data) => {
              if (!value) return true;
              return data.name.includes(value);
            }
          "
          @node-click="
            (node) => {
              channel = node;
              handleSearch();
            }
          "
        ></el-tree>
      </el-scrollbar>
    </el-aside>
    <el-main class="p-0">
      <div class="mb-3">
        <query-form :params="params" @search="handleSearch" @reset="handleReset">
          <query-item :label="$t('channel.name')" name="Q_Contains_name"></query-item>
          <query-item :label="$t('channel.alias')" name="Q_Contains_alias"></query-item>
        </query-form>
      </div>
      <div>
        <el-button type="primary" :disabled="perm('channel:create')" :icon="Plus" @click="() => handleAdd(undefined)">{{ $t('add') }}</el-button>
        <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete(selection.map((row) => row.id))">
          <template #reference>
            <el-button :disabled="selection.length <= 0 || perm('channel:delete')" :icon="Delete">{{ $t('delete') }}</el-button>
          </template>
        </el-popconfirm>
        <list-move :disabled="selection.length <= 0 || filtered || perm('channel:update')" class="ml-2" @move="(type) => move(selection, type)" />
        <column-setting name="channel" class="ml-2" />
      </div>
      <div class="mt-3 app-block">
        <el-table
          ref="table"
          v-loading="loading"
          row-key="id"
          :data="data"
          @selection-change="(rows) => (selection = rows)"
          @row-dblclick="(row) => handleEdit(row.id)"
          @sort-change="handleSort"
        >
          <column-list name="channel">
            <el-table-column type="selection" :selectable="deletable" width="45"></el-table-column>
            <el-table-column property="name" :label="$t('channel.name')" min-width="120" sortable="custom"></el-table-column>
            <el-table-column property="alias" :label="$t('channel.alias')" min-width="80" sortable="custom"></el-table-column>
            <el-table-column
              property="channelModel.name"
              :label="$t('channel.channelModel')"
              sort-by="channelModel@model-name"
              display="none"
              sortable="custom"
              min-width="60"
            ></el-table-column>
            <el-table-column property="articleModel.name" :label="$t('channel.articleModel')" sort-by="articleModel@model-name" sortable="custom" min-width="60"></el-table-column>
            <el-table-column property="processKey" :label="$t('channel.processKey')" min-width="60" sortable="custom" show-overflow-tooltip>
              <template #default="{ row }">{{ row.processKey != null ? processList.find((item) => item.key === row.processKey)?.name : undefined }}</template>
            </el-table-column>
            <el-table-column property="nav" :label="$t('channel.nav')" min-width="40">
              <template #default="{ row }">
                <el-tag :type="row.nav ? 'success' : 'info'" size="small">{{ $t(row.nav ? 'yes' : 'no') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column property="id" label="ID" width="80" sortable="custom"></el-table-column>
            <el-table-column :label="$t('table.action')">
              <template #default="{ row }">
                <el-button type="primary" :disabled="perm('channel:create') || !deletable(row)" size="small" link @click="() => handleAdd(row)">{{ $t('addChild') }}</el-button>
                <el-button type="primary" :disabled="perm('channel:update')" size="small" link @click="() => handleEdit(row.id)">{{ $t('edit') }}</el-button>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete([row.id])">
                  <template #reference>
                    <el-button type="primary" :disabled="perm('channel:delete') || !deletable(row)" size="small" link>{{ $t('delete') }}</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </column-list>
        </el-table>
      </div>
      <channel-form v-model="formVisible" :bean-id="beanId" :bean-ids="beanIds" :parent="parent" @finished="handleFinished" />
    </el-main>
  </el-container>
</template>
