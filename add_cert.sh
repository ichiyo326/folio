#!/usr/bin/env bash
set -euo pipefail

# ===== パス設定 =====
PDF_PATH="certs/Fujitsu Professional Internship 2024_certificate.pdf"

# ===== 日本語版 about に追記 =====
cat >> about/index.html <<'HTML'

<h2 class="h2">Certifications</h2>
<ul>
  <li>
    <strong>Fujitsu Professional Internship 2024</strong><br>
    発行元: 富士通株式会社 / 発行日: 2025/06/03 / 有効期限: 2028/06/02<br>
    <a href="../certs/Fujitsu Professional Internship 2024_certificate.pdf" target="_blank" rel="noreferrer">
      PDFを開く
    </a>
  </li>
</ul>
HTML

# ===== 英語版 about に追記 =====
cat >> en/about/index.html <<'HTML'

<h2 class="h2">Certifications</h2>
<ul>
  <li>
    <strong>Fujitsu Professional Internship 2024</strong><br>
    Issuer: Fujitsu Limited / Issued: 2025-06-03 / Expires: 2028-06-02<br>
    <a href="../../certs/Fujitsu Professional Internship 2024_certificate.pdf" target="_blank" rel="noreferrer">
      Open PDF
    </a>
  </li>
</ul>
HTML

# ===== Git 反映 =====
git add "$PDF_PATH" about/index.html en/about/index.html
git commit -m "feat(about): add Fujitsu Professional Internship 2024 certification PDF link"
git push origin main
