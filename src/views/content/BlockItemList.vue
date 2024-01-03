<script lang="ts">
export default { name: 'BlockItemList' };
</script>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { perm } from '@/stores/useCurrentUser';
import { moveList, toParams, resetParams } from '@/utils/common';
import { queryBlockList } from '@/api/config';
import { deleteBlockItem, queryBlockItemList, updateBlockItem, updateBlockItemOrder } from '@/api/content';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ListMove from '@/components/ListMove.vue';
import BlockItemForm from './BlockItemForm.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const table = ref<any>();
const data = ref<any[]>([]);
const selection = ref<any[]>([]);
const loading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));
const filtered = ref<boolean>(false);
const blockList = ref<any[]>([]);
const blockId = ref<string>();
const block = computed(() => blockList.value.find((item) => item.id === Number(blockId.value)));
const previewSrcList = computed(() => data.value.map((it) => it.image));
const mobilePreviewSrcList = computed(() => data.value.map((it) => it.mobileImage));
const fetchData = async () => {
  loading.value = true;
  try {
    data.value = await queryBlockItemList({ ...toParams(params.value), blockId: Number(blockId.value), Q_OrderBy: sort.value });
    filtered.value = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0 || sort.value !== undefined;
  } finally {
    loading.value = false;
  }
};
const fetchBlockList = async () => {
  blockList.value = await queryBlockList();
  blockId.value = String(blockList.value[0].id);
};

watch(blockId, () => fetchData());

onMounted(async () => {
  await fetchBlockList();
});

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

const handleAdd = () => {
  beanId.value = undefined;
  formVisible.value = true;
};
const handleEdit = (id: number) => {
  beanId.value = id;
  formVisible.value = true;
};
const handleUpdate = async (bean: any) => {
  await updateBlockItem(bean);
  fetchData();
  ElMessage.success(t('success'));
};
const handleDelete = async (ids: number[]) => {
  await deleteBlockItem(ids);
  fetchData();
  ElMessage.success(t('success'));
};
const move = async (selected: any[], type: 'top' | 'up' | 'down' | 'bottom') => {
  const list = moveList(selected, data.value, type);
  await updateBlockItemOrder(list.map((item) => item.id));
};
</script>

<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="blockId" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="item in blockList" :key="item.id" :name="String(item.id)" :label="item.name"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-0">
      <div class="mb-3">
        <query-form :params="params" @search="handleSearch" @reset="handleReset">
          <query-item :label="$t('blockItem.title')" name="Q_Contains_title"></query-item>
        </query-form>
      </div>
      <div>
        <el-button type="primary" :disabled="!block?.enabled || perm('blockItem:create')" :icon="Plus" @click="() => handleAdd()">{{ $t('add') }}</el-button>
        <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete(selection.map((row) => row.id))">
          <template #reference>
            <el-button :disabled="selection.length <= 0 || perm('blockItem:delete')" :icon="Delete">{{ $t('delete') }}</el-button>
          </template>
        </el-popconfirm>
        <list-move :disabled="selection.length <= 0 || filtered || perm('blockItem:update')" class="ml-2" @move="(type) => move(selection, type)" />
        <column-setting name="blockItem" class="ml-2" />
      </div>
      <div class="mt-3 app-block">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          @selection-change="(rows: any) => (selection = rows)"
          @row-dblclick="(row: any) => handleEdit(row.id)"
          @sort-change="handleSort"
        >
          <column-list name="blockItem">
            <el-table-column type="selection" width="38"></el-table-column>
            <el-table-column property="id" label="ID" width="80" sortable="custom"></el-table-column>
            <el-table-column property="title" :label="$t('blockItem.title')" sortable="custom" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column property="image" :label="$t('blockItem.image')">
              <template #default="{ row, $index }">
                <el-image
                  v-if="!!row.image"
                  :src="row.image"
                  fit="contain"
                  :preview-src-list="previewSrcList"
                  :initial-index="$index"
                  preview-teleported
                  class="w-32 h-32"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column property="mobileImage" :label="$t('blockItem.mobileImage')" display="none">
              <template #default="{ row, $index }">
                <el-image
                  v-if="!!row.mobileImage"
                  :src="row.mobileImage"
                  fit="contain"
                  :preview-src-list="mobilePreviewSrcList"
                  :initial-index="$index"
                  preview-teleported
                  class="w-32 h-32"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column property="targetBlank" :label="$t('blockItem.targetBlank')" sortable="custom" width="120">
              <template #default="{ row }">
                <el-switch v-model="row.targetBlank" :disabled="perm('blockItem:update')" @change="(targetBlank) => handleUpdate({ ...row, targetBlank })" />
              </template>
            </el-table-column>
            <el-table-column property="enabled" :label="$t('enable')" sortable="custom" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" :disabled="perm('blockItem:update')" @change="(enabled) => handleUpdate({ ...row, enabled })" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.action')">
              <template #default="{ row }">
                <el-button type="primary" :disabled="perm('blockItem:update')" size="small" link @click="() => handleEdit(row.id)">{{ $t('edit') }}</el-button>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete([row.id])">
                  <template #reference>
                    <el-button type="primary" :disabled="perm('blockItem:delete')" size="small" link>{{ $t('delete') }}</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </column-list>
        </el-table>
      </div>
      <block-item-form v-model="formVisible" :bean-id="beanId" :bean-ids="beanIds" :block-id="Number(blockId)" @finished="fetchData" />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    float: right;
    margin-right: 1px;
  }
}
</style>
