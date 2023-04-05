<script setup lang="ts">
import { toRefs, ref, markRaw } from 'vue';
import dayjs from 'dayjs';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import { queryProcessTaskList } from '@/api/system';
import defaultBpmnXml from '@/components/bpmnjs/customTranslate/defaultBpmnXml';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  instanceId: { type: String, default: null },
});
defineEmits({ 'update:modelValue': null });
const { instanceId } = toRefs(props);

const taskData = ref<any[]>([]);
const processData = ref<any[]>([]);
const loading = ref<boolean>(false);

const bpmnContainer = ref<any>();
let bpmnViewer: any;

const fetchData = async () => {
  loading.value = true;
  try {
    if (!instanceId?.value) {
      return;
    }
    const { xml, activities, tasks, processes } = await queryProcessTaskList(instanceId.value);
    taskData.value = tasks ?? [];
    processData.value = processes ?? [];
    if (!bpmnViewer) {
      bpmnViewer = markRaw(new BpmnViewer({ container: bpmnContainer.value }));
    }
    await bpmnViewer.importXML(xml ?? defaultBpmnXml('none', 'none', 'none'));
    const canvas = bpmnViewer.get('canvas');
    canvas.zoom('fit-viewport');
    activities?.forEach(({ activityId, endTime, deleteReason }: any) => {
      let color = 'highlight-curr';
      if (deleteReason) {
        color = 'highlight-reject';
      } else if (endTime) {
        color = 'highlight';
      }
      canvas.addMarker(activityId, color);
    });
  } finally {
    loading.value = false;
  }
};
const handlerOpen = async () => {
  fetchData();
};
</script>

<template>
  <el-dialog
    :title="$t('processInstance.op.task')"
    width="98%"
    :model-value="modelValue"
    @opened="() => handlerOpen()"
    @update:model-value="(event) => $emit('update:modelValue', event)"
  >
    <div ref="bpmnContainer" class="w-full"></div>
    <el-table v-loading="loading" :data="taskData">
      <!-- <el-table-column prop="id" label="ID" show-overflow-tooltip /> -->
      <el-table-column prop="name" :label="$t('processModel.name')" />
      <el-table-column prop="assignee" :label="$t('processActivity.assignee')" />
      <el-table-column property="created" :label="$t('processInstance.started')">
        <template #default="{ row }">{{ dayjs(row.created).format('YYYY-MM-DD HH:mm') }}</template>
      </el-table-column>
      <el-table-column property="endDate" :label="$t('processInstance.ended')">
        <template #default="{ row }">{{ row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD HH:mm') : undefined }}</template>
      </el-table-column>
      <el-table-column prop="duration" :label="$t('processActivity.durationInMillis')">
        <template #default="{ row }">{{ row.duration ? Math.floor(row.duration / 100 / 60 / 60) / 10 + ' H' : undefined }}</template>
      </el-table-column>
    </el-table>
    <p class="mt-4 text-lg">{{ $t('processInstance.history') }}</p>
    <el-table v-loading="loading" :data="processData">
      <!-- <el-table-column prop="id" label="ID" show-overflow-tooltip /> -->
      <el-table-column prop="assignee" :label="$t('processInstance.assignee')" />
      <el-table-column prop="status" :label="$t('processInstance.status')">
        <template #default="{ row }">
          <el-tag v-if="row.status === 'complete'" type="success" size="small">{{ $t(`processInstance.status.${row.status}`) }}</el-tag>
          <el-tag v-else-if="row.status === 'reject'" type="danger" size="small">{{ $t(`processInstance.status.${row.status}`) }}</el-tag>
          <el-tag v-else-if="row.status === 'cancel'" type="info" size="small">{{ $t(`processInstance.status.${row.status}`) }}</el-tag>
          <el-tag v-else type="warning" size="small">{{ $t(`processInstance.status.${row.status}`) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="opinion" :label="$t('processInstance.opinion')" />
      <el-table-column property="started" :label="$t('processInstance.started')">
        <template #default="{ row }">{{ dayjs(row.started).format('YYYY-MM-DD HH:mm') }}</template>
      </el-table-column>
      <el-table-column property="ended" :label="$t('processInstance.ended')">
        <template #default="{ row }">{{ row.ended ? dayjs(row.ended).format('YYYY-MM-DD HH:mm') : undefined }}</template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.highlight:not(.djs-connection) .djs-visual > :nth-child(1)) {
  fill: #b3e19d !important;
}
:deep(.highlight-curr:not(.djs-connection) .djs-visual > :nth-child(1)) {
  fill: #a0cfff !important;
}
:deep(.highlight-reject:not(.djs-connection) .djs-visual > :nth-child(1)) {
  fill: #fab6b6 !important;
}
</style>
