<template>
  <el-dialog :title="$t('imageCrop')" v-model="visible" @closed="destroyCropper()" top="5vh" :width="768" destroy-on-close append-to-body>
    <div class="text-center">
      <img ref="imgRef" @load="initCropper()" :src="src" alt="" class="inline" style="max-height:410px" />
    </div>
    <div class="text-right">
      <el-button @click.prevent="handleSubmit()" type="primary" native-type="submit" class="mt-4">{{ $t('save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { cropImage } from '@/api/config';

export default defineComponent({
  name: 'ImageCropper',
  props: {
    modelValue: { type: Boolean, required: true },
    src: { type: String, default: null },
    width: { type: Number },
    height: { type: Number },
    thumbnailWidth: { type: Number },
    thumbnailHeight: { type: Number },
  },
  emits: { 'update:modelValue': null, success: null },
  setup(props, { emit }) {
    const { modelValue, src, width, height, thumbnailWidth, thumbnailHeight } = toRefs(props);
    const visible = computed({
      get: () => modelValue.value,
      set: (val) => emit('update:modelValue', val),
    });

    const imgRef = ref<any>();
    const cropper = ref<any>();
    const cropParam = ref<any>({});

    const initCropper = () => {
      if (imgRef.value) {
        cropper.value = new Cropper(imgRef.value, {
          aspectRatio: width?.value && height?.value ? width.value / height.value : NaN,
          autoCropArea: width?.value && height?.value ? 1 : 0.8,
          viewMode: 1,
          minCropBoxWidth: width?.value ?? 16,
          minCropBoxHeight: height?.value ?? 16,
          zoomable: false,
          crop(event) {
            cropParam.value.url = src.value;
            cropParam.value.x = Math.floor(event.detail.x);
            cropParam.value.y = Math.floor(event.detail.y);
            cropParam.value.width = Math.floor(event.detail.width);
            cropParam.value.height = Math.floor(event.detail.height);
            cropParam.value.maxWidth = width?.value;
            cropParam.value.maxHeight = height?.value;
            cropParam.value.thumbnailWidth = thumbnailWidth?.value;
            cropParam.value.thumbnailHeight = thumbnailHeight?.value;
          },
        });
      }
    };
    const destroyCropper = () => {
      if (cropper.value) {
        cropper.value.destroy();
      }
    };
    const handleSubmit = async () => {
      visible.value = false;
      emit('success', (await cropImage(cropParam.value)).url);
    };
    return { imgRef, visible, initCropper, destroyCropper, handleSubmit };
  },
});
</script>

<style lang="scss" scoped>
/* Ensure the size of the image fit the container perfectly */
:deep(img) {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
