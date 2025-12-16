<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;

Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects', [ProjectController::class, 'store']);
Route::post('/projects/{project}/tasks', [TaskController::class, 'storeForProject']);
Route::patch('/tasks/{task}', [TaskController::class, 'toggle']);
