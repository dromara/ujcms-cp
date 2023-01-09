<template>
  <el-container>
    <el-aside width="200px" class="pr-3">
      <el-scrollbar class="bg-white rounded-sm p-2">
        <div class="mb-1 ml-2">
          <el-button
            :type="channel == null ? 'primary' : undefined"
            @click="
              channelTree.setCurrentKey(null);
              channel = undefined;
              handleSearch();
            "
            link
          >
            {{ $t('article.allChannel') }}
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
          @node-click="
            (node: any) => {
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
            :options="[0, 1, 10, 11, 12, 15, 20, 21, 22].map((item) => ({ label: $t(`article.status.${item}`), value: item }))"
          ></query-item>
          <query-item
            :label="$t('article.block')"
            name="Q_In_@BlockItem-blockId_Int"
            :options="blockList.filter((item) => item.recommendable).map((item) => ({ label: item.name, value: item.id }))"
          ></query-item>
          <query-item :label="$t('article.org')" name="Q_Like_org-name"></query-item>
          <query-item :label="$t('article.user')" name="Q_Like_user-username"></query-item>
          <query-item :label="$t('article.created')" name="Q_GE_@articleExt-created_DateTime,Q_LE_@articleExt-created_DateTime" type="datetime"></query-item>
          <query-item :label="$t('article.modifiedUser')" name="Q_Like_modifiedUser@user-username"></query-item>
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
        <el-select v-model="batchAction" class="ml-2">
          <template #prefix>{{ $t('batchAction') + ':' }}</template>
          <el-option v-for="item in batchActions" :disabled="perm(`article:${item}`)" :key="item" :value="item" :label="$t(`article.op.${item}`)" />
        </el-select>
        <el-popconfirm :title="$t('confirmExecute')" @confirm="handleExecute(batchAction, selectionIds)">
          <template #reference>
            <el-button :disabled="selectionIds.length <= 0 || perm(`article:${batchAction}`)" :icon="Cpu">{{ $t('execute') }}</el-button>
          </template>
        </el-popconfirm>
        <column-setting name="article" class="ml-2" />
      </div>
      <div class="app-block mt-3">
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="data"
          @selection-change="(rows: any) => (selection = rows)"
          @row-dblclick="(row: any) => handleEdit(row.id)"
          @sort-change="handleSort"
        >
          <column-list name="article">
            <el-table-column type="selection" :selectable="selectable" width="45"></el-table-column>
            <el-table-column property="id" label="ID" width="64" sortable="custom"></el-table-column>
            <el-table-column property="title" :label="$t('article.title')" min-width="280" sort-by="@articleExt-title" sortable="custom">
              <template #default="{ row }">
                <el-link :href="row.url" :underline="false" target="_blank">{{ row.title }}</el-link>
                <el-tag
                  v-for="item in row.blockItemList"
                  :key="item.id"
                  @close="handleBlockItemDelete(item.id)"
                  :type="item.enabled ? undefined : 'info'"
                  size="small"
                  class="ml-1"
                  closable
                >
                  {{ item.block.name }}
                </el-tag>
                <el-tag v-if="row.sticky > 0" @close="cancelSticky(row.id)" type="danger" class="mx-1" effect="light" size="small" round :closable="!perm('article:sticky')">
                  {{ row.sticky }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column property="channel.name" :label="$t('article.channel')" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column property="org.name" :label="$t('article.org')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="author" :label="$t('article.author')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="editor" :label="$t('article.editor')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="source" :label="$t('article.source')" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="user.username" :label="$t('article.user')" sort-by="user-username" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
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
                <el-tag v-else-if="row.status === 1" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 20" type="danger" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 21" type="warning" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tooltip v-else-if="row.status === 22" :content="row.rejectReason" placement="top">
                  <el-tag type="warning" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                </el-tooltip>
                <el-tag v-else type="info" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.action')" width="190">
              <template #default="{ row }">
                <el-button type="primary" :disabled="perm('article:update')" @click="handleEdit(row.id)" size="small" link>{{ $t('edit') }}</el-button>
                <el-button
                  v-if="currentUser.epRank > 0 || currentUser.epDisplay"
                  type="primary"
                  :disabled="!row.processInstanceId || perm('processInstance:task') || currentUser.epRank < 1"
                  @click="handleTask(row.processInstanceId)"
                  size="small"
                  link
                >
                  {{ $t('processInstance.op.task') }}
                </el-button>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="handleExecute('delete', [row.id])">
                  <template #reference>
                    <el-button type="primary" :disabled="perm('article:delete')" size="small" link>{{ $t('delete') }}</el-button>
                  </template>
                </el-popconfirm>
                <el-dropdown class="ml-2 align-middle">
                  <el-button type="primary" size="small" link>
                    <el-icon class="text-primary"><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <div>
                      <el-dropdown-menu>
                        <el-dropdown-item :disabled="perm('article:sticky')" @click="handleSticky(row.id, row.sticky)">
                          <span class="text-xs">{{ $t('article.op.sticky') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-for="(item, index) in blockList.filter((it) => it.enabled && it.recommendable)"
                          :key="item.id"
                          @click="recommendTo(item.id, row)"
                          :disabled="row.blocks.findIndex((block: any) => block.id === item.id) >= 0"
                          :divided="index === 0"
                        >
                          <span class="text-xs"> {{ `${$t('article.op.recommendTo')}: ${item.name}` }} </span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </div>
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
        :video="recommendVideo"
        :images="recommendImages"
        @finished="fetchData"
      />
      <process-task-list :instanceId="instanceId" v-model="taskListVisible" />
    </el-main>
  </el-container>
</template>

<script lang="ts">
export default { name: 'ArticleList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Cpu, MoreFilled } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import * as htmlparser2 from 'htmlparser2';
import * as domutils from 'domutils';
import { perm, currentUser } from '@/store/useCurrentUser';
import { pageSizes, pageLayout, toParams, resetParams } from '@/utils/common';
import { toTree } from '@/utils/tree';
import { queryBlockList } from '@/api/config';
import {
  deleteArticle,
  submitArticle,
  archiveArticle,
  offlineArticle,
  completelyDeleteArticle,
  stickyArticle,
  queryArticlePage,
  queryChannelList,
  deleteBlockItem,
} from '@/api/content';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import ArticleForm from './ArticleForm.vue';
import BlockItemForm from './BlockItemForm.vue';
import ProcessTaskList from '@/views/system/ProcessTaskList.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const table = ref<any>();
const data = ref<Array<any>>([]);
const selection = ref<Array<any>>([]);
const tableLoading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));
const blockList = ref<any[]>([]);
const recommendVisible = ref<boolean>(false);
const recommendBlockId = ref<number>();
const recommendArticleId = ref<number>();
const recommendTitle = ref<string>();
const recommendDescription = ref<string>();
const recommendVideo = ref<string>();
const recommendImages = ref<string[]>();

const channelTree = ref<any>();
const channelTreeData = ref<any[]>([]);
const channelTreeLoading = ref<boolean>(false);
const channel = ref<any>();

const instanceId = ref<string>();
const taskListVisible = ref<boolean>(false);

const batchActions = ['delete', 'submit', 'archive', 'offline', 'completelyDelete'];
const batchAction = ref<string>(batchActions[0]);

const selectable = (bean: any): boolean => {
  if (batchAction.value === 'delete') {
    // 已删除 不能删除
    return ![20].includes(bean.status);
  }
  if (batchAction.value === 'submit') {
    // 已发布、审核中 不能提交
    return ![0, 12].includes(bean.status);
  }
  if (batchAction.value === 'archive') {
    // 已发布 能归档
    return [0].includes(bean.status);
  }
  if (batchAction.value === 'offline') {
    // 已发布、已归档、待发布、待审核、审核中 能下线
    return [0, 1, 5, 11, 12].includes(bean.status);
  }
  if (batchAction.value === 'completelyDelete') {
    // 所有状态都能彻底删除
    return true;
  }
  return true;
};
const selectionIds = computed(() => {
  return selection.value.filter((item: any) => selectable(item)).map((item: any) => item.id);
});

const handleExecute = async (action: string, ids: number[]) => {
  if (action === 'delete') {
    await deleteArticle(ids);
  } else if (action === 'submit') {
    await submitArticle(ids);
  } else if (action === 'archive') {
    await archiveArticle(ids);
  } else if (action === 'offline') {
    await offlineArticle(ids);
  } else if (action === 'completelyDelete') {
    await completelyDeleteArticle(ids);
  } else {
    throw new Error(`not support action: ${action}`);
  }
  fetchData();
  ElMessage.success(t('success'));
};

const fetchData = async () => {
  tableLoading.value = true;
  try {
    const { content, totalElements } = await queryArticlePage({
      ...toParams(params.value),
      subChannelId: channel.value?.id,
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
  channelTreeLoading.value = true;
  try {
    channelTreeData.value = toTree(await queryChannelList({ isArticlePermission: true }));
  } finally {
    channelTreeLoading.value = false;
  }
};
const fetchBlockList = async () => {
  blockList.value = await queryBlockList();
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
  if (perm('article:update')) {
    return;
  }
  beanId.value = id;
  formVisible.value = true;
};
const recommendTo = (blockId: number, article: any) => {
  recommendVisible.value = true;
  recommendBlockId.value = blockId;
  recommendArticleId.value = article.id;
  recommendTitle.value = article.title;
  recommendDescription.value = article.description;
  recommendVideo.value = article.video;
  const dom = htmlparser2.parseDocument(article.text);
  const imgs = domutils.getElementsByTagName('img', dom);
  const urls = imgs.map((img: any) => domutils.getAttributeValue(img, 'src')).filter((src: string | undefined) => src != null) as string[];
  recommendImages.value = [...(article.imageList?.map((img: any) => img.url) ?? []), ...urls];
  if (article.image) {
    recommendImages.value.push(article.image);
  }
};
const handleBlockItemDelete = async (blockItemId: number) => {
  await deleteBlockItem([blockItemId]);
  fetchData();
  ElMessage.success(t('success'));
};
const handleTask = (id: string) => {
  instanceId.value = id;
  taskListVisible.value = true;
};
const handleSticky = async (id: number, sticky: number) => {
  const { value } = await ElMessageBox.prompt(`${t('article.sticky')} (${t('article.sticky.tooltip')})`, {
    confirmButtonText: t('ok'),
    cancelButtonText: t('cancel'),
    inputValue: String(sticky < 1 ? 1 : sticky),
    inputPattern: /^\d{1,3}$/,
    inputErrorMessage: t('article.error.sticky'),
  });
  await stickyArticle([id], Number(value));
  fetchData();
  ElMessage.success(t('success'));
};
const cancelSticky = async (id: number) => {
  await stickyArticle([id], 0);
  fetchData();
  ElMessage.success(t('success'));
};
</script>
