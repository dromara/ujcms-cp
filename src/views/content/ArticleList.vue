<template>
  <el-container>
    <el-aside width="200px" class="pr-3">
      <el-scrollbar class="bg-white rounded-sm p-2">
        <div class="mb-1 ml-2">
          <el-link
            :underline="false"
            :type="channel == null ? 'primary' : undefined"
            @click="
              channelTreeRef.setCurrentKey(null);
              channel = undefined;
              handleSearch();
            "
            href="javascript:"
          >
            {{ $t('article.allChannel') }}
          </el-link>
        </div>
        <el-tree
          ref="channelTreeRef"
          v-loading="channelTreeloading"
          :data="channelTree"
          :props="{ label: 'name' }"
          :expand-on-click-node="false"
          node-key="id"
          highlight-current
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
          <query-item :label="$t('article.title')" name="Q_Contains_@articleExt-title"></query-item>
          <query-item :label="$t('article.text')" name="Q_Contains_@articleExt-text"></query-item>
          <query-item :label="$t('article.publishDate')" name="Q_GE_publishDate_DateTime,Q_LE_publishDate_DateTime" type="datetime"></query-item>
          <query-item
            :label="$t('article.status')"
            name="Q_In_status_Int"
            :options="[0, 1, 2, 3, 4, 8, 9].map((item) => ({ label: $t(`article.status.${item}`), value: item }))"
          ></query-item>
          <query-item :label="$t('article.org')" name="Q_GE_org-name"></query-item>
          <query-item :label="$t('article.user')" name="Q_GE_user-username"></query-item>
          <query-item :label="$t('article.created')" name="Q_GE_@articleExt-created_DateTime,Q_LE_@articleExt-created_DateTime" type="datetime"></query-item>
          <query-item :label="$t('article.modifiedUser')" name="Q_GE_modifiedUser-username"></query-item>
          <query-item :label="$t('article.modified')" name="Q_GE_@articleExt-modified_DateTime,Q_LE_@articleExt-modified_DateTime" type="datetime"></query-item>
          <query-item :label="$t('article.author')" name="Q_Contains_@articleExt-author"></query-item>
          <query-item :label="$t('article.editor')" name="Q_Contains_@articleExt-editor"></query-item>
          <query-item :label="$t('article.source')" name="Q_Contains_@articleExt-source"></query-item>
          <query-item :label="$t('article.subtitle')" name="Q_Contains_@articleExt-subtitle"></query-item>
          <query-item :label="$t('article.fullTitle')" name="Q_Contains_@articleExt-fullTitle"></query-item>
          <query-item :label="$t('article.seoKeywords')" name="Q_Contains_@articleExt-seoKeywords"></query-item>
          <query-item :label="$t('article.seoDescription')" name="Q_Contains_@articleExt-seoDescription"></query-item>
        </query-form>
      </div>
      <div>
        <el-button type="primary" :disabled="perm('article:create')" :icon="Plus" @click="handleAdd()">{{ $t('add') }}</el-button>
        <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
          <template #reference>
            <el-button :disabled="selection.length <= 0 || perm('article:delete')" :icon="Delete" class="ml-2">{{ $t('delete') }}</el-button>
          </template>
        </el-popconfirm>
        <column-setting name="article" class="ml-2" />
      </div>
      <div class="app-block mt-3">
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="data"
          @selection-change="(rows) => (selection = rows)"
          @row-dblclick="(row) => handleEdit(row.id)"
          @sort-change="handleSort"
        >
          <column-list name="article">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column property="id" label="ID" width="64" sortable="custom"></el-table-column>
            <el-table-column property="title" :label="$t('article.title')" min-width="280" sort-by="@articleExt-title" sortable="custom">
              <template #default="{ row }">
                {{ row.title }}
                <el-tag v-for="item in row.blockItemList" :key="item.id" @close="handleBlockItemDelete(item.id)" size="small" closable>{{ item.block.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column property="channel.name" :label="$t('article.channel')" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column property="org.name" :label="$t('article.org')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="author" :label="$t('article.author')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="editor" :label="$t('article.editor')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="source" :label="$t('article.source')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="user.username" :label="$t('article.user')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="created" :label="$t('article.created')" min-width="120" sortable="custom" display="none" show-overflow-tooltip>
              <template #default="{ row }">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm') }}</template>
            </el-table-column>
            <el-table-column property="modifiedUser.username" :label="$t('article.modifiedUser')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="modified" :label="$t('article.modified')" min-width="120" sortable="custom" display="none" show-overflow-tooltip>
              <template #default="{ row }">{{ dayjs(row.modified).format('YYYY-MM-DD HH:mm') }}</template>
            </el-table-column>
            <el-table-column property="publishDate" :label="$t('article.publishDate')" min-width="120" sortable="custom" show-overflow-tooltip>
              <template #default="{ row }">{{ dayjs(row.publishDate).format('YYYY-MM-DD HH:mm') }}</template>
            </el-table-column>
            <el-table-column property="views" :label="$t('article.views')" sort-by="@articleBuffer-views" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column
              property="dayViews"
              :label="$t('article.dayViews')"
              sort-by="@articleBuffer-dayViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="weekViews"
              :label="$t('article.weekViews')"
              sort-by="@articleBuffer-weekViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="monthViews"
              :label="$t('article.monthViews')"
              sort-by="@articleBuffer-monthViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="quarterViews"
              :label="$t('article.quarterViews')"
              sort-by="@articleBuffer-quarterViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="yearViews"
              :label="$t('article.yearViews')"
              sort-by="@articleBuffer-yearViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column property="status" :label="$t('article.status')" sortable="custom" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag v-if="row.status === 0" type="success" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tag v-else type="info" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.action')" min-width="100">
              <template #default="{ row }">
                <el-button type="text" :disabled="perm('article:update')" @click="handleEdit(row.id)" size="small">{{ $t('edit') }}</el-button>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                  <template #reference>
                    <el-button type="text" :disabled="perm('article:delete')" size="small">{{ $t('delete') }}</el-button>
                  </template>
                </el-popconfirm>
                <el-dropdown class="ml-2">
                  <el-button type="text" size="small">
                    <el-icon class="text-primary"><more-filled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="item in blockList"
                        :key="item.id"
                        @click="recommendTo(item.id, row.id, row.title, row.description)"
                        :disabled="row.blocks.findIndex((block: any) => block.id === item.id) >= 0"
                      >
                        <span class="text-xs"> {{ `${$t('article.op.recommendTo')}: ${item.name}` }} </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </column-list>
        </el-table>
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          :page-sizes="pageSizes"
          :layout="pageLayout"
          @size-change="fetchData()"
          @current-change="fetchData()"
          small
          background
          class="px-3 py-2 justify-end"
        ></el-pagination>
      </div>

      <article-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" :channel="channel" @finished="fetchData" />
      <block-item-form
        v-model="recommendVisible"
        :beanId="null"
        :beanIds="[]"
        :blockId="recommendBlockId"
        :articleId="recommendArticleId"
        :title="recommendTitle"
        :description="recommendDescription"
        @finished="fetchData"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, MoreFilled } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { perm } from '@/store/useCurrentUser';
import { pageSizes, pageLayout, toParams, resetParams } from '@/utils/common';
import { toTree } from '@/utils/tree';
import { queryBlockList } from '@/api/config';
import { deleteArticle, queryArticlePage, queryChannelList, deleteBlockItem } from '@/api/content';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ArticleForm from './ArticleForm.vue';
import BlockItemForm from './BlockItemForm.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const table = ref<any>();
const data = ref<Array<any>>([]);
const selection = ref<Array<any>>([]);
const channelTreeloading = ref<boolean>(false);
const tableLoading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));
const channelTreeRef = ref<any>();
const channelTree = ref<any[]>([]);
const channel = ref<any>();
const blockList = ref<any[]>([]);
const recommendVisible = ref<boolean>(false);
const recommendBlockId = ref<number>();
const recommendArticleId = ref<number>();
const recommendTitle = ref<string>();
const recommendDescription = ref<string>();
const fetchData = async () => {
  tableLoading.value = true;
  try {
    const { content, totalElements } = await queryArticlePage({
      ...toParams(params.value),
      channelId: channel.value?.id,
      Q_OrderBy: sort.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    data.value = content;
    total.value = totalElements;
  } finally {
    tableLoading.value = false;
  }
};
const fetchChannel = async () => {
  channelTreeloading.value = true;
  try {
    channelTree.value = toTree(await queryChannelList());
  } finally {
    channelTreeloading.value = false;
  }
};
const fetchBlockList = async () => {
  blockList.value = await queryBlockList({ Q_EQ_enabled_Boolean: true });
};
onMounted(() => {
  fetchData();
  fetchChannel();
  fetchBlockList();
});

const handleSort = ({ column, prop, order }: { column: any; prop: string; order: string }) => {
  if (prop) {
    sort.value = (column.sortBy ?? prop) + (order === 'descending' ? '_desc' : '');
  } else {
    sort.value = undefined;
  }
  fetchData();
};
const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};
const handleReset = () => {
  table.value.clearSort();
  resetParams(params.value);
  sort.value = undefined;
  currentPage.value = 1;
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
  await deleteArticle(ids);
  fetchData();
  ElMessage.success(t('success'));
};
const recommendTo = (blockId: number, articleId: number, title: string, description: string) => {
  recommendVisible.value = true;
  recommendBlockId.value = blockId;
  recommendArticleId.value = articleId;
  recommendTitle.value = title;
  recommendDescription.value = description;
};
const handleBlockItemDelete = async (blockItemId: number) => {
  await deleteBlockItem([blockItemId]);
  fetchData();
  ElMessage.success(t('success'));
};
</script>
