<!--
  Kopia komponentu Pruvious (MultiCollectionsOverview.vue, pruvious 3.16.1) z dodanym
  przeciąganiem wierszy w zakładkach, które mają pole „order” (Kolejność).
  Podpięta w nuxt.config.ts: pruvious.dashboard.baseComponents.misc.MultiCollectionsOverview.
  Zmiany względem oryginału są oznaczone komentarzem „NB:”.
-->
<template>
  <PruviousBase>
    <template #search>
      <PruviousSearchRecords v-if="collection.search" :language="collection.translatable ? language : void 0" />
    </template>

    <template v-if="collection.translatable && supportedLanguages.length > 1" #language-switcher>
      <component
        v-pruvious-tooltip="{
  content: __('pruvious-dashboard', 'Language'),
  offset: [0, 9]
}"
        :is="SelectField"
        :modelValue="language"
        :options="{
  choices: languageChoices
}"
        @update:modelValue="changeLanguage($event)"
        class="!w-32"
      />
    </template>

    <div class="flex min-h-full flex-col p-8" :class="{ 'h-full': !table.data.value.length }">
      <div class="flex items-center justify-between gap-8">
        <div class="flex items-center gap-2 overflow-hidden pr-1">
          <h1 class="truncate text-xl">{{ title }}</h1>

          <button
            v-if="filter.isActive.value"
            v-pruvious-tooltip="__('pruvious-dashboard', 'Clear filters')"
            @click="clearFilter()"
            type="button"
            class="button button-white button-square-xs"
          >
            <PruviousIconFilterOff />
          </button>
        </div>

        <div class="flex gap-2">
          <button
            v-if="canDeleteMany && table.data.value.length"
            v-pruvious-tooltip="
  isSelecting ? __('pruvious-dashboard', 'Disable selection') : __('pruvious-dashboard', 'Enable selection')
"
            @click="toggleSelecting()"
            type="button"
            class="button button-white button-square"
            :class="{
  '!border-primary-700 !text-primary-700': isSelecting
}"
          >
            <PruviousIconCheckbox />
          </button>

          <button
            v-pruvious-tooltip="__('pruvious-dashboard', 'Edit columns')"
            @click="tableColumnsPopupVisible = true"
            type="button"
            class="button button-white button-square"
            :class="{
  '!border-primary-700 !text-primary-700': !table.hasDefaultColumns.value
}"
          >
            <PruviousIconLayoutColumns />
          </button>

          <button
            v-pruvious-tooltip="
  filter.isActive.value ? __('pruvious-dashboard', 'Edit filters') : __('pruvious-dashboard', 'Filter $items', { items: collection.label.record.plural })
