<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Game;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required',
        ]);

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);

        try {
            if ($user->save()) {
                $message = "Registered correctly.";
                return response()->json([$message, 200, 'isRegistered' => true]);
            }
        } catch (QueryException $ex) {
            $message = "Couldn't register.";
            return response()->json([$message, 500, 'isRegistered' => false]);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            return response([$token, $user, 'isLoggedIn' => true]);
        } else {
            return response(['isLoggedIn' => false]);
        }
    }

    public function showProfile()
    {
        $user = Auth::user();
        return response()->json($user);
    }

    public function showProfileOthers(Request $request)
    {

        $userId = $request->userId;
        $user = User::find($userId);

        return $user;
    }

    public function saveScore(Request $request)
    {
        $user = Auth::user();
        $user->totalScore += $request->totalScore;
        $user->jeacstars += $request->totalScore * 0.5;
        $user->save();
        return $user;
    }

    public function changeName(Request $request)
    {
        $user = Auth::user();
        $user->name = $request->name;
        $user->save();
        return $user;
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user();
        $user->password = Hash::make($request->password);
        $user->save();
        return $user;
    }

    public function getRanking()
    {
        $users = User::orderByDesc('totalScore')->get();
        return response()->json($users);
    }

    public function getUserUploadGames(){
        $user = Auth::user();
        $games = Game::where('user_id', $user->id)->get();
        return response()->json($games);
    }

    public function getOtherUserGames(Request $request)
    {
        $userId = $request->userId;
        $games = Game::where('user_id', $userId)->get();
        return response()->json($games);
    }
}
