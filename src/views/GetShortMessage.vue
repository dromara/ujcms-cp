<template>
  <el-dialog
    :title="$t('getShortMessage')"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @opened="
      focus?.focus();
      form.resetFields();
    "
    width="576px"
  >
    <el-form ref="form" :model="bean" label-width="150px" label-position="right">
      <el-alert v-if="error" :title="error" type="error" class="mb-3" :closable="false" show-icon />
      <el-form-item
        prop="mobile"
        :label="$t('mobile')"
        :rules="[
          { required: true, message: () => $t('v.required') },
          {
            asyncValidator: async (rule, value, callback) => {
              if (await mobileNotExist(value)) {
                callback($t('mobileNotExist'));
                return;
              }
              callback();
            },
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="bean.mobile" ref="focus" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item
        prop="captcha"
        :label="$t('captcha')"
        :rules="[
          { required: true, message: () => $t('v.required') },
          {
            asyncValidator: async (rule, value, callback) => {
              if (captchaToken == null || !(await tryCaptcha(captchaToken, value))) {
                callback($t('captchaIncorrect'));
                return;
              }
              callback();
            },
            trigger: 'blur',
          },
        ]"
        class="captcha"
      >
        <el-input v-model="bean.captcha" name="captcha" :placeholder="$t('captcha')" :prefix-icon="Picture">
          <template #append>
            <el-image :src="captchaData" style="height: 30px; margin-right: 1px" class="rounded-r cursor-pointer" @click="fetchCaptcha()" :title="$t('clickToRetrieveCaptcha')" />
          </template>
        </el-input>
      </el-form-item>
      <div>
        <el-button :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit">{{ $t('submit') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
export default { name: 'GetShortMessage' };
</script>

<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';
import { Picture } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { tryCaptcha, mobileNotExist, queryCaptcha, sendMobileMessage } from '@/api/login';

const props = defineProps({ modelValue: { type: Boolean, required: true } });
const emit = defineEmits({ 'update:modelValue': null, finish: null });
const { modelValue: visible } = toRefs(props);
const { t } = useI18n();
const form = ref<any>();
const focus = ref<any>();
const bean = ref<any>({});
const buttonLoading = ref<boolean>(false);
const error = ref<string>();

const captchaData = ref<string>();
const captchaToken = ref<string>();

const fetchCaptcha = async () => {
  const { token, image } = await queryCaptcha();
  captchaData.value = 'data:image/png;base64,' + image;
  captchaToken.value = token;
};

watch(visible, () => {
  if (visible.value) {
    fetchCaptcha();
  }
});

const handleSubmit = () => {
  form.value.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      const data = await sendMobileMessage(captchaToken.value ?? '', bean.value.captcha, bean.value.mobile, 3);
      console.log(data);
      // 登录失败，显示错误信息
      if (data.status !== 0) {
        error.value = data.message;
        return;
      }
      error.value = undefined;
      form.value.resetFields();
      ElMessage.success(t('success'));
      emit('finish', data.result.shortMessageId);
      emit('update:modelValue', false);
    } finally {
      buttonLoading.value = false;
    }
  });
};
</script>
