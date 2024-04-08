<script lang="ts">
export default { name: 'ArticleList' };
</script>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Cpu, MoreFilled, DocumentCopy, Grid } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Sortable from 'sortablejs';
import dayjs from 'dayjs';
import * as htmlparser2 from 'htmlparser2';
import * as domutils from 'domutils';
import { perm, currentUser } from '@/stores/useCurrentUser';
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
  updateArticleOrder,
  queryArticlePage,
  queryChannelList,
  deleteBlockItem,
} from '@/api/content';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import LabelTip from '@/components/LabelTip.vue';
import ProcessTaskList from '@/views/system/ProcessTaskList.vue';
import ArticleForm from './ArticleForm.vue';
import ArticlePushForm from './ArticlePushForm.vue';
import BlockItemForm from './BlockItemForm.vue';
import { openArticleLink } from './components/articleUtils';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const table = ref<any>();
const data = ref<any[]>([]);
const selection = ref<any[]>([]);
const tableLoading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));
const isSorted = ref<boolean>(false);
const action = ref<'add' | 'edit' | 'copy'>('edit');
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

const batchActions = ['completelyDelete', 'delete', 'submit', 'archive', 'offline'];
const batchAction = ref<string>(batchActions[0]);

const pushFormVisible = ref<boolean>(false);
const pushType = ref<'internal' | 'external'>('internal');

const route = useRoute();
const status = ref<number>(Number(route.query.status ?? '-1'));

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
      Q_EQ_status: status.value !== -1 ? status.value : undefined,
      subChannelId: channel.value?.id,
      Q_OrderBy: sort.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    isSorted.value = sort.value !== undefined;
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
let sortable;
const initDragTable = () => {
  const tbody = document.querySelector('#dataTable .el-table__body-wrapper tbody');
  sortable = Sortable.create(tbody, {
    handle: '.drag-handle',
    onEnd: async function (event: any) {
      const { oldIndex, newIndex } = event;
      if (oldIndex !== newIndex) {
        await updateArticleOrder(data.value[oldIndex].id, data.value[newIndex].id);
        data.value.splice(newIndex, 0, data.value.splice(oldIndex, 1)[0]);
        ElMessage.success(t('success'));
      }
    },
  });
};
onMounted(() => {
  fetchData();
  fetchChannel();
  fetchBlockList();
  initDragTable();
});
onBeforeUnmount(() => {
  if (sortable !== undefined) {
    sortable.destroy();
  }
});

