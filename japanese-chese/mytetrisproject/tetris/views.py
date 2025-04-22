from django.shortcuts import render
from django.http import JsonResponse
from .models import Score

def game_view(request):
    return render(request, 'tetris/game.html')

def save_score(request):
    if request.method == 'POST':
        new_score = request.POST.get('score')
        Score.objects.create(score=new_score, user=request.user if request.user.is_authenticated else None)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)
