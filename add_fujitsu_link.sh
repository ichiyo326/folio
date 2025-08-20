#!/usr/bin/env bash
set -euo pipefail

# === 日本語 (data/projects-ja.json) 編集 ===
# "fujitsu-japan-platform" の links を差し替え
jq '
  map(
    if .slug == "fujitsu-japan-platform"
    then .links = [{"href":"../certs/Fujitsu Professional Internship 2024_certificate.pdf","label":"修了証明 (PDF)"}]
    else .
    end
  )
' data/projects-ja.json > data/projects-ja.tmp && mv data/projects-ja.tmp data/projects-ja.json

# === 英語 (data/projects-en.json) 編集 ===
jq '
  map(
    if .slug == "fujitsu-japan-platform"
    then .links = [{"href":"../../certs/Fujitsu Professional Internship 2024_certificate.pdf","label":"Certificate (PDF)"}]
    else .
    end
  )
' data/projects-en.json > data/projects-en.tmp && mv data/projects-en.tmp data/projects-en.json

# === Gitへ追加・コミット・プッシュ ===
git add data/projects-ja.json data/projects-en.json
git commit -m "feat(projects): add Fujitsu Professional Internship certificate PDF link to Fujitsu Japan project"
git push origin main