"
            @click="filterPopupVisible = true"
            type="button"
            class="button button-white button-square"
            :class="{
  '!border-primary-700 !text-primary-700': filter.isActive.value
}"
          >
            <PruviousIconFilter />
          </button>

          <button
            v-if="selection.count.value"
            v-pruvious-tooltip="{
  content: clickConfirmation?.id === 'delete-records' ? __('pruvious-dashboard', 'Confirm to !!delete!!') : __('pruvious-dashboard', 'Delete'),
  showOnCreate: clickConfirmation?.id === 'delete-records'
}"
            @click="deleteSelectedRecords"
            type="button"
            class="button"
            :class="{
  'button-red border border-red-700': clickConfirmation?.id === 'delete-records',
  'button-white-red': clickConfirmation?.id !== 'delete-records'
}"
          >
            <span>
              {{
                __("pruvious-dashboard", "Delete $count $items", {
  count: selection.count.value,
  items: selection.currentType.value
})
              }}
            </span>
          </button>

          <NuxtLink
            v-if="canCreate"
            :to="`${collection.name}/create` + (language === primaryLanguage ? '' : '?language=' + language)"
            class="button"
          >
            <span>
              {{
                __("pruvious-dashboard", "Add $item", {
  item: __("pruvious-dashboard", collection.label.record.singular)
})
              }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <DevOnly>
        <PruviousDump class="mt-8">
          <div>Select: {{ filter.selectOption.value }}</div>
          <div>Where: {{ filter.whereOption.value }}</div>
          <div>Search: {{ filter.searchOption.value }}</div>
          <div>Order: {{ filter.orderOption.value }}</div>
          <div>Per page: {{ filter.perPageOption.value }}</div>
          <div>Current page: {{ filter.pageOption.value }} ({{ table.currentPage.value }})</div>
          <div>Last page: {{ table.lastPage.value }}</div>
          <div>Total records: {{ table.total.value }}</div>
          <div>Selected: {{ selection.selected.value }}</div>
          <div>Selected all: {{ selection.selectedAll.value }}</div>
          <div>Language: {{ language }}</div>
        </PruviousDump>
      </DevOnly>

      <div>
        <!-- NB: pasek z podpowiedzią przeciągania -->
        <div v-if="hasOrder && table.data.value.length" class="nb-reorder-bar mt-8">
          <template v-if="canReorder">
            <span class="nb-reorder-icon">⠿</span>
            <span>Złap dowolny wiersz i przeciągnij go wyżej lub niżej, aby zmienić kolejność — zapisuje się od razu.</span>
            <span v-if="reorderSaving" class="nb-reorder-status">Zapisywanie…</span>
          </template>
          <template v-else-if="!isOrderSorted">
            <span>Kolejność można zmieniać przeciąganiem, gdy lista jest ułożona według kolejności.</span>
            <button type="button" class="button button-white button-small" @click="sortByOrder">Ułóż według kolejności</button>
          </template>
          <template v-else-if="filter.isActive.value">
            <span>Przeciąganie jest wyłączone, gdy działa filtr. Wyczyść filtry, aby zmieniać kolejność.</span>
          </template>
        </div>

        <table v-if="table.data.value.length" class="w-full table-fixed" :class="hasOrder ? 'mt-3' : 'mt-8'">
          <thead>
            <tr>
              <th v-if="canReorder" class="nb-drag-col" />
              <th v-if="isSelecting" class="z-20 w-0">
                <component
                  :indeterminate="selection.count.value > 0 && !selection.selectedAll.value"
                  :is="CheckboxField"
                  :modelValue="selection.count.value > 0"
                  :options="{}"
                  @update:modelValue="onSelectAllChange"
                />
              </th>

              <th
                v-for="field of filter.selectOption.value"
                scope="col"
                class="truncate"
                :style="
  table.hasDefaultColumns.value && columnWidths[field] ? { width: `${columnWidths[field]}%` } : void 0
"
              >
                <div class="flex items-center pt-px">
                  <span
                    v-pruvious-tooltip="collection.fields[field].options.description"
                    class="truncate"
                    :class="{ 'cursor-help': collection.fields[field].options.description }"
                  >
                    {{ __("pruvious-dashboard", collection.fields[field].options.label) }}
                  </span>

                  <PruviousTableSorter
                    :defaultOrder="`${collection.dashboard.overviewTable.sort.field}:${collection.dashboard.overviewTable.sort.direction}`"
                    :fieldDeclaration="collection.fields[field]"
                    :fieldName="field"
                    :table="table"
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody ref="tbodyRef">
            <tr v-for="row of table.data.value" :key="row.id" :class="{ 'nb-draggable-row': canReorder }">
              <td v-if="canReorder" class="nb-drag-col">
                <span class="nb-drag-handle" title="Przeciągnij, aby zmienić kolejność">⠿</span>
              </td>
              <td v-if="isSelecting" class="z-20 w-0">
                <component
                  :is="CheckboxField"
                  :modelValue="!!selection.selected.value[row.id]"
                  :options="{}"
                  @update:modelValue="
  selection.selected.value[row.id] ? selection.deselect(row.id) : selection.select(row.id)
"
                />
              </td>

              <td v-for="(field, i) of filter.selectOption.value">
                <div v-if="!i" class="flex flex-col items-start gap-0.5">
                  <NuxtLink
                    :to="`${collection.name}/${row.id}`"
                    class="max-w-full truncate whitespace-pre-line font-medium transition hocus:text-primary-700"
                    :class="{ 'text-gray-400': row[field] === '' || row[field] === null }"
                  >
                    <span class="truncate">
                      {{
                        row[field] !== "" && row[field] !== null ? row[field] : __("pruvious-dashboard", collection.fields[field].additional.emptyLabel)
                      }}
                    </span>
                  </NuxtLink>

                  <div class="flex max-w-full gap-2">
                    <NuxtLink
                      :to="`${collection.name}/${row.id}`"
                      class="truncate text-xs text-gray-400 transition hocus:text-primary-700"
                    >
                      {{ canUpdate ? __("pruvious-dashboard", "Edit") : __("pruvious-dashboard", "View") }}
                    </NuxtLink>

                    <button
                      v-if="collection.canDuplicate && canCreate"
                      @click="duplicateRecord(row.id)"
                      type="button"
                      class="truncate text-xs text-gray-400 transition hocus:text-primary-700"
                    >
                      {{ __("pruvious-dashboard", "Duplicate") }}
                    </button>

                    <button
                      v-if="collection.publicPages"
                      @click="openUrl(row.id)"
                      type="button"
                      class="truncate text-xs text-gray-400 transition hocus:text-primary-700"
                    >
                      {{ __("pruvious-dashboard", "Open") }}
                    </button>

                    <component
                      v-if="AdditionalCollectionOptions"
                      :id="row.id"
                      :is="AdditionalCollectionOptions"
                      :table="table"
                    />

                    <button
                      v-if="canDelete"
                      v-pruvious-tooltip="{
  content: clickConfirmation?.id === `delete-record-${row.id}` ? __('pruvious-dashboard', 'Confirm to !!delete!!') : __('pruvious-dashboard', 'Delete'),
  showOnCreate: clickConfirmation?.id === `delete-record-${row.id}`,
  offset: [0, 8]
}"
                      @click="deleteRecord(row.id, $event)"
                      type="button"
                      class="truncate text-xs text-gray-400 transition hocus:text-red-500"
                    >
                      {{ __("pruvious-dashboard", "Delete") }}
                    </button>
                  </div>
                </div>

                <!-- NB: przełącznik „Aktywna/Aktywny” klikany od razu na liście -->
                <button
                  v-if="i && field === 'active' && canUpdate"
                  type="button"
                  class="nb-active-toggle nb-no-drag"
                  :class="{ 'is-on': row.active }"
                  :disabled="activeSaving[row.id]"
                  :title="row.active ? 'Widoczne na stronie — kliknij, aby ukryć' : 'Ukryte — kliknij, aby pokazać na stronie'"
                  @click="toggleActive(row)"
                >
                  <span class="nb-active-track"><span class="nb-active-thumb" /></span>
                  <span class="nb-active-label">{{ row.active ? 'Aktywna' : 'Ukryta' }}</span>
                </button>

                <component
                  v-if="i && field !== 'translations' && !(field === 'active' && canUpdate)"
                  :canUpdate="canUpdate"
                  :is="fieldPreviewsComponents[collection.fields[field].type]"
                  :language="language"
                  :name="field"
                  :options="collection.fields[field].options"
                  :record="row"
                  :value="row[field]"
                />

                <PruviousTranslationsFieldPreview
                  v-if="i && field === 'translations'"
                  :canUpdate="canUpdate"
                  :id="row.id"
                  :language="language"
                  :value="row.translations"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PruviousTablePagination :table="table" />

      <div
        v-if="table.loaded.value && !filter.isActive.value && !table.data.value.length"
        class="mt-8 flex flex-1 rounded-md border p-8 text-center text-sm text-gray-500"
      >
        <p class="m-auto">
          {{ __("pruvious-dashboard", "No $items found", { items: collection.label.record.plural }) }}
        </p>
      </div>

      <div
        v-if="table.loaded.value && filter.isActive.value && !table.data.value.length"
        class="mt-8 flex flex-1 rounded-md border p-8 text-center text-sm text-gray-500"
      >
        <p class="m-auto">
          {{
            __("pruvious-dashboard", "No $items matching the current filter were found", {
  items: collection.label.record.plural
})
          }}
        </p>
      </div>
    </div>

    <PruviousTableColumnsPopup v-model:visible="tableColumnsPopupVisible" :table="table" />

    <PruviousFilterPopup
      v-model:visible="filterPopupVisible"
      :filter="filter"
      :title="__('pruvious-dashboard', 'Filter $items', { items: collection.label.record.plural })"
      @updateFilter="table.updateLocation()"
    />

    <PruviousPopup
      v-model:visible="selectAllPopupVisible"
      :showHeader="false"
      @hotkey="onSelectAllPopupHotkey"
      width="26rem"
    >
      <div class="flex flex-col gap-4 p-4">
        <p>
          {{
            __("pruvious-dashboard", "Do you want to select all $count $items?", {
  count: table.total.value,
  items: collection.label.record.plural
})
          }}
        </p>

        <div class="flex justify-end gap-2">
          <button
            @click=";
  selectAllPopupVisible = false, selection.selectAllOnThisPage()"
            type="button"
            class="button button-white"
          >
            <span>{{ __("pruvious-dashboard", "No") }}</span>
          </button>

          <button
            @click=";
  selectAllPopupVisible = false, selection.selectAll(filter)"
            type="button"
            class="button button-white"
          >
            <span>{{ __("pruvious-dashboard", "Yes") }}</span>
          </button>
        </div>
      </div>
    </PruviousPopup>
  </PruviousBase>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useHead, useRoute, watch } from "#imports";
