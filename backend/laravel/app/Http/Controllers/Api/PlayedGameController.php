<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlayedGame;
use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PlayedGameController extends Controller
{
    public function createPlayedGame(Request $request)
    {
        $playedGame = new PlayedGame;
        $playedGame->userId = $request->userId;
        $playedGame->gameId = $request->gameId;
        $playedGame->score = $request->score;

        $playedGame->save();
    }

    public function showPlayedGame(Request $request)
    {
        $userId = $request->userId;
        $playedGames = PlayedGame::join('games', 'played_games.gameId', '=', 'games.id')
            ->join('users', 'played_games.userId', '=', 'users.id')
            ->where('played_games.userId', $userId)
            ->select('played_games.*', 'games.name', 'users.name as username')
            ->get();

        return $playedGames;
    }
}
