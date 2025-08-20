#!/usr/bin/env bash
set -euo pipefail

JA_FILE="about/index.html"
EN_FILE="en/about/index.html"

# 追加するセクション（日本語）
read -r -d '' CERTS_JA <<'HTML'
  <h2 class="h2">Certifications</h2>
  <ul>
    <li>
      <strong>Fujitsu Professional Internship 2024</strong><br>
      発行元: 富士通株式会社 / 発行日: 2025/06/03 / 有効期限: 2028/06/02<br>
      <a href="https://www.openbadge-global.com/api/v1.0/openBadge/v2/Wallet/Public/GetAssertionShare/dVR2UFlFV2w3YlBhYTVUd0lCYlhhUT09" target="_blank" rel="noreferrer">
        公開バッジを見る
      </a>
    </li>
  </ul>
HTML

# 追加するセクション（英語）
read -r -d '' CERTS_EN <<'HTML'
  <h2 class="h2">Certifications</h2>
  <ul>
    <li>
      <strong>Fujitsu Professional Internship 2024</strong><br>
      Issuer: Fujitsu Limited / Issued: 2025-06-03 / Expires: 2028-06-02<br>
      <a href="https://www.openbadge-global.com/api/v1.0/openBadge/v2/Wallet/Public/GetAssertionShare/dVR2UFlFV2w3YlBhYTVUd0lCYlhhUT09" target="_blank" rel="noreferrer">
        View Badge
      </a>
    </li>
  </ul>
HTML

# 閉じタグ </main> の直前に差し込む（元の文章はそのまま保持）
insert_before_main_close () {
  local file="$1"
  local block="$2"
  # Windows Git Bash / macOS / Linux どれでも動くように awk で処理
  awk -v RS= -v ORS= -v INS="$block" '
    {
      sub(/<\/main>/, INS "\n</main>")
      print
    }
  ' "$file" > "${file}.tmp"
  mv "${file}.tmp" "$file"
}

insert_before_main_close "$JA_FILE" "$CERTS_JA"
insert_before_main_close "$EN_FILE" "$CERTS_EN"

echo "Certifications section inserted into:"
echo " - $JA_FILE"
echo " - $EN_FILE"
