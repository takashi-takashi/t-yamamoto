<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

type BlockType = 'seat' | 'area'

type Block = {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  type: BlockType
}

type Assignment = {
  user: string
  start?: string // ISO date
  end?: string   // ISO date
}

// Grid is 24 x 40 units; coordinates approximate the provided layout image
const blocks = ref<Block[]>([
  // --- Areas (non-interactive) ---
  { id: 'lounge', label: '応接', x: 1, y: 1, w: 8,  h: 6, type: 'area' },
  { id: 'meeting', label: '会議室', x: 14, y: 4, w: 8, h: 8, type: 'area' },
  { id: 'pc_shelf', label: 'PC棚', x: 9, y: 21, w: 6, h: 3, type: 'area' },
  { id: 'shelf_left', label: '棚', x: 1, y: 12, w: 1, h: 16, type: 'area' },
  { id: 'shelf_right', label: '棚', x: 22, y: 20, w: 2, h: 12, type: 'area' },
  { id: 'trash', label: 'ごみ', x: 6, y: 6, w: 2, h: 2, type: 'area' },
  { id: 'r_x', label: 'R', x: 3, y: 6, w: 2, h: 2, type: 'area' },
  { id: 'shelf_top', label: '棚', x: 5, y: 6, w: 2, h: 2, type: 'area' },
  { id: 'printer', label: 'P', x: 22, y: 1, w: 2, h: 2, type: 'area' },

  // --- Seats ---
  { id: 'noda_m', label: 'hoge', x: 2, y: 10, w: 7, h: 6, type: 'seat' },

  // Right-up cluster (2 rows x 3 cols)
  { id: 'asano', label: 'fuga', x: 12, y: 12, w: 4, h: 4, type: 'seat' },
  { id: 'miyase', label: 'piyo', x: 16, y: 12, w: 4, h: 4, type: 'seat' },
  { id: 'makino', label: 'foo', x: 20, y: 12, w: 4, h: 4, type: 'seat' },
  { id: 'ochi', label: 'bar', x: 12, y: 16, w: 4, h: 4, type: 'seat' },
  { id: 'kakuno', label: 'baz', x: 16, y: 16, w: 4, h: 4, type: 'seat' },
  { id: 'tanaka_mgr', label: 'qux', x: 20, y: 16, w: 4, h: 4, type: 'seat' },

  // Center island around PC棚
  { id: 'tadano', label: 'quux', x: 10, y: 24, w: 4, h: 5, type: 'seat' },
  { id: 'kito', label: 'corge', x: 14, y: 28, w: 4, h: 4, type: 'seat' },
  { id: 'kohara', label: 'grault', x: 10, y: 28, w: 4, h: 4, type: 'seat' },
  { id: 'onodera', label: 'garply', x: 10, y: 32, w: 4, h: 4, type: 'seat' },
  { id: 'atochi', label: 'waldo', x: 14, y: 32, w: 4, h: 4, type: 'seat' },
  { id: 'kitou', label: 'fred', x: 14, y: 24, w: 4, h: 4, type: 'seat' },
  { id: 'hayashi', label: 'plugh', x: 18, y: 24, w: 4, h: 4, type: 'seat' },

  // Left bottom stack
  { id: 'sato', label: 'xyzzy', x: 2, y: 30, w: 6, h: 6, type: 'seat' },
  { id: 'suenaga', label: 'thud', x: 2, y: 24, w: 6, h: 6, type: 'seat' },

  // Right vertical
  { id: 'yamamoto', label: 'hoge2', x: 22, y: 26, w: 2, h: 6, type: 'seat' },
  { id: 'fujiyama', label: 'fuga2', x: 22, y: 32, w: 2, h: 6, type: 'seat' },
])

// Assignments persisted in localStorage
const STORAGE_KEY = 'seatAssignments.v1'
const assignments = ref<Record<string, Assignment>>({})

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) assignments.value = JSON.parse(raw)
    } catch {}
  }
})

watch(assignments, (v) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
  }
}, { deep: true })

const search = ref('')

const filteredBlocks = computed(() => {
  if (!search.value) return blocks.value
  const q = search.value.trim()
  return blocks.value.filter(b =>
    b.label.includes(q) || (assignments.value[b.id]?.user || '').includes(q),
  )
})

function getStatus(id: string): 'available' | 'active' | 'reserved' {
  const a = assignments.value[id]
  if (!a || !a.user) return 'available'
  if (!a.start && !a.end) return 'active'
  const now = new Date()
  const start = a.start ? new Date(a.start) : undefined
  const end = a.end ? new Date(a.end) : undefined
  if (start && start.getTime() > now.getTime()) return 'reserved'
  if (end && end.getTime() < now.getTime()) return 'available'
  return 'active'
}

function periodText(id: string): string {
  const a = assignments.value[id]
  if (!a || !a.user) return '空席'
  const s = a.start ? a.start : '未設定'
  const e = a.end ? a.end : '未設定'
  return `${a.user}｜${s} 〜 ${e}`
}

