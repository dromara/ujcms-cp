<template>
  <el-upload
    :action="imageUploadUrl"
    :headers="{ ...getAuthHeaders(), ...getSiteHeaders() }"
    :accept="accept"
    :before-upload="beforeUpload"
    :data="data"
    :show-file-list="false"
    :on-success="(res) => ((src = res.url), (cropperVisible = mode === 'manual'))"
    :on-progress="(event, file) => (progressFile = file)"
  >
    <!--
    // 用于测试上传进度条
    action="https://jsonplaceholder.typicode.com/posts/"
     -->
    <div v-if="src" class="full-flex-center rounded-border relative hover:border-opacity-0">
      <img :src="src" class="max-w-full max-h-full block" />
      <div class="full-flex-center absolute rounded-md cursor-default bg-black bg-opacity-50 opacity-0 hover:opacity-100 space-x-4" @click.stop>
        <el-icon class="image-action" @click="cropperVisible = true" :title="$t('cropImage')"><Crop /></el-icon>
        <el-icon class="image-action" @click="previewVisible = true" :title="$t('previewImage')"><View /></el-icon>
        <el-icon class="image-action" @click="src = undefined" :title="$t('deleteImage')"><Delete /></el-icon>
      </div>
    </div>
    <el-progress v-else-if="progressFile.status === 'uploading'" type="circle" :percentage="parseInt(progressFile.percentage, 10)" />
    <div v-else class="el-upload--picture-card">
      <el-icon><plus /></el-icon>
    </div>
  </el-upload>
  <div>
    <el-dialog v-model="previewVisible" top="5vh" :width="768" append-to-body destroy-on-close>
      <el-input v-model="src">
        <template #prepend>URL</template>
      </el-input>
      <img :src="src" alt="" class="mt-1 border border-gray-300" />
    </el-dialog>
  </div>
  <image-cropper v-model="cropperVisible" :src="src" :width="width" :height="height" @success="(url) => (src = url)"></image-cropper>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Crop, View, Delete } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { getAuthHeaders } from '@/utils/auth';
import { getSiteHeaders } from '@/utils/common';
import { imageUploadUrl, queryGlobalSettings } from '@/api/config';
import ImageCropper from './ImageCropper.vue';

// 'image/jpg,image/jpeg,image/png,image/gif'

const props = defineProps({
  modelValue: { type: String, default: null },
  fileAccept: { type: String },
  fileMaxSize: { type: Number },
  width: { type: Number },
  height: { type: Number },
  mode: { type: String, default: 'none' },
});

const emit = defineEmits({ 'update:modelValue': null });

const { modelValue, width, height, mode, fileAccept, fileMaxSize } = toRefs(props);
const { t } = useI18n();
const progressFile = ref<any>({});
const previewVisible = ref<boolean>(false);
const cropperVisible = ref<boolean>(false);
const src = computed({
  get: (): string | undefined => modelValue.value,
  set: (val: string | undefined) => emit('update:modelValue', val),
});
const resizable = computed(() => ['cut', 'resize'].includes(mode.value));
const data = computed(() => {
  const params: any = { resizeMode: mode.value === 'cut' ? 'cut' : 'normal' };
  if (width?.value != null) {
    // 为0不限制，为空则依然受全局图片宽高限制
    params.maxWidth = resizable.value ? width.value : 0;
  }
  if (height?.value != null) {
    // 为0不限制，为空则依然受全局图片宽高限制
    params.maxHeight = resizable.value ? height.value : 0;
  }
  return params;
});
const global = ref<any>();
const fetchGlobalSettings = async () => {
  global.value = await queryGlobalSettings();
};
onMounted(() => {
  fetchGlobalSettings();
});
const accept = computed(() => fileAccept?.value ?? global?.value?.upload?.imageInputAccept ?? 'image/jpg,image/jpeg,image/png,image/gif');
const maxSize = computed(() => fileMaxSize?.value ?? global?.value?.upload?.imageLimitByte ?? 0);
const beforeUpload = (file: any) => {
  if (maxSize.value > 0 && file.size > maxSize.value) {
    ElMessage.error(t('error.fileMaxSize', { size: `${maxSize.value / 1024 / 1024}MB` }));
    return false;
  }
  return true;
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog__headerbtn) {
  top: 4px;
}
:deep(.el-upload) {
  width: 148px;
  height: 148px;
}
.full-flex-center {
  @apply w-full h-full flex justify-center items-center;
}
.rounded-border {
  border: 1px solid #c0ccda;
  @apply rounded-md bg-gray-50;
}
.image-action {
  @apply cursor-pointer text-xl text-white;
}
</style>