import Sortable from "sortablejs";
import { languageLabels, primaryLanguage, supportedLanguages } from "#pruvious";
import {
  checkboxFieldComponent,
  dashboardMiscComponent,
  fieldPreviews,
  selectFieldComponent,
  tableAdditionalCollectionOptions
} from "#pruvious/dashboard";
import { stringifyQuery } from "#vue-router";
import { useCollectionLanguage } from "~~/node_modules/pruvious/dist/runtime/composables/dashboard/collection-language";
import { confirmClick, useClickConfirmation } from "~~/node_modules/pruvious/dist/runtime/composables/dashboard/confirm-click";
import { usePruviousDashboard } from "~~/node_modules/pruvious/dist/runtime/composables/dashboard/dashboard";
import { pruviousToasterShow } from "~~/node_modules/pruvious/dist/runtime/composables/dashboard/toaster";
import { __, loadTranslatableStrings } from "~~/node_modules/pruvious/dist/runtime/composables/translatable-strings";
import { useUser } from "~~/node_modules/pruvious/dist/runtime/composables/user";
import { CollectionOverview } from "~~/node_modules/pruvious/dist/runtime/utils/dashboard/collection-overview";
import { Filter } from "~~/node_modules/pruvious/dist/runtime/utils/dashboard/filter";
import { RecordSelection } from "~~/node_modules/pruvious/dist/runtime/utils/dashboard/record-selection";
import { pruviousFetch } from "~~/node_modules/pruvious/dist/runtime/utils/fetch";
import { isObject } from "~~/node_modules/pruvious/dist/runtime/utils/object";
import { capitalize, joinRouteParts, resolveCollectionPathPrefix, titleCase } from "~~/node_modules/pruvious/dist/runtime/utils/string";
import { getCapabilities } from "~~/node_modules/pruvious/dist/runtime/utils/users";
const clickConfirmation = useClickConfirmation();
const collectionLanguage = useCollectionLanguage();
const dashboard = usePruviousDashboard();
const route = useRoute();
const user = useUser();
const CheckboxField = checkboxFieldComponent();
const PruviousBase = dashboardMiscComponent.Base();
const PruviousFilterPopup = dashboardMiscComponent.FilterPopup();
const PruviousPopup = dashboardMiscComponent.Popup();
const PruviousSearchRecords = dashboardMiscComponent.SearchRecords();
const PruviousTableColumnsPopup = dashboardMiscComponent.TableColumnsPopup();
const PruviousTablePagination = dashboardMiscComponent.TablePagination();
const PruviousTableSorter = dashboardMiscComponent.TableSorter();
const PruviousTranslationsFieldPreview = dashboardMiscComponent.TranslationsFieldPreview();
const SelectField = selectFieldComponent();
dashboard.value.collection = route.params.collection;
const AdditionalCollectionOptions = tableAdditionalCollectionOptions[dashboard.value.collection]?.();
const collection = dashboard.value.collections[dashboard.value.collection];
const columnWidths = Object.fromEntries(
  collection.dashboard.overviewTable.columns.map(({ field, width }) => [field, width])
);
const fieldPreviewsComponents = Object.fromEntries(
  Object.entries(fieldPreviews).map(([name, component]) => [name, component()])
);
const filter = new Filter(stringifyQuery(route.query));
const filterPopupVisible = ref(false);
const language = ref(
  filter.whereOption.value.$and?.find((rule) => rule.language?.$eq)?.language.$eq ?? filter.whereOption.value.language?.$eq ?? primaryLanguage
);
if (!supportedLanguages.includes(language.value)) {
  language.value = primaryLanguage;
}
if (collection.translatable) {
  collectionLanguage.value = language.value;
}
await loadTranslatableStrings("pruvious-dashboard");
const languageChoices = Object.fromEntries(languageLabels.map(({ code, name }) => [code, name]));
const isSelecting = ref(false);
const selection = new RecordSelection(collection);
const table = new CollectionOverview(collection, filter, selection, language.value);
const tableColumnsPopupVisible = ref(false);
const selectAllPopupVisible = ref(false);
const title = __("pruvious-dashboard", capitalize(collection.label.collection.plural, false));
const userCapabilities = getCapabilities(user.value);
const canCreate = collection.apiRoutes.create && (user.value?.isAdmin || userCapabilities[`collection-${collection.name}-create`]);
const canDelete = collection.apiRoutes.delete && (user.value?.isAdmin || userCapabilities[`collection-${collection.name}-delete`]);
const canDeleteMany = collection.apiRoutes.deleteMany && (user.value?.isAdmin || userCapabilities[`collection-${collection.name}-delete-many`]);
const canUpdate = collection.apiRoutes.update && (user.value?.isAdmin || userCapabilities[`collection-${collection.name}-update`]);

