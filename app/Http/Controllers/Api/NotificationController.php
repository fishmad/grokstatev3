<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::with('user')->paginate(20);
        return JsonResource::collection($notifications);
    }

    public function show($id)
    {
        $notification = Notification::with('user')->findOrFail($id);
        return new JsonResource($notification);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string',
            'data' => 'nullable|json',
            'read_at' => 'nullable|date',
        ]);
        $notification = Notification::create($data);
        return new JsonResource($notification);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $data = $request->validate([
            'type' => 'sometimes|string',
            'data' => 'nullable|json',
            'read_at' => 'nullable|date',
        ]);
        $notification->update($data);
        return new JsonResource($notification);
    }

    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification deleted']);
    }
}
