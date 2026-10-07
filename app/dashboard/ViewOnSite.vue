<template>
  <a v-if="href" :href="href" target="_blank" rel="noopener" class="button button-white" title="Otwiera tę stronę w nowej karcie (zapisz zmiany przed podglądem)">
    <PruviousIconExternalLink class="nb-view-icon" />
    Zobacz na stronie
  </a>
</template>

<script setup lang="ts">
// Przycisk „Zobacz na stronie” w formularzu rekordu — otwiera podstronę,
// której dotyczy formularz (strony „Strona: …”, trasy, aktualności, edycje).
import { computed, useRoute, useRuntimeConfig } from '#imports'

const props = defineProps<{ record: Record<string, any> }>()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

/** Stałe adresy formularzy pojedynczych stron. */
const SINGLE_URLS: Record<string, string> = {
  home: '/',
  'strona-szlaki': '/szlaki',
  'strona-trasa': '/szlaki',
  'strona-korona': '/korona-gor',
  'strona-kultura': '/kultura',
  'strona-inicjatywy': '/inicjatywy',
  'strona-kontakt': '/kontakt',
  'strona-aktualnosci': '/aktualnosci',
  'strona-o-nas': '/o-nas/misja',
  'dream-map-settings': '/ustrzyki-2036',
  'site-settings': '/',
  volunteering: '/o-nas/wolontariat',
}

/** Adresy wpisów: część stała + slug rekordu. */
const RECORD_URLS: Record<string, string> = {
  trails: '/szlaki/',
  news: '/aktualnosci/',
  'festival-editions': '/kultura/edycje/',
}

const href = computed(() => {
  const collection = String(route.path).split('/collections/')[1]?.split('/')[0] ?? ''
  const base = String(runtimeConfig.public.siteUrl || '').replace(/\/$/, '')
  if (SINGLE_URLS[collection]) return base + SINGLE_URLS[collection]
  if (RECORD_URLS[collection] && props.record?.slug) return base + RECORD_URLS[collection] + props.record.slug
  return ''
})
</script>

<style scoped>
.nb-view-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.35rem;
}
</style>
