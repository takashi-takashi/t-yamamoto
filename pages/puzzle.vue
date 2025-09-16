<template>
  <div class="puzzle-page">
    <h1 class="title">ドラッグ＆ドロップ順序パズル</h1>

    <div class="controls">
      <button class="btn" @click="checkOrder">OK</button>
      <button class="btn secondary" @click="clearToInitial">クリア</button>
      <span class="message" :class="{ success: result === 'ok', error: result === 'ng' }">
        <template v-if="result === 'ok'">コングラッチュレーション！</template>
        <template v-else-if="result === 'ng'">ブー×</template>
      </span>
    </div>

    <div class="play-area" ref="playAreaRef">
      <div class="order-strip" ref="orderStripRef">
        <div
          v-for="(slot, idx) in slots"
          :key="idx"
          class="slot"
          :data-index="idx"
        >
          <span class="slot-label">{{ idx + 1 }}</span>
        </div>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        class="piece"
        :style="pieceStyle(item)"
        @pointerdown.prevent="onPointerDown($event, item)"
      >
        <span class="num">{{ item.id }}</span>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

type Piece = {
  id: number
  x: number
  y: number
  width: number
  height: number
  inSlotIndex: number | null
  lastFreeX: number
  lastFreeY: number
}

const COUNT = 9
const PIECE_SIZE = 72
const GAP = 10

const playAreaRef = ref<HTMLElement | null>(null)
const orderStripRef = ref<HTMLElement | null>(null)

const items = reactive<Piece[]>([])
const slots = reactive<Array<number | null>>(Array.from({ length: COUNT }, () => null))

const initialPositions = ref<{ x: number; y: number }[]>([])
const result = ref<'ok' | 'ng' | null>(null)

function initPieces() {
  items.splice(0, items.length)
  const area = playAreaRef.value?.getBoundingClientRect()
  const pad = 8
  const stripReserve = 120 // avoid initial overlap with order strip at top
  const maxX = Math.max(0, (area?.width ?? 600) - PIECE_SIZE - pad)
  const maxY = Math.max(0, (area?.height ?? 400) - PIECE_SIZE - pad - stripReserve)

  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < COUNT; i++) {
    // Simple random placement (may overlap slightly, acceptable for now)
    const x = Math.round(pad + Math.random() * maxX)
    const y = Math.round(stripReserve + Math.random() * maxY)
    positions.push({ x, y })
    items.push({
      id: i + 1,
      x,
      y,
      width: PIECE_SIZE,
      height: PIECE_SIZE,
      inSlotIndex: null,
      lastFreeX: x,
      lastFreeY: y,
    })
  }
  initialPositions.value = positions
  // Clear slots and result
  for (let i = 0; i < COUNT; i++) slots[i] = null
  result.value = null
}

onMounted(() => {
  // Defer until next frame to ensure refs have size
  requestAnimationFrame(() => initPieces())
})

function clearToInitial() {
  // Reset positions to initial snapshot and clear slots
  items.forEach((it, i) => {
    const init = initialPositions.value[i]
    if (init) {
      it.x = init.x
      it.y = init.y
      it.lastFreeX = init.x
      it.lastFreeY = init.y
    }
    it.inSlotIndex = null
  })
  for (let i = 0; i < COUNT; i++) slots[i] = null
  result.value = null
}

function pieceStyle(item: Piece) {
  return {
    width: item.width + 'px',
    height: item.height + 'px',
    transform: `translate(${item.x}px, ${item.y}px)`,
    zIndex: item === dragging.item ? 10 : 1,
  }
}

function checkOrder() {
  // All slots filled and in order 1..9
  const allFilled = slots.every((s) => s !== null)
  if (!allFilled) {
    result.value = 'ng'
    return
  }
  const ok = slots.every((id, idx) => id === idx + 1)
  result.value = ok ? 'ok' : 'ng'
}

const dragging = reactive<{ item: Piece | null; startX: number; startY: number; baseX: number; baseY: number }>({
  item: null,
  startX: 0,
  startY: 0,
  baseX: 0,
  baseY: 0,
})

