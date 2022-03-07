<template>
  <el-container>
    <el-aside width="180px" class="pr-3">
      <el-tabs v-model="blockId" @tab-click="fetchData()" tab-position="left" stretch class="bg-white">
        <el-tab-pane v-for="block in blockList" :key="block.id" :name="String(block.id)" :label="block.name"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="p-0">
      <div class="mb-3">
        <query-form :params="params" @search="handleSearch" @reset="handleReset">
          <query-item :label="$t('blockItem.title')" name="Q_Contains_title"></query-item>
        </query-form>
      </div>
      <div>
        <!-- <el-button type="primary" :disabled="perm('blockItem:create')" :icon="Plus" @click="handleAdd()">{{ $t('add') }}</el-button> -->
        <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
          <template #reference>
            <el-button :disabled="selection.length <= 0 || perm('blockItem:delete')" :icon="Delete">{{ $t('delete') }}</el-button>
          </template>
        </el-popconfirm>
        <list-move :disabled="selection.length <= 0 || filtered || perm('org:update')" @move="(type) => move(selection, type)" class="ml-2" />
        <column-setting name="blockItem" class="ml-2" />
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
          <column-list name="blockItem">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column property="id" label="ID" width="64" sortable="custom"></el-table-column>
            <el-table-column property="title" :label="$t('blockItem.title')" sortable="custom" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column property="image" :label="$t('blockItem.image')">
              <template #default="{ row }">
                <el-image v-if="!!row.image" :src="row.image" fit="contain" :preview-src-list="[row.image, row.mobileImage]" style="width: 100px; height: 100px"></el-image>
              </template>
            </el-table-column>
            <el-table-column property="mobileImage" :label="$t('blockItem.mobileImage')" display="none">
              <template #default="{ row }">
                <el-image
                  v-if="!!row.mobileImage"
                  :src="row.mobileImage"
                  fit="contain"
                  :preview-src-list="[row.mobileImage, row.image]"
                  style="width: 100px; height: 100px"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.action')">
              <template #default="{ row }">
                <el-button type="text" :disabled="perm('blockItem:update')" @click="handleEdit(row.id)" size="small">{{ $t('edit') }}</el-button>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                  <template #reference>
                    <el-button type="text" :disabled="perm('blockItem:delete')" size="small">{{ $t('delete') }}</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </column-list>
        </el-table>
      </div>
      <block-item-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" :blockId="Number(blockId)" @finished="fetchData" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { perm } from '@/store/useCurrentUser';
import { moveList, toParams, resetParams } from '@/utils/common';
import { queryBlockList } from '@/api/config';
import { deleteBlockItem, queryBlockItemList, updateBlockItemOrder } from '@/api/content';
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
const fetchData = async () => {
  loading.value = true;
  try {
    data.value = await queryBlockItemList({ ...toParams(params.value), Q_EQ_blockId: Number(blockId.value), Q_OrderBy: sort.value });
    filtered.value = Object.values(params.value).filter((v) => v !== undefined && v !== '').length > 0 || sort.value !== undefined;
  } finally {
    loading.value = false;
  }
};
const fetchBlockList = async () => {
  blockList.value = await queryBlockList({ Q_EQ_enabled_Boolean: true });
  blockId.value = String(blockList.value[0].id);
};
onMounted(async () => {
  await fetchBlockList();
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
  beanId.value = undefined;
  formVisible.value = true;
};
const handleEdit = (id: number) => {
  beanId.value = id;
  formVisible.value = true;
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

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    float: right;
    margin-right: 1px;
  }
}
</style>
