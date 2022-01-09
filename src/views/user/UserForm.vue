<template>
  <dialog-form
    :name="$t('menu.user.user')"
    :queryBean="queryUser"
    :createBean="createUser"
    :updateBean="updateUser"
    :deleteBean="deleteUser"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="(bean) => ({ gender: 'm', roleIds: [] })"
    :toValues="(bean) => ({ ...bean, roleIds: bean.roleList.map((item) => item.id) })"
    :disableDelete="(bean) => bean.id <= 1"
    perms="user"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
    large
  >
    <template #default="{values,bean,isEdit}">
      <el-row>
        <el-col :span="12">
          <el-form-item
            prop="username"
            :label="$t('user.username')"
            :rules="[
              { required: true, message: () => $t('v.required') },
              {
                asyncValidator: async (rule, value, callback) => {
                  if (value !== bean.username && !(await usernameValidation(value))) {
                    callback($t('user.error.usernameExist'));
                  }
                },
              },
            ]"
          >
            <el-input v-model="values.username" ref="focus" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="realName" :label="$t('user.realName')">
            <el-input v-model="values.realName" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="plainPassword" :label="$t('user.plainPassword')" :rules="[{ required: !isEdit, message: () => $t('v.required') }]">
            <el-input v-model="values.plainPassword" maxlength="50" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="passwordAgain"
            :label="$t('user.passwordAgain')"
            :rules="[
              { required: !isEdit, message: () => $t('v.required') },
              {
                validator: (rule, value, callback) => {
                  if (value != values.plainPassword) {
                    callback($t('user.error.passwordNotMatch'));
                  } else {
                    callback();
                  }
                },
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="values.passwordAgain" maxlength="50" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="mobile"
            :label="$t('user.mobile')"
            :rules="[
              {
                asyncValidator: async (rule, value, callback) => {
                  if (value !== bean.mobile && !(await mobileValidation(value))) {
                    callback($t('user.error.mobileExist'));
                  }
                },
              },
            ]"
          >
            <el-input v-model="values.mobile" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="email"
            :label="$t('user.email')"
            :rules="[
              {
                asyncValidator: async (rule, value, callback) => {
                  if (value !== bean.email && !(await emailValidation(value))) {
                    callback($t('user.error.emailExist'));
                  }
                },
              },
            ]"
          >
            <el-input v-model="values.email" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="groupId" :label="$t('user.group')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-select v-model="values.groupId">
              <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="orgId" :label="$t('user.org')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-cascader
              v-model="values.orgId"
              :options="orgList"
              :props="{ value: 'id', label: 'name', checkStrictly: true }"
              @change="(value) => (values.orgId = value[value.length - 1])"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="roleIds" :label="$t('user.role')">
            <el-checkbox-group v-model="values.roleIds">
              <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="rank"
            :rules="[
              { required: true, message: () => $t('v.required') },
              { type: 'integer', message: () => $t('v.integer') },
            ]"
          >
            <template #label><label-tip message="user.rank"/></template>
            <el-input v-model.number="values.rank" maxlength="4"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="gender" :label="$t('user.gender')" :rules="{ required: true, message: () => $t('v.required') }">
            <el-radio-group v-model="values.gender">
              <el-radio :label="'m'">{{ $t('gender.male') }}</el-radio>
              <el-radio :label="'f'">{{ $t('gender.female') }}</el-radio>
              <el-radio :label="'n'">{{ $t('gender.none') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="location" :label="$t('user.location')">
            <el-input v-model="values.location" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="birthday" :label="$t('user.birthday')">
            <el-date-picker v-model="values.birthday" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="bio" :label="$t('user.bio')">
            <el-input v-model="values.bio" type="textarea" :rows="3" maxlength="2000"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isEdit">
          <el-form-item prop="created" :label="$t('user.created')">
            <el-date-picker v-model="values.created" type="datetime" disabled></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isEdit">
          <el-form-item prop="loginDate" :label="$t('user.loginDate')">
            <el-date-picker v-model="values.loginDate" type="datetime" disabled></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isEdit">
          <el-form-item prop="loginIp" :label="$t('user.loginIp')">
            <el-input v-model="values.loginIp" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isEdit">
          <el-form-item prop="loginCount" :label="$t('user.loginCount')">
            <el-input v-model="values.loginCount" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { queryUser, createUser, updateUser, deleteUser, usernameValidation, emailValidation, mobileValidation, queryGroupList, queryOrgList, queryRoleList } from '@/api/user';
import { toTree } from '@/utils/tree';
import DialogForm from '@/components/DialogForm.vue';
import LabelTip from '@/components/LabelTip.vue';

export default defineComponent({
  components: { DialogForm, LabelTip },
  props: { modelValue: { type: Boolean, required: true }, beanId: { required: true }, beanIds: { required: true } },
  emits: { 'update:modelValue': null, finished: null },
  setup() {
    const focus = ref<any>(null);
    const groupList = ref<any[]>([]);
    const orgList = ref<any[]>([]);
    const roleList = ref<any[]>([]);
    onMounted(() => {
      queryGroupList({ Q_EQ_type: 2 }).then((result) => {
        groupList.value = result;
      });
      queryOrgList().then((result) => {
        orgList.value = toTree(result);
      });
      queryRoleList().then((result) => {
        roleList.value = result;
      });
    });
    return { queryUser, createUser, updateUser, deleteUser, focus, usernameValidation, emailValidation, mobileValidation, groupList, orgList, roleList };
  },
});
</script>
