<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'gender',
        'image_url',
        'image_name',
        'product_url',
        'price',
        'vendor',
    ];

    public function getImagePathAttribute()
    {
        return $this->image_name ? "products/{$this->id}/{$this->image_name}" : null;
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }
}