// Dialog state
const dialog = ref(false)
const editingId = ref<string | null>(null)
const formUser = ref('')
const formStart = ref<string | null>(null)
const formEnd = ref<string | null>(null)

const editingBlock = computed(() => blocks.value.find(b => b.id === editingId.value))

function openEdit(id: string) {
  editingId.value = id
  const a = assignments.value[id]
  formUser.value = a?.user || ''
  formStart.value = a?.start || null
  formEnd.value = a?.end || null
  dialog.value = true
}

function saveEdit() {
  const id = editingId.value
  if (!id) return
  if (!formUser.value) {
    // remove assignment
    const { [id]: _, ...rest } = assignments.value
    assignments.value = rest
  } else {
    assignments.value[id] = {
      user: formUser.value,
      start: formStart.value || undefined,
      end: formEnd.value || undefined,
    }
  }
  dialog.value = false
}

const router = useRouter()
</script>

<template>
  <v-container fluid class="pa-4">
    <v-app-bar flat density="comfortable">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.push('/')" />
      <v-toolbar-title>座席管理</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="検索 (氏名/ラベル)"
        hide-details
        density="comfortable"
        style="max-width: 340px"
      />
    </v-app-bar>

    <v-row class="mt-2" no-gutters>
      <v-col cols="12" md="9">
        <div class="legend mb-3">
          <v-chip size="small" color="success" variant="flat" class="mr-2" /> 空席
          <v-chip size="small" color="primary" variant="flat" class="mx-4" /> 使用中
          <v-chip size="small" color="amber" variant="flat" class="mr-2" /> 予約
        </div>

        <div class="floor-wrapper">
          <div class="floor-grid">
            <template v-for="b in filteredBlocks" :key="b.id">
              <v-tooltip location="top" :text="b.type==='seat' ? periodText(b.id) : b.label">
                <template #activator="{ props }">
                  <div
                    v-bind="props"
                    :class="['block', b.type, getStatus(b.id)]"
                    :style="{
                      gridColumn: b.x + ' / span ' + b.w,
                      gridRow: b.y + ' / span ' + b.h,
                    }"
                    @click="b.type==='seat' && openEdit(b.id)"
                  >
                    <span class="label">{{ b.label }}</span>
                    <span v-if="b.type==='seat' && assignments[b.id]?.user" class="sub">{{ assignments[b.id]?.user }}</span>
                  </div>
                </template>
              </v-tooltip>
            </template>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="3" class="pl-md-4 pt-6 pt-md-0">
        <v-card elevation="2">
          <v-card-title class="text-subtitle-1">操作</v-card-title>
          <v-card-text>
            <div class="text-body-2 mb-2">・席をクリックで割当を編集</div>
            <div class="text-body-2 mb-2">・ホバーで使用期間を表示</div>
            <div class="text-body-2">・検索で氏名/ラベルをフィルタ</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editingBlock?.label }} の割当</v-card-title>
        <v-card-text>
          <v-text-field v-model="formUser" label="氏名 (空で解除)" clearable />
          <div class="d-flex ga-4">
            <v-text-field v-model="formStart" label="開始 (YYYY-MM-DD)" placeholder="2025-09-01" />
            <v-text-field v-model="formEnd" label="終了 (YYYY-MM-DD)" placeholder="2025-09-30" />
          </div>
          <div class="text-caption text-medium-emphasis">開始が未来日は「予約」表示、終了が過去日は自動で「空席」扱い。</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog=false">キャンセル</v-btn>
          <v-btn color="primary" variant="flat" @click="saveEdit">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.legend { display: flex; align-items: center; font-size: 0.9rem; }
.floor-wrapper { width: 100%; display: flex; justify-content: center; }
.floor-grid {
  width: min(100%, 980px);
  aspect-ratio: 9 / 16; /* portrait like the provided image */
  border: 2px solid var(--v-theme-outline);
  background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0));
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: repeat(40, 1fr);
  gap: 6px;
  padding: 8px;
  border-radius: 10px;
}
.block {
  display: flex; align-items: center; justify-content: center;
  text-align: center; border: 1.5px solid var(--v-theme-outline);
  border-radius: 6px; position: relative; user-select: none;
  background: var(--v-theme-surface);
  transition: transform .08s ease, box-shadow .12s ease;
}
.block.seat { cursor: pointer; }
.block.seat:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }
.block.area { background: color-mix(in oklab, var(--v-theme-surface) 75%, var(--v-theme-primary) 5%); }

.block.available { outline: 0; }
.block.active { background: color-mix(in oklab, var(--v-theme-primary) 20%, white 85%); color: rgb(var(--v-theme-on-primary)); }
.block.reserved { background: color-mix(in oklab, #FFC107 30%, white 80%); }

.label { font-weight: 600; line-height: 1.1; }
.sub { position: absolute; bottom: 4px; right: 6px; font-size: .72rem; opacity: .7; }

@media (max-width: 600px) {
  .label { font-size: .78rem; }
}
</style>
