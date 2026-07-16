<template>
  <main
    class="min-h-screen bg-bg-surface text-text-primary px-4 py-8 max-w-7xl mx-auto overflow-hidden flex flex-col md:flex-row gap-6"
  >
    <div class="flex-none md:w-80 lg:w-96 flex flex-col gap-6">
      <div
        class="bg-bg-surface border border-border-color p-6 shadow-sm rounded-none animate-fade-up animate-delay-1"
      >
        <h1 class="font-display text-2xl font-bold mb-4 text-text-primary">
          <span class="text-accent">//</span> Vietnam Checklist
        </h1>
        <p class="text-text-secondary font-body mb-6">
          Đánh dấu và theo dõi những tỉnh thành (cũ) Việt Nam mà bạn đã từng đặt chân đến.
        </p>

        <div class="mb-6 animate-fade-up animate-delay-2">
          <div class="font-body text-sm text-text-secondary mb-2">Nền</div>
          <div class="flex gap-3 mb-4">
            <button
              v-for="color in modes"
              :key="color"
              @click="mode = color"
              :aria-label="color"
              :aria-pressed="mode === color"
              class="w-8 h-8 rounded-full border-2 transition-transform duration-200"
              :class="mode === color ? 'border-accent scale-110' : 'border-border-color'"
              :style="{ backgroundColor: color }"
            />
          </div>

          <div class="font-body text-sm text-text-secondary mb-2">Màu nhấn</div>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="color in accents"
              :key="color"
              @click="accent = color"
              :aria-label="color"
              :aria-pressed="accent === color"
              class="w-8 h-8 rounded-full border-2 transition-transform duration-200"
              :class="accent === color ? 'border-text-primary scale-110' : 'border-border-color'"
              :style="{ backgroundColor: color }"
            />
          </div>
        </div>

        <div
          class="mb-8 pb-6 border-b border-border-color text-center animate-fade-up animate-delay-3"
        >
          <div class="font-display font-medium text-lg mb-4 text-text-primary">Đã khám phá</div>

          <div class="flex items-center justify-center gap-6">
            <div class="flex flex-col items-center flex-1">
              <div class="font-display text-3xl md:text-4xl font-bold text-accent">
                {{ statLabel }}
              </div>
              <div class="text-text-secondary text-sm mt-1 font-body">Tỉnh thành</div>
            </div>

            <div class="w-px h-12 bg-border-color"></div>

            <div class="flex flex-col items-center flex-1">
              <div class="font-display text-3xl md:text-4xl font-bold text-accent">
                {{ completionPercent }} %
              </div>
              <div class="text-text-secondary text-sm mt-1 font-body">Việt Nam</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 animate-fade-up animate-delay-4">
          <button
            @click="downloadImage"
            :disabled="isGenerating"
            class="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="lucide:download" class="w-5 h-5" />
            <span>{{ isGenerating ? 'Đang tạo ảnh...' : 'Lưu ảnh Bản Đồ' }}</span>
          </button>

          <button
            @click="resetProvinces"
            class="w-full flex items-center justify-center gap-2 bg-bg-elevated hover:bg-bg-deep text-text-primary font-semibold py-3 px-4 rounded-none border border-border-color transition-colors duration-200"
          >
            <Icon icon="lucide:rotate-ccw" class="w-5 h-5" />
            <span>Xóa dữ liệu</span>
          </button>
        </div>
      </div>
    </div>

    <div
      id="map-export-container"
      class="flex-grow flex items-center justify-center bg-bg-surface border border-border-color p-4 lg:p-8 shadow-sm min-h-[600px] relative overflow-auto animate-fade-up animate-delay-5"
    >
      <VietnamMap
        ref="mapRef"
        :visitedProvinces="visitedProvinces"
        @provinceClick="toggleProvince"
        class="w-full h-full max-w-3xl"
      />

      <div
        v-show="isGenerating"
        class="absolute inset-0 bg-bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"
        ></div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import VietnamMap from './components/VietnamMap.vue'
import { useProvinceChecklist } from './composables/useProvinceChecklist'
import { useTheme } from './composables/useTheme'

const { visitedProvinces, toggleProvince, resetProvinces, statLabel, completionPercent } =
  useProvinceChecklist()
