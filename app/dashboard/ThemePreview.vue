<template>
  <div class="nb-preview">
    <p class="nb-preview-note">Podgląd na żywo — zmienia się od razu, zanim zapiszesz.</p>
    <div class="nb-site" :style="{ background: c.colorBackground }">
      <div class="nb-bar" :style="{ background: c.colorInk }">
        <span class="nb-logo">▲▲</span>
        <span>Szlaki</span><span>Kultura</span><span>O nas</span><span>Kontakt</span>
      </div>

      <div class="nb-hero" :style="{ background: c.colorSection }">
        <span class="nb-kicker" :style="{ color: c.colorAccent }">NAPIS NAD TYTUŁEM</span>
        <h3 class="nb-title" :style="{ color: c.colorBrand }">Tytuł podstrony</h3>
        <p class="nb-stats" :style="{ color: c.colorBrand }">24 trasy · 4,8–161 km długości</p>
      </div>

      <div class="nb-body">
        <p class="nb-question" :style="{ color: c.colorExtra }">Czym się zajmujemy?</p>
        <h4 class="nb-h" :style="{ color: c.colorTitle }">Śródtytuł sekcji</h4>
        <p class="nb-lead" :style="{ color: c.colorLead }">Pierwszy akapit opisu — tekst wyróżniony, trochę większy.</p>
        <p class="nb-text" :style="{ color: c.colorBody }">
          Zwykły tekst akapitu w opisach i na kartach. Tak wygląda dłuższy fragment czytany przez odwiedzających,
          z <a :style="{ color: c.colorAccent }">linkiem w tekście</a>.
        </p>
        <div class="nb-row">
          <span class="nb-btn" :style="{ background: c.colorAccent }">Przycisk</span>
          <span class="nb-num" :style="{ color: c.colorAccent }">01</span>
          <span class="nb-chip" :style="{ color: c.colorEasy, borderColor: c.colorEasy }">● Łatwa</span>
          <span class="nb-chip" :style="{ color: c.colorMedium, borderColor: c.colorMedium }">● Średnia</span>
          <span class="nb-chip" :style="{ color: c.colorHard, borderColor: c.colorHard }">● Trudna</span>
        </div>
      </div>

      <div class="nb-footer" :style="{ background: c.colorInk }">Stopka strony</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Podgląd kolorów na żywo — bierze bieżące (także niezapisane) wartości z formularza.
// W „Wyglądzie strony” (kolory ogólne) — pola colorX. W „Wyglądzie tej strony”
// podstrony — pola themeX, a puste biorą kolory ogólne (pobrane z „Elementów wspólnych”).
import { computed, onMounted, ref } from '#imports'
import { pruviousFetch } from '~~/node_modules/pruvious/dist/runtime/utils/fetch'

const props = defineProps<{ record: Record<string, any> }>()

const DEFAULTS: Record<string, string> = {
  colorTitle: '#151d1c',
  colorLead: '#566c71',
  colorBody: '#6c7173',
  colorExtra: '#615b3a',
  colorAccent: '#a8551f',
  colorBrand: '#135e24',
  colorInk: '#1a2420',
  colorBackground: '#eff2ef',
  colorSection: '#f3f1ea',
  colorEasy: '#0072bd',
  colorMedium: '#9c27b0',
  colorHard: '#cc0000',
}
/** Pole „Wyglądu tej strony” → kolor ogólny, który zastępuje. */
const PAGE_FIELDS: Record<string, string> = {
  themeBackground: 'colorBackground',
  themeHero: 'colorSection',
  themeTitle: 'colorTitle',
  themeLead: 'colorLead',
  themeBody: 'colorBody',
  themeAccent: 'colorAccent',
}

const isHex = (v: unknown): v is string => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)
const isPageForm = computed(() => props.record && 'themeTitle' in props.record)

// Kolory ogólne zapisane w CMS (dla podglądu na podstronach).
const globals = ref<Record<string, string>>({})
onMounted(async () => {
  if (!isPageForm.value) return
  const response = await pruviousFetch('collections/site-settings', { dispatchEvents: false } as any)
  if (response.success) globals.value = response.data as any
})

const c = computed(() => {
  const out: Record<string, string> = {}
  for (const [key, fallback] of Object.entries(DEFAULTS)) {
    const source = isPageForm.value ? globals.value[key] : props.record?.[key]
    out[key] = isHex(source) ? source : fallback
  }
  if (isPageForm.value) {
    for (const [pageField, globalField] of Object.entries(PAGE_FIELDS)) {
      if (isHex(props.record?.[pageField])) out[globalField] = props.record[pageField]
    }
    // Tytuł podstrony na stronie ma kolor tytułów, gdy ustawiono go dla tej strony.
    if (isHex(props.record?.themeTitle)) out.colorBrand = props.record.themeTitle
  }
  return out
})
</script>

<style scoped>
.nb-preview {
  width: 100%;
  margin-bottom: 0.5rem;
}

.nb-preview-note {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.nb-site {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  font-family: Inter, system-ui, sans-serif;
}

.nb-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
}

.nb-logo {
  margin-right: auto;
  color: #8bc34a;
  letter-spacing: -0.15em;
}

.nb-hero {
  padding: 1rem 1.2rem;
}

.nb-kicker {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.nb-title {
  margin: 0.25rem 0 0.35rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.35rem;
  font-weight: 600;
}

.nb-stats {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
}

.nb-body {
  padding: 1rem 1.2rem 1.2rem;
}

.nb-question {
  margin: 0 0 0.4rem;
  font-family: Georgia, serif;
  font-size: 0.95rem;
  font-weight: 600;
}

.nb-h {
  margin: 0 0 0.35rem;
  font-family: Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
}

.nb-lead {
  margin: 0 0 0.4rem;
  font-size: 0.92rem;
}

.nb-text {
  margin: 0 0 0.8rem;
  font-size: 0.8rem;
  line-height: 1.6;
}

.nb-text a {
  font-weight: 600;
  text-decoration: underline;
}

.nb-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.nb-btn {
  padding: 0.35rem 0.8rem;
  border-radius: 0.4rem;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}

.nb-num {
  font-family: Georgia, serif;
  font-weight: 700;
}

.nb-chip {
  padding: 0.15rem 0.55rem;
  border: 1px solid;
  border-radius: 999px;
  background: #fff;
  font-size: 0.68rem;
  font-weight: 700;
}

.nb-footer {
  padding: 0.6rem 1rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.7rem;
}
</style>
