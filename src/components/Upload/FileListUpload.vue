<template>
  <el-upload
    :action="imageUploadUrl"
    :headers="{ ...getAuthHeaders(), ...getSiteHeaders() }"
    :accept="accept"
    :before-upload="beforeUpload"
    :on-success="(res) => fileList.push({ name: res.name, url: res.url, length: res.size })"
    :on-progress="(event, file) => (progressFile = file)"
    :show-file-list="false"
    multiple
  >
    <!--
    action="https://jsonplaceholder.typicode.com/posts/"
     -->
    <el-button size="small" type="primary">{{ $t('clickToUpload') }}</el-button>
  </el-upload>
  <el-progress v-if="progressFile.status === 'uploading'" :percentage="parseInt(progressFile.percentage, 10)"></el-progress>
  <transition-group tag="ul" :class="['el-upload-list', 'el-upload-list--text', { 'is-disabled': disabled }]" name="el-list">
    <li v-for="file in fileList" :key="file.url" class="el-upload-list__item is-success">
      <a class="el-upload-list__item-name" @click="handlePreview(file)"><i class="el-icon-document"></i>{{ file.name }}</a>
      <label class="el-upload-list__item-status-label">
        <i class="el-icon-upload-success el-icon-circle-check el-icon-check"></i>
      </label>
      <i v-if="!disabled" class="el-icon-close" @click="fileList.splice(fileList.indexOf(file), 1)"></i>
    </li>
  </transition-group>
  <el-dialog :title="$t('article.fileList.attribute')" v-model="previewVisible" top="5vh" :width="768" append-to-body>
    <el-form ref="form" :model="previewFile" label-width="150px">
      <el-form-item prop="name" :label="$t('name')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="previewFile.name" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item prop="length" :label="$t('size')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="previewFile.length" maxlength="19">
          <template #append>Byte</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="url" label="URL" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="previewFile.url" maxlength="255"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleSubmit()" type="primary" native-type="submit" size="small">{{ $t('submit') }}</el-button>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getAuthHeaders } from '@/utils/auth';
import { getSiteHeaders } from '@/utils/common';
import { imageUploadUrl, queryGlobalSettings } from '@/api/config';

export default defineComponent({
  name: 'FileListUpload',
  props: {
    modelValue: { type: Array, default: () => [] },
    fileAccept: { type: String },
    fileMaxSize: { type: Number },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { fileAccept, fileMaxSize } = toRefs(props);
    const { t } = useI18n();
    const { modelValue } = toRefs(props);
    const progressFile = ref<any>({});
    const fileList = computed({
      get: () => modelValue.value,
      set: (val) => emit('update:modelValue', val),
    });
    const previewVisible = ref<boolean>(false);
    const previewFile = ref<any>({});
    const form = ref<any>(null);

    const handlePreview = (file: any) => {
      previewFile.value = file;
      previewVisible.value = true;
    };
    const handleSubmit = () => {
      form.value.validate(async (valid: boolean) => {
        if (!valid) return;
        previewVisible.value = false;
      });
    };
    const global = ref<any>(null);
    const fetchGlobalSettings = async () => {
      global.value = await queryGlobalSettings();
    };
    onMounted(() => {
      fetchGlobalSettings();
    });
    const defaultAccept = '.zip,.7z,.gz,.bz2,.iso,.rar,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.m3u8,.mp3,.ogg';
    const accept = computed(() => fileAccept?.value ?? global?.value?.upload?.fileInputAccept ?? defaultAccept);
    const maxSize = computed(() => fileMaxSize?.value ?? global?.value?.upload?.fileLimitByte ?? 0);
    const beforeUpload = (file: any) => {
      if (maxSize.value > 0 && file.size > maxSize.value) {
        ElMessage.error(t('error.fileMaxSize', { size: `${maxSize.value / 1024 / 1024}MB` }));
        return false;
      }
      return true;
    };
    return { fileList, progressFile, imageUploadUrl, getAuthHeaders, getSiteHeaders, form, previewVisible, previewFile, handlePreview, handleSubmit, accept, beforeUpload };
  },
});
</script>

<style lang="scss" scoped></style>
