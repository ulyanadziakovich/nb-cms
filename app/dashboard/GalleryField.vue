<template>
  <div class="nb-gallery">
    <div v-if="options.label || options.description" class="nb-gallery-head">
      <span class="nb-gallery-label">
        <span v-if="options.required" class="nb-required">*</span>
        {{ options.label }}
        <span class="nb-gallery-count">{{ countLabel }}</span>
      </span>
      <PruviousIconHelp v-if="options.description" v-pruvious-tooltip="description" class="nb-help" />
    </div>

    <div class="nb-gallery-actions">
      <label class="button button-white" :class="{ 'nb-disabled': disabled || uploading }">
        <PruviousIconUpload class="nb-btn-icon" />
        Wgraj zdjęcia z komputera
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="nb-file-input"
          :disabled="disabled || uploading"
          @change="onFilesChosen"
        />
      </label>
      <button type="button" class="button button-white" :disabled="disabled || uploading" @click="pickFromLibrary">
        Dodaj z biblioteki mediów
      </button>
      <button
        v-if="items.length"
        type="button"
        class="button button-white-red"
        :disabled="disabled || uploading"
        @click="clearAll"
      >
        {{ confirmClear ? 'Na pewno usunąć wszystkie?' : 'Usuń wszystkie' }}
      </button>
    </div>

    <p v-if="uploading" class="nb-gallery-progress">Wgrywanie zdjęć… {{ uploadDone }}/{{ uploadTotal }}</p>
    <p v-else-if="items.length > 1" class="nb-gallery-hint">Przeciągnij zdjęcie, aby zmienić kolejność. Pierwsze zdjęcie jest pierwsze na stronie.</p>
    <p v-else-if="!items.length" class="nb-gallery-hint">Brak zdjęć. Możesz zaznaczyć wiele plików naraz.</p>

    <div ref="gridEl" class="nb-gallery-grid">
      <div v-for="(item, i) in items" :key="item.uploadId + '-' + i" class="nb-gallery-tile" :data-index="i">
        <img v-if="thumbs[item.uploadId]" :src="thumbs[item.uploadId]" alt="" draggable="false" />
        <span v-else class="nb-gallery-missing">…</span>
        <span class="nb-gallery-pos">{{ i + 1 }}</span>
        <button
          v-if="!disabled"
          type="button"
          class="nb-gallery-remove nb-no-drag"
          title="Usuń z galerii (zdjęcie zostaje w mediach)"
          @click="remove(i)"
        >
          ×
        </button>
      </div>
    </div>

    <PruviousInputError :errors="errors" :fieldKey="fieldKey" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useRuntimeConfig, watch } from '#imports'
import Sortable from 'sortablejs'
import { openMediaLibraryPopup } from '~~/node_modules/pruvious/dist/runtime/composables/dashboard/media'
import { pruviousToasterShow } from '~~/node_modules/pruvious/dist/runtime/composables/dashboard/toaster'
import { pruviousFetch } from '~~/node_modules/pruvious/dist/runtime/utils/fetch'

type Item = { uploadId: number; alt: string }

const props = defineProps<{
  modelValue: Item[] | null
  options: { label?: string; description?: string | string[]; required?: boolean; directory?: string }
  fieldKey?: string
  errors?: Record<string, string>
  disabled?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [Item[]] }>()

const runtimeConfig = useRuntimeConfig()
const items = computed<Item[]>(() => (Array.isArray(props.modelValue) ? props.modelValue : []))
const description = computed(() => [props.options.description ?? []].flat().join('\n'))
const countLabel = computed(() => {
  const n = items.value.length
  const last = n % 10
  const lastTwo = n % 100
  const word = n === 1 ? 'zdjęcie' : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'zdjęcia' : 'zdjęć'
  return `(${n} ${word})`
})

// Miniatury: adresy plików dla wszystkich zdjęć w galerii.
const thumbs = ref<Record<number, string>>({})
async function loadThumbs() {
  const missing = items.value.map((i) => i.uploadId).filter((id) => !thumbs.value[id])
  for (let start = 0; start < missing.length; start += 100) {
    const ids = missing.slice(start, start + 100)
    const response = await pruviousFetch('collections/uploads', {
      query: { where: `id[in][${ids.join(',')}]`, select: 'id,directory,filename', perPage: 100 },
    } as any)
    if (response.success) {
      for (const upload of (response.data as any).records) {
        thumbs.value[upload.id] = runtimeConfig.public.pruvious.uploadsBase + upload.directory + upload.filename
      }
    }
  }
}
watch(items, loadThumbs, { immediate: true })

