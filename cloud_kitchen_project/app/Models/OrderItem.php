<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\FoodItem;

class OrderItem extends Model
{
    use HasFactory;
    protected $fillable = ['order_id', 'food_item_id', 'quantity', 'price','food_name'];

    // Web uses this relationship
    public function food()
    {
        return $this->belongsTo(FoodItem::class);
    }

    // Mobile API uses this relationship (alias for compatibility)
    public function foodItem()
    {
        return $this->belongsTo(FoodItem::class, 'food_item_id');
    }
}
