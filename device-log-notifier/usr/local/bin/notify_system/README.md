# 研究室 通知システム (複数装置 + MATLAB + リソース監視対応)

## 概要

本システムは、研究室内で使用される分析装置や MATLAB 実験装置のログファイルを定期的に監視し、

* 指定キーワードの検出（従来機能）
* MATLAB プロセスの **CPU 時間 / 使用メモリ / 経過秒数** の取得（新機能）

を行い、学内メールサーバ経由で通知します。

* 手動連絡（週 8 回、合計 40 分 / 週）をゼロに
* 最大 30 秒の遅延で稼働終了を把握
* `cron` または `systemd.timer` による自動実行
* 外部クラウドや外部通知サービスは使用しない

---

## ディレクトリ構成

```bash
/usr/local/bin/notify_system/
├── app.py
├── device_monitor.py   # psutil によるリソース監視を実装
├── requirements.txt    # psutil 追記済み
└── config/
    ├── deviceA.yml
    ├── deviceB.yml
    └── deviceMatlab.yml
```

---

## MATLAB ログ出力例

```matlab
% experiment_run.m
logFile = '/shared/logs/matlab_experiment.log';
fid = fopen(logFile, 'a');
fprintf(fid, '[INFO] Start MATLAB experiment: %s\n', datestr(now, 'yyyy-mm-dd HH:MM:SS'));
pause(10);
fprintf(fid, '[INFO] End MATLAB experiment: %s\n', datestr(now, 'yyyy-mm-dd HH:MM:SS'));
fclose(fid);
```

---

## YAML 設定例（deviceMatlab.yml）

```yaml
device_name: "deviceMatlab"
log_file_path: "/shared/logs/matlab_experiment.log"
offset_file_path: "/tmp/deviceMatlab_offset.dat"
pattern: "(Start MATLAB experiment|End MATLAB experiment|ERROR)"
# --- 以下 2 行が追加キー ---
pid_file_path: "/tmp/matlab.pid"          # MATLAB 起動スクリプトで出力する PID ファイル
collect_resource: true                     # true で CPU / メモリ / 経過秒を取得
```

* `pid_file_path` : MATLAB 起動時に `echo $! > /tmp/matlab.pid` で生成してください。
* `collect_resource` : true の場合、通知メールに `[RES] pid=... cpu_sec=... rss=... elapsed_sec=...]` が追記されます。

---

## セットアップ手順

### 1. Python 環境インストール

```bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip
```

### 2. ライブラリインストール

`requirements.txt` に `psutil` を追加済みです。

```bash
cd /usr/local/bin/notify_system
sudo pip3 install -r requirements.txt
```

### 3. 権限設定

```bash
sudo chmod +x /usr/local/bin/notify_system/app.py
sudo chown user:user /shared/logs/matlab_experiment.log
sudo touch /tmp/deviceMatlab_offset.dat /tmp/matlab.pid
sudo chown user:user /tmp/deviceMatlab_offset.dat /tmp/matlab.pid
```

---

## MATLAB プロセス起動例（PID ファイル生成）

```bash
nohup matlab -batch experiment_run.m & echo $! > /tmp/matlab.pid
```

---

## 動作確認（手動実行）

```bash
/usr/bin/python3 /usr/local/bin/notify_system/app.py
```

メール本文にログ行と `[RES] ...` 行が含まれていれば成功です。

---

## 定期実行設定

### cron（30 秒間隔）

```bash
crontab -e
* * * * * /usr/bin/python3 /usr/local/bin/notify_system/app.py >> /var/log/notify_system.log 2>&1
* * * * * sleep 30; /usr/bin/python3 /usr/local/bin/notify_system/app.py >> /var/log/notify_system.log 2>&1
```

### systemd.timer（30 秒間隔厳密実行）

<details>
<summary>/etc/systemd/system/notify_system.service</summary>

```ini
[Unit]
Description=Notify System Service

[Service]
ExecStart=/usr/bin/python3 /usr/local/bin/notify_system/app.py
StandardOutput=append:/var/log/notify_system.log
StandardError=append:/var/log/notify_system.log
Restart=always

[Install]
WantedBy=multi-user.target
```

</details>

<details>
<summary>/etc/systemd/system/notify_system.timer</summary>

```ini
[Unit]
Description=Notify System Timer

[Timer]
OnBootSec=30
OnUnitActiveSec=30
Unit=notify_system.service

[Install]
WantedBy=multi-user.target
```

</details>

```bash
sudo systemctl enable notify_system.service notify_system.timer
sudo systemctl start notify_system.timer
```

---

## 拡張方法

1. `config/deviceX.yml` を作成し、ログパス・オフセットファイル・検出パターン・PID ファイルパス・collect_resource を定義。
2. `app.py` の設定ファイル一覧に `deviceX.yml` を追加。
3. ログ抽出条件を変更する場合、該当 YAML の `pattern` を修正。
4. 通知先メールアドレスは `app.py` 内の `TO_ADDRS` リストを編集。

---

## 導入前後の比較

| 指標            | 導入前 | 導入後 |
|-----------------|--------|--------|
| 手動通知回数    | 週 8 回 | 0 回 |
| 通知遅延        | 平均 5 分 | 最大 30 秒 |
| 実験計画の遅延  | 週 1 日発生 | 解消 |
| 作業時間        | 40 分 / 週 | 0 分 |
| リソース可視化  | なし | CPU 秒 / メモリがメール本文に表示 |

---

## 備考

* データベース、Web UI、外部クラウドサービスは使用していません。
* 通知メールの本文には、装置ログ中の該当行と `[RES] ...` の計測行のみを記載します（機密情報を含めない設計）。
* 実験失敗・異常終了時の記録にも対応可能で、正規表現の設定で抽出対象を柔軟に変更できます。

---

## 保存場所推奨

```bash
/usr/local/bin/notify_system/README.md
```

