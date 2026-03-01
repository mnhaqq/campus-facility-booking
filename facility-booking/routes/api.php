<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\FacilityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AvailabilityController;

Route::apiResource('facilities', FacilityController::class);
Route::apiResource('bookings', BookingController::class);

Route::get('/availability', [AvailabilityController::class, 'check']);
