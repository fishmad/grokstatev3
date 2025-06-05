<?php

namespace App\Jobs;

use App\Models\SavedSearch;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessSavedSearch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public SavedSearch $savedSearch;
    public User $user;

    /**
     * Create a new job instance.
     */
    public function __construct(SavedSearch $savedSearch, User $user)
    {
        $this->savedSearch = $savedSearch;
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        \App\Models\SavedSearch::where('notify', true)->each(function ($search) {
            $query = \App\Models\Property::query()
                ->whereHas('price', fn ($p) => $p->where('penalize_search', false))
                ->when($search->search_query, fn ($q) => $q->where('headline', 'like', '%' . $search->search_query . '%')
                    ->orWhere('description', 'like', '%' . $search->search_query . '%'))
                ->when($search->type, fn ($q) => $q->where('type', $search->type))
                ->when($search->country_id, fn ($q) => $q->whereHas('address', fn ($a) => $a->where('country_id', $search->country_id)))
                ->when($search->state_id, fn ($q) => $q->whereHas('address', fn ($a) => $a->where('state_id', $search->state_id)))
                ->when($search->suburb_id, fn ($q) => $q->whereHas('address', fn ($a) => $a->where('suburb_id', $search->suburb_id)))
                ->when($search->price_min, fn ($q) => $q->whereHas('price', fn ($p) => $p->where('amount', '>=', $search->price_min)
                                              ->orWhere('range_min', '>=', $search->price_min)))
                ->when($search->price_max, fn ($q) => $q->whereHas('price', fn ($p) => $p->where('amount', '<=', $search->price_max)
                                              ->orWhere('range_max', '<=', $search->price_max)))
                ->where('created_at', '>=', now()->subDay());

            $newProperties = $query->get();

            if ($newProperties->isNotEmpty()) {
                // Notify user (e.g., via email)
                // Mail::to($search->user->email)->send(new NewPropertiesFound($search, $newProperties));
            }
        });
    }
}
