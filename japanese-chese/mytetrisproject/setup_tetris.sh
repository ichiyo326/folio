#!/bin/bash

PROJECT_NAME="mytetrisproject"
APP_NAME="tetris"

echo "== Django アプリを作成中: $APP_NAME =="
python manage.py startapp $APP_NAME

SETTINGS_FILE="$PROJECT_NAME/settings.py"
grep -q "'$APP_NAME'" $SETTINGS_FILE || \
  sed -i "/INSTALLED_APPS = \[/a\    '$APP_NAME'," $SETTINGS_FILE

PROJECT_URL="$PROJECT_NAME/urls.py"
if ! grep -q "include('$APP_NAME.urls')" "$PROJECT_URL"; then
  sed -i "/from django.urls import path/a\\from django.urls import include" "$PROJECT_URL"
  sed -i "/urlpatterns = \[/a\\    path('', include('$APP_NAME.urls'))," "$PROJECT_URL"
fi

mkdir -p $APP_NAME/templates/$APP_NAME
mkdir -p $APP_NAME/static/$APP_NAME/js

cat > $APP_NAME/models.py <<EOF
from django.db import models
from django.contrib.auth.models import User

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.score}"
EOF

cat > $APP_NAME/views.py <<EOF
from django.shortcuts import render
from django.http import JsonResponse
from .models import Score

def game_view(request):
    return render(request, '$APP_NAME/game.html')

def save_score(request):
    if request.method == 'POST':
        new_score = request.POST.get('score')
        Score.objects.create(score=new_score, user=request.user if request.user.is_authenticated else None)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)
EOF

cat > $APP_NAME/urls.py <<EOF
from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_view, name='${APP_NAME}_game'),
    path('save_score/', views.save_score, name='save_score'),
]
EOF

cat > $APP_NAME/templates/$APP_NAME/game.html <<'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Web Tetris</title>
    <script src="{% static 'tetris/js/tetris.js' %}"></script>
    <style>
      #gameCanvas {
        border: 1px solid #000;
        display: block;
        margin: 20px auto;
      }
      #score {
        text-align: center;
        font-size: 24px;
      }
      #controls {
        text-align: center;
      }
    </style>
</head>
<body>
    <h1 style="text-align:center;">Tetris</h1>
    <canvas id="gameCanvas" width="240" height="480"></canvas>
    <div id="score">Score: 0</div>
    <div id="controls">
        <button onclick="startGame()">Start</button>
    </div>
</body>
</html>
EOF

cat > $APP_NAME/static/$APP_NAME/js/tetris.js <<'EOF'
// ここに後でテトリス本体JSを貼り付けます
EOF

python manage.py makemigrations
python manage.py migrate

echo "== 完了: ブラウザで http://127.0.0.1:8000/ を開いてください =="
