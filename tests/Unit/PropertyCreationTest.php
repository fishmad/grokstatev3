<?php

test('example', function () {
    expect(true)->toBeTrue();
});

test('authenticated user can create property with address', function () {
    $user = \App\Models\User::factory()->create();
    $this->actingAs($user);
    $payload = [
        'title' => 'Test Property',
        'description' => 'Test description',
        'property_type_id' => 1,
        'street_number' => '123',
        'street_name' => 'Main St',
        'unit_number' => '5',
        'country_name' => 'Australia',
        'state_name' => 'NSW',
        'suburb_name' => 'Sydney',
        'postcode' => '2000',
        'lat' => -33.8688,
        'long' => 151.2093,
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
