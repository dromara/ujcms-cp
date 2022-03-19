<template>
  <div class="h-12 flex justify-between items-center overflow-hidden shadow bg-white">
    <div class="h-full flex items-center">
      <div class="h-full flex items-center align-middle px-4 cursor-pointer hover:bg-gray-100" @click="toggleSidebar">
        <el-icon :size="18"><component :is="appState.sidebar ? Fold : Expand"></component></el-icon>
      </div>
      <breadcrumb class="inline-block" />
    </div>
    <div class="h-full">
      <div class="h-full inline-block" v-if="site">
        <el-link class="h-full px-3 hover:bg-gray-100" :href="site?.url" :underline="false" :title="$t('siteHome')" target="_blank">
          <el-icon :size="16" class="align-text-top"><HomeFilled /></el-icon>
        </el-link>
      </div>
      <el-dropdown class="h-full" v-if="site">
        <div class="h-full flex items-center px-3 hover:bg-gray-100">
          {{ site?.name }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in siteList" :key="item.id" @click="changeSiteId(item.id)" :disabled="site?.id === item.id">
              <span :style="{ 'margin-left': item.depth * 16 + 'px' }">{{ item.name }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown class="h-full">
        <div class="h-full flex items-center px-3 hover:bg-gray-100">
          {{ languages[locale as string || 'zh-cn'] }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(name, lang) in languages" :key="lang" :disabled="locale === lang" @click="changeLocale(lang)">{{ name }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown class="h-full">
        <div class="h-full flex items-center px-3 hover:bg-gray-100">
          <el-icon><User /></el-icon>
          <span class="ml-1">{{ currentUser.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!--
            <router-link to="/">
              <el-dropdown-item>Home</el-dropdown-item>
            </router-link>
             -->
            <el-dropdown-item @click="passwordFormVisible = true" :disabled="perm('password:update')">{{ $t('changePassword') }}</el-dropdown-item>
            <el-dropdown-item @click="machineFormVisible = true" v-if="hasPermission('machine:code') && isInclude('machine:code')">
              {{ $t('menu.personal.machine.code') }}
            </el-dropdown-item>
            <el-dropdown-item @click="machineLicenseVisible = true" v-if="hasPermission('machine:license') && isInclude('machine:license')">
              {{ $t('menu.personal.machine.license') }}
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout()" :icon="SwitchButton">{{ $t('logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <password-form v-model="passwordFormVisible"></password-form>
    <machine-code-form v-if="hasPermission('machine:code') && isInclude('machine:code')" v-model="machineFormVisible"></machine-code-form>
    <machine-license-form v-if="hasPermission('machine:license') && isInclude('machine:license')" v-model="machineLicenseVisible"></machine-license-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Fold, Expand, HomeFilled, User, SwitchButton } from '@element-plus/icons-vue';
import { setCookieLocale, getSessionSiteId, setSessionSiteId } from '@/utils/common';
import { languages } from '@/i18n';
import { toTree, flatTree } from '@/utils/tree';
import { querySiteList } from '@/api/system';
import { currentUser, perm, hasPermission, isInclude, logout } from '@/store/useCurrentUser';
import { appState, toggleSidebar } from '@/store/useAppState';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import PasswordForm from '@/views/personal/PasswordForm.vue';
import MachineCodeForm from '@/views/personal/MachineCodeForm.vue';
import MachineLicenseForm from '@/views/personal/MachineLicenseForm.vue';

const { locale } = useI18n({ useScope: 'global' });

const siteId = ref<number | null>(getSessionSiteId());
const siteList = ref<any[]>([]);
const site = computed(() => siteList.value.find((item) => item.id === siteId.value));
const fetchSiteList = async () => {
  siteList.value = flatTree(toTree(await querySiteList()));
  if (siteId.value == null) {
    siteId.value = siteList.value[0]?.id;
  }
};
const changeSiteId = (id: number) => {
  setSessionSiteId(id);
  siteId.value = id;
  window.location.reload();
};
onMounted(() => {
  fetchSiteList();
});

const changeLocale = (lang: string) => {
  locale.value = lang;
  setCookieLocale(lang);
};
const handleLogout = () => {
  logout();
  // router.push(`/login?redirect=${route.fullPath}`);
  window.location.reload();
};

const passwordFormVisible = ref<boolean>(false);
const machineFormVisible = ref<boolean>(false);
const machineLicenseVisible = ref<boolean>(false);
</script>