function onPointerDown(e: PointerEvent, item: Piece) {
  result.value = null // clear message on new action
  ;(e.target as Element).setPointerCapture?.(e.pointerId)

  // If currently in a slot, free it
  if (item.inSlotIndex !== null) {
    const idx = item.inSlotIndex
    if (idx !== null) slots[idx] = null
    item.inSlotIndex = null
  }

  dragging.item = item
  dragging.startX = e.clientX
  dragging.startY = e.clientY
  dragging.baseX = item.x
  dragging.baseY = item.y

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.item) return
  const dx = e.clientX - dragging.startX
  const dy = e.clientY - dragging.startY
  const area = playAreaRef.value?.getBoundingClientRect()
  const item = dragging.item

  let nx = dragging.baseX + dx
  let ny = dragging.baseY + dy

  // Constrain to play area
  const maxX = Math.max(0, (area?.width ?? 600) - item.width)
  const maxY = Math.max(0, (area?.height ?? 400) - item.height)
  nx = Math.min(Math.max(0, nx), maxX)
  ny = Math.min(Math.max(0, ny), maxY)

  item.x = nx
  item.y = ny
}

function onPointerUp(e: PointerEvent) {
  const item = dragging.item
  window.removeEventListener('pointermove', onPointerMove)
  if (!item) return

  // Try to snap into order strip slot if over it
  const stripEl = orderStripRef.value
  const stripBox = stripEl?.getBoundingClientRect()
  if (stripBox) {
    const px = e.clientX
    const py = e.clientY
    const inside = px >= stripBox.left && px <= stripBox.right && py >= stripBox.top && py <= stripBox.bottom
    if (inside) {
      const slotNodes = Array.from(stripEl!.querySelectorAll('.slot')) as HTMLElement[]
      // Find nearest available slot by x position
      let bestIdx = -1
      let bestDist = Number.POSITIVE_INFINITY
      slotNodes.forEach((node, idx) => {
        const rect = node.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const d = Math.hypot(px - cx, py - cy)
        if (d < bestDist) {
          bestDist = d
          bestIdx = idx
        }
      })

      if (bestIdx >= 0 && slots[bestIdx] === null) {
        // Snap to slot
        const targetRect = slotNodes[bestIdx].getBoundingClientRect()
        const areaBox = playAreaRef.value!.getBoundingClientRect()
        const localX = targetRect.left - areaBox.left + (targetRect.width - item.width) / 2
        const localY = targetRect.top - areaBox.top + (targetRect.height - item.height) / 2
        item.x = Math.round(localX)
        item.y = Math.round(localY)
        item.inSlotIndex = bestIdx
        slots[bestIdx] = item.id
      } else {
        // Return to free location baseline
        item.lastFreeX = item.x
        item.lastFreeY = item.y
      }
    } else {
      // Free area; remember last free position
      item.lastFreeX = item.x
      item.lastFreeY = item.y
    }
  }

  dragging.item = null
}
</script>

<style scoped>
.puzzle-page {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 16px 24px;
}
.title {
  font-size: 20px;
  margin: 0 0 12px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.btn {
  padding: 8px 14px;
  border: 1px solid #333;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
}
.btn.secondary {
  background: #f5f5f5;
}
.message {
  min-width: 140px;
  font-weight: 700;
}
.message.success {
  color: #0a7d26;
}
.message.error {
  color: #c0392b;
}

.order-strip {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 8px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 8px;
  border: 2px dashed #bbb;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: saturate(120%) blur(2px);
}
.slot {
  height: 64px;
  border: 2px dashed #ddd;
  background: #fafafa;
  border-radius: 8px;
  position: relative;
}
.slot-label {
  position: absolute;
  right: 6px;
  bottom: 4px;
  font-size: 12px;
  color: #999;
}

.play-area {
  position: relative;
  height: 520px;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  background: repeating-linear-gradient(45deg, #fff, #fff 10px, #fafafa 10px, #fafafa 20px);
  overflow: hidden;
}

.piece {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
  border: 2px solid rgba(0,0,0,0.05);
  user-select: none;
  touch-action: none;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #1d1d1f;
}
.piece .num { font-size: 20px; }

/* Distinct colors per id */
.piece:nth-child(9n+1) { background: #ffe082; }
.piece:nth-child(9n+2) { background: #ffcc80; }
.piece:nth-child(9n+3) { background: #ffab91; }
.piece:nth-child(9n+4) { background: #f48fb1; }
.piece:nth-child(9n+5) { background: #ce93d8; }
.piece:nth-child(9n+6) { background: #b39ddb; }
.piece:nth-child(9n+7) { background: #9fa8da; }
.piece:nth-child(9n+8) { background: #90caf9; }
.piece:nth-child(9n+9) { background: #80deea; }
</style>
