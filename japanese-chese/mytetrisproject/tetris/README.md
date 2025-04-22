# Tetris Game - Django + JavaScript

## 概要

このプロジェクトは、**Django** をバックエンドとして、**JavaScript** と **Canvas API** を使用して実装された**テトリスゲーム**です。ユーザーは操作方法に従ってミノを動かし、回転させ、速度を調整できます。ゲームオーバー後は自動でリセットされ、再度プレイが可能です。

## 機能

- **ミノ操作**
  - 左右移動（← / →）
  - 下に移動（↓）
  - 回転（↑）
  - 一気に落下（Enter）
  - ミノ変更（＜ / ＞）
  
- **速度調整**
  - 落下速度を「Slow / Normal / Fast」に切り替え可能
  
- **ゲームオーバー後、再スタート可能**

## 技術スタック

- **バックエンド**: Django
- **フロントエンド**: JavaScript, HTML5 (Canvas API)
- **データベース**: SQLite (Djangoデフォルト)
- **フレームワーク**: Spring Boot（APIサーバとしての構成）

## セットアップ

### 1. 環境構築

まず、Python と Django がインストールされていることを確認してください。

```bash
python --version
pip install django
```

### 2. プロジェクトの作成
プロジェクトをクローンして、必要な依存関係をインストールします。

```bash
git clone https://github.com/yourusername/tetris-game.git
cd tetris-game
pip install -r requirements.txt
```

### 3. データベースのマイグレーション
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. サーバの起動
サーバを起動し、ブラウザでゲームをプレイします。
```bash
python manage.py runserver
```
ブラウザで http://127.0.0.1:8000/ を開きます。

主要ファイル
tetris/static/tetris/js/tetris.js: ゲームロジックを実装しているJavaScriptファイル

tetris/templates/tetris/game.html: ゲーム画面のHTMLテンプレート

tetris/views.py: ゲームビューとスコア保存用のバックエンドロジック

操作方法
← / →: 左右にミノを移動

↓: 1段下に移動

↑: 回転

Enter: ミノを一気に落下

＜ / ＞: 現在のミノを変更

Speed: Slow / Normal / Fast で落下速度を変更

開発の背景
このプロジェクトは、バックエンド開発やWebフレームワークに対する理解を深めるために開発しました。Djangoを使用し、クライアント側でのインタラクションをJavaScriptとCanvasで実現することに挑戦しました。

今後の改善点
ハイスコア機能の追加

ミノのゴースト（影）表示

サウンドエフェクトの追加（回転、着地、ゲームオーバー時）

