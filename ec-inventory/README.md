## ✅ 実行手順（バックエンド & フロントエンド）

---

### 🖥️ バックエンド（Spring Boot）

```bash
cd ec-inventory
mvn spring-boot:run
```

- 起動後、`http://localhost:8080` でアプリケーションが動作します。

#### 利用可能なAPIエンドポイント

| メソッド | パス                     | 説明                   |
|----------|--------------------------|------------------------|
| GET      | `/api/products`          | 商品一覧の取得         |
| POST     | `/api/purchase/multiple` | 複数商品の購入処理     |

---

### 🌐 フロントエンド（React + TypeScript）

```bash
cd react-frontend
npm install
npm start
```

- 起動後、`http://localhost:3000` でアプリケーションが表示されます。

---

### ✅ 動作確認手順

1. ブラウザで `http://localhost:3000` にアクセスする。  
2. 商品一覧が表示される（`/api/products` を取得）。  
3. 任意の商品を「カートに入れる」。  
4. カート下部の「購入」ボタンを押す。  
5. `/api/purchase/multiple` にPOSTリクエストが送信され、在庫が更新される。  

---

### 🔧 CORS設定（Spring Boot側で必要な場合）

#### 方法①：Controllerクラスに付与

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    // ...
}
```

#### 方法②：WebMvcConfigurerでグローバル設定

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST");
    }
}
```
