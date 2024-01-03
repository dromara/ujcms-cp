<script lang="ts">
export default { name: 'RolePermissionForm' };
</script>

<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getPermsTreeData } from '@/data';
import { toTree, flatTree, disablePermissionTree } from '@/utils/tree';
import { currentUser } from '@/stores/useCurrentUser';
import { queryRole, updateRolePermission, roleArticlePermissions, roleChannelPermissions } from '@/api/user';
import { queryChannelList } from '@/api/content';
import LabelTip from '@/components/LabelTip.vue';

const props = defineProps({ modelValue: { type: Boolean, required: true }, beanId: { type: Number, default: null } });
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
const channelPermissionExpand = ref<boolean>(true);
const channelPermissionCheck = ref<boolean>(false);
const channelPermissionTree = ref<any>();
const permsData: any[] = getPermsTreeData();
disablePermissionTree(permsData, currentUser.grantPermissions ?? []);
const channelData = ref<any[]>([]);
const disabled = computed(() => (bean.value.global && !currentUser.globalPermission) || currentUser.rank > bean.value.rank);
const fetchRole = async () => {
  if (beanId.value != null) {
    bean.value = await queryRole(beanId.value);
    values.value = { ...bean.value };
    // 树组件先加载好，再赋值
    nextTick().then(() => {
      permissionTree.value?.setCheckedKeys(bean.value.permission?.split(',') ?? []);
      grantPermissionTree.value?.setCheckedKeys(bean.value.grantPermission?.split(',') ?? []);
    });
  }
};
const fetchArticlePermissions = async () => {
  if (beanId.value != null) {
    const articlePermissions = await roleArticlePermissions(beanId.value);
    articlePermissionTree.value?.setCheckedKeys([]);
    articlePermissions.forEach((key: number) => {
      articlePermissionTree.value?.setChecked(key, true, false);
    });
  }
};
const fetchChannelPermissions = async () => {
  if (beanId.value != null) {
    const channelPermissions = await roleChannelPermissions(beanId.value);
    channelPermissionTree.value?.setCheckedKeys([]);
    channelPermissions.forEach((key: number) => {
      channelPermissionTree.value?.setChecked(key, true, false);
    });
  }
};
const fetchChannelData = async () => {
  channelData.value = toTree(await queryChannelList());
};

