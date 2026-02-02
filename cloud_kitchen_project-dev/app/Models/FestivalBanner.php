<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FestivalBanner extends Model
{
    protected $fillable = [
        'title',
        'image',
        'is_active',
        'start_date',
        'end_date',
        'food_item_id',
    ];

    public function foodItem(){
        return $this->belongsTo(FoodItem::class);
    }
}

