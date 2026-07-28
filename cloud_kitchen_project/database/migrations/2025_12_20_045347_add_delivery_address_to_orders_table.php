<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->string('delivery_name')->after('user_id');
        $table->string('delivery_phone');
        $table->text('delivery_address');
        $table->string('delivery_city');
        $table->string('delivery_pincode');
    });
}


    /**
     * Reverse the migrations.
     */
   public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropColumn([
            'delivery_name',
            'delivery_phone',
            'delivery_address',
            'delivery_city',
            'delivery_pincode'
        ]);
    });
}

};