// NB: przeciąganie kolejności — działa w zakładkach z polem „order”, gdy lista jest
// ułożona według kolejności rosnąco, bez filtrów i poza trybem zaznaczania.
const hasOrder = !!collection.fields.order && !!canUpdate;
const isOrderSorted = computed(() => {
  const o = filter.orderOption.value;
  return o.length === 1 && /^order(:asc)?$/.test(o[0]);
});
const canReorder = computed(() => hasOrder && isOrderSorted.value && !filter.isActive.value && !isSelecting.value);
const tbodyRef = ref(null);
const reorderSaving = ref(false);
let sortable;

function sortByOrder() {
  filter.order("order:asc");
  table.updateLocation();
}

async function saveOrder(oldIndex, newIndex) {
  const rows = table.data.value;
  const [moved] = rows.splice(oldIndex, 1);
  rows.splice(newIndex, 0, moved);
  const page = Number(filter.pageOption.value || 1);
  const perPage = Number(filter.perPageOption.value || collection.dashboard.overviewTable.perPage);
  const offset = (page - 1) * perPage;
  const from = Math.min(oldIndex, newIndex);
  const to = Math.max(oldIndex, newIndex);
  reorderSaving.value = true;
  try {
    // Na pierwszym przeciągnięciu numerujemy całą stronę (wszystkie mogą mieć 0),
    // potem wystarczy przenumerować przesunięty zakres.
    const needsFull = rows.some((r) => r.order === undefined || r.order === null);
    const range = needsFull ? [0, rows.length - 1] : [from, to];
    const updates = [];
    for (let i = range[0]; i <= range[1]; i++) {
      const order = offset + i + 1;
      if (rows[i].order !== order) {
        rows[i].order = order;
        updates.push(pruviousFetch(`collections/${collection.name}/${rows[i].id}`, { method: "patch", body: { order } }));
      }
    }
    const results = await Promise.all(updates);
    if (results.some((r) => !r.success)) {
      pruviousToasterShow({ message: "Nie udało się zapisać kolejności. Odśwież stronę i spróbuj ponownie.", type: "error" });
      await table.fetchData();
    } else {
      pruviousToasterShow({ message: "Kolejność zapisana" });
    }
  } finally {
    reorderSaving.value = false;
  }
}

