<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'level',
        'price',
        'duration',
        'instructor',
        'rating',
        'students_count',
        'reviews_count',
        'thumbnail_url',
        'preview_url',
        'topics',
        'learnings',
        'requirements',
        'includes_certificate',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price'                => 'decimal:2',
            'rating'               => 'decimal:1',
            'topics'               => 'array',
            'learnings'            => 'array',
            'requirements'         => 'array',
            'includes_certificate' => 'boolean',
            'is_active'            => 'boolean',
        ];
    }

    // Relaciones

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    // Scopes

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOfCategory($query, ?string $category)
    {
        return $query->when($category && $category !== 'todas',
            fn($q) => $q->where('category', $category)
        );
    }

    public function scopeOfLevel($query, ?string $level)
    {
        return $query->when($level && $level !== 'todos',
            fn($q) => $q->where('level', $level)
        );
    }

    // Helpers 

    public function toFrontend(): array
    {
        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'description'         => $this->description,
            'category'            => $this->category,
            'level'               => $this->level,
            'price'               => (float) $this->price,
            'duration'            => $this->duration,
            'instructor'          => $this->instructor,
            'rating'              => (float) $this->rating,
            'studentsCount'       => $this->students_count,
            'reviewsCount'        => $this->reviews_count,
            'thumbnailUrl'        => $this->thumbnail_url,
            'previewUrl'          => $this->preview_url,
            'topics'              => $this->topics        ?? [],
            'learnings'           => $this->learnings     ?? [],
            'requirements'        => $this->requirements  ?? [],
            'includesCertificate' => $this->includes_certificate,
            'isActive'            => $this->is_active,
            'createdAt'           => $this->created_at->toISOString(),
        ];
    }
}