<template>
  <form class="flex">
    <div class="space-y-1">
      <div v-for="(name, index) in names" :key="name">
        <el-button :icon="index == 0 ? 'el-icon-plus' : 'el-icon-minus'" @click="handelRow(index)" :disabled="index <= 0 && remains.length <= 0" size="small" circle></el-button>
        <el-select v-model="names[index]" @change="clearParams()" size="small" class="w-36">
          <el-option v-for="item in data.filter((it) => it.name === names[index] || remains.includes(it))" :key="item.name" :label="item.label" :value="item.name"></el-option>
        </el-select>
        <query-input :inputs="inputs" :name="names[index]"></query-input>
      </div>
    </div>
    <div>
      <el-button-group class="ml-2">
        <el-button native-type="submit" icon="el-icon-search" size="small" @click.prevent="$emit('search')">{{ $t('search') }}</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="$emit('reset')">{{ $t('reset') }}</el-button>
      </el-button-group>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import QueryInput from './QueryInput.vue';

interface Item {
  label: string;
  name: string;
  type: 'string' | 'date' | 'datetime' | 'number';
  options: Array<{ label: string; value: string | number }>;
}

export default defineComponent({
  name: 'QueryForm',
  components: { QueryInput },
  props: { params: { type: Object, required: true } },
  emits: {
    search: null,
    reset: null,
  },
  provide() {
    return {
      params: this.params,
    };
  },
  setup(props, { slots }) {
    const { params } = toRefs(props);
    const data = ref<any[]>([]);
    const inputs = ref<any[]>([]);
    inputs.value = slots.default?.() ?? [];
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
    return { data, names, remains, inputs, clearParams, handelRow };
  },
});
</script>
