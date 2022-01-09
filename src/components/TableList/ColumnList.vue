<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { ColumnState, getColumnSettings, setColumnOrigins } from './useColumns';

export default defineComponent({
  name: 'ColumnList',
  props: { name: { type: String, required: true } },
  setup(props, { slots }) {
    const { name } = toRefs(props);
    const { t } = useI18n();
    const slotColumns = slots.default?.() ?? [];
    // 获取栏目名称
    const getColumnTitle = (columnProps: any) => {
      // 如果是checkbox列，则名称为“选择框”
      if (columnProps?.type === 'selection') return t('table.selection');
      return columnProps?.label;
    };
    // 获取el-table-column的名称、是否显示
    const origins: ColumnState[] = slotColumns.map((column) => ({ title: getColumnTitle(column.props), display: column.props?.display !== 'none' }));
    setColumnOrigins(name.value, origins);

    const settings = getColumnSettings(name.value);
    const columns = computed(() =>
      slotColumns
        .filter((column) => {
          const matched = settings.value.find((item) => getColumnTitle(column.props) === item.title);
          return !matched || matched.display;
        })
        .map((column) => ({ ...column, key: getColumnTitle(column.props) }))
        .sort((a, b) => {
          let indexA = settings.value.findIndex((item) => item.title === getColumnTitle(a));
          if (indexA < 0) indexA = slotColumns.findIndex((item) => getColumnTitle(item) === getColumnTitle(a));
          let indexB = settings.value.findIndex((item) => item.title === getColumnTitle(b));
          if (indexB < 0) indexB = slotColumns.findIndex((item) => getColumnTitle(item) === getColumnTitle(b));
          return indexA - indexB;
        }),
    );
    return { columns };
  },
  render() {
    return this.columns;
  },
});
</script>
