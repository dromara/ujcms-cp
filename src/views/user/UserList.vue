<template>
  <div>
    <div class="mb-3">
      <query-form :params="params" @search="handleSearch" @reset="handleReset">
        <query-item :label="$t('user.username')" name="Q_Contains_username"></query-item>
        <query-item :label="$t('user.mobile')" name="Q_Contains_mobile"></query-item>
        <query-item :label="$t('user.email')" name="Q_Contains_email"></query-item>
        <query-item :label="$t('user.rank')" name="Q_GE_rank,Q_LE_rank" type="number"></query-item>
        <query-item :label="$t('user.created')" name="Q_GE_@userExt-created_DateTime,Q_LE_@userExt-created_DateTime" type="datetime"></query-item>
        <query-item :label="$t('user.status')" name="Q_In_status_Int" :options="[0, 1].map((item) => ({ label: $t(`user.status.${item}`), value: item }))"></query-item>
      </query-form>
    </div>
    <div>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">{{ $t('add') }}</el-button>
      <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
        <template #reference>
          <el-button :disabled="selection.length <= 0 || perm('user:delete')" icon="el-icon-delete" size="small">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <column-setting name="user" class="ml-2" />
    </div>
    <div class="app-block mt-3">
      <el-table ref="table" v-loading="loading" :data="data" @selection-change="(rows) => (selection = rows)" @row-dblclick="(row) => handleEdit(row.id)" @sort-change="handleSort">
        <column-list name="user">
          <el-table-column type="selection" :selectable="deletable" width="50"></el-table-column>
          <el-table-column property="id" label="ID" width="60" sortable="custom"></el-table-column>
          <el-table-column property="username" :label="$t('user.username')" sortable="custom" min-width="100"></el-table-column>
          <el-table-column property="mobile" :label="$t('user.mobile')" sortable="custom" display="none" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column property="email" :label="$t('user.email')" sortable="custom" display="none" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column property="realName" :label="$t('user.realName')" sort-by="@userExt-realName" sortable="custom" min-width="100" show-overflow-tooltip />
          <el-table-column property="gender" :label="$t('user.gender')" sort-by="@userExt-gender" sortable="custom" display="none">
            <template #default="{row}">{{ $t(`gender.${row.gender}`) }}</template>
          </el-table-column>
          <el-table-column property="created" :label="$t('user.created')" sort-by="@userExt-created" sortable="custom" display="none" width="160">
            <template #default="{row}">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column property="birthday" :label="$t('user.birthday')" sort-by="@userExt-birthday" sortable="custom" display="none" width="110">
            <template #default="{row}">{{ dayjs(row.birthday).format('YYYY-MM-DD') }}</template>
          </el-table-column>
          <el-table-column property="loginDate" :label="$t('user.loginDate')" sort-by="@userExt-loginDate" sortable="custom" display="none" width="160">
            <template #default="{row}">{{ dayjs(row.loginDate).format('YYYY-MM-DD HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column property="loginIp" :label="$t('user.loginIp')" sort-by="@userExt-loginIp" sortable="custom" display="none" show-overflow-tooltip />
          <el-table-column property="loginCount" :label="$t('user.loginCount')" sort-by="@userExt-loginCount" sortable="custom" display="none" show-overflow-tooltip />
          <el-table-column property="org.name" :label="$t('user.org')" sort-by="org-name" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="roles" :label="$t('user.role')" show-overflow-tooltip>
            <template #default="{row}">
              <el-space>
                <span v-for="item in row.roleList" :key="item.id">{{ item.name }}</span>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column property="group.name" :label="$t('user.group')" sort-by="group-name" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="rank" :label="$t('user.rank')" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column property="status" :label="$t('user.status')" sortable="custom" show-overflow-tooltip>
            <template #default="{row}">
              <el-tag v-if="row.status === 0" type="success" size="mini">{{ $t(`user.status.${row.status}`) }}</el-tag>
              <el-tag v-if="row.status === 1" type="danger" size="mini">{{ $t(`user.status.${row.status}`) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.action')">
            <template #default="{row}">
              <el-button type="text" size="small" @click="handleEdit(row.id)" :disabled="perm('user:show')">{{ $t('edit') }}</el-button>
              <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                <template #reference>
                  <el-button type="text" :disabled="!deletable(row) || perm('user:delete')" size="small">{{ $t('delete') }}</el-button>
                </template>
              </el-popconfirm>
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
        background
        class="px-3 py-2 text-right"
      ></el-pagination>
    </div>
    <user-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" @finished="fetchData" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { perm } from '@/store/useCurrentUser';
import { pageSizes, pageLayout, toParams, resetParams } from '@/utils/common';
import { deleteUser, queryUserPage } from '@/api/user';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import UserForm from './UserForm.vue';

export default defineComponent({
  components: { UserForm, ColumnList, ColumnSetting, QueryForm, QueryItem },
  setup() {
    const { t } = useI18n();
    const params = ref<any>({});
    const sort = ref<any>(undefined);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(10);
    const total = ref<number>(0);
    const table = ref<any>(null);
    const data = ref<Array<any>>([]);
    const selection = ref<Array<any>>([]);
    const loading = ref<boolean>(false);
    const formVisible = ref<boolean>(false);
    const beanId = ref<number | null>(null);
    const beanIds = computed(() => data.value.map((row) => row.id));
    const fetchData = async () => {
      loading.value = true;
      try {
        const { content, totalElements } = await queryUserPage({ ...toParams(params.value), Q_OrderBy: sort.value, page: currentPage.value, pageSize: pageSize.value });
        data.value = content;
        total.value = totalElements;
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

    const handleAdd = () => {
      beanId.value = null;
      formVisible.value = true;
    };
    const handleEdit = (id: number) => {
      beanId.value = id;
      formVisible.value = true;
    };
    const handleDelete = async (ids: number[]) => {
      await deleteUser(ids);
      fetchData();
      ElMessage.success(t('success'));
    };
    const deletable = (bean: any) => bean.id > 1;
    return {
      params,
      pageSizes,
      pageLayout,
      currentPage,
      pageSize,
      total,
      table,
      data,
      selection,
      loading,
      formVisible,
      beanId,
      beanIds,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSearch,
      handleSort,
      handleReset,
      fetchData,
      deletable,
      dayjs,
      perm,
    };
  },
});
</script>
