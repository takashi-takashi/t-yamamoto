<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const root = document.querySelector<HTMLElement>('#letter9')
  if (!root) return
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height - vh
      const p = total > 0 ? Math.min(1, Math.max(0, (0 - rect.top) / total)) : 0
      root.style.setProperty('--p', String(p))
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
      <h1>Parallax 9: Long Letter + Filmstrips</h1>
      <p>Longer scroll with dual flowing image rails.</p>
    </header>

    <section id="letter9" class="scene">
      <div class="viewport">
        <div class="letter">
          <div class="paper">
            <h2>手紙</h2>
            <p>朝の空気はひんやりとして、街はまだ目を覚ましていません。</p>
            <p>ゆっくりと歩けば、昨日と同じ角に、少しだけ違う光が宿ります。</p>
            <p>遠くでは列車が走り、窓の外の景色が、一本のフィルムのように流れていきます。</p>
            <p>その中に、あなたに伝えたい言葉がいくつも見つかりました。</p>
            <p>急がなくても大丈夫。ページをめくるように、ひとつずつ確かめていきましょう。</p>
            <p>季節は巡り、道の表情はいつも少しずつ変わります。</p>
            <p>たとえ同じ道でも、その日だけの足音が残るのだと思います。</p>
            <p>その足音が優しくありますように。今日のあなたに、穏やかな風が吹きますように。</p>
            <p>見上げれば、雲はゆっくりとかたちを変え、太陽はまた新しい影を作ります。</p>
            <p>ここまで読んでくれてありがとう。どうか、よく眠り、よく笑えますように。</p>
            <p class="foot">— 長い朝の散歩より</p>
          </div>
        </div>

        <div class="rails" aria-hidden="true">
          <div class="row top">
            <img class="img" src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop" alt="" />
          </div>
          <div class="row bottom">
            <img class="img" src="https://images.unsplash.com/photo-1526481280698-8fcc13fd5bf3?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop" alt="" />
          </div>
        </div>
      </div>
    </section>

    <section class="after">
      <div class="container">
        <h3>Longer scroll</h3>
        <p>Two horizontal rails move in opposite directions for a wide feel.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { color: #e6e7ee; background: #0b1020; }
.lead { min-height: 40vh; display: grid; place-items: center; text-align: center; }
.scene { height: 360vh; }
.viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; display: grid; grid-template-columns: 1fr 2fr; }

.letter { position: relative; display: grid; place-items: center; padding: 24px; }
.paper {
  width: min(92%, 560px); max-height: 84vh; overflow: auto;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px) saturate(120%);
  color: #fff; padding: 24px 28px; border-radius: 12px;
  transform: translate3d(0, calc(var(--p) * -40px), 0);
}
.paper h2 { margin: 0 0 8px; }
.paper p { line-height: 1.8; margin: 0 0 16px; }
.paper .foot { margin-top: 20px; opacity: 0.8; }

.rails { position: relative; }
.row { position: absolute; left: 0; right: 0; display: flex; gap: 16px; padding: 16px 24px; }
.row.top { top: 8vh; transform: translate3d(calc(var(--p) * -60%), 0, 0); }
.row.bottom { bottom: 8vh; transform: translate3d(calc(var(--p) * 50%), 0, 0); }
.img { height: 72vh; width: auto; flex: 0 0 auto; border-radius: 12px; object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }

.after { padding: 64px 24px 18vh; }
.container { max-width: 900px; margin: 0 auto; }
</style>

