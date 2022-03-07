<template>
  <dialog-form
    :name="$t('menu.content.blockItem')"
    :queryBean="queryBlockItem"
    :createBean="createBlockItem"
    :updateBean="updateBlockItem"
    :deleteBean="deleteBlockItem"
    :beanId="beanId"
    :beanIds="beanIds"
    :focus="focus"
    :initValues="() => ({ blockId, articleId, title, description })"
    :toValues="(bean) => ({ ...bean, articleTitle: bean.article.title, articleId: bean.article.id })"
    perms="blockItem"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @finished="$emit('finished')"
    @beanChange="(bean) => (currentBlockId = bean.blockId)"
  >
    <template #default="{ values, isEdit }">
      <el-form-item prop="blockId" :label="$t('blockItem.block')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-select v-model="values.blockId" class="w-full" @change="(value) => (currentBlockId = value)" disabled>
          <template v-for="item in blockList" :key="item.id">
            <el-option v-if="isEdit || item.enabled" :label="item.name" :value="item.id" :disabled="!item.enabled"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="title" :label="$t('blockItem.title')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.title" ref="focus" maxlength="150"></el-input>
      </el-form-item>
      <el-form-item v-if="isEdit" :label="$t('blockItem.articleId')">
        <el-input v-model="values.articleId" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="isEdit" :label="$t('blockItem.articleTitle')">
        <el-input v-model="values.articleTitle" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="block?.withDescription" prop="description" :label="$t('blockItem.description')" :rules="{ required: true, message: () => $t('v.required') }">
        <el-input v-model="values.description" type="textarea" :rows="5" maxlength="1000"></el-input>
      </el-form-item>
      <el-form-item v-if="block?.withImage" prop="image" :label="$t('blockItem.image')" :rules="{ required: true, message: () => $t('v.required') }">
        <image-upload v-model="values.image" :width="block.imageWidth" :height="block.imageHeight" mode="manual"></image-upload>
      </el-form-item>
      <el-form-item v-if="block?.withMobileImage" prop="mobileImage" :label="$t('blockItem.mobileImage')" :rules="{ required: true, message: () => $t('v.required') }">
        <image-upload v-model="values.mobileImage" :width="block.mobileImageWidth" :height="block.mobileImageHeight" mode="manual"></image-upload>
      </el-form-item>
    </template>
  </dialog-form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref, toRefs } from 'vue';
import { queryBlockList } from '@/api/config';
import { queryBlockItem, createBlockItem, updateBlockItem, deleteBlockItem } from '@/api/content';
import DialogForm from '@/components/DialogForm.vue';
import { ImageUpload } from '@/components/Upload';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  beanId: { required: true },
  beanIds: { type: Array, required: true },
  blockId: { type: Number },
  articleId: { type: Number },
  title: { type: String },
  description: { type: String },
});
defineEmits({ 'update:modelValue': null, finished: null });

const { blockId } = toRefs(props);
const currentBlockId = ref<number | null>();
const focus = ref<any>();
const blockList = ref<any[]>([]);
const block = computed(() => blockList.value.find((item) => item.id === (currentBlockId.value ?? blockId?.value)));
onMounted(async () => {
  blockList.value = await queryBlockList();
});
</script>
