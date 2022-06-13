<template>
  <div class="dialog-full">
    <el-dialog :title="$t('model.fun.customFields')" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" destroy-on-close fullscreen>
      <el-container class="border-t" style="height: calc(100vh - 65px)">
        <el-aside width="240px">
          <el-scrollbar class="h-full">
            <draggable :list="components" :group="{ name: 'components', pull: 'clone', put: false }" :sort="false" :clone="clone" @end="onEnd" item-key="label">
              <template #item="{ element }">
                <div class="drag-component">{{ element.label }}</div>
              </template>
            </draggable>
          </el-scrollbar>
        </el-aside>
        <el-container class="border-r border-l">
          <el-header height="auto" class="px-2 py-1">
            <el-button :loading="buttonLoading" @click.prevent="handleSubmit" type="primary">{{ $t('save') }}</el-button>
          </el-header>
          <el-main class="border-t p-0">
            <el-scrollbar class="drawing-board h-full p-2">
              <el-form :model="drawingFormData" label-width="150px" class="h-full">
                <draggable
                  :list="customs"
                  class="min-h-full content-start mx-0"
                  tag="el-row"
                  :component-data="{ gutter: 8 }"
                  :animation="250"
                  @start="drag = true"
                  @end="drag = false"
                  group="components"
                  item-key="code"
                >
                  <template #item="{ element: field }">
                    <el-col :span="field.double ? 12 : 24" class="relative">
                      <el-form-item :prop="field.code" :label="field.name" :required="field.required" class="mb-0 py-3">
                        <field-item :field="field" v-model="field.defaultValue"></field-item>
                      </el-form-item>
                      <div
                        :class="['drag-mask', !drag && selected !== field ? 'hover:opacity-10' : null, selected === field ? 'drag-mask-selected' : null]"
                        @click="changeSelected(field)"
                      ></div>
                      <div :class="['drag-close', selected !== field ? 'hidden' : null]" @click="deleteElement(field)">
                        <el-icon class="text-danger"><circle-close /></el-icon>
                      </div>
                    </el-col>
                  </template>
                </draggable>
              </el-form>
            </el-scrollbar>
          </el-main>
        </el-container>
        <el-aside class="right-panel w-60">
          <el-scrollbar class="h-full pt-0.5 pb-3">
            <el-tabs v-model="currentTab" stretch>
              <el-tab-pane :label="$t('model.attribute')" name="attribute" class="px-2">
                <el-form :model="selected" ref="selectedForm">
                  <field-attribute v-if="selected" :selected="selected" />
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-scrollbar>
        </el-aside>
      </el-container>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default { name: 'ModelCustomFields' };
</script>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleClose } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import draggable from 'vuedraggable';
import { queryModel, updateModel } from '@/api/config';
import FieldItem from './components/FieldItem.vue';
import FieldAttribute from './components/FieldAttribute.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  beanId: { type: Number },
});
const emit = defineEmits({ 'update:modelValue': null });

const { beanId, modelValue: visible } = toRefs(props);
const { t } = useI18n();
const bean = ref<any>({});
const drawingFormData = ref<any>({});
const selectedForm = ref<any>();
const drag = ref<boolean>(false);
const selected = ref<any>();
const cloned = ref<any>();
const currentTab = ref<string>('attribute');
const buttonLoading = ref<boolean>(false);
const components = ref<any[]>([
  { label: t('model.fieldType.text'), type: 'text' },
  { label: t('model.fieldType.textarea'), type: 'textarea' },
  { label: t('model.fieldType.number'), type: 'number' },
  { label: t('model.fieldType.slider'), type: 'slider' },
  { label: t('model.fieldType.date'), type: 'date' },
  { label: t('model.fieldType.color'), type: 'color' },
  { label: t('model.fieldType.radio'), type: 'radio' },
  { label: t('model.fieldType.checkbox'), type: 'checkbox' },
  { label: t('model.fieldType.select'), type: 'select' },
  { label: t('model.fieldType.multipleSelect'), type: 'multipleSelect' },
  // { label: t('model.fieldType.cascader'), type: 'cascader' },
  { label: t('model.fieldType.switch'), type: 'switch' },
  { label: t('model.fieldType.imageUpload'), type: 'imageUpload' },
  { label: t('model.fieldType.videoUpload'), type: 'videoUpload' },
  { label: t('model.fieldType.fileUpload'), type: 'fileUpload' },
  { label: t('model.fieldType.tinyEditor'), type: 'tinyEditor' },
]);
const customs = ref<any[]>([]);
watch(visible, async () => {
  if (visible.value && beanId?.value != null) {
    bean.value = await queryModel(beanId.value);
    customs.value = JSON.parse(bean.value.customs || '[]');
    if (customs.value.length > 0) {
      [selected.value] = customs.value;
    } else {
      selected.value = undefined;
    }
  }
});
const changeSelected = async (element: any) => {
  if (!selected.value) {
    selected.value = element;
    return;
  }
  selectedForm.value.validate((valid: boolean) => {
    if (valid) {
      selected.value = element;
    }
  });
};
const clone = (element: any) => {
  const cloneElement = { code: `field${new Date().getTime()}`, type: element.type, name: element.label, double: false };
  cloned.value = cloneElement;
  return cloneElement;
};
const onEnd = (evt: any) => {
  if (evt.from !== evt.to) {
    selected.value = cloned.value;
  }
};
const deleteElement = (element: any) => {
  const index = customs.value.indexOf(element);
  customs.value.splice(index, 1);
  const { length } = customs.value;
  if (length <= 0) {
    selected.value = undefined;
  } else if (index < length) {
    selected.value = customs.value[index];
  } else {
    selected.value = customs.value[length - 1];
  }
};
const handleSubmit = async () => {
  buttonLoading.value = true;
  try {
    if (customs.value.length > 0) {
      selectedForm.value.validate(async (valid: boolean) => {
        if (valid) {
          await updateModel({ ...bean.value, customs: JSON.stringify(customs.value) });
        }
      });
    } else {
      await updateModel({ ...bean.value, customs: JSON.stringify(customs.value) });
    }
    ElMessage.success(t('success'));
  } finally {
    buttonLoading.value = false;
    emit('update:modelValue', false);
  }
};
</script>

<style lang="scss" scoped>
.drag-component {
  @apply inline-block relative w-28 mt-2 mr-2 p-2 text-xs rounded-sm cursor-move bg-gray-100 border border-primary border-dashed border-opacity-0 hover:border-opacity-100 hover:text-primary;
}
.drag-mask {
  @apply absolute top-0 left-0 w-full h-full cursor-move z-10 opacity-0 bg-primary-light;
}
.drag-mask-selected {
  @apply bg-primary-light opacity-30 rounded-sm border border-primary border-dashed;
}
.drag-close {
  @apply absolute -top-1 right-0 z-10 cursor-pointer opacity-70;
}

.dialog-full {
  :deep(.el-dialog__body) {
    padding-bottom: 0;
  }
}
.right-panel {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.drawing-board {
  .sortable-ghost {
    &::before {
      content: ' ';
      @apply absolute w-full top-0 left-0 h-1 bg-warning;
    }
    .drag-mask {
      opacity: 0.1 !important;
    }
    &.drag-component {
      @apply w-full ml-0 mr-0;
    }
  }
  :deep(.el-scrollbar__view) {
    @apply h-full;
  }
}

// .sortable-drag {
//   @apply bg-primary-lighter;
// }
// .sortable-chosen {
//   border-top: 3px solid red;
// }
</style>
