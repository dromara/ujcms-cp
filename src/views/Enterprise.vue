<template>
  <div>
    <div class="app-block p-3 flex">
      <el-alert type="warning" :closable="false" :show-icon="true">
        <template #title><span v-html="$t('error.enterprise')"></span></template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
