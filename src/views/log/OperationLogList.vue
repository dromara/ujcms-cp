<script lang="ts">
export default { name: 'OperationLogList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { logModules, logNames } from '@/data';
import { perm } from '@/stores/useCurrentUser';
import { pageSizes, pageLayout, toParams, resetParams } from '@/utils/common';
import { deleteOperationLog, queryOperationLogPage } from '@/api/log';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import OperationLogForm from './OperationLogForm.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const table = ref<any>();
const data = ref<any[]>([]);
const selection = ref<any[]>([]);
const loading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));

const fetchData = async () => {
  loading.value = true;
  try {
    const { content, totalElements } = await queryOperationLogPage({ ...toParams(params.value), Q_OrderBy: sort.value, page: currentPage.value, pageSize: pageSize.value });
    data.value = content;
    total.value = totalElements;
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

const handleEdit = (id: number) => {
  beanId.value = id;
  formVisible.value = true;
};
const handleDelete = async (ids: number[]) => {
  await deleteOperationLog(ids);
  fetchData();
  ElMessage.success(t('success'));
};
</script>

<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('operationLog.module')" name="Q_EQ_module">
          <el-select v-model="params['Q_EQ_module']" class="w-96">
            <el-option v-for="item in logModules" :key="item" :label="$t(`log.${item}`)" :value="item" />
          </el-select>
        </query-item>
        <query-item :label="$t('operationLog.name')" name="Q_EQ_name">
          <el-select v-model="params['Q_EQ_name']" class="w-96">
            <el-option v-for="item in logNames.filter((it) => it.startsWith(params['Q_EQ_module'] ?? ''))" :key="item" :label="$t(`log.${item}`)" :value="item" />
          </el-select>
        </query-item>
        <query-item :label="$t('operationLog.user')" name="Q_Like_user-username"></query-item>
        <query-item :label="$t('operationLog.ip')" name="Q_Like_ip"></query-item>
        <query-item :label="$t('operationLog.created')" name="Q_GE_created_DateTime,Q_LE_created_DateTime" type="datetime"></query-item>
        <query-item
          :label="$t('operationLog.type')"
          name="Q_In_type_Short"
          :options="[1, 2, 3, 0].map((item) => ({ label: $t(`operationLog.type.${item}`), value: item }))"
        ></query-item>
        <query-item
          :label="$t('operationLog.status')"
          name="Q_In_status_Short"
          :options="[1, 0].map((item) => ({ label: $t(`operationLog.status.${item}`), value: item }))"
        ></query-item>
      </query-form>
    </div>
    <div>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('operationLog:delete')" :icon="Delete">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <column-setting name="operationLog" class="ml-2" />
    </div>
    <div class="app-block mt-3">
      <el-table ref="table" v-loading="loading" :data="data" @selection-change="(rows) => (selection = rows)" @row-dblclick="(row) => handleEdit(row.id)" @sort-change="handleSort">
        <column-list name="operationLog">
          <el-table-column type="selection" width="38"></el-table-column>
          <el-table-column property="id" label="ID" width="80" sortable="custom"></el-table-column>
          <el-table-column property="module" :label="$t('operationLog.module')" sortable="custom" show-overflow-tooltip>
            <template #default="{ row }">{{ row.module && $t(`log.${row.module}`) }}</template>
          </el-table-column>
          <el-table-column property="name" :label="$t('operationLog.name')" sortable="custom" show-overflow-tooltip>
            <template #default="{ row }">{{ row.name && $t(`log.${row.name}`) }}</template>
          </el-table-column>
          <el-table-column property="user.username" :label="$t('operationLog.user')" sort-by="user-username" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="ip" :label="$t('operationLog.ip')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="created" :label="$t('operationLog.created')" min-width="120" sortable="custom" show-overflow-tooltip>
            <template #default="{ row }">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column property="type" :label="$t('operationLog.type')" width="80">
            <template #default="{ row }">
              <el-tag size="small">{{ $t(`operationLog.type.${row.type}`) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column property="status" :label="$t('operationLog.status')" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success" size="small">{{ $t(`operationLog.status.${row.status}`) }}</el-tag>
              <el-tag v-else type="danger" size="small">{{ $t(`operationLog.status.${row.status}`) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.action')">
            <template #default="{ row }">
              <el-button type="primary" :disabled="perm('operationLog:show')" size="small" link @click="() => handleEdit(row.id)">{{ $t('view') }}</el-button>
              <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete([row.id])">
                <template #reference>
                  <el-button type="primary" :disabled="perm('operationLog:delete')" size="small" link>{{ $t('delete') }}</el-button>
                </template>
              </el-popconfirm>
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
        class="px-3 py-2 justify-end"
        @size-change="() => fetchData()"
        @current-change="() => fetchData()"
      ></el-pagination>
    </div>
    <operation-log-form v-model="formVisible" :bean-id="beanId" :bean-ids="beanIds" @finished="fetchData" />
  </div>
</template>
