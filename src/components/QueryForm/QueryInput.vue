<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue';

export default defineComponent({
  name: 'QueryInput',
  props: { inputs: { type: Array, required: true }, name: { type: String, required: true } },
  setup(props) {
    const { inputs, name } = toRefs(props);
    const input = computed(() => inputs.value.find((item: any) => item.props.name === name.value));
    return { input };
  },
  render() {
    return this.input;
  },
});
</script>
