<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Track scroll progress per .scene-chunk and set --p for each
onMounted(() => {
  const scenes = Array.from(document.querySelectorAll<HTMLElement>('.scene-chunk'))
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      const vh = window.innerHeight || 1
      for (const sc of scenes) {
        const rect = sc.getBoundingClientRect()
        const total = rect.height - vh
        const p = total > 0 ? Math.min(1, Math.max(0, (0 - rect.top) / total)) : 0
        sc.style.setProperty('--p', String(p))
      }
      raf = 0
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })
})

// Confetti overlay
const canvasRef = ref<HTMLCanvasElement | null>(null)
const running = ref(false)
let ctx: CanvasRenderingContext2D | null = null
let particles: Array<{x:number;y:number;vx:number;vy:number;size:number;color:string;shape:number;rot:number;vr:number}> = []
let rafId = 0
let stopAt = 0

function resizeCanvas() {
  const c = canvasRef.value
  if (!c) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  c.width = Math.floor((window.innerWidth) * dpr)
  c.height = Math.floor((window.innerHeight) * dpr)
  c.style.width = window.innerWidth + 'px'
  c.style.height = window.innerHeight + 'px'
  ctx = c.getContext('2d')
  ctx && ctx.scale(dpr, dpr)
}

function initParticles(count = 200) {
  const W = window.innerWidth
  particles = Array.from({ length: count }, () => {
    const size = 6 + Math.random() * 10
    return {
      x: Math.random() * W,
      y: -20 - Math.random() * 200,
      vx: -0.5 + Math.random() * 1,
      vy: 1 + Math.random() * 2.5,
      size,
      color: pick(['#f87171','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6']),
      shape: Math.floor(Math.random() * 3), // 0:rect, 1:circle, 2:triangle
      rot: Math.random() * Math.PI,
      vr: (-0.03 + Math.random() * 0.06)
    }
  })
}

function pick<T>(a: T[]): T { return a[Math.floor(Math.random()*a.length)] }

function drawParticle(p: typeof particles[number], g: CanvasRenderingContext2D) {
  g.save()
  g.translate(p.x, p.y)
  g.rotate(p.rot)
  g.fillStyle = p.color
  const s = p.size
  if (p.shape === 0) {
    g.fillRect(-s/2, -s/2, s, s)
  } else if (p.shape === 1) {
    g.beginPath(); g.arc(0,0,s/2,0,Math.PI*2); g.fill()
  } else {
    g.beginPath(); g.moveTo(0,-s/1.2); g.lineTo(s/1.2,s/1.2); g.lineTo(-s/1.2,s/1.2); g.closePath(); g.fill()
  }
  g.restore()
}

function tick() {
  if (!ctx || !canvasRef.value) return
  const W = canvasRef.value.width / (window.devicePixelRatio||1)
  const H = canvasRef.value.height / (window.devicePixelRatio||1)
  ctx.clearRect(0,0,W,H)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.rot += p.vr
    // wind sway
    p.vx += (Math.sin(p.y*0.02) * 0.01)
    if (p.y > H + 20) {
      // respawn at top while running window
      p.y = -20
      p.x = Math.random() * W
      p.vx = -0.5 + Math.random() * 1
      p.vy = 1 + Math.random() * 2.5
    }
    drawParticle(p, ctx)
  }
  const now = performance.now()
  if (now < stopAt) {
    rafId = requestAnimationFrame(tick)
  } else {
    running.value = false
  }
}

function startConfetti(durationMs = 6000) {
  resizeCanvas()
  initParticles()
  running.value = true
  stopAt = performance.now() + durationMs
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(rafId)
})

// UI state for Yes/No
const displayedAt = ref<string | null>(null)
function onYes() {
  displayedAt.value = new Date().toLocaleString()
  startConfetti(6000)
}
function onNo() {
  displayedAt.value = null
}
</script>

