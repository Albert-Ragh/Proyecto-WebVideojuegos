<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\PlayedGameController;
use App\Http\Controllers\Api\StoreController;

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/showProfile', [AuthController::class, 'showProfile']);
    Route::post('/saveScore', [AuthController::class, 'saveScore']);
    Route::post('/changeName', [AuthController::class, 'changeName']);
    Route::post('/changePassword', [AuthController::class, 'changePassword']);
    Route::get('/getUserUploadGames', [AuthController::class, 'getUserUploadGames']);
});

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/upload', [GameController::class, 'upload']);

Route::get('/gamesList', [GameController::class, 'listGames']);

Route::get('/getRanking', [AuthController::class, 'getRanking']);

Route::post('/createPlayedGame', [PlayedGameController::class, 'createPlayedGame']);

Route::get('/showPlayedGame', [PlayedGameController::class, 'showPlayedGame']);

Route::post('/createStoreItem', [StoreController::class, 'createStoreItem']);

Route::get('/getStoreItems', [StoreController::class, 'getStoreItems']);

Route::post('/buyItems', [StoreController::class, 'buyItems']);

Route::post('/sellItems', [StoreController::class, 'sellItems']);

Route::post('/setAvatar', [StoreController::class, 'setAvatar']);

Route::post('/setBGImage', [StoreController::class, 'setBGImage']);

Route::get('/getBoughtItems', [StoreController::class, 'getBoughtItems']);

Route::get('/showProfileOthers', [AuthController::class, 'showProfileOthers']);

Route::post('/deleteGame/{id}', [GameController::class, 'deleteGame']);

Route::get('/getOtherUserGames', [AuthController::class, 'getOtherUserGames']);

Route::post('/updateGame/{id}', [GameController::class, 'updateGame']);