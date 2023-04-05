<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Fold, Expand, HomeFilled, User, SwitchButton } from '@element-plus/icons-vue';
import { setCookieLocale, getSessionSiteId, setSessionSiteId } from '@/utils/common';
import { languages } from '@/i18n';
import { queryCurrentSiteList } from '@/api/login';
import { currentUser, perm, hasPermission, isInclude, logout } from '@/store/useCurrentUser';
import { appState, toggleSidebar } from '@/store/useAppState';
import BreadCrumb from '@/components/BreadCrumb/index.vue';
import PasswordForm from '@/views/personal/PasswordForm.vue';
import MachineCode from '@/views/personal/MachineCode.vue';
import MachineLicense from '@/views/personal/MachineLicense.vue';
import HomepageEnvironment from '@/views/personal/HomepageEnvironment.vue';
import HomepageGeneratedKey from '@/views/personal/HomepageGeneratedKey.vue';

const { locale } = useI18n({ useScope: 'global' });

const siteList = ref<any[]>([]);
const site = ref<any>({});
const fetchSiteList = async () => {
  siteList.value = await queryCurrentSiteList();
  site.value = siteList.value.find((item) => item.id === getSessionSiteId()) ?? siteList.value[0];
};
const changeSiteId = (id: number) => {
  setSessionSiteId(id);
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
const machineCodeVisible = ref<boolean>(false);
const machineLicenseVisible = ref<boolean>(false);
const homepageEnvironmentVisible = ref<boolean>(false);
const homepageGeneratedKeyVisible = ref<boolean>(false);
</script>

<template>
  <div class="h-12 flex justify-between items-center overflow-hidden shadow bg-white">
    <div class="h-full flex items-center">
      <div class="h-full flex items-center align-middle px-4 cursor-pointer hover:bg-gray-100" @click="toggleSidebar">
        <el-icon :size="18"><component :is="appState.sidebar ? Fold : Expand"></component></el-icon>
      </div>
      <bread-crumb class="inline-block" />
    </div>
    <div class="h-full">
      <div v-if="site" class="h-full inline-block">
        <el-link class="h-full px-3 hover:bg-gray-100" :href="site?.url" :underline="false" :title="$t('siteHome')" target="_blank">
          <el-icon :size="16" class="align-text-top"><HomeFilled /></el-icon>
        </el-link>
      </div>
      <el-dropdown v-if="site" class="h-full">
        <div class="h-full flex items-center px-3 hover:bg-gray-100">
          {{ site?.name }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in siteList" :key="item.id" :disabled="site?.id === item.id" @click="() => changeSiteId(item.id)">
              <span :style="{ 'margin-left': item.depth * 16 + 'px' }">{{ item.name }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown class="h-full">
        <div class="h-full flex items-center px-3 hover:bg-gray-100">
          {{ languages[(locale as string) || 'zh-cn'] }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(name, lang) in languages" :key="lang" :disabled="locale === lang" @click="() => changeLocale(lang)">{{ name }}</el-dropdown-item>
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
            <el-dropdown-item :disabled="perm('password:update')" @click="() => (passwordFormVisible = true)">{{ $t('changePassword') }}</el-dropdown-item>
            <el-dropdown-item divided :disabled="perm('homepage:environment')" @click="() => (homepageEnvironmentVisible = true)">
              {{ $t('menu.personal.homepage.environment') }}
            </el-dropdown-item>
            <el-dropdown-item :disabled="perm('homepage:generatedKey')" @click="() => (homepageGeneratedKeyVisible = true)">
              {{ $t('menu.personal.homepage.generatedKey') }}
            </el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('machine:code') && isInclude('machine:code')" divided @click="() => (machineCodeVisible = true)">
              {{ $t('menu.personal.machine.code') }}
            </el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('machine:license') && isInclude('machine:license')" @click="() => (machineLicenseVisible = true)">
              {{ $t('menu.personal.machine.license') }}
            </el-dropdown-item>
            <el-dropdown-item divided :icon="SwitchButton" @click="() => handleLogout()">{{ $t('logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <password-form v-model="passwordFormVisible" />
    <homepage-environment v-if="hasPermission('homepage:environment')" v-model="homepageEnvironmentVisible"></homepage-environment>
    <homepage-generated-key v-if="hasPermission('homepage:generatedKey')" v-model="homepageGeneratedKeyVisible"></homepage-generated-key>
    <machine-code v-if="hasPermission('machine:code') && isInclude('machine:code')" v-model="machineCodeVisible"></machine-code>
    <machine-license v-if="hasPermission('machine:license') && isInclude('machine:license')" v-model="machineLicenseVisible"></machine-license>
  </div>
</template>
