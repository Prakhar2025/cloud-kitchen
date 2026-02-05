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

    // Add image URL for API responses
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        // Return full URL for mobile app
        return url('uploads/banners/' . $this->image);
    }

    public function foodItem(){
        return $this->belongsTo(FoodItem::class);
    }
}