watch(
  [tbodyRef, canReorder],
  ([el, enabled]) => {
    if (sortable && (!el || sortable.el !== el)) {
      sortable.destroy();
      sortable = void 0;
    }
    if (el && !sortable) {
      sortable = Sortable.create(el, {
        // Przeciąganie z dowolnego miejsca wiersza; przyciski i pola wyboru dalej działają
        // normalnie, a krótkie kliknięcie w nazwę nadal otwiera rekord.
        filter: "button, input, select, textarea, label, .nb-no-drag",
        preventOnFilter: false,
        forceFallback: true,
        fallbackTolerance: 5,
        animation: 150,
        ghostClass: "nb-drag-ghost",
        onEnd: (e) => {
          if (e.oldIndex === e.newIndex) return;
          // Sortable przesunął element w DOM — cofamy to i pozwalamy Vue przerysować listę.
          const parent = e.from;
          parent.removeChild(e.item);
          parent.insertBefore(e.item, parent.children[e.oldIndex] ?? null);
          saveOrder(e.oldIndex, e.newIndex);
        },
      });
    }
    sortable?.option("disabled", !enabled);
  },
  { flush: "post" },
);
onBeforeUnmount(() => sortable?.destroy());

// NB: włączanie/ukrywanie rekordu jednym kliknięciem na liście (pole „active”).
const activeSaving = ref({});
async function toggleActive(row) {
  const next = !row.active;
  activeSaving.value[row.id] = true;
  row.active = next;
  const res = await pruviousFetch(`collections/${collection.name}/${row.id}`, { method: "patch", body: { active: next } });
  activeSaving.value[row.id] = false;
  if (res.success) {
    pruviousToasterShow({ message: next ? "Widoczne na stronie" : "Ukryte na stronie" });
  } else {
    row.active = !next;
    pruviousToasterShow({ message: "Nie udało się zmienić widoczności. Spróbuj ponownie.", type: "error" });
  }
}
useHead({ title });
watch(
  () => route.query,
  async () => {
    table.setFilterFromQueryString(stringifyQuery(route.query));
    await table.fetchData();
  },
  { immediate: true }
);
async function clearFilter() {
  table.clearFilters();
  await table.updateLocation();
}
function toggleSelecting() {
  isSelecting.value = !isSelecting.value;
  selection.deselectAll();
}
function onSelectAllChange(value) {
  if (value) {
    if (table.lastPage.value > 1) {
      selectAllPopupVisible.value = true;
    } else {
      selection.selectAllOnThisPage();
    }
  } else {
    selection.deselectAll();
  }
}
async function deleteSelectedRecords(event) {
  confirmClick({
    target: event.target,
    id: "delete-records",
    success: async () => {
      await selection.delete();
      await table.fetchData();
    }
  });
}
async function deleteRecord(id, event) {
  confirmClick({
    target: event.target,
    id: `delete-record-${id}`,
    success: async () => {
      const response = await pruviousFetch(`collections/${collection.name}/${id}`, {
        method: "delete",
        query: { select: "id" }
      });
      if (response.success) {
        pruviousToasterShow({
          message: __("pruvious-dashboard", "$item deleted", {
            item: titleCase(collection.label.record.singular, false)
          })
        });
        await table.fetchData();
      }
    }
  });
}
async function duplicateRecord(id) {
  const response = await pruviousFetch(`collections/${collection.name}/${id}/duplicate`, {
    method: "post",
    query: { select: "id" }
  });
  if (response.success) {
    pruviousToasterShow({
      message: __("pruvious-dashboard", "$item duplicated", {
        item: titleCase(collection.label.record.singular, false)
      })
    });
    await table.fetchData();
  } else if (isObject(response.error)) {
    pruviousToasterShow({
      message: "<ul><li>" + Object.entries(response.error).map(([key, value]) => `**${key}:** ${value}`).join("</li><li>") + "</li></ul>",
      type: "error"
    });
  }
}
function onSelectAllPopupHotkey(action) {
  if (action === "close") {
    selectAllPopupVisible.value = false;
  }
}
async function openUrl(id) {
  if (collection.publicPages) {
    const response = await pruviousFetch(`collections/${collection.name}/${id}`);
    if (response.success) {
      const baseUrl = joinRouteParts(
        (response.data.language === primaryLanguage ? "" : response.data.language) + "/" + resolveCollectionPathPrefix(collection, response.data.language, primaryLanguage) + "/" + response.data[collection.publicPages.pathField ?? "path"]
      );
      if (collection.publicPages.publicField && !response.data[collection.publicPages.publicField] && collection.publicPages.draftTokenField) {
        window.open(`${baseUrl}?__d=${response.data[collection.publicPages.draftTokenField]}`, "_blank");
      } else {
        window.open(baseUrl, "_blank");
      }
    }
  }
}
async function changeLanguage(languageCode) {
  collectionLanguage.value = languageCode;
  language.value = languageCode;
  table.updateDefaultLanguage(languageCode);
  await table.updateLocation();
}
</script>

