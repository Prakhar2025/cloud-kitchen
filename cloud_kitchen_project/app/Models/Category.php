<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'status','image'];

    // Add image URL for API responses
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        // Return full URL for mobile app
        return url('uploads/categories/' . $this->image);
    }

     public function foodItems()
    {
        return $this->hasMany(FoodItem::class);
    }

}
