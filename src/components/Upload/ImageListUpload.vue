<template>
  <!-- <transition-group tag="ul" :class="['el-upload-list', 'el-upload-list--picture-card', { 'is-disabled': disabled }]" name="el-list"> -->
  <ul :class="['el-upload-list', 'el-upload-list--picture-card', { 'is-disabled': disabled }]">
    <li v-for="file in fileList" :key="file.url" class="el-upload-list__item is-success">
      <div class="w-full h-full bg-gray-50 flex justify-center items-center">
        <img class="max-w-full max-h-full block" :src="file.url" alt="" />
        <div class="full-flex-center absolute rounded-md cursor-default bg-black bg-opacity-50 opacity-0 hover:opacity-100 space-x-4" @click.stop>
          <i class="el-icon-crop image-action" @click="(cropperVisible = true), (currentFile = file)" :title="$t('cropImage')"></i>
          <i class="el-icon-view image-action" @click="handlePreview(file)" :title="$t('previewImage')"></i>
          <i class="el-icon-delete image-action" @click="fileList.splice(fileList.indexOf(file), 1)" :title="$t('deleteImage')"></i>
        </div>
      </div>
    </li>
  </ul>
  <!-- </transition-group> -->
  <el-upload
    :action="imageUploadUrl"
    :headers="{ ...getAuthHeaders(), ...getSiteHeaders() }"
    :data="getData()"
    :accept="accept"
    :before-upload="beforeUpload"
    :on-success="(res, file) => fileList.push({ name: res.name, url: res.url })"
    :on-progress="(event, file) => (progressFile = file)"
    :show-file-list="false"
    multiple
    class="inline-block"
  >
    <el-progress v-if="progressFile.status === 'uploading'" type="circle" :percentage="parseInt(progressFile.percentage, 10)" />
    <div v-else class="el-upload--picture-card"><i class="el-icon-plus"></i></div>
  </el-upload>
  <div>
    <el-dialog v-model="previewVisible" top="5vh" :width="768">
      <el-input v-model="previewFile.url" maxlength="255">
        <template #prepend>URL</template>
      </el-input>
      <el-input v-model="previewFile.description" type="textarea" :rows="2" :placeholder="$t('article.imageList.description')" class="mt-1"></el-input>
      <img :src="previewFile.url" alt="" class="mt-1 border border-gray-300" />
    </el-dialog>
  </div>
  <image-cropper
    v-model="cropperVisible"
    :src="currentFile.url"
    :thumbnailWidth="thumbnailWidth"
    :thumbnailHeight="thumbnailHeight"
    @success="(url) => (currentFile.url = url)"
  ></image-cropper>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getAuthHeaders } from '@/utils/auth';
import { getSiteHeaders } from '@/utils/common';
import { imageUploadUrl, queryGlobalSettings } from '@/api/config';
import ImageCropper from './ImageCropper.vue';

export default defineComponent({
  name: 'ImageListUpload',
  components: { ImageCropper },
  props: {
    modelValue: { type: Array, default: () => [] },
    fileAccept: { type: String },
    fileMaxSize: { type: Number },
    maxWidth: { type: Number },
    maxHeight: { type: Number },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { modelValue, maxWidth, maxHeight, fileAccept, fileMaxSize } = toRefs(props);
    const { t } = useI18n();
    const progressFile = ref<any>({});
    const currentFile = ref<any>({});
    const previewVisible = ref<boolean>(false);
    const cropperVisible = ref<boolean>(false);
    const previewFile = ref<any>({ src: 'data:;base64,=' });
    const fileList = computed({
      get: () => modelValue.value,
      set: (val) => emit('update:modelValue', val),
    });
    const handlePreview = (file: any) => {
      previewFile.value = file;
      previewVisible.value = true;
    };
    const thumbnailWidth = 300;
    const thumbnailHeight = 300;
    const getData = () => {
      const data: any = { isWatermark: true, thumbnailWidth, thumbnailHeight };
      if (maxWidth?.value != null) {
        data.maxWidth = maxWidth.value;
      }
      if (maxHeight?.value != null) {
        data.maxHeight = maxHeight.value;
      }
      return data;
    };
    const global = ref<any>(null);
    const fetchGlobalSettings = async () => {
      global.value = await queryGlobalSettings();
    };
    onMounted(() => {
      fetchGlobalSettings();
    });
    const defaultAccept = 'image/jpg,image/jpeg,image/png,image/gif';
    const accept = computed(() => fileAccept?.value ?? global?.value?.upload?.imageInputAccept ?? defaultAccept);
    const maxSize = computed(() => fileMaxSize?.value ?? global?.value?.upload?.imageLimitByte ?? 0);
    const beforeUpload = (file: any) => {
      if (maxSize.value > 0 && file.size > maxSize.value) {
        ElMessage.error(t('error.fileMaxSize', { size: `${maxSize.value / 1024 / 1024}MB` }));
        return false;
      }
      return true;
    };

    return {
      fileList,
      progressFile,
      currentFile,
      imageUploadUrl,
      getAuthHeaders,
      getSiteHeaders,
      getData,
      thumbnailWidth,
      thumbnailHeight,
      cropperVisible,
      handlePreview,
      previewVisible,
      previewFile,
      accept,
      beforeUpload,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__headerbtn) {
  top: 4px;
}
.full-flex-center {
  @apply w-full h-full flex justify-center items-center;
}
.image-action {
  @apply cursor-pointer text-xl text-white;
}
</style>
