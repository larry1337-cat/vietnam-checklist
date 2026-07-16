export const ACCENT_COLORS = [
  '#a6231c',
  '#22385e',
  '#3e7c59',
  '#c24b72',
  '#c08a2e',
  '#5a3825',
  '#1e6f6b',
  '#5b3a6e',
]

export interface ModePalette {
  bgSurface: string
  bgElevated: string
  bgDeep: string
  textPrimary: string
  textSecondary: string
  borderColor: string
}

export const MODE_PALETTES: Record<string, ModePalette> = {
  '#fafafa': {
    bgSurface: '#fafafa',
    bgElevated: '#f1f1f2',
    bgDeep: '#e4e4e7',
    textPrimary: '#18181b',
    textSecondary: '#52525b',
    borderColor: '#e4e4e7',
  },
  '#09090b': {
    bgSurface: '#09090b',
    bgElevated: '#18181b',
    bgDeep: '#27272a',
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
    borderColor: '#3f3f46',
  },
}

export const MODE_COLORS = Object.keys(MODE_PALETTES)
