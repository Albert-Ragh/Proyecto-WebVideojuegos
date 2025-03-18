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
        Schema::create('user_x_items', function (Blueprint $table) {
            $table->bigInteger('userId')->unsigned();
            $table->bigInteger('itemId')->unsigned();
            $table->boolean('avatar')->default(false);
            $table->boolean('bgImage')->default(false);

            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('itemId')->references('id')->on('stores')->onDelete('cascade');
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
        Schema::dropIfExists('user_x_items');
    }
};
