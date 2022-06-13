<template>
  <div>
    <div class="app-block p-3 flex">
      <div>
        <el-avatar :size="76" class="flex justify-center items-center">
          <el-icon class="text-5xl"><Avatar /></el-icon>
        </el-avatar>
      </div>
      <div class="ml-3 space-y-1 text-gray-regular text-sm">
        <p class="text-base font-bold">{{ currentUser.username }}</p>
        <p>
          {{ $t('user.loginDate') }}: <span class="ml-1">{{ dayjs(currentUser.loginDate).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </p>
        <p>
          {{ $t('user.loginIp') }}: <span class="ml-1">{{ currentUser.loginIp }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import { currentUser } from '@/store/useCurrentUser';
</script>