function update(next: Item[]) {
  emit('update:modelValue', next)
}

function remove(index: number) {
  update(items.value.filter((_, i) => i !== index))
}

const confirmClear = ref(false)
function clearAll() {
  if (!confirmClear.value) {
    confirmClear.value = true
    setTimeout(() => (confirmClear.value = false), 4000)
    return
  }
  confirmClear.value = false
  update([])
}

function pickFromLibrary() {
  openMediaLibraryPopup({
    pickCallback: (upload: any) => {
      if (!upload?.id) return
      update([...items.value, { uploadId: upload.id, alt: '' }])
    },
  } as any)
}

// Wgrywanie wielu plików naraz — po kolei, żeby było widać postęp.
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadDone = ref(0)
const uploadTotal = ref(0)
async function onFilesChosen(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files ?? [])
  if (!files.length) return
  uploading.value = true
  uploadDone.value = 0
  uploadTotal.value = files.length
  const added: Item[] = []
  for (const file of files) {
    const body = new FormData()
    body.append('$file', file)
    body.append('directory', props.options.directory || 'galerie/')
    const response = await pruviousFetch('collections/uploads', { method: 'post', body } as any)
    if (response.success && (response.data as any)?.id) {
      const upload = response.data as any
      thumbs.value[upload.id] = runtimeConfig.public.pruvious.uploadsBase + upload.directory + upload.filename
      added.push({ uploadId: upload.id, alt: '' })
    } else {
      const reason = typeof response.error === 'object' ? Object.values(response.error ?? {}).join(' ') : response.error
      pruviousToasterShow({ message: `**${file.name}:** ${reason || 'nie udało się wgrać'}`, type: 'error' })
    }
    uploadDone.value++
  }
  update([...items.value, ...added])
  uploading.value = false
  if (fileInput.value) fileInput.value.value = ''
  if (added.length) pruviousToasterShow({ message: `Dodano ${added.length} zdjęć do galerii. Pamiętaj, aby zapisać.` })
}

// Zmiana kolejności przeciąganiem — jak w listach.
const gridEl = ref<HTMLElement | null>(null)
let sortable: Sortable | null = null
onMounted(async () => {
  await nextTick()
  if (!gridEl.value) return
  sortable = Sortable.create(gridEl.value, {
    animation: 150,
    filter: '.nb-no-drag',
    preventOnFilter: false,
    forceFallback: true,
    fallbackTolerance: 5,
    disabled: !!props.disabled,
    onEnd: (event) => {
      const { oldIndex, newIndex, item, from } = event
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return
      // Sortable przesunął element w DOM — cofamy to i pozwalamy Vue przerysować listę.
      from.removeChild(item)
      from.insertBefore(item, from.children[oldIndex] ?? null)
      const next = [...items.value]
      const [moved] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, moved!)
      update(next)
    },
  })
})
onBeforeUnmount(() => sortable?.destroy())
</script>

<style scoped>
.nb-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
}

.nb-gallery-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.nb-gallery-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #111827;
}

.nb-required {
  color: #ef4444;
}

.nb-gallery-count {
  margin-left: 0.25rem;
  color: #6b7280;
  font-weight: 400;
}

.nb-help {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.nb-gallery-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.nb-gallery-actions label {
  position: relative;
  cursor: pointer;
}

.nb-btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.35rem;
}

.nb-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.nb-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.nb-gallery-progress,
.nb-gallery-hint {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.nb-gallery-progress {
  color: #a9541f;
  font-weight: 600;
}

.nb-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 0.4rem;
}

.nb-gallery-tile {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.4375rem;
  background: #f3f4f6;
  cursor: grab;
  user-select: none;
}

.nb-gallery-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.nb-gallery-missing {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
}

.nb-gallery-pos {
  position: absolute;
  left: 0.3rem;
  bottom: 0.3rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.7);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
}

.nb-gallery-remove {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(17, 24, 39, 0.7);
  color: #fff;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}

.nb-gallery-tile:hover .nb-gallery-remove {
  opacity: 1;
}

.nb-gallery-remove:hover {
  background: #dc2626;
}
</style>
