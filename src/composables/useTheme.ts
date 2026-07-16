import { useStorage } from '@vueuse/core'
import { watch } from 'vue'
import { ACCENT_COLORS, MODE_COLORS, MODE_PALETTES } from '../config/theme'

function systemMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? MODE_COLORS[1] : MODE_COLORS[0]
}

export function useTheme() {
  const accent = useStorage('vibe-vietnam-accent', ACCENT_COLORS[0])
  const mode = useStorage('vibe-vietnam-mode', systemMode())
  const root = document.documentElement.style

  watch(
    accent,
    (value) => {
      root.setProperty('--color-accent', value)
    },
    { immediate: true },
  )

  watch(
    mode,
    (value) => {
      const palette = MODE_PALETTES[value] ?? MODE_PALETTES[MODE_COLORS[0]]
      root.setProperty('--color-bg-surface', palette.bgSurface)
      root.setProperty('--color-bg-elevated', palette.bgElevated)
      root.setProperty('--color-bg-deep', palette.bgDeep)
      root.setProperty('--color-text-primary', palette.textPrimary)
      root.setProperty('--color-text-secondary', palette.textSecondary)
      root.setProperty('--color-border-color', palette.borderColor)
    },
    { immediate: true },
  )

  return { accent, accents: ACCENT_COLORS, mode, modes: MODE_COLORS }
}
