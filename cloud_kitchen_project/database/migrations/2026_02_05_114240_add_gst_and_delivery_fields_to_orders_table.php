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
            $table->decimal('subtotal', 10, 2)->nullable()->after('total_amount');
            $table->decimal('gst_amount', 10, 2)->nullable();
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('payment_processing_fee', 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'gst_amount', 'delivery_charge', 'payment_processing_fee']);
        });
    }
};
