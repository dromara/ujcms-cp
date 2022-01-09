<template>
  <div
    v-if="isExternalLink"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-bind="$attrs"
  />
  <svg v-else :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue';
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '@/utils/validate';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { iconClass, className } = toRefs(props);

    const isExternalLink = computed(() => isExternal(iconClass.value));

    const iconName = computed(() => `#icon-${iconClass.value}`);

    const svgClass = computed(() => {
      if (className.value) {
        return `svg-icon ${className.value}`;
      }
      return 'svg-icon';
    });

    const styleExternalIcon = computed(() => ({
      mask: `url(${iconClass.value}) no-repeat 50% 50%`,
      '-webkit-mask': `url(${iconClass.value}) no-repeat 50% 50%`,
    }));

    return {
      isExternalLink, iconName, svgClass, styleExternalIcon,
    };
  },
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
