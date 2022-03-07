<template>
  <el-upload
    :action="action"
    :headers="{ ...getAuthHeaders(), ...getSiteHeaders() }"
    :accept="accept"
    :before-upload="beforeUpload"
    :on-progress="(event, file) => (progressFile = file)"
    :show-file-list="false"
    :disabled="disabled"
    :multiple="multiple"
  >
    <!--
    // 用于测试上传进度条
    action="https://jsonplaceholder.typicode.com/posts/"
     -->
    <el-button type="primary">{{ $t('clickToUpload') }}</el-button>
  </el-upload>
  <el-progress v-if="progressFile.status === 'uploading'" :percentage="parseInt(progressFile.percentage, 10)"></el-progress>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getAuthHeaders } from '@/utils/auth';
import { getSiteHeaders } from '@/utils/common';
import { imageUploadUrl, videoUploadUrl, docUploadUrl, fileUploadUrl, queryGlobalSettings } from '@/api/config';

export default defineComponent({
  name: 'BaseUpload',
  props: {
    type: {
      type: String,
      default: 'file',
      validator: (value: string) => ['image', 'video', 'doc', 'file'].includes(value),
    },
    uploadAction: { type: String },
    fileAccept: { type: String },
    fileMaxSize: { type: Number },
    multiple: { type: Boolean },
    disabled: { type: Boolean, default: false },
    'on-success': { type: Function },
  },
  setup(props) {
    const { type, uploadAction, fileAccept, fileMaxSize } = toRefs(props);
    const { t } = useI18n();
    const progressFile = ref<any>({});
    const global = ref<any>();
    const fetchGlobalSettings = async () => {
      global.value = await queryGlobalSettings();
    };
    onMounted(() => {
      fetchGlobalSettings();
    });
    const action = computed(() => {
      if (uploadAction?.value != null) {
        return uploadAction.value;
      }
      switch (type.value) {
        case 'image':
          return imageUploadUrl;
        case 'video':
          return videoUploadUrl;
        case 'doc':
          return docUploadUrl;
        case 'file':
          return fileUploadUrl;
        default:
          throw new Error(`Type not support: ${type.value}`);
      }
    });
    const accept = computed(() => {
      if (fileAccept?.value != null) {
        return fileAccept.value;
      }
      switch (type.value) {
        case 'image':
          return global?.value?.upload?.imageInputAccept ?? '.jpg,.jpeg,.png,.gif';
        case 'video':
          return global?.value?.upload?.videoInputAccept ?? '.mp4,.m3u8';
        case 'doc':
          return global?.value?.upload?.docInputAccept ?? '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
        case 'file':
          return global?.value?.upload?.fileInputAccept ?? '.zip,.7z,.gz,.bz2,.iso,.rar,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.m3u8,.mp3,.ogg';
        default:
          throw new Error(`Type not support: ${type.value}`);
      }
    });
    const maxSize = computed(() => {
      if (fileMaxSize?.value != null) {
        return fileMaxSize.value;
      }
      switch (type.value) {
        case 'image':
          return global?.value?.upload?.imageLimitByte ?? 0;
        case 'video':
          return global?.value?.upload?.videoLimitByte ?? 0;
        case 'doc':
          return global?.value?.upload?.docLimitByte ?? 0;
        case 'file':
          return global?.value?.upload?.fileLimitByte ?? 0;
        default:
          throw new Error(`Type not support: ${type.value}`);
      }
    });
    const beforeUpload = (file: any) => {
      if (maxSize.value > 0 && file.size > maxSize.value) {
        ElMessage.error(t('error.fileMaxSize', { size: `${maxSize.value / 1024 / 1024}MB` }));
        return false;
      }
      return true;
    };
    return { progressFile, getAuthHeaders, getSiteHeaders, action, accept, beforeUpload };
  },
});
</script>

<style lang="scss" scoped></style>
