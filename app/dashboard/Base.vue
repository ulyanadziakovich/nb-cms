<template>
  <div class="flex h-screen min-w-[90rem] flex-col">
    <!-- Header -->
    <div class="relative z-40 flex h-14 shrink-0 items-center border-b bg-white pl-8 pr-6">
      <div class="flex w-full max-w-[18rem]">
        <NuxtLink
          :title="__('pruvious-dashboard', 'Go to start page')"
          :to="
  `/${runtimeConfig.public.pruvious.dashboardPrefix}` + (collectionLanguage !== primaryLanguage ? `?language=${collectionLanguage}` : '')
"
        >
          <HeaderLogo />
        </NuxtLink>
      </div>

      <!-- Search -->
      <div class="flex w-full max-w-md gap-2 pr-8">
        <slot name="search" />
      </div>

      <div class="ml-auto flex items-center gap-5">
        <!-- Language switcher -->
        <slot name="language-switcher" />

        <div class="flex">
          <PruviousQuickActions />

          <button
            v-if="dashboard.isCacheActive"
            v-pruvious-tooltip="{ content: __('pruvious-dashboard', 'Clear cache'), offset: [0, 13] }"
            @click="clearCache()"
            type="button"
            class="flex h-8 w-8 transition hocus:text-primary-700"
          >
            <PruviousIconEraser class="m-auto h-4 w-4" />
          </button>

          <NuxtLink
            v-pruvious-tooltip="{ content: __('pruvious-dashboard', 'My profile'), offset: [0, 13] }"
            :to="`/${runtimeConfig.public.pruvious.dashboardPrefix}/profile`"
            class="flex h-8 w-8 transition hocus:text-primary-700"
          >
            <PruviousIconUser class="m-auto h-4 w-4" />
          </NuxtLink>

          <NuxtLink
            v-pruvious-tooltip="{ content: __('pruvious-dashboard', 'Log out'), offset: [0, 13] }"
            :to="`/${runtimeConfig.public.pruvious.dashboardPrefix}/logout`"
            class="flex h-8 w-8 transition hocus:text-red-500"
          >
            <PruviousIconLogout class="m-auto h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="flex h-full flex-1">
        <div v-if="showMenu" class="scrollbar-thin h-full w-full max-w-[18rem] overflow-y-auto p-8 pr-0">
          <!-- Menu pogrupowane według stron witryny (app/config/menuGroups.ts). -->
          <ul class="flex flex-col items-start pt-0.5">
            <li v-for="group of groupedMenu.groups" :key="group.label" class="w-full">
              <button
                type="button"
                class="nb-menu-group inline-flex w-full items-center gap-2 py-1.5 text-[0.9375rem] font-medium text-gray-700"
                @click="toggleGroup(group.label)"
              >
                <span class="nb-menu-chevron" :class="{ 'nb-menu-chevron-open': isGroupOpen(group) }">›</span>
                <span class="truncate">{{ group.label }}</span>
              </button>
              <ul v-show="isGroupOpen(group)" class="nb-menu-items">
                <li v-for="item of group.items" :key="item.path" class="w-full">
                  <NuxtLink
                    :title="item.label"
                    :to="menuLink(item)"
                    class="inline-flex items-center gap-2 py-1 text-[0.875rem] text-gray-400 transition hocus:text-primary-700"
                    :class="{ 'font-medium !text-gray-700': isActive(item) }"
                  >
                    <span v-html="item.icon" class="pointer-events-none -mt-px h-4 w-4 shrink-0"></span>
                    <span class="pointer-events-none truncate">{{ item.label }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
            <li v-if="groupedMenu.rest.length" class="nb-menu-divider w-full"></li>
            <li v-for="item of groupedMenu.rest" :key="item.path" class="w-full">
              <NuxtLink
                :title="item.label"
                :to="menuLink(item)"
                class="inline-flex items-center gap-2 py-1.5 text-[0.9375rem] text-gray-400 transition hocus:text-primary-700"
                :class="{ 'font-medium !text-gray-700': isActive(item) }"
              >
                <span v-html="item.icon" class="pointer-events-none -mt-px h-4 w-4 shrink-0"></span>
                <span class="pointer-events-none truncate">{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="scrollbar-thin flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>

    <PruviousDialog />
    <PruviousDragImage />
    <PruviousMediaDirectoryPopup />
    <PruviousMediaFileInput />
    <PruviousMediaLibraryPopup />
    <PruviousMediaUploadPopup />
    <PruviousUnsavedChanges />
    <PruviousGlobals />
  </div>
</template>

<script setup>
import { computed, ref, useRoute, useRuntimeConfig, watch } from "#imports";
import { MENU_GROUPS } from "../config/menuGroups";
import { primaryLanguage } from "#pruvious";
import { dashboardHeaderLogoComponent, dashboardMiscComponent } from "#pruvious/dashboard";
import "~~/node_modules/pruvious/dist/runtime/assets/style.css";
import { useCollectionLanguage } from "~~/node_modules/pruvious/dist/runtime/composables/dashboard/collection-language";
import { usePruviousDashboard } from "~~/node_modules/pruvious/dist/runtime/composables/dashboard/dashboard";
import { pruviousToasterShow } from "~~/node_modules/pruvious/dist/runtime/composables/dashboard/toaster";
import { __, loadTranslatableStrings } from "~~/node_modules/pruvious/dist/runtime/composables/translatable-strings";
import { pruviousFetch } from "~~/node_modules/pruvious/dist/runtime/utils/fetch";
defineProps({
  showMenu: {
    type: Boolean,
    default: true
  }
});
const collectionLanguage = useCollectionLanguage();
const dashboard = usePruviousDashboard();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const queryStringLanguage = ref("");
const queryStringLanguageWhere = ref("");
const HeaderLogo = dashboardHeaderLogoComponent();
const PruviousDialog = dashboardMiscComponent.Dialog();
const PruviousDragImage = dashboardMiscComponent.DragImage();
const PruviousGlobals = dashboardMiscComponent.Globals();
const PruviousMediaDirectoryPopup = dashboardMiscComponent.MediaDirectoryPopup();
const PruviousMediaFileInput = dashboardMiscComponent.MediaFileInput();
const PruviousMediaLibraryPopup = dashboardMiscComponent.MediaLibraryPopup();
const PruviousMediaUploadPopup = dashboardMiscComponent.MediaUploadPopup();
const PruviousQuickActions = dashboardMiscComponent.QuickActions();
const PruviousUnsavedChanges = dashboardMiscComponent.UnsavedChanges();
await loadTranslatableStrings("pruvious-dashboard");
watch(
  collectionLanguage,
  () => {
    if (collectionLanguage.value !== primaryLanguage) {
      queryStringLanguage.value = `?language=${collectionLanguage.value}`;
      queryStringLanguageWhere.value = `?where=language[=][${collectionLanguage.value}]`;
    } else {
      queryStringLanguage.value = "";
      queryStringLanguageWhere.value = "";
    }
  },
  { immediate: true }
);
async function clearCache() {
  const response = await pruviousFetch("clear-cache.post");
  if (response.success) {
    pruviousToasterShow({ message: __("pruvious-dashboard", "Cache cleared successfully") });
  }
}

// --- Menu pogrupowane według stron witryny ---
function menuLink(item) {
  const col = item.collection ? dashboard.value.collections[item.collection] : null;
  return item.collection
    ? item.path + (col?.translatable ? (col.mode === "multi" ? queryStringLanguageWhere.value : queryStringLanguage.value) : "")
    : `/${runtimeConfig.public.pruvious.dashboardPrefix}/${item.path}`;
}
function isActive(item) {
  const path = item.collection ? item.path : `/${runtimeConfig.public.pruvious.dashboardPrefix}/${item.path}`;
  return route.fullPath === path || route.fullPath.startsWith(`${path}?`) || route.fullPath.startsWith(`${path}/`);
}
const groupedMenu = computed(() => {
  const byCollection = new Map(dashboard.value.menu.filter((m) => m.collection).map((m) => [m.collection, m]));
  const used = new Set();
  const groups = MENU_GROUPS.map((group) => ({
    label: group.label,
    items: group.items
      .filter((it) => byCollection.has(it.collection))
      .map((it) => {
        used.add(it.collection);
        return { ...byCollection.get(it.collection), label: it.label };
      }),
  })).filter((group) => group.items.length);
  const rest = dashboard.value.menu.filter((m) => !m.collection || !used.has(m.collection));
  return { groups, rest };
});
// Akordeon: otwarta jest tylko jedna grupa — ta, w której jest otwarta strona,
// albo ostatnio kliknięta. Przejście gdzie indziej zwija pozostałe.
const openGroup = ref("");
function activeGroupLabel() {
  return groupedMenu.value.groups.find((group) => group.items.some(isActive))?.label ?? "";
}
watch(
  () => route.fullPath,
  () => {
    openGroup.value = activeGroupLabel();
  },
  { immediate: true },
);
function isGroupOpen(group) {
  return openGroup.value === group.label;
}
function toggleGroup(label) {
  openGroup.value = openGroup.value === label ? "" : label;
}
</script>

<style>
@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:400;src:url(../../assets/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:400;src:url(../../assets/KFOkCnqEu92Fr1Mu51xIIzIXKMny.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:normal;font-weight:500;src:url(../../assets/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Roboto;font-style:italic;font-weight:500;src:url(../../assets/KFOjCnqEu92Fr1Mu51S7ACc6CsTYl4BO.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}
</style>

<style scoped>
.nb-menu-group {
  cursor: pointer;
  text-align: left;
}

.nb-menu-chevron {
  display: inline-block;
  width: 1rem;
  color: #9ca3af;
  transition: transform 0.15s;
}

.nb-menu-chevron-open {
  transform: rotate(90deg);
}

.nb-menu-items {
  margin: 0 0 0.35rem 0.6rem;
  padding-left: 0.75rem;
  border-left: 1px solid #e5e7eb;
}

.nb-menu-divider {
  margin: 0.75rem 0;
  border-top: 1px solid #e5e7eb;
}
</style>
