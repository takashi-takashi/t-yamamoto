<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const scenes = Array.from(document.querySelectorAll<HTMLElement>('.scene-chunk'))
  if (!scenes.length) return
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
</script>

<template>
  <div class="page">
    <header class="lead">
      <h1>Parallax 10: Long Journey Letter</h1>
      <p>Much longer scroll with multi-rail panorama and long prose.</p>
    </header>

    <!-- 5つのパララックス領域に分割 -->
    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r1">
            <div class="shape square c1"></div>
            <div class="shape circle c2"></div>
            <div class="shape diamond c3"></div>
          </div>
          <div class="rail r2">
            <div class="shape rect c4"></div>
            <div class="shape circle c5"></div>
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>第1章 出発</h2>
          <p>出発の朝、荷物は軽く、心は少しだけ重く。見送りの手が小さく揺れて、角を曲がるころにはもう見えなくなる。</p>
          <p>歩幅を合わせるように、街路樹が一定のリズムで過ぎていく。</p>
        </div></div>
      </div>
    </section>

    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r2">
            <div class="shape square c6"></div>
            <div class="shape circle c1"></div>
            <div class="shape rect c2"></div>
          </div>
          <div class="rail r3">
            <div class="shape diamond c3"></div>
            <div class="shape square c4"></div>
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>第2章 車窓</h2>
          <p>列車に乗れば、窓は一本の長い映画館。鳥の影、農道の曲線、川面の光。スクリーンはいつだって今ここにある。</p>
          <p>速度が上がるほど、思い出は粒になってきらめく。</p>
        </div></div>
      </div>
    </section>

    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r1">
            <div class="shape circle c5"></div>
            <div class="shape square c6"></div>
          </div>
          <div class="rail r3">
            <div class="shape rect c1"></div>
            <div class="shape diamond c2"></div>
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>第3章 途中の町</h2>
          <p>駅ごとに違う匂いがして、会話のリズムが変わる。見知らぬ町の標識は、いつの間にか読めるようになっていく。</p>
          <p>どこに着くのかよりも、どんなふうに着くのかを知りたくて、ページを増やすように、駅を重ねる。</p>
        </div></div>
      </div>
    </section>

    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r2">
            <div class="shape square c3"></div>
            <div class="shape circle c4"></div>
          </div>
          <div class="rail r1">
            <div class="shape rect c5"></div>
            <div class="shape square c6"></div>
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>第4章 トンネル</h2>
          <p>トンネルでは自分の顔が映り、外の景色は闇の奥にたたまれる。短い静けさが過ぎれば、また世界はほどけていく。</p>
          <p>遠くの山は近づけば形を変え、近くのものは離れてはじめて輪郭を持つ。</p>
        </div></div>
      </div>
    </section>

    <section class="scene-chunk">
      <div class="viewport">
        <div class="rails" aria-hidden="true">
          <div class="rail r3">
            <div class="shape diamond c2"></div>
            <div class="shape circle c1"></div>
          </div>
          <div class="rail r2">
            <div class="shape square c4"></div>
            <div class="shape rect c3"></div>
          </div>
        </div>
        <div class="center"><div class="paper">
          <h2>第5章 余白</h2>
          <p>振り返るたび、昨日よりも静かな気持ちで、同じ道を新しく歩ける気がする。きょうの手紙はここまで。続きをまたどこかで。</p>
          <p class="foot">— 長い旅路より</p>
        </div></div>
      </div>
    </section>

    <section class="after">
      <div class="container">
        <h3>Very long scroll</h3>
        <p>Three rails drift in different directions/speeds under a sticky letter.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { color: #e6e7ee; background: #0b1020; }
.lead { min-height: 40vh; display: grid; place-items: center; text-align: center; }
.scene-chunk { height: 140vh; }
.viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; }

.rails { position: absolute; inset: 0; pointer-events: none; }
.rail { position: absolute; left: -40vw; right: -40vw; display: flex; gap: 24px; padding: 16px 24px; }
.rail img { display: none; }
.rail .shape {
  height: 56vh; width: 56vh; flex: 0 0 auto;
  border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  filter: brightness(0.98) contrast(1.05) saturate(1.05);
}
.rail .shape.rect { width: 84vh; }
.rail .shape.circle { border-radius: 50%; }
.rail .shape.diamond { transform: rotate(45deg) scale(0.85); border-radius: 8px; }

/* color palettes for shapes */
.c1 { background: linear-gradient(135deg, #a78bfa, #60a5fa); }
.c2 { background: linear-gradient(135deg, #34d399, #22d3ee); }
.c3 { background: linear-gradient(135deg, #f472b6, #fb7185); }
.c4 { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.c5 { background: linear-gradient(135deg, #38bdf8, #6366f1); }
.c6 { background: linear-gradient(135deg, #fca5a5, #f97316); }

/* three horizontal rails moving at different speeds/directions */
.r1 { top: 10vh; transform: translate3d(calc(var(--p) * -40%), 0, 0); }
.r2 { top: 40vh; transform: translate3d(calc(var(--p) * 25%), 0, 0); }
.r3 { bottom: 6vh; transform: translate3d(calc(var(--p) * -12%), 0, 0); }

.center { position: relative; display: grid; place-items: center; height: 100vh; }
.paper {
  width: min(92%, 700px);
  height: 110vh; /* 各セクションごとに少し見切れる */
  overflow: hidden;
  color: #fff;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px) saturate(120%);
  padding: 28px 32px;
  border-radius: 12px;
  /* 各セクションの進捗でゆっくり上下に移動 */
  transform: translate3d(0, calc(8vh + (var(--p) * -36vh)), 0);
}
.chunk { padding: 14px 0 6px; }
.paper h2 { margin: 0 0 10px; font-weight: 700; }
.paper p { line-height: 1.9; margin: 0 0 14px; }
.paper .foot { margin-top: 10px; opacity: 0.85; }

.after { padding: 64px 24px 18vh; }
.container { max-width: 900px; margin: 0 auto; }
</style>
