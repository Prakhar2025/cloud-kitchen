<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'name',
        'phone',
        'house_no',
        'building_name',
        'street_name',
        'landmark',
        'address',
        'city',
        'pincode',
        'is_default',
        'latitude',
        'longitude',
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function orders()
{
    return $this->hasMany(Order::class, 'address_id');
}


}
