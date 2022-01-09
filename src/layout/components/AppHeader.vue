<template>
  <div class="h-12 flex justify-between items-center overflow-hidden shadow bg-white">
    <div class="h-full flex items-center">
      <div class="h-full flex items-center align-middle px-4 cursor-pointer hover:bg-gray-100" @click="toggleSidebar">
        <i class="text-xl" :class="appState.sidebar ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
      </div>
      <breadcrumb class="inline-block" />
    </div>
    <div class="h-full">
      <div class="h-full inline-block" v-if="site">
        <el-link class="h-full px-3 hover:bg-gray-100" :href="site?.url" :underline="false" :title="$t('siteHome')" target="_blank"><i class="el-icon-s-home text-lg"></i></el-link>
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
        <!-- <span class="el-dropdown-link"> Dropdown List<i class="el-icon-arrow-down el-icon--right"></i> </span> -->
        <div class="h-full flex items-center px-3 hover:bg-gray-100">
          {{ getLangage(locale) }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :disabled="locale === 'zh-cn'" @click="changeLocale('zh-cn')">{{ getLangage('zh-cn') }}</el-dropdown-item>
            <el-dropdown-item :disabled="locale === 'en'" @click="changeLocale('en')">{{ getLangage('en') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown class="h-full">
        <div class="h-full flex items-center px-3 hover:bg-gray-100">
          <i class="el-icon-user"></i>
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
            <el-dropdown-item divided @click="handleLogout()" icon="el-icon-switch-button">{{ $t('logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <password-form v-model="passwordFormVisible"></password-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { setCookieLocale, getSessionSiteId, setSessionSiteId } from '@/utils/common';
import { toTree, flatTree } from '@/utils/tree';
import { querySiteList } from '@/api/system';
import { currentUser, perm, logout } from '@/store/useCurrentUser';
import { appState, toggleSidebar } from '@/store/useAppState';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import PasswordForm from '@/views/personal/PasswordForm.vue';

export default defineComponent({
  name: 'AppHeader',
  components: {
    Breadcrumb,
    PasswordForm,
  },
  setup() {
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

    const getLangage = (lang: string) => {
      if (lang === 'zh-cn') return '中文';
      if (lang === 'en') return 'English';
      return lang;
    };
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

    return {
      appState,
      currentUser,
      perm,
      toggleSidebar,
      handleLogout,
      getLangage,
      changeLocale,
      changeSiteId,
      locale,
      siteList,
      siteId,
      site,
      passwordFormVisible,
    };
  },
});
</script>
