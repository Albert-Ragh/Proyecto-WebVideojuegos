<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('played_games', function (Blueprint $table) {
            $table->bigInteger('userId')->unsigned();
            $table->bigInteger('gameId')->unsigned();
            $table->bigInteger('score');

            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('gameId')->references('id')->on('games')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('played_games');
    }
};