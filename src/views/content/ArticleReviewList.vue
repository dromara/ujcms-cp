<template>
  <div>
    <div>
      <el-popconfirm :title="$t('confirmPass')" @confirm="handlePass(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('articleReview:pass')" :icon="CircleCheck" type="primary">{{ $t('pass') }}</el-button>
        </template>
      </el-popconfirm>
      <el-button :disabled="selection.length <= 0 || perm('articleReview:reject')" @click="handleReject(selection.map((row) => row.id))" :icon="CircleClose">{{
        $t('reject')
      }}</el-button>
      <column-setting name="article" class="ml-2" />
    </div>
    <div class="app-block mt-3">
      <el-table ref="table" v-loading="tableLoading" :data="data" @selection-change="(rows) => (selection = rows)" @row-dblclick="(row) => handleEdit(row.id)">
        <column-list name="article">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column property="id" label="ID" width="64"></el-table-column>
          <el-table-column property="title" :label="$t('article.title')" min-width="280">
            <template #default="{ row }">
              <el-link :href="row.url" :underline="false" target="_blank">{{ row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column property="channel.name" :label="$t('article.channel')" show-overflow-tooltip></el-table-column>
          <el-table-column property="org.name" :label="$t('article.org')" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="author" :label="$t('article.author')" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="editor" :label="$t('article.editor')" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="source" :label="$t('article.source')" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="user.username" :label="$t('article.user')" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="created" :label="$t('article.created')" min-width="120" display="none" show-overflow-tooltip>
            <template #default="{ row }">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm') }}</template>
          </el-table-column>
          <el-table-column property="modifiedUser.username" :label="$t('article.modifiedUser')" display="none" show-overflow-tooltip></el-table-column>
          <el-table-column property="modified" :label="$t('article.modified')" min-width="120" display="none" show-overflow-tooltip>
            <template #default="{ row }">{{ dayjs(row.modified).format('YYYY-MM-DD HH:mm') }}</template>
          </el-table-column>
          <el-table-column property="publishDate" :label="$t('article.publishDate')" min-width="120" show-overflow-tooltip>
            <template #default="{ row }">{{ dayjs(row.publishDate).format('YYYY-MM-DD HH:mm') }}</template>
          </el-table-column>
          <el-table-column property="status" :label="$t('article.status')" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="success" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
              <el-tag v-else-if="row.status === 1" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
              <el-tag v-else-if="row.status === 20" type="danger" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
              <el-tag v-else-if="[21, 22].includes(row.status)" type="warning" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
              <el-tag v-else type="info" size="small">{{ $t(`article.status.${row.status}`) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.action')" min-width="180">
            <template #default="{ row }">
              <el-button type="primary" :disabled="perm('article:update')" @click="handleEdit(row.id)" size="small" link>{{ $t('edit') }}</el-button>
              <el-button type="primary" :disabled="!row.processInstanceId || perm('processInstance:task')" @click="handleTask(row.processInstanceId)" size="small" link>{{
                $t('processInstance.op.task')
              }}</el-button>
              <el-popconfirm :title="$t('confirmPass')" @confirm="handlePass([row.id])">
                <template #reference>
                  <el-button type="primary" :disabled="perm('articleReview:pass')" size="small" link>{{ $t('pass') }}</el-button>
                </template>
              </el-popconfirm>
              <el-button type="primary" :disabled="perm('articleReview:reject')" @click="handleReject([row.id])" size="small" link>{{ $t('reject') }}</el-button>
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
    <article-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" :is-review="true" @finished="fetchData" />
    <process-task-list :instanceId="instanceId" v-model="taskListVisible" />
  </div>
</template>

<script lang="ts">
export default { name: 'ArticleReviewList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { perm } from '@/store/useCurrentUser';
import { pageSizes, pageLayout } from '@/utils/common';
import { passArticle, rejectArticle, queryArticleReviewPage } from '@/api/content';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import ArticleForm from './ArticleForm.vue';
import ProcessTaskList from '@/views/system/ProcessTaskList.vue';

const { t } = useI18n();
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

const instanceId = ref<string>();
const taskListVisible = ref<boolean>(false);

const fetchData = async () => {
  tableLoading.value = true;
  try {
    const { content, totalElements } = await queryArticleReviewPage({
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    data.value = content;
    total.value = totalElements;
  } finally {
    tableLoading.value = false;
  }
};
onMounted(() => {
  fetchData();
});

const handleEdit = (id: number) => {
  if (perm('article:update')) {
    return;
  }
  beanId.value = id;
  formVisible.value = true;
};
const handlePass = async (ids: number[]) => {
  await passArticle(ids);
  fetchData();
  ElMessage.success(t('success'));
};
const handleReject = async (ids: number[]) => {
  ElMessageBox.prompt(t('article.rejectReason'), t('reject'), {
    confirmButtonText: t('submit'),
    cancelButtonText: t('cancel'),
    inputPattern: /\S+/,
    inputErrorMessage: t('v.required'),
  }).then(async ({ value }) => {
    await rejectArticle(ids, value);
    fetchData();
    ElMessage.success(t('success'));
  });
};
const handleTask = (id: string) => {
  instanceId.value = id;
  taskListVisible.value = true;
};
</script>
