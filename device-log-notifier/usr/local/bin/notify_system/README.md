# 研究室 通知システム (複数装置 + MATLAB対応)

## 概要

本システムは、研究室内で使用される分析装置や MATLAB 実験装置のログファイルを定期的に監視し、特定のキーワードを検出した場合に学内メールサーバを通じて通知を行うものです。

- 手動連絡（週8回、合計40分/週）をゼロに
- 最大30秒の遅延で稼働終了を把握
- cron または systemd.timer による自動実行
- 外部クラウドや外部通知サービスは使用しない

---

## ディレクトリ構成

```bash
/usr/local/bin/notify_system/ 
├── app.py 
├── device_monitor.py 
├── requirements.txt 
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

## YAML設定例（deviceMatlab.yml）

```bash
device_name: "deviceMatlab"
log_file_path: "/shared/logs/matlab_experiment.log"
offset_file_path: "/tmp/deviceMatlab_offset.dat"
pattern: "(Start MATLAB experiment|End MATLAB experiment|ERROR)"
```

## セットアップ手順

### 1. Python環境インストール

```bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip
```

### 2. ライブラリインストール

```bash
cd /usr/local/bin/notify_system
sudo pip3 install -r requirements.txt
```

### 3. 権限設定

```bash
sudo chmod +x /usr/local/bin/notify_system/app.py
sudo chown user:user /shared/logs/matlab_experiment.log
sudo touch /tmp/deviceMatlab_offset.dat
sudo chown user:user /tmp/deviceMatlab_offset.dat
```

## 動作確認（手動実行）

```bash
/usr/bin/python3 /usr/local/bin/notify_system/app.py
```

## 定期実行設定
### cron（30秒間隔相当）

```yaml
crontab -e
* * * * * /usr/bin/python3 /usr/local/bin/notify_system/app.py >> /var/log/notify_system.log 2>&1
* * * * * sleep 30; /usr/bin/python3 /usr/local/bin/notify_system/app.py >> /var/log/notify_system.log 2>&1
```

### systemd.timer（30秒ごとの厳密実行）
#### /etc/systemd/system/notify_system.service

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

#### /etc/systemd/system/notify_system.timer

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

```bash
sudo systemctl enable notify_system.service notify_system.timer
sudo systemctl start notify_system.timer
```

## 拡張方法

新しい装置を追加するには以下の手順で対応できます：

1. `config/deviceX.yml` を作成し、対象装置のログパス・オフセットファイル・検出パターンを定義
2. `app.py` の設定ファイル一覧に `deviceX.yml` を追加
3. 検知するログ内容を変更したい場合は、該当 `.yml` ファイルの `pattern` を修正
4. 通知先メールアドレスは `app.py` 内の `TO_ADDRS` リストを編集

---

## 導入前後の比較

| 指標               | 導入前           | 導入後         |
|--------------------|------------------|----------------|
| 手動通知回数       | 週8回            | 0回            |
| 通知までの遅延     | 平均5分          | 最大30秒       |
| 実験計画の遅延     | 週1日発生         | 解消           |
| 作業時間           | 40分/週          | 0分            |

---

## 備考

- データベース、Web UI、外部クラウドサービスは使用していません。
- 通知メールの本文には、装置ログ中の該当行のみを記載しています（機密情報を含めない設計）。
- 実験失敗・異常終了時の記録にも対応可能で、正規表現の設定で抽出対象を柔軟に変更できます。

---

## 保存場所推奨

このファイルは以下に保存することを推奨します：

```yaml
/usr/local/bin/notify_system/README.md
```
