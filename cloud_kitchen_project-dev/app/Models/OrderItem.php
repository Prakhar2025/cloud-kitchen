<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\FoodItem;

class OrderItem extends Model
{
    use HasFactory;
    protected $fillable = ['order_id', 'food_item_id', 'quantity', 'price','food_name'];

public function food()
{
    return $this->belongsTo(FoodItem::class);
}
}