<style scoped>
/* NB: przełącznik aktywności na liście */
.nb-active-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.15rem 0.25rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.8125rem;
  color: #64748b;
}
.nb-active-toggle:disabled {
  opacity: 0.6;
  cursor: wait;
}
.nb-active-track {
  position: relative;
  width: 2.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: #cbd5e1;
  transition: background 0.15s;
}
.nb-active-thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s;
}
.nb-active-toggle.is-on .nb-active-track {
  background: #16a34a;
}
.nb-active-toggle.is-on .nb-active-thumb {
  transform: translateX(1rem);
}
.nb-active-toggle.is-on .nb-active-label {
  color: #15803d;
  font-weight: 600;
}

/* NB: style przeciągania kolejności */
.nb-draggable-row {
  cursor: grab;
}
.nb-draggable-row:active {
  cursor: grabbing;
}
:deep(.sortable-fallback) {
  opacity: 0.9;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
  background: #fff;
}
.nb-reorder-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  padding: 0.6rem 0.9rem;
  border-radius: 0.375rem;
  background: #f1f5f9;
  font-size: 0.8125rem;
  color: #475569;
}
.nb-reorder-icon {
  font-size: 1rem;
  color: #64748b;
}
.nb-reorder-status {
  margin-left: auto;
  color: #64748b;
}
.nb-drag-col {
  width: 2.25rem;
  padding-left: 0.5rem !important;
  padding-right: 0 !important;
}
.nb-drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  cursor: grab;
  color: #94a3b8;
  font-size: 1.1rem;
  user-select: none;
}
.nb-drag-handle:hover {
  background: #e2e8f0;
  color: #334155;
}
.nb-drag-handle:active {
  cursor: grabbing;
}
:deep(.nb-drag-ghost) {
  opacity: 0.4;
  background: #e0f2fe;
}
</style>
