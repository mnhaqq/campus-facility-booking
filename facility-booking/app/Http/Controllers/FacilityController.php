<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Facility;

class FacilityController extends Controller
{
    public function index()
    {
        return response()->json(Facility::all(), 200);
    }

    public function show($id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        return response()->json($facility, 200);
    }
}
