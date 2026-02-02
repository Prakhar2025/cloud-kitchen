<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodItem extends Model
{
    use HasFactory;
protected $fillable = [
    'category_id',
    'name',
    'description',
    'price',
    'image',
    'type',
    'is_available'
];

    public function category()
{
    return $this->belongsTo(Category::class);
}

public function ratings()
{
    return $this->hasMany(Rating::class, 'food_item_id');
}


}
