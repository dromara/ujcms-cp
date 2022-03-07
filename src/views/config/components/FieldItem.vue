<!--
      { label: '单行文本', type: 'text' },
      { label: '多行文本', type: 'textarea' },
      { label: '计数器', type: 'number' },
      { label: '日期选择器', type: 'date' },
      { label: '颜色选择器', type: 'color' },
      { label: '滑块', type: 'slider' },
      { label: '单选框组', type: 'radio' },
      { label: '多选框组', type: 'checkbox' },
      { label: '下拉单选', type: 'select' },
      { label: '下拉多选', type: 'multipleSelect' },
      { label: '级联选择', type: 'cascader' },
      { label: '开关', type: 'switch' },
      { label: '富文本编辑器', type: 'tinyEditor' },
      { label: '图片上传', type: 'imageUpload' },
      { label: '视频上传', type: 'videoUpload' },
      { label: '文件上传', type: 'fileUpload' },
-->
<template>
  <el-input v-if="field.type === 'text'" v-model="data" :placeholder="field.placeholder"></el-input>
  <el-input v-else-if="field.type === 'textarea'" type="textarea" v-model="data" :placeholder="field.placeholder" :rows="field.rows"></el-input>
  <el-input-number v-else-if="field.type === 'number'" v-model="data" :placeholder="field.placeholder"></el-input-number>
  <el-date-picker v-else-if="field.type === 'date'" :type="field.dateType ?? 'date'" v-model="data" :placeholder="field.placeholder" />
  <el-color-picker v-else-if="field.type === 'color'" v-model="data"></el-color-picker>
  <el-slider v-else-if="field.type === 'slider'" v-model="data" :showInput="field.showInput ?? false" :min="field.min" :max="field.max"></el-slider>
  <el-switch v-else-if="field.type === 'switch'" v-model="data" :active-value="field.activeValue" :inactive-value="field.inactiveValue"></el-switch>
  <el-radio-group v-else-if="field.type === 'radio'" v-model="data">
    <template v-if="field.checkStyle === 'button'">
      <el-radio-button v-for="item in dictList" :key="item.id" :label="item.name">{{ item.name }}</el-radio-button>
    </template>
    <template v-else>
      <el-radio v-for="item in dictList" :key="item.id" :label="item.name">{{ item.name }}</el-radio>
    </template>
  </el-radio-group>
  <el-checkbox-group v-else-if="field.type === 'checkbox'" v-model="data">
    <template v-if="field.checkStyle === 'button'">
      <el-checkbox-button v-for="item in dictList" :key="item.id" :label="item.name">{{ item.name }}</el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox v-for="item in dictList" :key="item.id" :label="item.name">{{ item.name }}</el-checkbox>
    </template>
  </el-checkbox-group>
  <el-select v-else-if="field.type === 'select'" v-model="data" :clearable="field.clearable" :placeholder="field.placeholder" class="w-full">
    <el-option v-for="item in dictList" :key="item.id" :value="item.name" :label="item.name"></el-option>
  </el-select>
  <el-select v-else-if="field.type === 'multipleSelect'" v-model="data" :clearable="field.clearable" :placeholder="field.placeholder" multiple class="w-full">
    <el-option v-for="item in dictList" :key="item.id" :value="item.name" :label="item.name"></el-option>
  </el-select>
  <image-upload v-else-if="field.type === 'imageUpload'" v-model="data" :height="field.imageHeight" :width="field.imageWidth" :mode="field.imageMode"></image-upload>
  <template v-else-if="field.type === 'videoUpload'">
    <el-input v-model="data" :placeholder="field.placeholder" maxlength="255"></el-input>
    <base-upload type="video" :on-success="(res: any) => (data = res.url)"></base-upload>
  </template>
  <template v-else-if="field.type === 'fileUpload'">
    <el-input v-model="data" :placeholder="field.placeholder" maxlength="255"></el-input>
    <base-upload type="file" :on-success="(res: any) => (data = res.url)"></base-upload>
  </template>
  <tinymce
    v-else-if="field.type === 'tinyEditor'"
    v-model="data"
    :init="{ ...{ placeholder: field.placeholder }, ...(field.minHeight ? { min_height: field.minHeight } : {}), ...(field.maxHeight ? { max_height: field.maxHeight } : {}) }"
  />
  <div v-else>{{ `Unsupported type: ${field.type}` }}</div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watchEffect, computed } from 'vue';
import { queryDictList } from '@/api/config';
import Tinymce from '@/components/Tinymce/index.vue';
import { BaseUpload, ImageUpload } from '@/components/Upload';

export default defineComponent({
  name: 'FieldItem',
  components: { Tinymce, BaseUpload, ImageUpload },
  props: { field: { type: Object, required: true }, modelValue: null },
  emits: { 'update:modelValue': null },
  setup(props, { emit }) {
    const { field, modelValue } = toRefs(props);
    const dictList = ref<any[]>([]);
    watchEffect(async () => {
      const typeId = field.value.dictTypeId;
      if (typeId) {
        dictList.value = await queryDictList({ typeId });
      }
    });
    const data = computed({
      get: () => {
        // 下拉多选框的 v-model 为空会报错。
        if (modelValue.value == null && ['multipleSelect', 'checkbox'].includes(field.value.type)) {
          return [];
        }
        return modelValue.value;
      },
      set: (val) => emit('update:modelValue', val),
    });

    // watchEffect(() => {
    //   data.value = modelValue.value;
    // });
    return { dictList, data };
  },
});
</script>
