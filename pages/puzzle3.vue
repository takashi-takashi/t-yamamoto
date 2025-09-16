<template>
  <div class="puzzle-page">
    <h1 class="title">順序パズル 3（3段並べ替え）</h1>

    <div class="controls">
      <button class="btn" @click="checkOrder">OK</button>
      <button class="btn secondary" @click="clearToInitial">クリア</button>
      <span class="message" :class="{ success: result === 'ok', error: result === 'ng' }">
        <template v-if="result === 'ok'">コングラッチュレーション！</template>
        <template v-else-if="result === 'ng'">ブー×</template>
      </span>
    </div>

    <div class="play-area" ref="playAreaRef">
      <!-- 視覚的ガイド（枠にはめずに帯だけ） -->
      <div class="row-guide top"><span>1-3</span></div>
      <div class="row-guide mid"><span>4-6</span></div>
      <div class="row-guide bot"><span>7-9</span></div>

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

type Piece = { id: number; x: number; y: number; width: number; height: number; lastFreeX: number; lastFreeY: number }

const COUNT = 9
const PIECE_SIZE = 72

const playAreaRef = ref<HTMLElement | null>(null)
const items = reactive<Piece[]>([])
const initialPositions = ref<{ x: number; y: number }[]>([])
const result = ref<'ok' | 'ng' | null>(null)

function initPieces() {
  items.splice(0, items.length)
  const area = playAreaRef.value?.getBoundingClientRect()
  const pad = 8
  const maxX = Math.max(0, (area?.width ?? 600) - PIECE_SIZE - pad)
  const maxY = Math.max(0, (area?.height ?? 540) - PIECE_SIZE - pad)
  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < COUNT; i++) {
    const x = Math.round(pad + Math.random() * maxX)
    const y = Math.round(pad + Math.random() * maxY)
    positions.push({ x, y })
    items.push({ id: i + 1, x, y, width: PIECE_SIZE, height: PIECE_SIZE, lastFreeX: x, lastFreeY: y })
  }
  initialPositions.value = positions
  result.value = null
}

onMounted(() => { requestAnimationFrame(() => initPieces()) })

function clearToInitial() {
  items.forEach((it, i) => {
    const init = initialPositions.value[i]
    if (!init) return
    it.x = init.x
    it.y = init.y
    it.lastFreeX = init.x
    it.lastFreeY = init.y
  })
  result.value = null
}

function pieceStyle(item: Piece) {
  return { width: item.width + 'px', height: item.height + 'px', transform: `translate(${item.x}px, ${item.y}px)`, zIndex: item === dragging.item ? 10 : 1 }
}

// バンド（上中下）に収まっているかどうかを中心点で判定
function bandIndexFor(item: Piece): 0 | 1 | 2 | -1 {
  const area = playAreaRef.value?.getBoundingClientRect()
  if (!area) return -1
  const h = area.height
  const third = h / 3
  const cy = item.y + item.height / 2
  if (cy < third) return 0
  if (cy < third * 2) return 1
  if (cy <= h) return 2
  return -1
}

function checkOrder() {
  const bands: Piece[][] = [[], [], []]
  for (const it of items) {
    const bi = bandIndexFor(it)
    if (bi === -1) { result.value = 'ng'; return }
    bands[bi].push(it)
  }
  // 各段に3個ずつ
  if (!(bands[0].length === 3 && bands[1].length === 3 && bands[2].length === 3)) { result.value = 'ng'; return }
  // 左→右のX順に並べたIDが [1,2,3], [4,5,6], [7,8,9]
  const okTop = bands[0].sort((a,b)=>a.x-b.x).every((p, i) => p.id === i + 1)
  const okMid = bands[1].sort((a,b)=>a.x-b.x).every((p, i) => p.id === i + 4)
  const okBot = bands[2].sort((a,b)=>a.x-b.x).every((p, i) => p.id === i + 7)
  result.value = okTop && okMid && okBot ? 'ok' : 'ng'
}

const dragging = reactive<{ item: Piece | null; startX: number; startY: number; baseX: number; baseY: number }>({ item: null, startX: 0, startY: 0, baseX: 0, baseY: 0 })

function onPointerDown(e: PointerEvent, item: Piece) {
  result.value = null
  ;(e.target as Element).setPointerCapture?.(e.pointerId)
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
  const maxX = Math.max(0, (area?.width ?? 600) - item.width)
  const maxY = Math.max(0, (area?.height ?? 540) - item.height)
  nx = Math.min(Math.max(0, nx), maxX)
  ny = Math.min(Math.max(0, ny), maxY)
  item.x = nx
  item.y = ny
}

function onPointerUp() {
  const item = dragging.item
  window.removeEventListener('pointermove', onPointerMove)
  if (!item) return
  // スナップはしない。最後の自由位置だけ更新
  item.lastFreeX = item.x
  item.lastFreeY = item.y
  dragging.item = null
}
</script>

<style scoped>
.puzzle-page { max-width: 960px; margin: 24px auto; padding: 0 16px 24px; }
.title { font-size: 18px; margin: 0 0 12px; }
.controls { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.btn { padding: 8px 14px; border: 1px solid #333; background: #fff; border-radius: 6px; cursor: pointer; }
.btn.secondary { background: #f5f5f5; }
.message { min-width: 140px; font-weight: 700; }
.message.success { color: #0a7d26; }
.message.error { color: #c0392b; }

.play-area { position: relative; height: 540px; border: 1px solid #e3e3e3; border-radius: 8px; background: #fff; overflow: hidden; }
.row-guide { position: absolute; left: 0; right: 0; height: calc(100%/3); border-top: 1px dashed #eee; border-bottom: 1px dashed #eee; display: grid; align-items: center; }
.row-guide span { color: #999; font-size: 12px; margin-left: 8px; }
.row-guide.top { top: 0; background: linear-gradient(to bottom, #fafafa, transparent); }
.row-guide.mid { top: calc(100%/3); background: linear-gradient(to bottom, #fafafa, transparent); }
.row-guide.bot { top: calc(200%/3); background: linear-gradient(to bottom, #fafafa, transparent); }

.piece { position: absolute; width: 72px; height: 72px; border-radius: 12px; box-shadow: 0 3px 8px rgba(0,0,0,0.15); border: 2px solid rgba(0,0,0,0.05); user-select: none; touch-action: none; display: grid; place-items: center; font-weight: 800; color: #1d1d1f; }
.piece .num { font-size: 20px; }
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

