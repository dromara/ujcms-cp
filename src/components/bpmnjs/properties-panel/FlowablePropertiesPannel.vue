<script setup lang="ts">
import { ref, watch, toRefs, PropType } from 'vue';
import { User, Setting } from '@element-plus/icons-vue';
import LabelTip from '@/components/LabelTip.vue';
import { is } from 'bpmn-js/lib/util/ModelUtil';

const props = defineProps({ modeler: { type: Object, default: null }, queryRoles: { type: Function as PropType<() => Promise<any>>, required: true } });
const { modeler } = toRefs(props);
const element = ref<any>();
let modeling: any;
let canvas: any;
let selection: any;

const propertyName = ref<string>();
const propertyId = ref<string>();
const propertyRoleIds = ref<number[]>();

const roleList = ref<any[]>([]);

const changeName = (name: string) => {
  modeling.updateProperties(selection, { name });
};
const changeId = (id: string) => {
  modeling.updateProperties(selection, { id });
};
const changeRoles = (roleIds: number[]) => {
  modeling.updateProperties(selection, { candidateGroups: roleIds.join(',') });
};

const fetchRoleList = async () => {
  roleList.value = await props.queryRoles();
};

watch(
  () => modeler.value,
  async () => {
    if (modeler.value != null) {
      fetchRoleList();
      canvas = modeler.value.get('canvas');
      modeling = modeler.value.get('modeling');
      modeler.value.on('selection.changed', (event: any) => {
        const { newSelection = [] } = event;
        selection = newSelection[0] ?? canvas.getRootElement();
        element.value = selection;
        if (selection.businessObject) {
          propertyName.value = selection.businessObject.name;
          propertyId.value = selection.businessObject.id;
          propertyRoleIds.value = selection.businessObject.candidateGroups?.split(',').map((item: string) => Number(item));
        }
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <el-collapse model-value="1">
    <el-collapse-item name="1">
      <template #title>
        <el-icon class="text-base"><Setting /></el-icon><span class="text-sm font-bold ml-1">{{ $t('flowable.groups.normal') }}</span>
      </template>
      <el-form label-width="96px">
        <el-form-item>
          <template #label><label-tip message="flowable.properties.name" /></template>
          <el-input v-model="propertyName" :disabled="!is(element, 'bpmn:UserTask')" @input="changeName" />
        </el-form-item>
        <el-form-item class="mb-0">
          <template #label><label-tip message="flowable.properties.id" /></template>
          <el-input v-model="propertyId" disabled @input="changeId" />
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item v-if="is(element, 'bpmn:UserTask')" name="2">
      <template #title>
        <el-icon class="text-base"><User /></el-icon><span class="text-sm font-bold ml-1">{{ $t('flowable.groups.assignment') }}</span>
      </template>
      <el-form label-width="96px">
        <el-form-item>
          <template #label><label-tip message="flowable.properties.candidateGroups" /></template>
          <el-select v-model="propertyRoleIds" multiple class="w-full" @change="changeRoles">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <!-- <el-input v-model="candidateGroups" @input="changeCandidateGroups" /> -->
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>
