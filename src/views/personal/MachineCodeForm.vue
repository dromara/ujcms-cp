<template>
  <el-dialog :title="$t('menu.personal.machine.code')" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :width="768">
    <!-- <pre><code class="whitespace-pre-wrap">{{ machineCode }}</code></pre> -->
    <el-input :model-value="machineCode" :rows="24" :readonly="true" type="textarea" />
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { getMachineCode } from '@/api/personal';

defineProps({ modelValue: { type: Boolean, required: true } });
const machineCode = ref<string>();
onMounted(async () => {
  machineCode.value = await getMachineCode();
});
</script>
