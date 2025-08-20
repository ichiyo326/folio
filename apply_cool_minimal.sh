#!/usr/bin/env bash
set -euo pipefail

# --- どの階層に index.html があるか自動検出（., ./folio, ./folio/folio を順にチェック） ---
detect_base() {
  for d in "." "folio" "folio/folio"; do
    if [[ -f "$d/index.html" && -d "$d/assets" ]]; then
      echo "$d"
      return
    fi
  done
  echo "index.html が見つかりません。リポジトリ直下 or folio/ or folio/folio で実行してください。" 1>&2
  exit 1
}
BASE="$(detect_base)"

ASSETS="$BASE/assets"
CSS="$ASSETS/styles.css"
JS="$ASSETS/main.js"

INDEX_JA="$BASE/index.html"
INDEX_EN="$BASE/en/index.html"
PROJ_JA="$BASE/projects/index.html"
PROJ_EN="$BASE/en/projects/index.html"

# --- CSSにクール・ミニマルのパレット＆アニメ＆カードホバーを追記（重複防止） ---
if ! grep -q "/* COOL_MINIMAL_V1 */" "$CSS"; then
  cat >> "$CSS" <<'CSSX'

/* COOL_MINIMAL_V1 ---------------------------------------------- */
:root{
  --bg:#ffffff;
  --fg:#0a0a0a;
  --muted:#6b7280;
  --line:#e5e7eb;
  --pri:#111111;         /* ボタンや強調: 黒 */
  --acc:#0ea5e9;         /* アクセント: 淡いシアン */
}
body{background:var(--bg);color:var(--fg)}
header, footer{background:#fff}

/* Hero: グラデーション＋幾何装飾（写真なし） */
.hero--minimal{
  position:relative;
  padding:72px 0 56px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  overflow:hidden;
}
.hero--minimal .kicker{letter-spacing:.06em;color:var(--muted);font-size:13px;text-transform:uppercase}
.hero--minimal h1{font-size:clamp(28px,5.5vw,44px);line-height:1.2;margin:12px 0 8px}
.hero--minimal p.lead{color:#334155;max-width:60ch}

/* 装飾の円／ライン（CSSだけ） */
.hero--minimal::before,
.hero--minimal::after{
  content:"";
  position:absolute;
  pointer-events:none;
  border-radius:999px;
  filter: blur(24px);
  opacity:.35;
}
.hero--minimal::before{
  width:360px;height:360px; top:-120px; right:-120px;
  background:radial-gradient(circle at 30% 30%, #e2e8f0, #ffffff 60%);
  border:1px solid var(--line);
}
.hero--minimal::after{
  width:260px;height:260px; bottom:-80px; left:-80px;
  background:radial-gradient(circle at 70% 70%, #f1f5f9, #ffffff 60%);
  border:1px solid var(--line);
}

/* CTA */
.btn{
  display:inline-block; padding:10px 14px; border-radius:10px;
  border:1px solid var(--line); text-decoration:none; color:inherit;
  transition:transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.btn--dark{background:var(--pri); color:#fff; border-color:var(--pri)}
.btn:hover{transform:translateY(-2px); box-shadow:0 6px 22px rgba(0,0,0,.06)}
.btn:focus{outline:2px solid var(--acc); outline-offset:2px}

/* カード（Projects） */
.card{transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease}
.card:hover{transform: translateY(-3px); box-shadow:0 10px 26px rgba(0,0,0,.06); border-color:#dbe3ea}

/* グリッド余白微調整 */
.grid{gap:18px}
@media(min-width:900px){ .grid{gap:20px} }

/* セクションの下余白 */
section{margin-bottom:28px}

/* スクロールアニメ */
.animate{opacity:0; transform:translateY(16px); transition:all .6s cubic-bezier(.2,.65,.2,1)}
.animate.is-in{opacity:1; transform:none}
/* --------------------------------------------------------------- */
CSSX
fi

# --- main.js に IntersectionObserver を追記（重複防止） ---
if ! grep -q "IntersectionObserver" "$JS"; then
  cat >> "$JS" <<'JSX'

// Scroll-in animations (Cool Minimal)
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.animate');
  if (!('IntersectionObserver' in window) || els.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
});
JSX
fi

# --- Hero を差し替え（JA/EN両方）。既存 <section class="hero">〜</section> を置換、無ければ先頭に注入 ---
replace_hero () {
  local FILE="$1"
  local LANG="$2" # ja|en
  local CTA_GH='https://github.com/ichiyo326'
  local CTA_RS='#'
  local CTA_MAIL='mailto:er325198s@gmail.com'

  local H1 KICKER LEAD BTN1 BTN2 BTN3
  if [[ "$LANG" == "ja" ]]; then
    KICKER="PORTFOLIO"
    H1="整合性と可読性を両立する、クール・ミニマル。"
    LEAD="写真に頼らず、文字・色・図形・アニメーションで情報を最短距離で伝えるUI。現場の判断を早く、誤解を減らす設計を心がけています。"
    BTN1="GitHub"
    BTN2="Resume"
    BTN3="Email"
  else
    KICKER="PORTFOLIO"
    H1="Cool & Minimal—clarity without photos."
    LEAD="No photos, just type, shapes, motion, and color to communicate fast and clearly. Designed for quick evaluations and fewer misunderstandings."
    BTN1="GitHub"
    BTN2="Resume"
    BTN3="Email"
  fi

  # 新しいHeroブロック
  read -r -d '' NEW_HERO <<HTML || true
<section class="hero hero--minimal animate">
  <div class="wrap">
    <div class="kicker">$KICKER</div>
    <h1>$H1</h1>
    <p class="lead">$LEAD</p>
    <div class="cta" style="margin-top:16px">
      <a class="btn btn--dark" href="$CTA_GH" target="_blank" rel="noreferrer">$BTN1</a>
      <a class="btn" href="$CTA_RS" target="_blank" rel="noreferrer">$BTN2</a>
      <a class="btn" href="$CTA_MAIL">$BTN3</a>
    </div>
  </div>
</section>
HTML

  # 既存の hero セクションを置換（最初の1個だけ）
  if grep -q '<section[^>]*class="[^"]*hero' "$FILE"; then
    awk -v RS= -v ORS= -v BLOCK="$NEW_HERO" '
      {
        # 1回だけ <section ... hero 〜 </section> を BLOCK に置換
        if (match($0, /<section[^>]*class="[^"]*hero[^"]*"[^>]*>.*?<\/section>/s)) {
          before = substr($0, 1, RSTART-1)
          after  = substr($0, RSTART+RLENGTH)
          $0 = before BLOCK after
        }
        print
      }
    ' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
  else
    # なければ <main class="wrap"> の直下に挿入
    awk -v RS= -v ORS= -v BLOCK="$NEW_HERO" '
      { sub(/<main[^>]*class="[^"]*wrap[^"]*"[^>]*>/, "&\n" BLOCK); print }
    ' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
  fi
}

replace_hero "$INDEX_JA" "ja"
replace_hero "$INDEX_EN" "en"

# --- Projectsのカードをアニメ対象に（JSで監視される）: h1の下に注意書き追加＆ラッパへ .animate 付与 ---
mark_projects_animate () {
  local FILE="$1"
  # grid直前に data-hook を一つ仕込む（.grid に animate を付けたいがHTMLはJS描画）
  # → .grid を囲う div.wrapper を作って animate を与える
  if ! grep -q 'data-projects-animated' "$FILE"; then
    awk -v RS= -v ORS= '
      {
        sub(/<div class="grid">/, "<div data-projects-animated class=\"animate\"><div class=\"grid\">")
        gsub("</div>\\s*</main>", "</div>\n</main>")
        print
      }
    ' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
  fi
}

mark_projects_animate "$PROJ_JA" || true
mark_projects_animate "$PROJ_EN" || true

echo "Cool Minimal を適用しました："
echo " - $CSS にパレット/カード/アニメを追加"
echo " - $JS にスクロールアニメを追加"
echo " - $INDEX_JA / $INDEX_EN の Hero を刷新"
echo " - Projects リストにアニメ用ラッパを追加"
