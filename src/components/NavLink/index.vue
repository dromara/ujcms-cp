<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link v-else v-slot="{ isActive, href, navigate }" v-bind="$props" custom>
    <a v-bind="$attrs" :href="href" :class="isActive ? activeClass : inactiveClass" @click="navigate">
      <slot />
    </a>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
  name: 'AppLink',
  // todo
  props: {
    // add @ts-ignore if using TypeScript
    ...RouterLink.props,
    inactiveClass: String,
  },
  computed: {
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http');
    },
  },
  mounted() {
    // console.log('test', ...RouterLink.props);
  },
});
</script>
