<template>
  <div class="nb-color">
    <div class="nb-color-head">
      <span class="nb-color-label">{{ options.label }}</span>
      <PruviousIconHelp v-if="options.description" v-pruvious-tooltip="description" class="nb-help" />
    </div>
    <div class="nb-color-row">
      <input
        type="color"
        class="nb-color-swatch"
        :value="current"
        :disabled="disabled"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <input
        type="text"
        class="nb-color-text"
        :value="modelValue ?? ''"
        :placeholder="options.default"
        :disabled="disabled"
        maxlength="7"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).value.trim())"
      />
      <span v-if="!options.default && !modelValue" class="nb-color-inherit">używany jest kolor ogólny</span>
      <button
        v-if="!options.default && modelValue"
        type="button"
        class="button button-white button-sm"
        :disabled="disabled"
        @click="emit('update:modelValue', '')"
      >
        Użyj koloru ogólnego
      </button>
      <button
        v-if="options.default && modelValue !== options.default"
        type="button"
        class="button button-white button-sm"
        :disabled="disabled"
        @click="emit('update:modelValue', options.default!)"
      >
        Przywróć domyślny
      </button>
    </div>
    <PruviousInputError :errors="errors" :fieldKey="fieldKey" />
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'

const props = defineProps<{
  modelValue: string | null
  options: { label?: string; description?: string | string[]; default?: string }
  fieldKey?: string
  errors?: Record<string, string>
  disabled?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const description = computed(() => [props.options.description ?? []].flat().join('\n'))
const current = computed(() => (/^#[0-9a-f]{6}$/i.test(props.modelValue ?? '') ? props.modelValue! : props.options.default || '#ffffff'))
</script>

<style scoped>
.nb-color {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}

.nb-color-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.nb-color-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #111827;
}

.nb-help {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.nb-color-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nb-color-swatch {
  width: 2.5rem;
  height: 2.25rem;
  padding: 0.15rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.4375rem;
  background: #fff;
  cursor: pointer;
}

.nb-color-inherit {
  font-size: 0.75rem;
  color: #9ca3af;
}

.nb-color-text {
  width: 7rem;
  height: 2.25rem;
  padding: 0 0.6rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.4375rem;
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
}
</style>
