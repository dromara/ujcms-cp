<template>
  <el-container>
    <el-aside width="200px" class="pr-3">
      <el-scrollbar class="bg-white rounded-sm p-2">
        <div v-if="currentUser.globalPermission" class="ml-2">
          <el-checkbox
            v-model="showGlobalData"
            @change="
              fetchOrg();
              fetchData();
            "
            :label="$t('globalData')"
          />
        </div>
        <el-tree
          ref="orgTree"
          v-loading="orgTreeLoading"
          :data="orgTreeData"
          :props="{ label: 'name' }"
          :expand-on-click-node="false"
          :default-expanded-keys="orgTreeData.map((item) => item.id)"
          node-key="id"
          highlight-current
          @node-click="
            (node) => {
              org = node;
              handleSearch();
            }
          "
        ></el-tree>
      </el-scrollbar>
    </el-aside>
    <el-main class="p-0">
      <div class="mb-3">
        <query-form :params="params" @search="handleSearch" @reset="handleReset">
          <query-item :label="$t('user.username')" name="Q_Contains_username"></query-item>
          <query-item :label="$t('user.mobile')" name="Q_Contains_mobile"></query-item>
          <query-item :label="$t('user.email')" name="Q_Contains_email"></query-item>
          <query-item :label="$t('user.rank')" name="Q_GE_rank,Q_LE_rank" type="number"></query-item>
          <query-item :label="$t('user.created')" name="Q_GE_@userExt-created_DateTime,Q_LE_@userExt-created_DateTime" type="datetime"></query-item>
          <query-item :label="$t('user.status')" name="Q_In_status_Int" :options="[0, 1, 2, 3].map((item) => ({ label: $t(`user.status.${item}`), value: item }))"></query-item>
        </query-form>
      </div>
      <div>
        <el-button type="primary" :icon="Plus" @click="handleAdd">{{ $t('add') }}</el-button>
        <el-dropdown :disabled="selection.length <= 0 || perm('user:updateStatus')" class="ml-2">
          <el-button :disabled="selection.length <= 0 || perm('user:updateStatus')">
            {{ $t('user.op.status') }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="n in [0, 1, 2, 3]"
                :key="n"
                @click="
                  handleStatus(
                    selection.map((row) => row.id),
                    n,
                  )
                "
              >
                {{ $t(`user.status.${n}`) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete(selection.map((row) => row.id))">
          <template #reference>
            <el-button :disabled="selection.length <= 0 || perm('user:delete')" :icon="Delete" class="ml-2">{{ $t('delete') }}</el-button>
          </template>
        </el-popconfirm>
        <column-setting name="user" class="ml-2" />
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
          <column-list name="user">
            <el-table-column type="selection" :selectable="deletable" width="50"></el-table-column>
            <el-table-column property="id" label="ID" width="64" sortable="custom"></el-table-column>
            <el-table-column property="username" :label="$t('user.username')" sortable="custom" min-width="100"></el-table-column>
            <el-table-column property="mobile" :label="$t('user.mobile')" sortable="custom" display="none" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column property="email" :label="$t('user.email')" sortable="custom" display="none" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column property="realName" :label="$t('user.realName')" sort-by="@userExt-realName" display="none" sortable="custom" min-width="100" show-overflow-tooltip />
            <el-table-column property="gender" :label="$t('user.gender')" sort-by="@userExt-gender" sortable="custom" display="none">
              <template #default="{ row }">{{ $t(`gender.${row.gender}`) }}</template>
            </el-table-column>
            <el-table-column property="created" :label="$t('user.created')" sort-by="@userExt-created" sortable="custom" display="none" width="170">
              <template #default="{ row }">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm:ss') }}</template>
            </el-table-column>
            <el-table-column property="birthday" :label="$t('user.birthday')" sort-by="@userExt-birthday" sortable="custom" display="none" width="110">
              <template #default="{ row }">{{ dayjs(row.birthday).format('YYYY-MM-DD') }}</template>
            </el-table-column>
            <el-table-column property="loginDate" :label="$t('user.loginDate')" sort-by="@userExt-loginDate" sortable="custom" display="none" width="170">
              <template #default="{ row }">{{ dayjs(row.loginDate).format('YYYY-MM-DD HH:mm:ss') }}</template>
            </el-table-column>
            <el-table-column property="loginIp" :label="$t('user.loginIp')" sort-by="@userExt-loginIp" sortable="custom" display="none" show-overflow-tooltip />
            <el-table-column property="loginCount" :label="$t('user.loginCount')" sort-by="@userExt-loginCount" sortable="custom" display="none" show-overflow-tooltip />
            <el-table-column property="org.name" :label="$t('user.org')" sort-by="org-name" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column property="roles" :label="$t('user.role')" show-overflow-tooltip>
              <template #default="{ row }">
                <el-space>
                  <span v-for="item in row.roleList" :key="item.id">{{ item.name }}</span>
                </el-space>
              </template>
            </el-table-column>
            <el-table-column property="group.name" :label="$t('user.group')" sort-by="group-name" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column property="rank" :label="$t('user.rank')" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column property="status" :label="$t('user.status')" sortable="custom" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag v-if="row.status === 0" type="success" size="small">{{ $t(`user.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 1" type="info" size="small">{{ $t(`user.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 2" type="warning" size="small">{{ $t(`user.status.${row.status}`) }}</el-tag>
                <el-tag v-else-if="row.status === 3" type="danger" size="small">{{ $t(`user.status.${row.status}`) }}</el-tag>
                <el-tag v-else type="danger">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.action')" min-width="120">
              <template #default="{ row }">
                <el-button type="primary" @click="handleEdit(row.id)" :disabled="perm('user:update')" size="small" link>{{ $t('edit') }}</el-button>
                <el-button type="primary" @click="handlePermissionEdit(row.id)" :disabled="perm('user:updatePermission')" size="small" link>
                  {{ $t('permissionSettings') }}
                </el-button>
                <el-popconfirm :title="$t('confirmDelete')" @confirm="handleDelete([row.id])">
                  <template #reference>
                    <el-button type="primary" :disabled="!deletable(row) || perm('user:delete')" size="small" link>{{ $t('delete') }}</el-button>
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
          small
          background
          class="px-3 py-2 justify-end"
        ></el-pagination>
      </div>
      <user-form v-model="formVisible" :beanId="beanId" :beanIds="beanIds" :org="org" :showGlobalData="showGlobalData" @finished="fetchData" />
      <user-permission-form v-model="permissionFormVisible" :beanId="beanId" @finished="fetchData"></user-permission-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
export default { name: 'UserList' };
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, ArrowDown } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { currentUser, perm } from '@/store/useCurrentUser';
import { pageSizes, pageLayout, toParams, resetParams } from '@/utils/common';
import { toTree } from '@/utils/tree';
import { deleteUser, updateUserStatus, queryUserList, queryOrgList } from '@/api/user';
import { ColumnList, ColumnSetting } from '@/components/TableList';
import { QueryForm, QueryItem } from '@/components/QueryForm';
import UserForm from './UserForm.vue';
import UserPermissionForm from './UserPermissionForm.vue';

const { t } = useI18n();
const params = ref<any>({});
const sort = ref<any>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const table = ref<any>();
const data = ref<Array<any>>([]);
const selection = ref<Array<any>>([]);
const loading = ref<boolean>(false);
const formVisible = ref<boolean>(false);
const permissionFormVisible = ref<boolean>(false);
const beanId = ref<number>();
const beanIds = computed(() => data.value.map((row) => row.id));

const showGlobalData = ref<boolean>(false);
const orgTreeLoading = ref<boolean>(false);
const orgTree = ref<any>();
const orgTreeData = ref<any[]>([]);
const org = ref<any>();

const deletable = (bean: any) => bean.id > 1 && currentUser.rank <= bean.rank;

const fetchOrg = async () => {
  orgTreeLoading.value = true;
  try {
    orgTreeData.value = toTree(await queryOrgList({ current: !showGlobalData.value }));
  } finally {
    orgTreeLoading.value = false;
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    const { content, totalElements } = await queryUserList({
      ...toParams(params.value),
      orgId: org.value?.id,
      current: !showGlobalData.value,
      Q_OrderBy: sort.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    data.value = content;
    total.value = totalElements;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  fetchOrg();
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
const handlePermissionEdit = (id: number) => {
  beanId.value = id;
  permissionFormVisible.value = true;
};
const handleDelete = async (ids: number[]) => {
  await deleteUser(ids);
  fetchData();
  ElMessage.success(t('success'));
};
const handleStatus = async (ids: number[], status: number) => {
  await updateUserStatus(ids, status);
  fetchData();
  ElMessage.success(t('success'));
};
</script>
