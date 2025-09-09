<script setup lang="ts">
import { ref, computed } from 'vue'

type Stage = 'M2' | 'M1' | 'L3' | 'L2' | 'L1' | 'S' | 'T'
type Region = '東京' | '大阪' | '愛知' | '福岡'

type Row = {
  stage: Stage
  title: string
  base: number // 基本給(月)
  role: number // 役職手当(月)
  dutyMin: number // 職務手当(月) 下限
}

const rows: Row[] = [
  { stage: 'M2', title: '部長',         base: 300000, role: 170000, dutyMin: 0 },
  { stage: 'M1', title: '統括マネージャー', base: 280000, role: 140000, dutyMin: 19000 },
  { stage: 'L3', title: 'マネージャー',   base: 230000, role:  90000, dutyMin: 35000 },
  { stage: 'L2', title: 'リーダー',       base: 220000, role:  70000, dutyMin: 28000 },
  { stage: 'L1', title: 'サブリーダー',   base: 210000, role:  50000, dutyMin: 33000 },
  { stage: 'S',  title: 'S',            base: 200000, role:      0, dutyMin: 20000 },
  { stage: 'T',  title: 'T',            base: 190000, role:      0, dutyMin: 0 },
]

const regionAllowance: Record<Region, number> = {
  '東京': 50000,
  '大阪': 40000,
  '愛知': 31000,
  '福岡': 10000,
}

const region = ref<Region>('東京')

function monthlyTotal(r: Row, reg: Region) {
  return r.base + r.role + r.dutyMin + regionAllowance[reg]
}

function annualGross(r: Row, reg: Region) {
  return monthlyTotal(r, reg) * 12
}

// 概算・簡易の日本の手取り年収計算
// 前提:
// - 社会保険: 年収の14%と仮定（健保・厚年・雇用等の目安）
// - 給与所得控除: 令和以降の近似式（区分簡略化）
// - 基礎控除: 所得税48万円、住民税43万円
// - 住民税: 10%
// - 所得税: 超過累進（5,10,20,23,33,40,45%）の簡易版
function employmentDeduction(gross: number): number {
  // 給与収入ベースの概算（最低55万円）
  if (gross <= 1800000) return Math.max(550000, gross * 0.4 - 100000)
  if (gross <= 3600000) return gross * 0.3 + 80000
  if (gross <= 6600000) return gross * 0.2 + 440000
  if (gross <= 8500000) return gross * 0.1 + 1100000
  return 1950000
}

function incomeTax(calcBase: number): number {
  // 所得税: 課税所得に対する簡易累進
  const brackets = [
    { up: 1950000, rate: 0.05, ded: 0 },
    { up: 3300000, rate: 0.10, ded: 97500 },
    { up: 6950000, rate: 0.20, ded: 427500 },
    { up: 9000000, rate: 0.23, ded: 636000 },
    { up: 18000000, rate: 0.33, ded: 1536000 },
    { up: 40000000, rate: 0.40, ded: 2796000 },
    { up: Infinity, rate: 0.45, ded: 4796000 },
  ]
  for (const b of brackets) {
    if (calcBase <= b.up) {
      return Math.max(0, Math.floor(calcBase * b.rate - b.ded))
    }
  }
  return 0
}

function annualNet(gross: number): number {
  const social = Math.floor(gross * 0.14)
  const kyu = employmentDeduction(gross)
  const baseForTax = Math.max(0, gross - social - kyu)
  const incomeTaxBase = Math.max(0, baseForTax - 480000) // 所得税 基礎控除
  const residentTaxBase = Math.max(0, baseForTax - 430000) // 住民税 基礎控除
  const national = incomeTax(incomeTaxBase)
  const resident = Math.floor(residentTaxBase * 0.10)
  const totalTax = national + resident
  return gross - social - totalTax
}

const tableItems = computed(() => rows.map(r => {
  const m = monthlyTotal(r, region.value)
  const g = annualGross(r, region.value)
  const n = annualNet(g)
  return {
    stage: r.stage,
    title: r.title,
    base: r.base,
    role: r.role,
    duty: r.dutyMin,
    region: regionAllowance[region.value],
    monthly: m,
    gross: g,
    net: n,
  }
}))

function yen(n: number): string {
  return n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 })
}
</script>

<template>
  <v-container fluid class="pa-4">
    <v-app-bar flat density="comfortable">
      <v-btn icon="mdi-arrow-left" variant="text" to="/" />
      <v-toolbar-title>情報処理・年収シミュレーション</v-toolbar-title>
      <v-spacer />
      <v-chip-group v-model="region" selected-class="text-white" color="secondary" 
        class="mr-2" column>
        <v-chip filter value="東京" color="secondary">東京</v-chip>
        <v-chip filter value="大阪" color="secondary">大阪</v-chip>
        <v-chip filter value="愛知" color="secondary">愛知</v-chip>
        <v-chip filter value="福岡" color="secondary">福岡</v-chip>
      </v-chip-group>
    </v-app-bar>

    <v-alert type="info" variant="tonal" class="mt-4">
      職務手当は提示レンジの<b>下限</b>で計算。税・社保は概算であり実額とは異なる場合があります。
    </v-alert>

    <v-card class="mt-4" elevation="2">
      <v-data-table
        :items="tableItems"
        :headers="[
          { title: 'ステージ', value: 'stage' },
          { title: '役職', value: 'title' },
          { title: '基本給(月)', value: 'base' },
          { title: '役職手当(月)', value: 'role' },
          { title: '職務手当(月・下限)', value: 'duty' },
          { title: '地域手当(月)', value: 'region' },
          { title: '合計(月)', value: 'monthly', align: 'end' },
          { title: '年収(総支給)', value: 'gross', align: 'end' },
          { title: '手取り年収(概算)', value: 'net', align: 'end' },
        ]"
        class="elevation-0"
        density="comfortable"
        item-key="stage"
      >
        <template #item.base="{ item }">
          <v-chip color="primary" variant="tonal">{{ yen(item.base) }}</v-chip>
        </template>
        <template #item.role="{ item }">
          <v-chip color="indigo" variant="tonal">{{ yen(item.role) }}</v-chip>
        </template>
        <template #item.duty="{ item }">
          <v-chip color="amber" variant="tonal">{{ yen(item.duty) }}</v-chip>
        </template>
        <template #item.region="{ item }">
          <v-chip color="teal" variant="tonal">{{ yen(item.region) }}</v-chip>
        </template>
        <template #item.monthly="{ item }">
          <div class="text-right font-weight-bold">{{ yen(item.monthly) }}</div>
        </template>
        <template #item.gross="{ item }">
          <div class="text-right text-primary font-weight-bold">{{ yen(item.gross) }}</div>
        </template>
        <template #item.net="{ item }">
          <div class="text-right text-success font-weight-bold">{{ yen(item.net) }}</div>
        </template>
      </v-data-table>
    </v-card>

    <v-card class="mt-4" elevation="1">
      <v-card-title class="text-subtitle-1">計算ロジック（概要）</v-card-title>
      <v-card-text class="text-body-2">
        月額 = 基本給 + 役職手当 + 職務手当(下限) + 地域手当（選択地域）<br>
        年収(総支給) = 月額 × 12<br>
        手取り年収(概算) = 年収 − 社会保険(14%) − 所得税 − 住民税（10%）<br>
        所得税は給与所得控除と基礎控除48万円を適用した課税所得に超過累進を当てています。
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.text-right { text-align: right; }
</style>