<template>
  <div class="page">
    <header class="lead">
      <h1>Parallax 11: Letter + Yes/No</h1>
      <p>Bottom has Yes/No; Yes shows DateTime and confetti.</p>
    </header>

    <!-- Scenes (shorter sample, 3 chunks) -->
    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r1">
            <div class="shape square c1" />
            <div class="shape circle c2" />
            <div class="shape diamond c3" />
          </div>
          <div class="rail r2">
            <div class="shape rect c4" />
            <div class="shape circle c5" />
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>手紙 1</h2>
          <p>ゆっくりと景色が流れ、言葉は紙の上で静かに並びます。</p>
        </div></div>
      </div>
    </section>

    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r2">
            <div class="shape square c6" />
            <div class="shape circle c1" />
            <div class="shape rect c2" />
          </div>
          <div class="rail r3">
            <div class="shape diamond c3" />
            <div class="shape square c4" />
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>手紙 2</h2>
          <p>進むほどに景色は遠のき、思い出は近づいて見えてきます。</p>
        </div></div>
      </div>
    </section>

    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r1">
            <div class="shape circle c5" />
            <div class="shape square c6" />
          </div>
          <div class="rail r3">
            <div class="shape rect c1" />
            <div class="shape diamond c2" />
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>手紙 3</h2>
          <p>この手紙を閉じるころ、また少しやさしくなれますように。</p>
        </div></div>
      </div>
    </section>

    <!-- Bottom action section -->
    <section class="actions">
      <div class="container">
        <div class="actions-inner">
          <div class="buttons">
            <button class="btn yes" @click="onYes">Yes</button>
            <button class="btn no" @click="onNo">No</button>
          </div>
          <div class="status" v-if="displayedAt">
            現在時刻: <strong>{{ displayedAt }}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- Confetti overlay -->
    <canvas v-show="running" ref="canvasRef" class="confetti" />
  </div>
</template>

<style scoped>
.page { color: #e6e7ee; background: #0b1020; min-height: 100vh; }
.lead { min-height: 40vh; display: grid; place-items: center; text-align: center; }

.scene-chunk { height: 140vh; }
.viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; }

.rails { position: absolute; inset: 0; pointer-events: none; }
.rail { position: absolute; left: -40vw; right: -40vw; display: flex; gap: 24px; padding: 16px 24px; }
.rail .shape { height: 56vh; width: 56vh; flex: 0 0 auto; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); filter: brightness(0.98) contrast(1.05) saturate(1.05); }
.rail .shape.rect { width: 84vh; }
.rail .shape.circle { border-radius: 50%; }
.rail .shape.diamond { transform: rotate(45deg) scale(0.85); border-radius: 8px; }

/* drift speeds (rightwards) */
.r1 { top: 10vh; transform: translate3d(calc(var(--p) * 100%), 0, 0); }
.r2 { top: 40vh; transform: translate3d(calc(var(--p) * 80%), 0, 0); }
.r3 { bottom: 6vh; transform: translate3d(calc(var(--p) * 60%), 0, 0); }

/* letter card */
.center { position: relative; display: grid; place-items: center; height: 100vh; }
.paper { width: min(92%, 700px); height: 110vh; overflow: hidden; color: #fff; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(6px) saturate(120%); padding: 28px 32px; border-radius: 12px; transform: translate3d(0, calc(8vh + (var(--p) * -36vh)), 0); }
.paper h2 { margin: 0 0 10px; font-weight: 700; }
.paper p { line-height: 1.9; margin: 0; }

/* bottom actions */
.actions { padding: 64px 24px 96px; background: #0b1020; border-top: 1px solid rgba(255,255,255,0.06); }
.container { max-width: 900px; margin: 0 auto; }
.actions-inner { display: grid; gap: 16px; place-items: center; text-align: center; }
.buttons { display: flex; gap: 12px; }
.btn { padding: 10px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.16); background: rgba(255,255,255,0.08); color: #fff; cursor: pointer; }
.btn.yes { background: linear-gradient(135deg, #34d399, #22d3ee); border-color: transparent; }
.btn.no { background: linear-gradient(135deg, #fca5a5, #fb7185); border-color: transparent; }
.status { color: #fff; opacity: 0.95; }

/* confetti overlay */
.confetti { position: fixed; inset: 0; z-index: 1000; pointer-events: none; }

/* colors */
.c1 { background: linear-gradient(135deg, #a78bfa, #60a5fa); }
.c2 { background: linear-gradient(135deg, #34d399, #22d3ee); }
.c3 { background: linear-gradient(135deg, #f472b6, #fb7185); }
.c4 { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.c5 { background: linear-gradient(135deg, #38bdf8, #6366f1); }
.c6 { background: linear-gradient(135deg, #fca5a5, #f97316); }
</style>

