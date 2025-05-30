# 樋口裕季 (ひぐち ゆうき) - ポートフォリオ

## 自己紹介・経歴
樋口 裕季（ひぐち ゆうき）と申します。1999年5月12日生（25歳）で、東京農工大学大学院 知能情報システム工学専攻（修了見込み：2026年3月）に在籍しています。大学および大学院で情報工学を専攻し、**JavaによるWebバックエンド**や**複数話者音声の音源分離研究**に取り組んできました。バックエンド開発のトランザクション制御・並列アクセス処理や、音響信号処理（SNR/SDR向上手法）について知見があります。

---

## 学歴
- **2015年4月～2018年3月**  
  佐賀県立佐賀西高校 普通科 卒業

- **2019年4月～2023年3月**  
  東京農工大学 工学部 知能情報システム工学科 数理情報コース 卒業

- **2023年4月～現在**  
  東京農工大学大学院 工学府 知能情報システム工学専攻 在籍  
  （**2026年3月 修了見込み**）

---

## インターン・アルバイト経験

### 1. 株式会社ヒューメイヤ
- **就業期間:** 2023年4月～2024年8月（約1年4か月）
- **業務内容:**
  - Javaを用いたREST APIの設計・実装（バックエンド）
  - JavaScript + Ajaxによる在庫動的更新機能の開発
  - 同時アクセス下の在庫整合性を保つためのトランザクション＋ロック制御の導入
  - 複数商品をまとめて購入できるUI/UX改善の実装（注文手続き40%短縮）

### 2. 油井コンサルティング
- **就業期間:** 2024年9月～（現在進行中）
- **業務内容:**
  - VB.NET / VB / C# を用いた電子カルテのデータ移行スクリプトの作成
  - 医療データフォーマットの変換・バリデーションの実施
  - 移行後テスト、不具合修正、マニュアル整備、データ品質維持支援

### 3. 株式会社マネーフォワード
- **就業期間:** 2025年3月～4月（10日間）
- **業務内容:**
  - Ruby on Rails でバックエンド開発業務に参加
  - API設計や既存機能の修正タスクを通じて、実務フローに準じた開発工程を体験

### 4. 富士通株式会社
- **就業期間:** 2025年4月～5月（約1か月半）
- **業務内容:**
  - 富士通共通基盤の導入支援業務に従事
  - 社内システム向けに共通コンポーネントの展開、設定、動作検証を担当

---

## 技術スタック

| 分類                     | 技術・ツール                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **プログラミング言語**    | Java（3年以上）, JavaScript（3年以上）, SQL（MySQL 2年）, Python／C++／MATLAB（研究・演習で3年以上） |
| **フレームワーク / ライブラリ** | Spring Boot, JUnit, VB.NET, NumPy/SciPy, Slack API |
| **データベース / ツール**| MySQL, Git, GitHub, Linux(Cron), AWS（EC2, RDS）                                          |
| **その他**               | REST API設計, Ajax(非同期通信), トランザクション・ロック制御, データ移行 (VBによるスクリプト開発)     |

---

## 代表プロジェクト

### ECサイト在庫管理APIの開発
- **概要:**  
  Java (Spring Boot) を用いたECサイト向け在庫管理APIを開発。複数ユーザーの同時アクセスでも在庫数がずれないよう、トランザクションと排他制御を実装。
- **技術:**  
  Spring Boot, MySQLトランザクション制御, 楽観／悲観ロック, JUnitテスト
- **成果:**  
  注文ステップ40%削減、在庫不整合ゼロ達成、キャンセル率の低減

### 装置ログ監視・Slack通知システムの開発
- **概要:**  
  実験装置のログをPythonスクリプトで定期監視し、Slack APIを使ってリアルタイム通知。
- **技術:**  
  Python, cron, Slack API, ファイル監視処理, メール・通知設計
- **成果:**  
  通知遅延 最大数分→30秒以下に短縮、週8件の手動確認をゼロに

### 音声分離研究・機械学習（大学院研究）
- **概要:**  
  ICAとSTFTを活用し、混合音声から各話者の声を分離。SNR/SDR/話者識別率を改善し、実環境下での認識精度向上を実現。
- **技術:**  
  MATLAB, Python, 音響信号処理, ICA, SDR/SNR評価, GitLab活用
- **成果:**  
  SNRを18→20.5dBに向上、話者識別率82%、分離精度を定量的に評価可能に

---

### **DjangoとPython、JavaScriptで作成したテトリスゲーム**
- **概要:**  
  Djangoをバックエンドに、JavaScript（Canvas）を用いて、クライアント側で動作するテトリスゲームを作成。ゲーム内では、ユーザーがミノの動き、回転、スピードを操作でき、ゲームオーバー後のリスタートも実現。
- **技術:**  
  Django, JavaScript, Canvas API, HTML, CSS
- **成果:**  
  ゲーム内でスコア記録、ハードドロップ機能、速度調整機能を実装。ゲームオーバー後のリセットが機能し、操作方法説明やユーザーインタラクションも実装。

---

## 開発で重視している考え方

- **品質担保:** コードレビュー、例外処理、ログ出力、静的解析、CIを重視  
- **データ整合性:** 排他制御・一貫性保持・トランザクション設計を重視  
- **テストと検証:** 単体/結合テスト、負荷テストを通じた定量評価・検証を実施

---

## GitHubリポジトリ構成

このポートフォリオ用にまとめたGitHubリポジトリは、プロジェクトごとにディレクトリを分けています。


```
├─ README.md                    # ポートフォリオ概要（本ドキュメント）
├─ device-log-notifier/         # 装置ログ監視・通知システム (Python + cron)
├─ ec-inventory                 # Java+SpringbootでのECサイト仮実装
├─ tetris-game # DjangoとJavaScriptで作成したテトリスゲーム
```

### `device-log-notifier/`
Pythonスクリプトとcron設定例、Slack APIとの連携用コードを掲載。  
ログファイル監視・リアルタイム通知システムの構成と設定例も含む。

---

これらの経験・開発実績をもとに、ソフトウェアエンジニアとしてトランザクション制御・在庫管理システムなどの**バックエンド開発**から、**音声処理分野でのR&D**まで、幅広く貢献できるよう努めています。

ご興味を持っていただけましたら、リポジトリ内の各READMEやソースコードをご覧いただければ幸いです。今後も機能追加や新しい技術の検証を随時アップデートし、より高品質なシステム設計・実装を目指していきます。
