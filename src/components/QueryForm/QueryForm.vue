<script setup lang="ts">
import { useSlots, provide, computed, ref, toRefs } from 'vue';
import { Plus, Minus, Search, Refresh } from '@element-plus/icons-vue';
import QueryInput from './QueryInput.vue';

const props = defineProps({ params: { type: Object, required: true } });
const { params } = toRefs(props);
const slots = useSlots();
provide('params', params);
defineEmits({
  search: null,
  reset: null,
});

const data = ref<any[]>([]);
const inputs = computed(() => slots.default?.() ?? []);
data.value = inputs.value.map((item) => ({ label: item.props?.label, name: item.props?.name }));

const [first] = data.value;
const names = ref<string[]>([first.name]);
const remains = computed(() => data.value.filter((it) => !names.value.includes(it.name)));
const clearParams = () => {
  Object.keys(params.value).forEach((key) => {
    if (!names.value.includes(key) && names.value.findIndex((item) => item.split(',').includes(key)) === -1) {
      delete params.value[key];
    }
  });
};
const handelRow = (index: number) => {
  if (index === 0) {
    const [item] = remains.value;
    names.value[names.value.length] = item.name;
  } else {
    names.value.splice(index, 1);
    clearParams();
  }
};
</script>

<template>
  <form class="flex">
    <div class="space-y-1">
      <div v-for="(name, index) in names" :key="name" class="flex">
        <el-button :icon="index == 0 ? Plus : Minus" :disabled="index <= 0 && remains.length <= 0" circle @click="() => handelRow(index)"></el-button>
        <el-select v-model="names[index]" class="w-36" @change="() => clearParams()">
          <el-option v-for="item in data.filter((it) => it.name === names[index] || remains.includes(it))" :key="item.name" :label="item.label" :value="item.name"></el-option>
        </el-select>
        <query-input :inputs="inputs" :name="names[index]"></query-input>
      </div>
    </div>
    <div>
      <el-button-group class="ml-2">
        <el-button native-type="submit" :icon="Search" @click.prevent="() => $emit('search')">{{ $t('search') }}</el-button>
        <el-button :icon="Refresh" @click="() => $emit('reset')">{{ $t('reset') }}</el-button>
      </el-button-group>
    </div>
  </form>
</template>
