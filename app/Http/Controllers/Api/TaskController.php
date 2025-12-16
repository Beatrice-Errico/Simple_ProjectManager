<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function storeForProject(Project $project, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:255'],
        ]);

        $task = $project->tasks()->create([
            'content' => $validated['content'],
        ]);

        return response()->json($task, 201);
    }

    public function toggle(Task $task): JsonResponse
    {
        $task->is_completed = ! $task->is_completed;
        $task->save();

        return response()->json($task);
    }
}
