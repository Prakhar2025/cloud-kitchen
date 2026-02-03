<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "food_item_id",
        "quantity",
    ];
    public function food()
{
    return $this->belongsTo(FoodItem::class, 'food_item_id');
}

public function carts()
{
    return $this->hasMany(Cart::class);
}

}
