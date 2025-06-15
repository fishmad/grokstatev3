<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('messages')->insert([
            [
                'sender_id' => 1,
                'recipient_id' => 1,
                'subject' => 'Enquiry about property',
                'body' => 'Is this property still available?',
                'read_at' => null,
                'sent_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sender_id' => 2,
                'recipient_id' => 1,
                'subject' => 'Inspection request',
                'body' => 'Can I book an inspection for next week?',
                'read_at' => null,
                'sent_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
