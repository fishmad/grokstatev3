<?php

test('authenticated user can create property with address', function () {
    $user = \App\Models\User::factory()->create();

    // Create or fetch location records
    $country = \App\Models\Country::firstOrCreate(['name' => 'Australia'], ['iso_code' => 'AU']);
    $state = \App\Models\State::firstOrCreate(
        ['name' => 'NSW', 'country_id' => $country->id],
        ['iso_code' => 'NSW']
    );
    $suburb = \App\Models\Suburb::firstOrCreate(['name' => 'Sydney', 'state_id' => $state->id, 'postcode' => '2000']);

    $propertyType = \App\Models\PropertyType::firstOrCreate(['id' => 1], ['name' => 'House']);
    $listingMethod = \App\Models\ListingMethod::firstOrCreate(['id' => 1], ['name' => 'Sale']);
    $listingStatus = \App\Models\ListingStatus::firstOrCreate(['id' => 1], ['name' => 'Active']);

    $this->actingAs($user);

    $payload = [
        'title' => 'Test Property',
        'description' => 'Test description',
        'property_type_id' => $propertyType->id,
        'listing_method_id' => $listingMethod->id,
        'listing_status_id' => $listingStatus->id,
        'street_number' => '123',
        'street_name' => 'Main St',
        'unit_number' => '5',
        'country_id' => $country->id,
        'state_id' => $state->id,
        'suburb_id' => $suburb->id,
        'postcode' => '2000',
        'latitude' => -33.8688,
        'longitude' => 151.2093,
    ];

    $response = $this->post('/properties', $payload);
    $response->assertRedirect();
    $this->assertDatabaseHas('properties', ['title' => 'Test Property']);
    $property = \App\Models\Property::where('title', 'Test Property')->first();
    $this->assertNotNull($property);
    $this->assertDatabaseHas('addresses', [
        'property_id' => $property->id,
        'street_name' => 'Main St',
    ]);
    $address = $property->address;
    $this->assertNotNull($address);
    $this->assertEquals('Sydney', $address->suburb->name);
    $this->assertEquals('NSW', $address->suburb->state->name);
    $this->assertEquals('Australia', $address->suburb->state->country->name);
    $this->assertEquals(now()->addMonths(6)->format('Y-m'), $property->expires_at->format('Y-m'));
});
