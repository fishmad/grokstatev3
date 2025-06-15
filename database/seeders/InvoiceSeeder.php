<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('invoices')->insert([
            [
                'user_id' => 1,
                'total_amount' => 1200000.00,
                'currency' => 'AUD',
                'invoice_date' => now()->toDateString(),
                'due_date' => now()->addDays(30)->toDateString(),
                'status' => 'paid',
                'pdf_path' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'total_amount' => 800000.00,
                'currency' => 'AUD',
                'invoice_date' => now()->toDateString(),
                'due_date' => now()->addDays(30)->toDateString(),
                'status' => 'unpaid',
                'pdf_path' => 'invoices/2/invoice2.pdf',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
