#!/usr/bin/env bash
set -euo pipefail

edit() {
  local file="$1"
  local lang="$2"  # ja|en
  python - <<'PY' "$file" "$lang"
import json, sys, io, os
path, lang = sys.argv[1], sys.argv[2]
with io.open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)
for item in data:
    if item.get('slug') == 'fujitsu-japan-platform':
        if lang == 'ja':
            item['links'] = [{
                'href': '../certs/Fujitsu Professional Internship 2024_certificate.pdf',
                'label': '修了証明 (PDF)'
            }]
        else:
            item['links'] = [{
                'href': '../../certs/Fujitsu Professional Internship 2024_certificate.pdf',
                'label': 'Certificate (PDF)'
            }]
with io.open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
PY
}

edit data/projects-ja.json ja
edit data/projects-en.json en

git add data/projects-ja.json data/projects-en.json
git commit -m "feat(projects): add certificate PDF link to Fujitsu Japan project"
git push origin main