watch(visible, async () => {
  if (visible.value) {
    fetchRole();
    fetchArticlePermissions();
    fetchChannelPermissions();
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
      handlePermission();
      handleGrantPermission();
      handleArticlePermission();
      handleChannelPermission();
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
  if (permissionTree.value != null) {
    values.value.permission = getPermission(permissionTree.value.getCheckedNodes(), permissionTree.value.getHalfCheckedNodes());
  }
};
const handleGrantPermission = () => {
  if (grantPermissionTree.value != null) {
    values.value.grantPermission = getPermission(grantPermissionTree.value.getCheckedNodes(), grantPermissionTree.value.getHalfCheckedNodes());
  }
};
const handleArticlePermission = () => {
  if (articlePermissionTree.value != null) {
    values.value.articlePermissions = [...articlePermissionTree.value.getCheckedNodes(), ...articlePermissionTree.value.getHalfCheckedNodes()].map((item) => item.id);
  }
};
const handleChannelPermission = () => {
  if (channelPermissionTree.value != null) {
    values.value.channelPermissions = [...channelPermissionTree.value.getCheckedNodes(), ...channelPermissionTree.value.getHalfCheckedNodes()].map((item) => item.id);
  }
};
const getPermission = (checkedNodes: any[], halfCheckedNodes: any[]) =>
  [...checkedNodes, ...halfCheckedNodes]
    .filter((item) => item.perms)
    .map((item) => item.perms?.join(','))
    .join(',');
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <el-drawer :title="$t('permissionSettings')" :with-header="false" :model-value="modelValue" :size="576" @update:model-value="(event) => $emit('update:modelValue', event)">
    <template #default>
      <el-form ref="form" :model="values" :disabled="disabled" label-width="150px">
        <el-tabs v-model="tabName">
          <el-tab-pane :label="$t('role.permission')" name="permission">
            <el-alert :title="$t('role.permission.tooltip')" type="info" :closable="false" show-icon />
            <el-form-item prop="allPermission">
              <template #label><label-tip message="role.allPermission" /></template>
              <el-switch v-model="values.allPermission"></el-switch>
            </el-form-item>
            <template v-if="!values.allPermission">
              <div class="border-t">
                <el-checkbox
                  v-model="permissionExpand"
                  :disabled="false"
                  :label="$t('expand/collapse')"
                  @change="(checked: any) => expandTree(checked, permissionTree, permsData)"
                />
                <el-checkbox
                  v-model="permissionCheck"
                  :label="$t('checkAll/uncheckAll')"
                  @change="
                  (checked: any) => {
                    checkTree(checked, permissionTree, permsData);
                    handlePermission();
                  }
                "
                />
              </div>
              <el-tree ref="permissionTree" :data="permsData" node-key="key" class="border rounded" default-expand-all show-checkbox @check="() => handlePermission()" />
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="currentUser.epRank >= 1 || currentUser.epDisplay" :label="$t('role.grantPermission')" name="grantPermission">
            <template v-if="currentUser.epRank >= 1">
              <el-alert :title="$t('role.grantPermission.tooltip')" type="info" :closable="false" show-icon />
              <el-form-item prop="allGrantPermission" class="mt-3">
                <template #label><label-tip message="role.allGrantPermission" /></template>
                <el-switch v-model="values.allGrantPermission"></el-switch>
              </el-form-item>
              <template v-if="!values.allGrantPermission">
                <div class="border-t">
                  <el-checkbox v-model="grantPermissionExpand" :label="$t('expand/collapse')" @change="(checked: any) => expandTree(checked, grantPermissionTree, permsData)" />
                  <el-checkbox
                    v-model="grantPermissionCheck"
                    :label="$t('checkAll/uncheckAll')"
                    @change="
                  (checked: any) => {
                    checkTree(checked, grantPermissionTree, permsData);
                    handleGrantPermission();
                  }
                "
                  />
                </div>
                <el-tree
                  ref="grantPermissionTree"
                  :data="permsData"
                  node-key="key"
                  class="border rounded"
                  default-expand-all
                  show-checkbox
                  @check="() => handleGrantPermission()"
                />
              </template>
            </template>
            <template v-else>
              <el-alert type="warning" :closable="false" :show-icon="true">
                <template #title><span v-html="$t('error.enterprise.short')"></span></template>
              </el-alert>
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="currentUser.epRank >= 1 || currentUser.epDisplay" :label="$t('role.dataPermission')" name="dataPermission">
            <template v-if="currentUser.epRank >= 1">
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
              <el-form-item prop="allStatusPermission" :rules="{ required: true, message: () => $t('v.required') }">
                <template #label><label-tip message="role.allStatusPermission" help /></template>
                <el-switch v-model="values.allStatusPermission" :disabled="!currentUser.allStatusPermission"></el-switch>
              </el-form-item>
            </template>
            <template v-else>
              <el-alert type="warning" :closable="false" :show-icon="true">
                <template #title><span v-html="$t('error.enterprise.short')"></span></template>
              </el-alert>
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="currentUser.epRank >= 1 || currentUser.epDisplay" :label="$t('role.articlePermission')" name="articlePermission">
            <template v-if="currentUser.epRank >= 1">
              <el-form-item prop="allArticlePermission">
                <template #label><label-tip message="role.allArticlePermission" help /></template>
                <el-switch v-model="values.allArticlePermission"></el-switch>
              </el-form-item>
              <template v-if="!values.allArticlePermission">
                <div class="border-t">
                  <el-checkbox
                    v-model="articlePermissionExpand"
                    :label="$t('expand/collapse')"
                    @change="(checked: any) => expandTree(checked, articlePermissionTree, channelData, 'id')"
                  />
                  <el-checkbox
                    v-model="articlePermissionCheck"
                    :label="$t('checkAll/uncheckAll')"
                    @change="
                    (checked: any) => {
                      checkTree(checked, articlePermissionTree, channelData, 'id');
                      handleArticlePermission();
                    }
                  "
                  />
                </div>
                <el-tree
                  ref="articlePermissionTree"
                  :data="channelData"
                  node-key="id"
                  :props="{ label: 'name' }"
                  class="border rounded"
                  default-expand-all
                  show-checkbox
                  @check="() => handleArticlePermission()"
                />
              </template>
            </template>
            <template v-else>
              <el-alert type="warning" :closable="false" :show-icon="true">
                <template #title><span v-html="$t('error.enterprise.short')"></span></template>
              </el-alert>
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="currentUser.epRank >= 1 || currentUser.epDisplay" :label="$t('role.channelPermission')" name="channelPermission">
            <template v-if="currentUser.epRank >= 1">
              <el-form-item prop="allChannelPermission">
                <template #label><label-tip message="role.allChannelPermission" help /></template>
                <el-switch v-model="values.allChannelPermission"></el-switch>
              </el-form-item>
              <template v-if="!values.allChannelPermission">
                <div class="border-t">
                  <el-checkbox
                    v-model="channelPermissionExpand"
                    :label="$t('expand/collapse')"
                    @change="(checked: any) => expandTree(checked, channelPermissionTree, channelData, 'id')"
                  />
                  <el-checkbox
                    v-model="channelPermissionCheck"
                    :label="$t('checkAll/uncheckAll')"
                    @change="
                      (checked: any) => {
                        checkTree(checked, channelPermissionTree, flatTree(channelData), 'id');
                        handleChannelPermission();
                      }
                    "
                  />
                </div>
                <el-tree
                  ref="channelPermissionTree"
                  :data="channelData"
                  node-key="id"
                  :props="{ label: 'name' }"
                  class="border rounded"
                  check-strictly
                  default-expand-all
                  show-checkbox
                  @check="() => handleChannelPermission()"
                />
              </template>
            </template>
            <template v-else>
              <el-alert type="warning" :closable="false" :show-icon="true">
                <template #title><span v-html="$t('error.enterprise.short')"></span></template>
              </el-alert>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </template>
    <template #footer>
      <div class="flex items-center justify-between">
        <div>
          <el-tag>{{ values?.name }}</el-tag>
        </div>
        <div>
          <el-button @click="() => $emit('update:modelValue', false)">{{ $t('cancel') }}</el-button>
          <el-button type="primary" :loading="buttonLoading" :disabled="disabled" @click="() => handleSubmit()">{{ $t('save') }}</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>
