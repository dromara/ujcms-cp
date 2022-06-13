<template>
  <el-drawer :title="$t('permissionSettings')" :with-header="false" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :size="576">
    <template #default>
      <el-form ref="form" :model="values" :disabled="disabled" label-width="150px">
        <el-tabs v-model="tabName">
          <el-tab-pane :label="$t('role.permission')" name="permission">
            <div>
              <el-checkbox v-model="permissionExpand" @change="(checked) => expandTree(checked, permissionTree, permsData)" :disabled="false" :label="$t('expand/collapse')" />
              <el-checkbox
                v-model="permissionCheck"
                @change="
                  (checked) => {
                    checkTree(checked, permissionTree, permsData);
                    handlePermission();
                  }
                "
                :label="$t('checkAll/uncheckAll')"
              />
            </div>
            <el-tree ref="permissionTree" :data="permsData" node-key="key" @check="handlePermission()" class="border rounded" default-expand-all show-checkbox />
          </el-tab-pane>
          <el-tab-pane :label="$t('role.grantPermission')" name="grantPermission">
            <el-alert :title="$t('role.grantPermission.tooltip')" type="info" :closable="false" show-icon />
            <div>
              <el-checkbox v-model="grantPermissionExpand" @change="(checked) => expandTree(checked, grantPermissionTree, permsData)" :label="$t('expand/collapse')" />
              <el-checkbox
                v-model="grantPermissionCheck"
                @change="
                  (checked) => {
                    checkTree(checked, grantPermissionTree, permsData);
                    handleGrantPermission();
                  }
                "
                :label="$t('checkAll/uncheckAll')"
              />
            </div>
            <el-tree ref="grantPermissionTree" :data="permsData" node-key="key" @check="handleGrantPermission()" class="border rounded" default-expand-all show-checkbox />
          </el-tab-pane>
          <el-tab-pane :label="$t('role.dataPermission')" name="dataPermission">
            <el-form-item prop="globalPermission" :rules="{ required: true, message: () => $t('v.required') }">
              <template #label><label-tip message="role.globalPermission" help /></template>
              <el-switch v-model="values.globalPermission" :disabled="!currentUser.globalPermission"></el-switch>
            </el-form-item>
            <el-form-item prop="dataScope" :rules="[{ required: true, message: () => $t('v.required') }]">
              <template #label><label-tip message="role.dataScope" help /></template>
              <el-select v-model="values.dataScope">
                <el-option v-for="item in [1, 2, 3]" :key="item" :label="$t(`role.dataScope.${item}`)" :value="item" />
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('role.articlePermission')" name="articlePermission">
            <el-form-item prop="allArticlePermission" :rules="{ required: true, message: () => $t('v.required') }">
              <template #label><label-tip message="role.allArticlePermission" help /></template>
              <el-switch v-model="values.allArticlePermission"></el-switch>
            </el-form-item>
            <template v-if="!values.allArticlePermission">
              <div class="border-t">
                <el-checkbox
                  v-model="articlePermissionExpand"
                  @change="(checked) => expandTree(checked, articlePermissionTree, channelData, 'id')"
                  :label="$t('expand/collapse')"
                />
                <el-checkbox
                  v-model="articlePermissionCheck"
                  @change="
                    (checked) => {
                      checkTree(checked, articlePermissionTree, channelData, 'id');
                      handleArticlePermission();
                    }
                  "
                  :label="$t('checkAll/uncheckAll')"
                />
              </div>
              <el-tree
                ref="articlePermissionTree"
                :data="channelData"
                node-key="id"
                @check="handleArticlePermission()"
                :props="{ label: 'name' }"
                class="border rounded"
                default-expand-all
                show-checkbox
              />
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </template>
    <template #footer>
      <div class="flex justify-between items-center">
        <div>
          <el-tag>{{ values?.name }}</el-tag>
        </div>
        <div>
          <el-button @click="$emit('update:modelValue', false)">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit()" :loading="buttonLoading" :disabled="disabled">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts">