const { accent, accents, mode, modes } = useTheme()

const mapRef = ref<InstanceType<typeof VietnamMap> | null>(null)
const isGenerating = ref(false)

const downloadImage = async () => {
  if (isGenerating.value || !mapRef.value) return
  isGenerating.value = true

  try {
    const originalSvg = document.querySelector('.vietnam-map-container svg') as SVGSVGElement
    if (!originalSvg) throw new Error('Could not find SVG')

    const clonedSvg = originalSvg.cloneNode(true) as SVGSVGElement

    const paths = clonedSvg.querySelectorAll('.province-path')
    paths.forEach((path) => {
      const originalPath = originalSvg.querySelector(`#${path.id}`)
      if (originalPath) {
        const computedStyle = window.getComputedStyle(originalPath)
        path.setAttribute('fill', computedStyle.fill)
        path.setAttribute('stroke', computedStyle.stroke)
        path.setAttribute('stroke-width', computedStyle.strokeWidth)
        path.setAttribute('stroke-opacity', computedStyle.strokeOpacity || '1')
      }
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const svgData = new XMLSerializer().serializeToString(clonedSvg)

    const img = new Image()
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    const scale = 2
    const width = 703
    const imageHeight = 900
    const paddingBottom = 160
    const canvasHeight = imageHeight + paddingBottom

    canvas.width = width * scale
    canvas.height = canvasHeight * scale

    const bodyStyles = window.getComputedStyle(document.body)
    const bgSurface = bodyStyles.getPropertyValue('--color-bg-surface').trim() || '#fafafa'

    if (ctx) {
      ctx.fillStyle = bgSurface
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    await new Promise((resolve, reject) => {
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, width * scale, imageHeight * scale)
        URL.revokeObjectURL(url)

        if (ctx) {
          const secondaryTextColor =
            bodyStyles.getPropertyValue('--color-text-secondary').trim() || '#52525b'
          const accentColor = bodyStyles.getPropertyValue('--color-accent').trim() || '#a6231c'
          const lineColor = bodyStyles.getPropertyValue('--color-border-color').trim() || '#e4e4e7'

          const centerX = canvas.width / 2
          const watermarkStartY = imageHeight * scale + 20 * scale

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          ctx.fillStyle = secondaryTextColor
          ctx.font = `normal ${28 * scale}px "Be Vietnam Pro", sans-serif`
          ctx.fillText('Đã khám phá', centerX, watermarkStartY)

          const statsY = watermarkStartY + 45 * scale
          const labelsY = statsY + 35 * scale
          const columnOffset = 120 * scale

          ctx.fillStyle = accentColor
          ctx.font = `bold ${42 * scale}px "Anybody", sans-serif`
          ctx.fillText(statLabel.value, centerX - columnOffset, statsY)

          ctx.fillStyle = secondaryTextColor
          ctx.font = `normal ${24 * scale}px "Be Vietnam Pro", sans-serif`
          ctx.fillText('Tỉnh thành', centerX - columnOffset, labelsY)

          ctx.strokeStyle = lineColor
          ctx.lineWidth = 1 * scale
          ctx.beginPath()
          ctx.moveTo(centerX, statsY - 15 * scale)
          ctx.lineTo(centerX, labelsY + 5 * scale)
          ctx.stroke()

          ctx.fillStyle = accentColor
          ctx.font = `bold ${42 * scale}px "Anybody", sans-serif`
          ctx.fillText(`${completionPercent.value} %`, centerX + columnOffset, statsY)

          ctx.fillStyle = secondaryTextColor
          ctx.font = `normal ${24 * scale}px "Be Vietnam Pro", sans-serif`
          ctx.fillText('Việt Nam', centerX + columnOffset, labelsY)
        }
        resolve(true)
      }
      img.onerror = reject
      img.src = url
    })

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const timestamp = new Date().getTime()
    link.download = `vietnam-checklist-${timestamp}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Lỗi tạo ảnh:', error)
    alert('Có lỗi xảy ra khi tạo ảnh bản đồ. Vui lòng thử lại!')
  } finally {
    isGenerating.value = false
  }
}
</script>
