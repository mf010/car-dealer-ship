<?php

namespace App\Traits;

trait Filterable
{
    public function scopeFilter($query, $filters)
    {
        if (!$filters) {
            return $query;
        }

        foreach ($filters as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            // Handle special date range filters
            if (in_array($field, ['date_from', 'date_to'])) {
                $dateField = $this->getDateFieldName();
                if ($field === 'date_from') {
                    $query->whereDate($dateField, '>=', $value);
                } else {
                    $query->whereDate($dateField, '<=', $value);
                }
                continue;
            }

            // Handle numeric range filters
            if (in_array($field, ['amount_from', 'amount_to'])) {
                $amountField = $this->getAmountFieldName();
                if ($field === 'amount_from') {
                    $query->where($amountField, '>=', $value);
                } else {
                    $query->where($amountField, '<=', $value);
                }
                continue;
            }

            // Handle like searches for string fields
            if (in_array($field, $this->getLikeFields())) {
                $query->where($field, 'like', "%{$value}%");
                continue;
            }

            // Handle exact matches
            $query->where($field, $value);
        }

        return $query;
    }

    // Override these methods in your models as needed
    protected function getDateFieldName()
    {
        return 'created_at';
    }

    protected function getAmountFieldName()
    {
        return 'amount';
    }

    protected function getLikeFields()
    {
        return ['name', 'description'];
    }
}