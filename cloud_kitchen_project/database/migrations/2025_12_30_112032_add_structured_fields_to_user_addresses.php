<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('user_addresses', function (Blueprint $table) {
            $table->string('house_no')->nullable()->after('phone');
            $table->string('building_name')->nullable();
            $table->string('street_name')->nullable();
            $table->string('landmark')->nullable();
        });
    }

    public function down()
    {
        Schema::table('user_addresses', function (Blueprint $table) {
            $table->dropColumn([
                'house_no',
                'building_name',
                'street_name',
                'landmark'
            ]);
        });
    }
};