export default { name: 'RolePermissionForm' };
</script>

<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getPermsTreeData } from '@/data';
import { toTree, disablePermissionTree } from '@/utils/tree';
import { currentUser } from '@/store/useCurrentUser';
import { queryRole, updateRolePermission, roleArticlePermissions } from '@/api/user';
import { queryChannelList } from '@/api/content';
import LabelTip from '@/components/LabelTip.vue';

const props = defineProps({ modelValue: { type: Boolean, required: true }, beanId: { type: Number } });
const emit = defineEmits({ 'update:modelValue': null, finished: null });

const { beanId, modelValue: visible } = toRefs(props);
const { t } = useI18n();
const tabName = ref<string>('permission');
const form = ref<any>();
const bean = ref<any>({});
const values = ref<any>({});
const buttonLoading = ref<boolean>(false);

const permissionExpand = ref<boolean>(true);
const permissionCheck = ref<boolean>(false);
const permissionTree = ref<any>();
const grantPermissionExpand = ref<boolean>(true);
const grantPermissionCheck = ref<boolean>(false);
const grantPermissionTree = ref<any>();
const articlePermissionExpand = ref<boolean>(true);
const articlePermissionCheck = ref<boolean>(false);
const articlePermissionTree = ref<any>();
const permsData: any[] = getPermsTreeData();
disablePermissionTree(permsData, currentUser.grantPermissions ?? []);
const channelData = ref<any[]>([]);
const disabled = computed(() => (bean.value.global && !currentUser.globalPermission) || currentUser.rank > bean.value.rank);
const fetchRole = async () => {
  if (beanId?.value != null) {
    bean.value = await queryRole(beanId.value);
    values.value = { ...bean.value };
    permissionTree.value?.setCheckedKeys(bean.value.permission?.split(',') ?? []);
    grantPermissionTree.value?.setCheckedKeys(bean.value.grantPermission?.split(',') ?? []);
  }
};
const fetchArticlePermissions = async () => {
  if (beanId?.value != null) {
    const articlePermissions = await roleArticlePermissions(beanId.value);
    articlePermissions.forEach((key: number) => {
      articlePermissionTree.value?.setChecked(key, true, false);
    });
  }
};
const fetchChannelData = async () => {
  channelData.value = toTree(await queryChannelList());
};

watch(visible, () => {
  if (visible.value) {
    fetchRole();
    fetchArticlePermissions();
  }
});
onMounted(() => {
  fetchChannelData();
});

const handleSubmit = () => {
  form.value.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      await updateRolePermission(values.value);
      emit('finished');
      emit('update:modelValue', false);
      ElMessage.success(t('success'));
    } finally {
      buttonLoading.value = false;
    }
  });
};

const expandTree = (checked: boolean, tree: any, data: any[], key?: string) => {
  data.forEach((item) => {
    if (item.children) {
      tree.getNode(item[key ?? 'key']).expanded = checked;
      expandTree(checked, tree, item.children, key);
    }
  });
};
const checkTree = (checked: boolean, tree: any, data: any[], key?: string) => {
  tree.setCheckedKeys(checked ? data.map((item: any) => item[key ?? 'key']) : []);
};

const handlePermission = () => {
  values.value.permission = getPermission(permissionTree.value.getCheckedNodes(), permissionTree.value.getHalfCheckedNodes());
};
const handleGrantPermission = () => {
  values.value.grantPermission = getPermission(grantPermissionTree.value.getCheckedNodes(), grantPermissionTree.value.getHalfCheckedNodes());
};
const handleArticlePermission = () => {
  values.value.articlePermissions = [...articlePermissionTree.value.getCheckedNodes(), ...articlePermissionTree.value.getHalfCheckedNodes()].map((item) => item.id);
};
const getPermission = (checkedNodes: any[], halfCheckedNodes: any[]) =>
  [...checkedNodes, ...halfCheckedNodes]
    .filter((item) => item.perms)
    .map((item) => item.perms?.join(','))
    .join(',');
</script>
