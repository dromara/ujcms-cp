<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="!unsaved"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @opened="!isEdit && focus?.focus()"
    :width="large ? '98%' : '683px'"
    :top="large ? '16px' : undefined"
  >
    <div>
      <el-button v-if="isEdit && addable" :disabled="perm(`${perms}:create`)" type="primary" :icon="Plus" @click="handleAdd">{{ $t('add') }}</el-button>
      <el-popconfirm v-if="isEdit" :title="$t('confirmDelete')" @confirm="handleDelete">
        <template #reference>
          <el-button :loading="buttonLoading" :disabled="disableDelete?.(bean) || perm(`${perms}:delete`)" :icon="Delete">{{ $t('delete') }}</el-button>
        </template>
      </el-popconfirm>
      <el-button v-if="isEdit" @click="handlePrev" :disabled="!hasPrev">{{ $t('form.prev') }}</el-button>
      <el-button v-if="isEdit" @click="handleNext" :disabled="!hasNext">{{ $t('form.next') }}</el-button>
      <el-button @click="handleCancel" type="primary">{{ $t('back') }}</el-button>
      <el-tooltip :content="$t('form.continuous')" placement="top">
        <el-switch v-model="continuous" size="small" class="ml-2"></el-switch>
      </el-tooltip>
      <el-tag v-if="unsaved" type="danger" class="ml-2">{{ $t('form.unsaved') }}</el-tag>
      <slot name="header" :values="values" :bean="bean" :isEdit="isEdit"></slot>
    </div>
    <el-form
      :class="['mt-5', 'pr-5']"
      ref="form"
      v-loading="loading"
      :model="values"
      :disabled="!editable"
      :label-width="labelWidth ?? '150px'"
      :label-position="labelPosition ?? 'right'"
    >
      <slot :values="values" :bean="bean" :isEdit="isEdit"></slot>
      <div v-if="editable">
        <el-button :disabled="perm(isEdit ? `${perms}:update` : `${perms}:create`)" :loading="buttonLoading" @click.prevent="handleSubmit" type="primary" native-type="submit">
          {{ $t('submit') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import { perm } from '@/store/useCurrentUser';

const CONTINUOUS_SETTINGS = 'ujcms_continuous_settings';
function fetchContinuous(): Record<string, boolean> {
  const settings = localStorage.getItem(CONTINUOUS_SETTINGS);
  return settings ? JSON.parse(settings) : {};
}
function storeContinuous(settings: Record<string, boolean>) {
  localStorage.setItem(CONTINUOUS_SETTINGS, JSON.stringify(settings));
}
function getContinuous(name: string) {
  const settings = fetchContinuous();
  return settings[name] ?? false;
}
function setContinuous(name: string, continuous: boolean) {
  const settings = fetchContinuous();
  settings[name] = continuous;
  storeContinuous(settings);
}

export default defineComponent({
  name: 'DialogForm',
  props: {
    modelValue: { type: Boolean, required: true },
    name: { type: String, required: true },
    beanId: { required: true },
    beanIds: { type: Array, required: true },
    initValues: { type: Function as PropType<(bean?: any) => any>, required: true },
    toValues: { type: Function as PropType<(bean: any) => any>, required: true },
    queryBean: { type: Function as PropType<(id: any) => Promise<any>>, required: true },
    createBean: { type: Function as PropType<(bean: any) => Promise<any>>, required: true },
    updateBean: { type: Function as PropType<(bean: any) => Promise<any>>, required: true },
    deleteBean: { type: Function as PropType<(ids: any[]) => Promise<any>>, required: true },
    disableDelete: { type: Function as PropType<(bean: any) => boolean> },
    addable: { type: Boolean, default: true },
    editable: { type: Boolean, default: true },
    perms: String,
    focus: Object,
    large: Boolean,
    labelPosition: String,
    labelWidth: String,
  },
  emits: {
    'update:modelValue': null,
    finished: null,
    beanChange: null,
    beforeSubmit: null,
  },
  setup(props, { emit }) {
    const { name, beanId, beanIds, focus, modelValue: visible } = toRefs(props);
    const { t } = useI18n();
    const loading = ref<boolean>(false);
    const buttonLoading = ref<boolean>(false);
    const continuous = ref<boolean>(getContinuous(name.value));
    const reseted = ref<boolean>(false);
    const unsaved = ref<boolean>(false);
    const form = ref<any>();
    const values = ref<any>(props.initValues());
    const bean = ref<any>({});
    const id = ref<any>();
    const ids = ref<Array<any>>([]);
    const isEdit = computed(() => id.value != null);
    const title = computed(() => `${name.value} - ${isEdit.value ? `${t('edit')} (ID: ${id.value})` : `${t('add')}`}`);
    const idChanged = async () => {
      loading.value = true;
      unsaved.value = false;
      reseted.value = true;
      try {
        bean.value = id.value != null ? await props.queryBean(id.value) : {};
        values.value = id.value != null ? props.toValues(bean.value) : props.initValues(values.value);
        emit('beanChange', bean.value);
        form.value.resetFields();
      } finally {
        loading.value = false;
      }
    };
    watch(visible, () => {
      if (visible.value) {
        ids.value = beanIds.value;
        if (id.value !== beanId.value) {
          id.value = beanId.value;
        } else if (id.value != null) {
          idChanged();
        }
        if (id.value == null) {
          reseted.value = true;
          values.value = props.initValues();
        }
      }
    });
    watch(id, () => {
      idChanged();
    });
    watch(
      // 监听对象必须使用 lodash 的深度拷贝，才能在监听里面获取旧值和新值。
      // 参考文档：https://v3.vuejs.org/guide/reactivity-computed-watchers.html#watching-reactive-objects
      () => _.cloneDeep(values.value),
      (curr, prev) => {
        // 重置触发的bean改动，不标记为未保存。
        if (reseted.value) {
          reseted.value = false;
        } else if (JSON.stringify(curr) !== JSON.stringify(prev)) {
          // 自定义字段改变页面时，会改变values.customs，加上字段的值，但这些值为undefined。
          // 这会触发watch监听，但json值不变。如json值不变，则不修改unsaved状态。
          unsaved.value = true;
        }
      },
      { deep: true },
    );
    watch(continuous, () => setContinuous(name.value, continuous.value));
    const index = computed(() => ids.value.indexOf(id.value));
    const hasPrev = computed(() => index.value > 0);
    const hasNext = computed(() => index.value < ids.value.length - 1);
    const handlePrev = () => {
      if (hasPrev.value) {
        id.value = ids.value[index.value - 1];
      }
    };
    const handleNext = () => {
      if (hasNext.value) {
        id.value = ids.value[index.value + 1];
      }
    };
    const handleAdd = () => {
      // eslint-disable-next-line no-unused-expressions
      focus?.value?.focus?.();
      id.value = undefined;
    };
    const handleCancel = () => {
      emit('update:modelValue', false);
    };
    const handleSubmit = () => {
      form.value.validate(async (valid: boolean) => {
        if (!valid) return;
        buttonLoading.value = true;
        try {
          emit('beforeSubmit', values.value);
          if (isEdit.value) {
            await props.updateBean(values.value);
            unsaved.value = false;
          } else {
            await props.createBean(values.value);
            // eslint-disable-next-line no-unused-expressions
            focus?.value?.focus?.();
            unsaved.value = false;
            reseted.value = true;
            values.value = props.initValues(values.value);
            form.value.resetFields();
          }
          ElMessage.success(t('success'));
          if (!continuous.value) emit('update:modelValue', false);
          emit('finished', bean.value);
        } finally {
          buttonLoading.value = false;
        }
      });
    };
    const handleDelete = async () => {
      buttonLoading.value = true;
      try {
        await props.deleteBean([id.value]);
        if (!continuous.value) emit('update:modelValue', false);
        if (hasNext.value) {
          handleNext();
          ids.value.splice(index.value - 1, 1);
        } else if (hasPrev.value) {
          handlePrev();
          ids.value.splice(index.value + 1, 1);
        } else {
          emit('update:modelValue', false);
        }
        ElMessage.success(t('success'));
        emit('finished');
      } finally {
        buttonLoading.value = false;
      }
    };
    const setUnsaved = (bool: boolean) => {
      unsaved.value = bool;
    };
    return {
      perm,
      handleAdd,
      handleDelete,
      handleSubmit,
      handleCancel,
      handlePrev,
      handleNext,
      hasPrev,
      hasNext,
      loading,
      buttonLoading,
      continuous,
      unsaved,
      isEdit,
      form,
      values,
      bean,
      id,
      title,
      setUnsaved,
      Plus,
      Delete,
    };
  },
});
</script>
