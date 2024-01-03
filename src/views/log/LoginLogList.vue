<script lang="ts">
export default { name: 'LoginLogList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { perm } from '@/stores/useCurrentUser';
import { pageSizes, pageLayout, toParams, resetParams } from '@/utils/common';
import { deleteLoginLog, queryLoginLogPage } from '@/api/log';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import LoginLogForm from './LoginLogForm.vue';

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
    const { content, totalElements } = await queryLoginLogPage({ ...toParams(params.value), Q_OrderBy: sort.value, page: currentPage.value, pageSize: pageSize.value });
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
  await deleteLoginLog(ids);
  fetchData();
  ElMessage.success(t('success'));
};
</script>

<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('loginLog.loginName')" name="Q_Like_loginName"></query-item>
        <query-item :label="$t('loginLog.user')" name="Q_Like_user-username"></query-item>
        <query-item :label="$t('loginLog.ip')" name="Q_Contains_ip"></query-item>
        <query-item :label="$t('loginLog.type')" name="Q_In_type_Int" :options="[1, 2, 9].map((item) => ({ label: $t(`loginLog.type.${item}`), value: item }))"></query-item>
        <query-item
          :label="$t('loginLog.status')"
          name="Q_In_status_Int"
          :options="[0, 1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17].map((item) => ({ label: $t(`loginLog.status.${item}`), value: item }))"
        ></query-item>
      </query-form>
    </div>
    <div>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('loginLog:delete')" :icon="Delete">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <column-setting name="loginLog" class="ml-2" />
    </div>
    <div class="app-block mt-3">
      <el-table ref="table" v-loading="loading" :data="data" @selection-change="(rows) => (selection = rows)" @row-dblclick="(row) => handleEdit(row.id)" @sort-change="handleSort">
        <column-list name="loginLog">
          <el-table-column type="selection" width="38"></el-table-column>
          <el-table-column property="id" label="ID" width="80" sortable="custom"></el-table-column>
          <el-table-column property="ip" :label="$t('loginLog.ip')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="created" :label="$t('loginLog.created')" sortable="custom" width="170">
            <template #default="{ row }">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column property="user.username" :label="$t('loginLog.user')" sort-by="user-username" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="loginName" :label="$t('loginLog.loginName')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="type" :label="$t('loginLog.type')" sortable="custom" width="100">
            <template #default="{ row }">
              <el-tag v-if="[1, 2].includes(row.type)" size="small">{{ $t(`loginLog.type.${row.type}`) }}</el-tag>
              <el-tag v-else-if="row.type != null" type="info" size="small">{{ $t(`loginLog.type.${row.type}`) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column property="status" :label="$t('loginLog.status')" sortable="custom" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === 0" type="success" size="small">{{ $t(`loginLog.status.${row.status}`) }}</el-tag>
              <el-tag v-else-if="[1, 2].includes(row.status)" type="danger" size="small">{{ $t(`loginLog.status.${row.status}`) }}</el-tag>
              <el-tag v-else-if="[3, 4].includes(row.status)" type="warning" size="small">{{ $t(`loginLog.status.${row.status}`) }}</el-tag>
              <el-tag v-else-if="row.status != null" type="info" size="small">{{ $t(`loginLog.status.${row.status}`) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.action')">
            <template #default="{ row }">
              <el-button type="primary" :disabled="perm('loginLog:show')" size="small" link @click="() => handleEdit(row.id)">{{ $t('view') }}</el-button>
              <el-popconfirm :title="$t('confirmDelete')" @confirm="() => handleDelete([row.id])">
                <template #reference>
                  <el-button type="primary" :disabled="perm('loginLog:delete')" size="small" link>{{ $t('delete') }}</el-button>
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
    <login-log-form v-model="formVisible" :bean-id="beanId" :bean-ids="beanIds" @finished="fetchData" />
  </div>
</template>
