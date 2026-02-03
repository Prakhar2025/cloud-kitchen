<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('orders', function (Blueprint $table) {
        $table->string('delivery_name')->nullable()->change();
        $table->string('delivery_phone')->nullable()->change();
        $table->text('delivery_address')->nullable()->change();
        $table->string('delivery_city')->nullable()->change();
        $table->string('delivery_pincode')->nullable()->change();
    });
}

public function down()
{
    Schema::table('orders', function (Blueprint $table) {
        $table->string('delivery_name')->nullable(false)->change();
        $table->string('delivery_phone')->nullable(false)->change();
        $table->text('delivery_address')->nullable(false)->change();
        $table->string('delivery_city')->nullable(false)->change();
        $table->string('delivery_pincode')->nullable(false)->change();
    });
}

};
