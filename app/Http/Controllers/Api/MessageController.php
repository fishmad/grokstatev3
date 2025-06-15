<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::with(['sender', 'recipient'])->paginate(20);
        return JsonResource::collection($messages);
    }

    public function show($id)
    {
        $message = Message::with(['sender', 'recipient'])->findOrFail($id);
        return new JsonResource($message);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sender_id' => 'required|exists:users,id',
            'recipient_id' => 'required|exists:users,id',
            'subject' => 'nullable|string',
            'body' => 'required|string',
            'read_at' => 'nullable|date',
            'sent_at' => 'nullable|date',
        ]);
        $message = Message::create($data);
        return new JsonResource($message);
    }

    public function update(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        $data = $request->validate([
            'subject' => 'nullable|string',
            'body' => 'nullable|string',
            'read_at' => 'nullable|date',
            'sent_at' => 'nullable|date',
        ]);
        $message->update($data);
        return new JsonResource($message);
    }

    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();
        return response()->json(['message' => 'Message deleted']);
    }
}