const handleSort = ({ column, prop, order }: { column: any; prop: string; order: string }) => {
  if (prop && order) {
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
  action.value = 'add';
  beanId.value = undefined;
  formVisible.value = true;
};
const handleCopy = (id: number) => {
  action.value = 'copy';
  beanId.value = id;
  formVisible.value = true;
};
const handleEdit = (id: number) => {
  if (perm('article:update')) {
    return;
  }
  action.value = 'edit';
  beanId.value = id;
  formVisible.value = true;
};

const handleInternalPush = (id: number) => {
  beanId.value = id;
  pushType.value = 'internal';
  pushFormVisible.value = true;
};
const handleExternalPush = (id: number) => {
  beanId.value = id;
  pushType.value = 'external';
  pushFormVisible.value = true;
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
const stickyVisible = ref<boolean>(false);
const stickyForm = ref<any>();
const stickyValues = ref<any>({ id: 0, sticky: 0, stickyDate: null });

const handleSticky = (id: number, sticky: number, stickyDate: Date) => {
  stickyVisible.value = true;
  stickyValues.value = { id, sticky: sticky < 1 ? 1 : sticky, stickyDate };
};
const submitSticky = async () => {
  stickyForm.value.validate(async (valid: boolean) => {
    if (!valid) return;
    await stickyArticle([stickyValues.value.id], stickyValues.value.sticky, stickyValues.value.stickyDate);
    fetchData();
    stickyVisible.value = false;
    ElMessage.success(t('success'));
  });
};
const cancelSticky = async (id: number) => {
  await stickyArticle([id], 0, undefined);
  fetchData();
  ElMessage.success(t('success'));
};
</script>

<template>
  <el-container>
    <el-aside width="220px" class="pr-3">
      <el-scrollbar class="p-2 bg-white rounded-sm">
        <div class="mb-1 ml-2">
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
            :label="$t('article.block')"
            name="Q_In_@BlockItem-blockId_Int"
            :options="blockList.filter((item) => item.recommendable).map((item) => ({ label: item.name, value: item.id }))"
          ></query-item>
          <query-item :label="$t('article.org')" name="Q_Like_org-name"></query-item>
          <query-item :label="$t('article.user')" name="Q_Like_user-username"></query-item>
          <query-item :label="$t('article.created')" name="Q_GE_created_DateTime,Q_LE_created_DateTime" type="datetime"></query-item>
          <query-item :label="$t('article.modifiedUser')" name="Q_Like_modifiedUser@user-username"></query-item>
          <query-item :label="$t('article.modified')" name="Q_GE_modified_DateTime,Q_LE_modified_DateTime" type="datetime"></query-item>
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
        <el-button type="primary" :disabled="perm('article:create')" :icon="Plus" @click="() => handleAdd()">{{ $t('add') }}</el-button>
        <el-select v-model="batchAction" class="ml-2">
          <template #prefix>{{ $t('batchAction') + ':' }}</template>
          <el-option v-for="item in batchActions" :key="item" :disabled="perm(`article:${item}`)" :value="item" :label="$t(`article.op.${item}`)" />
        </el-select>
        <el-popconfirm :title="$t('confirmExecute')" @confirm="() => handleExecute(batchAction, selectionIds)">
          <template #reference>
            <el-button :disabled="selectionIds.length <= 0 || perm(`article:${batchAction}`)" :icon="Cpu">{{ $t('execute') }}</el-button>
          </template>
        </el-popconfirm>
        <column-setting name="article" class="ml-2" />
      </div>
      <el-radio-group v-model="status" class="mt-3" @change="() => fetchData()">
        <el-radio-button :label="-1">{{ $t('all') }}</el-radio-button>
        <el-radio-button :label="0">{{ $t('article.status.0') }}</el-radio-button>
        <el-radio-button :label="1">{{ $t('article.status.1') }}</el-radio-button>
        <el-radio-button :label="5">{{ $t('article.status.5') }}</el-radio-button>
        <el-radio-button :label="10">{{ $t('article.status.10') }}</el-radio-button>
        <el-radio-button :label="11">{{ $t('article.status.11') }}</el-radio-button>
        <el-radio-button :label="12">{{ $t('article.status.12') }}</el-radio-button>
        <el-radio-button :label="20">{{ $t('article.status.20') }}</el-radio-button>
        <el-radio-button :label="21">{{ $t('article.status.21') }}</el-radio-button>
        <el-radio-button :label="22">{{ $t('article.status.22') }}</el-radio-button>
      </el-radio-group>
      <div class="app-block">
        <el-table
          id="dataTable"
          ref="table"
          v-loading="tableLoading"
          row-key="id"
          :data="data"
          @selection-change="(rows: any) => (selection = rows)"
          @row-dblclick="(row: any) => handleEdit(row.id)"
          @sort-change="handleSort"
        >
          <column-list name="article">
            <el-table-column type="selection" :selectable="selectable" width="38"></el-table-column>
            <el-table-column width="42">
              <el-icon
                class="text-lg align-middle text-gray-secondary"
                :class="isSorted || perm('article:updateOrder') ? ['cursor-not-allowed', 'text-gray-disabled'] : ['cursor-move', 'text-gray-regular', 'drag-handle']"
                disalbed
              >
                <Grid />
              </el-icon>
            </el-table-column>
            <el-table-column property="id" label="ID" width="80" sortable="custom"></el-table-column>
            <el-table-column property="title" :label="$t('article.title')" min-width="280" sort-by="@articleExt-title" sortable="custom">
              <template #default="{ row }">
                <!-- <el-button type="primary" link @click="() => openArticleLink(row.status, row.url, row.dynamicUrl)">{{ row.title }}</el-button> -->
                <el-link href="javascript:" :underline="false" @click="() => openArticleLink(row.status, row.url, row.dynamicUrl)">{{ row.title }}</el-link>
                <el-tag
                  v-for="item in row.blockItemList"
                  :key="item.id"
                  :type="item.enabled ? undefined : 'info'"
                  size="small"
                  class="ml-1"
                  closable
                  @close="() => handleBlockItemDelete(item.id)"
                >
                  {{ item.block.name }}
                </el-tag>
                <el-tooltip v-if="row.sticky > 0" placement="top">
                  <template #content>
                    {{ $t('article.sticky') }}
                    <span v-if="row.stickyDate != null">{{ dayjs(row.stickyDate).format(' YYYY-MM-DD HH:mm:ss') }}</span>
                  </template>
                  <el-tag type="danger" class="mx-1" effect="light" size="small" round :closable="!perm('article:sticky')" @close="() => cancelSticky(row.id)">
                    {{ row.sticky }}
                  </el-tag>
                </el-tooltip>
                <el-tooltip v-if="row.srcId != null" placement="top">
                  <template #content>
                    {{ t(`article.type.${row.type}`) }}:
                    <span v-if="row.siteId !== row.src.siteId">[{{ row.src.site.name }}]</span>
                    {{ row.src.channel.paths.map((it: any) => it.name).join(' / ') }}
                  </template>
                  <el-icon class="ml-1 align-middle"><DocumentCopy /></el-icon>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column property="channel.name" :label="$t('article.channel')" sort-by="channel-name" sortable="custom" show-overflow-tooltip>
              <template #default="{ row }">
                <span :title="row.channel.paths.map((it: any) => it.name).join(' / ')">{{ row.channel.name }}</span>
              </template>
            </el-table-column>
            <el-table-column property="org.name" :label="$t('article.org')" sort-by="org-name" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="author" :label="$t('article.author')" sort-by="@articleExt-author" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="editor" :label="$t('article.editor')" sort-by="@articleExt-editor" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="source" :label="$t('article.source')" sort-by="@articleExt-source" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="user.username" :label="$t('article.user')" sort-by="user-username" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column property="created" :label="$t('article.created')" min-width="120" sortable="custom" display="none" show-overflow-tooltip>
              <template #default="{ row }">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm') }}</template>
            </el-table-column>
            <el-table-column
              property="modifiedUser.username"
              :label="$t('article.modifiedUser')"
              sort-by="modifiedUser@user-username"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column property="modified" :label="$t('article.modified')" min-width="120" sortable="custom" display="none" show-overflow-tooltip>
              <template #default="{ row }">{{ dayjs(row.modified).format('YYYY-MM-DD HH:mm') }}</template>
            </el-table-column>
            <el-table-column property="publishDate" :label="$t('article.publishDate')" min-width="120" sortable="custom" show-overflow-tooltip>
              <template #default="{ row }">{{ dayjs(row.publishDate).format('YYYY-MM-DD HH:mm') }}</template>
            </el-table-column>
            <el-table-column property="views" :label="$t('article.views')" sort-by="@articleExt-views" sortable="custom" display="none" show-overflow-tooltip></el-table-column>
            <el-table-column
              property="dayViews"
              :label="$t('article.dayViews')"
              sort-by="@articleExt-dayViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="weekViews"
              :label="$t('article.weekViews')"
              sort-by="@articleExt-weekViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="monthViews"
              :label="$t('article.monthViews')"
              sort-by="@articleExt-monthViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="quarterViews"
              :label="$t('article.quarterViews')"
              sort-by="@articleExt-quarterViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="yearViews"
              :label="$t('article.yearViews')"
              sort-by="@articleExt-yearViews"
              sortable="custom"
              display="none"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column property="status" :label="$t('article.status')" sortable="custom" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag v-if="row.status === 0" type="success" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 1" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 20" type="warning" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 21" type="warning" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                <el-tooltip v-else-if="row.status === 22" :content="row.rejectReason" placement="top">
                  <el-tag type="danger" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
                </el-tooltip>
                <el-tag v-else type="info" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.action')" width="260">
              <template #default="{ row }">
                <el-button type="primary" :disabled="perm('article:update')" size="small" link @click="() => handleEdit(row.id)">{{ $t('edit') }}</el-button>
                <el-button
                  v-if="currentUser.epRank > 0 || currentUser.epDisplay"
                  type="primary"
                  :disabled="!row.processInstanceId || perm('processInstance:task') || currentUser.epRank < 1"
                  size="small"
                  link
                  @click="() => handleTask(row.processInstanceId)"
                >
                  {{ $t('processInstance.op.task') }}
                </el-button>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleExecute('delete', [row.id])">
                  <template #reference>
                    <el-button type="primary" :disabled="perm('article:delete') || [20].includes(row.status)" size="small" link>{{ $t('delete') }}</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm :title="$t('confirmCompletelyDelete')" @confirm="() => handleExecute('completelyDelete', [row.id])">
                  <template #reference>
                    <el-button type="primary" :disabled="perm('article:completelyDelete')" size="small" link>{{ $t('completelyDelete') }}</el-button>
                  </template>
                </el-popconfirm>
                <el-dropdown class="ml-2 align-middle">
                  <el-button type="primary" size="small" link>
                    <el-icon class="text-primary"><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <div>
                      <el-dropdown-menu>
                        <!-- <el-dropdown-item :disabled="perm('article:completelyDelete')" @click="handleExecute('completelyDelete', [row.id])">
                          <span class="text-xs">{{ $t('completelyDelete') }}</span>
                        </el-dropdown-item> -->
                        <el-dropdown-item :disabled="perm('article:submit') || [0, 12].includes(row.status)" @click="() => handleExecute('submit', [row.id])">
                          <span class="text-xs">{{ $t('article.op.submit') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="perm('article:archive') || ![0].includes(row.status)" @click="() => handleExecute('archive', [row.id])">
                          <span class="text-xs">{{ $t('article.op.archive') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="perm('article:offline') || ![0, 1, 5, 11, 12].includes(row.status)" @click="() => handleExecute('offline', [row.id])">
                          <span class="text-xs">{{ $t('article.op.offline') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="perm('article:create')" divided @click="() => handleCopy(row.id)">
                          <span class="text-xs">{{ $t('copy') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="currentUser.epRank >= 2 || currentUser.epDisplay"
                          :disabled="perm('article:internalPush') || row.status !== 0 || row.srcId != null || currentUser.epRank < 2"
                          :title="currentUser.epRank < 2 ? $t('error.enterprise.short') : undefined"
                          @click="() => handleInternalPush(row.id)"
                        >
                          <span class="text-xs">{{ $t('article.op.internalPush') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="currentUser.epRank >= 3 || currentUser.epDisplay"
                          :disabled="perm('article:externalPush') || row.status !== 0 || row.srcId != null || currentUser.epRank < 3"
                          :title="currentUser.epRank < 3 ? $t('error.enterprise.short') : undefined"
                          @click="() => handleExternalPush(row.id)"
                        >
                          <span class="text-xs">{{ $t('article.op.externalPush') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="perm('article:sticky')" divided @click="() => handleSticky(row.id, row.sticky, row.stickyDate)">
                          <span class="text-xs">{{ $t('article.op.sticky') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-for="(item, index) in blockList.filter((it) => it.enabled && it.recommendable)"
                          :key="item.id"
                          :disabled="row.blocks.findIndex((block: any) => block.id === item.id) >= 0"
                          :divided="index === 0"
                          @click="() => recommendTo(item.id, row)"
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
          v-model:current-page="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          :page-sizes="pageSizes"
          :layout="pageLayout"
          small
          background
          class="justify-end px-3 py-2"
          @size-change="() => fetchData()"
          @current-change="() => fetchData()"
        ></el-pagination>
      </div>

      <article-form v-model="formVisible" :action="action" :bean-id="beanId" :bean-ids="beanIds" :channel="channel" @finished="fetchData" />
      <article-push-form v-model="pushFormVisible" :bean-id="beanId" :type="pushType" @finished="fetchData" />
      <block-item-form
        v-model="recommendVisible"
        :bean-id="undefined"
        :bean-ids="[]"
        :block-id="recommendBlockId"
        :article-id="recommendArticleId"
        :title="recommendTitle"
        :description="recommendDescription"
        :video="recommendVideo"
        :images="recommendImages"
        @finished="fetchData"
      />
      <process-task-list v-model="taskListVisible" :instance-id="instanceId" />
      <el-dialog v-model="stickyVisible" :title="$t('article.sticky')" :width="768">
        <el-form ref="stickyForm" :model="stickyValues" label-width="150px">
          <el-form-item prop="sticky">
            <template #label><label-tip message="article.sticky" help /></template>
            <el-input-number v-model="stickyValues.sticky" :min="0" :max="999" />
          </el-form-item>
          <el-form-item
            prop="stickyDate"
            :rules="{
              validator: (rule, value, callback) => {
                if (value != null && Date.now() > value.getTime()) {
                  callback($t('article.error.stickyDate.beforeCurrent'));
                  return;
                }
                callback();
              },
            }"
          >
            <template #label><label-tip message="article.stickyDate" help /></template>
            <el-date-picker v-model="stickyValues.stickyDate" type="datetime" />
          </el-form-item>
          <el-button type="primary" @click="() => submitSticky()">{{ $t('submit') }}</el-button>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>
