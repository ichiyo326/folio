from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_view, name='tetris_game'),
    path('save_score/', views.save_score, name='save_score'),
]
