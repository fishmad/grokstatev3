<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;
use App\Models\Media;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PropertyImportSeeder extends Seeder
{
    // DEV FLAG: Set to true to assign all imported properties to user ID 1 and prevent new user creation
    protected $assignAllToUser1 = true;

    public function run()
    {
        // 1. Load all CSVs into arrays
        $listings = $this->csvToArray(database_path('Conversion/other_en_listingsdb.csv'));
        $users = $this->csvToArray(database_path('Conversion/other_en_userdb.csv'));
        $details = $this->csvToArray(database_path('Conversion/other_en_listingsdbelements.csv'));
        $images = $this->csvToArray(database_path('Conversion/other_en_listingsimages.csv'));
        $categories = $this->csvToArray(database_path('Conversion/other_en_class.csv'));
        $classlistings = $this->csvToArray(database_path('Conversion/other_classlistingsdb.csv'));

        // 2. Index users, details, images, categories, classlistings by their IDs for fast lookup
        $usersById = collect($users)->keyBy('userdb_id');
        $detailsByListing = collect($details)->groupBy('listingsdb_id');
        $imagesByListing = collect($images)->groupBy('listingsdb_id');
        $categoriesById = collect($categories)->keyBy('class_id');
        $classlistingsByListing = collect($classlistings)->groupBy('listingsdb_id');

        // 3. Import properties
        foreach ($listings as $row) {
            // --- LOGGING: Start of property import ---
            \Log::info("[PropertyImportSeeder] Importing property: listingsdb_id={$row['listingsdb_id']} title='{$row['listingsdb_title']}'");

            // Find or create user
            $userId = 1;
            if (!$this->assignAllToUser1) {
                $user = \App\Models\User::find($row['userdb_id']);
                if (!$user) {
                    $userData = $usersById[$row['userdb_id']] ?? null;
                    $email = $userData['userdb_emailaddress'] ?? ('imported_user_' . $row['userdb_id'] . '@example.com');
                    $name = isset($userData['userdb_user_first_name'], $userData['userdb_user_last_name'])
                        ? trim($userData['userdb_user_first_name'] . ' ' . $userData['userdb_user_last_name'])
                        : ($userData['userdb_user_name'] ?? 'Imported User ' . $row['userdb_id']);
                    $user = \App\Models\User::firstOrCreate([
                        'email' => $email,
                    ], [
                        'name' => $name,
                        'password' => bcrypt('password'),
                        'email_verified_at' => now(),
                    ]);
                }
                $userId = $user->id;
            }

            // Map details
            $propertyDetails = $detailsByListing[$row['listingsdb_id']] ?? collect();
            // Define keys to skip (mapped fields + explicit skip-list)
            $skipKeys = [
                'sq_mtr', 'lot_size', 'garage_size', 'country', 'postcode', 'state', 'town', 'address', 'baths', 'beds', 'full_desc', 'price',
                'mlsexport', 'open_house', 'OH_Start', 'OH_Finish',
            ];
            $attributes = [];
            $mappedFields = [
                'garage_size' => null,
                'baths' => null,
                'beds' => null,
                'country' => null,
                'postcode' => null,
                'state' => null,
                'town' => null,
                'address' => null,
                'full_desc' => null,
                'price' => null,
                'lot_size' => null, // <-- add these
                'sq_mtr' => null,   // <-- add these
            ];
            foreach ($propertyDetails as $detail) {
                $key = $detail['listingsdbelements_field_name'];
                $value = $detail['listingsdbelements_field_value'];
                // Only skip if value is null or empty string
                if (is_null($value) || $value === '') continue;
                // Minimal HTML stripping for 'contact' field only
                if (strtolower($key) === 'contact' && is_string($value)) {
                    $value = strip_tags($value);
                    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $value = trim($value);
                }
                $attributes[$key] = $value;
            }
            // Now use $mappedFields for direct mapping to columns if needed

            // Ensure property_type exists
            $propertyType = \App\Models\PropertyType::firstOrCreate([
                'id' => $attributes['property_type_id'] ?? 1,
            ], [
                'name' => $attributes['property_type'] ?? 'Default Type',
            ]);
            // Ensure listing_method exists
            $listingMethod = \App\Models\ListingMethod::firstOrCreate([
                'id' => $attributes['listing_method_id'] ?? 1,
            ], [
                'name' => $attributes['listing_method'] ?? 'Default Method',
                'slug' => $attributes['listing_method'] ?? 'default-method',
            ]);
            // Ensure listing_status exists
            $listingStatus = \App\Models\ListingStatus::firstOrCreate([
                'id' => $attributes['listing_status_id'] ?? 1,
            ], [
                'name' => $attributes['status'] ?? 'Default Status',
            ]);

            // Map status to listing_status_id or listing_method_id
            $statusValue = $attributes['status'] ?? null;
            $listingStatusId = $listingStatus->id;
            $listingMethodId = $listingMethod->id;
            $isForLease = false;
            if ($statusValue) {
                if (strtolower(trim($statusValue)) === 'for lease') {
                    // Map to ListingMethod 'Rent'
                    $rentMethod = \App\Models\ListingMethod::whereRaw('LOWER(name) = ?', ['rent'])->first();
                    if ($rentMethod) {
                        $listingMethodId = $rentMethod->id;
                    }
                    $isForLease = true;
                } else {
                    $statusModel = \App\Models\ListingStatus::whereRaw('LOWER(name) = ?', [strtolower($statusValue)])->first();
                    $methodModel = \App\Models\ListingMethod::whereRaw('LOWER(name) = ?', [strtolower($statusValue)])->first();
                    if ($statusModel) {
                        $listingStatusId = $statusModel->id;
                    } elseif ($methodModel) {
                        $listingMethodId = $methodModel->id;
                    } else {
                        // Fallback to Historic status if no match
                        $historicStatus = \App\Models\ListingStatus::where('name', 'Historic')->first();
                        if ($historicStatus) {
                            $listingStatusId = $historicStatus->id;
                        }
                    }
                }
            }

            // Generate unique slug for property
            $baseSlug = $row['listingsdb_title'] ? Str::slug($row['listingsdb_title']) : 'property-' . uniqid();
            $slug = $baseSlug;
            $slugSuffix = 1;
            while (\App\Models\Property::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $slugSuffix;
                $slugSuffix++;
            }

            // Set description to full_desc if available, else fallback
            $desc = '';
            if (!empty($mappedFields['full_desc'])) {
                $desc = $mappedFields['full_desc'];
            } elseif (!empty($attributes['full_desc'])) {
                $desc = $attributes['full_desc'];
            } elseif (!empty($row['listingsdb_notes'])) {
                $desc = $row['listingsdb_notes'];
            }
            $desc = preg_replace('/<br\\s*\/?>(?![^<]*<)/i', "\n", $desc);
            $desc = preg_replace('/<\/?p>/i', "\n", $desc);
            $desc = preg_replace('/(&nbsp;)+/i', ' ', $desc); // Replace one or more &nbsp; with a single space
            $desc = str_replace('&amp;', '&', $desc); // Convert &amp; to &
            // Replace common HTML entities with their text equivalents
            $desc = str_replace([
                '&quot;', '&ldquo;', '&rdquo;', '&lsquo;', '&rsquo;', '&apos;', '&hellip;', '&frac12;', '&frac14;', '&frac34;', '&ndash;', '&mdash;', '&lt;', '&gt;', '&laquo;', '&raquo;', '&bull;', '&middot;', '&shy;', '&deg;', '&cent;', '&pound;', '&yen;', '&euro;', '&copy;', '&reg;', '&trade;', '&sup2;', '&sup3;', '&sup1;', '&ordm;', '&ordf;', '&sect;', '&para;', '&brvbar;', '&uml;', '&iexcl;', '&iquest;', '&times;', '&divide;', '&OElig;', '&oelig;', '&Scaron;', '&scaron;', '&Yuml;', '&circ;', '&tilde;', '&ensp;', '&emsp;', '&thinsp;', '&zwnj;', '&zwj;', '&lrm;', '&rlm;', '&ndash;', '&mdash;', '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;', '&bdquo;', '&dagger;', '&Dagger;', '&permil;', '&lsaquo;', '&rsaquo;', '&oline;', '&euro;', '&fnof;', '&Alpha;', '&Beta;', '&Gamma;', '&Delta;', '&Epsilon;', '&Zeta;', '&Eta;', '&Theta;', '&Iota;', '&Kappa;', '&Lambda;', '&Mu;', '&Nu;', '&Xi;', '&Omicron;', '&Pi;', '&Rho;', '&Sigma;', '&Tau;', '&Upsilon;', '&Phi;', '&Chi;', '&Psi;', '&Omega;', '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;', '&theta;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&rho;', '&sigmaf;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;', '&curren;'
            ], [
                '"', '"', '"', "'", "'", "'", '...', '1/2', '1/4', '3/4', '-', '--', '<', '>', '«', '»', '•', '·', '', '°', '¢', '£', '¥', '€', '(c)', '(r)', '™', '²', '³', '¹', 'º', 'ª', '§', '¶', '|', '¨', '¡', '¿', '×', '÷', 'Œ', 'œ', 'Š', 'š', 'Ÿ', '^', '~', ' ', ' ', ' ', '', '', '', '', '-', '--', "'", "'", ',', '"', '"', ',,', '†', '‡', '‰', '<', '>', '‾', '€', 'ƒ', 'A', 'B', 'Γ', 'Δ', 'E', 'Z', 'H', 'Θ', 'I', 'K', 'Λ', 'M', 'N', 'Ξ', 'O', 'Π', 'P', 'Σ', 'T', 'Y', 'Φ', 'X', 'Ψ', 'Ω', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'ς', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', '¤'
            ], $desc);
            $desc = strip_tags($desc);
            $desc = preg_replace("/\r?\n/", "\n", $desc);
            // Collapse multiple newlines to a single newline
            $desc = preg_replace('/\n{2,}/', "\n", $desc);
            // Remove leading/trailing whitespace from each sentence/line
            $desc = implode("\n", array_map('trim', explode("\n", $desc)));
            $desc = trim($desc);

            // Remove excessive exclamation/question marks (e.g. '!!!' -> '!')
            $desc = preg_replace('/([!?])\1+/', '$1', $desc);
            // Convert ALL CAPS words (3+ letters) to sentence case, but keep acronyms (2-4 letters)
            $desc = preg_replace_callback('/\b([A-Z]{3,})\b/', function($m) {
                // Keep only common AU real estate, units, and tech acronyms
                $acronyms = [
                    'CBD','NSW','ACT','VIC','QLD','WA','SA','NT','TAS', // AU states/regions
                    'POA','GST','DA','BASIX','WIR', 'ENS', 'STCA', // real estate/finance
                    'SQM','HA','AC','M2','KM','KM2','FT','FT2','SQFT', // units
                    'NBN','TV','AC','DC', // tech/utilities
                    'LED','USB','HD','GPS' // general
                ];
                return in_array($m[1], $acronyms) ? $m[1] : ucfirst(strtolower($m[1]));
            }, $desc);
            // Capitalize first letter of each sentence (basic, not perfect for all edge cases)
            $desc = preg_replace_callback('/(^|[.!?]\s+)([a-z])/', function($m) {
                return $m[1] . strtoupper($m[2]);
            }, $desc);
            // Add double newlines between sentences
            $desc = preg_replace('/([.!?])\s+/', "$1\n\n", $desc);

            // --- Sanitize and normalize property title ---
            $oldPropertyId = $row['listingsdb_id'] ?? null;
            $propertyTitle = $row['listingsdb_title'] ?? '';
            $propertyTitle = strip_tags($propertyTitle);
            $propertyTitle = html_entity_decode($propertyTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $propertyTitle = preg_replace('/\s+/', ' ', $propertyTitle); // Collapse whitespace
            $propertyTitle = trim($propertyTitle);
            // Remove any prepended property ID (e.g. "12345 - My Title")
            $propertyTitle = preg_replace('/^\d+\s*-\s*/', '', $propertyTitle);
            // Title case, but preserve acronyms and common real estate terms
            $propertyTitle = mb_convert_case($propertyTitle, MB_CASE_TITLE, 'UTF-8');
            // Restore common acronyms and real estate terms to uppercase
            $acronyms = ['CBD','NSW','ACT','VIC','QLD','WA','SA','NT','TAS','POA','GST','DA','BASIX','WIR','ENS','STCA','NBN','TV','AC','DC','LED','USB','HD','GPS'];
            foreach ($acronyms as $acro) {
                $propertyTitle = preg_replace('/\\b' . preg_quote(ucfirst(strtolower($acro)), '/') . '\\b/u', $acro, $propertyTitle);
            }
            // Capitalize after colon (e.g. "Unit: 5/10 Main St")
            $propertyTitle = preg_replace_callback('/(:\s*)([a-z])/', function($m) {
                return $m[1] . strtoupper($m[2]);
            }, $propertyTitle);
            // Remove excessive exclamation/question marks
            $propertyTitle = preg_replace('/([!?])\1+/', '$1', $propertyTitle);
            // Remove leading/trailing punctuation
            $propertyTitle = trim($propertyTitle, "-–—:;,. ");
            // Append old property ID if it exists
            if ($oldPropertyId) {
                $propertyTitle = rtrim($propertyTitle) . " - #{$oldPropertyId}";
            }

            // Handle lot_size and sq_mtr: skip if present but empty, else extract value and unit
            $landSize = null;
            $landSizeUnit = null;
            $buildingSize = null;
            $buildingSizeUnit = null;
            $unitMap = [
                'SqMeters' => 'sqm',
                'square' => 'sqm',
                ' sqm' => 'sqm',
                'hectares' => 'ha',
                ' hectare' => 'ha',
                ' ha' => 'ha',
                'ha' => 'ha',
                ' m2' => 'sqm',
                'm2' => 'sqm',
                'ac' => 'acres',
                'acre' => 'acres',
                'acres' => 'acres',
                'm' => 'sqm',
                'sq' => 'sqm',
                'sq mts' => 'sqm',
            ];
            // Helper to clean and extract number and unit
            $extractSize = function($raw) use ($unitMap) {
                if (!$raw || trim($raw) === '') return [null, null];
                $raw = trim($raw);
                // Extract number and unit (e.g. "1,234 sqm", "2 ha", "5000m2", "3 acres", "1000sqm")
                if (preg_match('/([\d\.,\s]+)\s*([a-zA-Z]+)/', $raw, $matches) || preg_match('/([\d\.,]+)([a-zA-Z]+)/', $raw, $matches)) {
                    $num = preg_replace('/[^\d\.,]/', '', $matches[1]);
                    $num = str_replace([',', ' '], '', $num);
                    $unit = strtolower(trim($matches[2]));
                    $unit = $unitMap[$unit] ?? $unit;
                    return [$num, $unit];
                } elseif (preg_match('/([\d\.,]+)/', $raw, $matches)) {
                    $num = preg_replace('/[^\d\.,]/', '', $matches[1]);
                    $num = str_replace([',', ' '], '', $num);
                    return [$num, 'sqm']; // Default to sqm if only a number is found
                }
                return [null, null];
            };
            // lot_size
            $landSize = null;
            $landSizeUnit = null;
            $rawLotSize = !empty($mappedFields['lot_size']) ? $mappedFields['lot_size'] : (!empty($attributes['lot_size']) ? $attributes['lot_size'] : null);
            if ($rawLotSize && trim($rawLotSize) !== '') {
                [$landSize, $landSizeUnit] = $extractSize($rawLotSize);
                if ($landSize !== null) {
                    $landSize = (int) round(floatval($landSize)); // Use whole numbers only
                }
            }
            // sq_mtr
            $buildingSize = null;
            $buildingSizeUnit = null;
            $rawSqMtr = !empty($mappedFields['sq_mtr']) ? $mappedFields['sq_mtr'] : (!empty($attributes['sq_mtr']) ? $attributes['sq_mtr'] : null);
            if ($rawSqMtr && trim($rawSqMtr) !== '') {
                [$buildingSize, $buildingSizeUnit] = $extractSize($rawSqMtr);
                if ($buildingSize !== null) {
                    $buildingSize = (int) round(floatval($buildingSize)); // Use whole numbers only
                }
            }

            // Normalize pipe-separated values in 'community_features' and 'home_features' to arrays before storing in dynamic_attributes
            $featureFields = ['community_features', 'home_features'];
            foreach ($featureFields as $featureKey) {
                if (isset($attributes[$featureKey]) && is_string($attributes[$featureKey]) && strpos($attributes[$featureKey], '||') !== false) {
                    $attributes[$featureKey] = array_map('trim', explode('||', $attributes[$featureKey]));
                }
            }

            // --- Robust extraction for beds, baths, and car/parking spaces ---
            $extractIntField = function(array $sources, array $keys) {
                foreach ($keys as $key) {
                    foreach ($sources as $source) {
                        if (isset($source[$key]) && trim($source[$key]) !== '') {
                            $val = $source[$key];
                            // Remove any non-digit except dot/comma
                            $val = preg_replace('/[^\d.,]/', '', $val);
                            $val = str_replace(',', '', $val);
                            if ($val !== '' && is_numeric($val)) {
                                return (int) round(floatval($val));
                            }
                        }
                    }
                }
                return null;
            };
            $beds = $extractIntField([
                $attributes,
                $row
            ], ['beds', 'bedrooms', 'bed', 'num_beds']);
            $baths = $extractIntField([
                $attributes,
                $row
            ], ['baths', 'bathrooms', 'bath', 'num_baths']);
            $carSpaces = $extractIntField([
                $attributes,
                $row
            ], ['garage_size', 'car_spaces', 'carspace', 'car_space', 'garage', 'parking', 'parking_spaces', 'carparks', 'carpark', 'car', 'cars']);

            $property = Property::updateOrCreate(
                ['slug' => $slug], // Unique key for upsert
                [
                    'user_id' => $userId,
                    'title' => $propertyTitle,
                    'description' => $desc,
                    'created_at' => $row['listingsdb_creation_date'],
                    'updated_at' => $row['listingsdb_last_modified'],
                    'expires_at' => $row['listingsdb_expiration'],
                    'property_type_id' => $propertyType->id,
                    'listing_method_id' => $listingMethodId,
                    'listing_status_id' => $listingStatusId,
                    'beds' => $beds,
                    'baths' => $baths,
                    'parking_spaces' => $carSpaces,
                    'land_size' => $landSize,
                    'land_size_unit' => $landSizeUnit,
                    'building_size' => $buildingSize,
                    'building_size_unit' => $buildingSizeUnit,
                    'dynamic_attributes' => json_encode($attributes),
                ]
            );
            if (!$property) {
                \Log::error("[PropertyImportSeeder] FAILED to create/update property for listingsdb_id={$row['listingsdb_id']}");
                continue;
            } else {
                \Log::info("[PropertyImportSeeder] Created/updated property ID {$property->id} for listingsdb_id={$row['listingsdb_id']}");
            }

            // --- Fallback logic for key fields with more possible keys ---
            $suburbKeys = ['town', 'suburb', 'locality', 'address_town'];
            $suburbName = null;
            foreach ($suburbKeys as $key) {
                if (!empty($attributes[$key])) {
                    $suburbName = $attributes[$key];
                    break;
                } elseif (!empty($row[$key])) {
                    $suburbName = $row[$key];
                    break;
                }
            }
            // --- State resolution for suburb ---
            $stateKeys = ['state', 'state_id', 'region', 'region_name'];
            $stateValue = null;
            foreach ($stateKeys as $key) {
                if (!empty($attributes[$key])) {
                    $stateValue = $attributes[$key];
                    break;
                } elseif (!empty($row[$key])) {
                    $stateValue = $row[$key];
                    break;
                }
            }
            $stateId = null;
            if ($stateValue) {
                // Try to find state by name or iso_code (case-insensitive)
                $stateModel = \App\Models\State::whereRaw('LOWER(name) = ?', [strtolower($stateValue)])
                    ->orWhereRaw('LOWER(iso_code) = ?', [strtolower($stateValue)])
                    ->first();
                if ($stateModel) {
                    $stateId = $stateModel->id;
                } else {
                    \Log::warning("[PropertyImportSeeder] State '{$stateValue}' not found in states table for property ID {$property->id}");
                }
            }
            $suburb = null;
            // --- Robust postcode extraction for suburb ---
            $postcodeKeys = ['postcode', 'zip', 'postal_code', 'post_code', 'pcode'];
            $postcode = null;
            foreach ($postcodeKeys as $key) {
                if (!empty($attributes[$key])) {
                    $postcode = $attributes[$key];
                    break;
                } elseif (!empty($row[$key])) {
                    $postcode = $row[$key];
                    break;
                }
            }
            if ($suburbName && is_string($suburbName) && trim($suburbName) !== '' && $stateId && $postcode) {
                $suburb = \App\Models\Suburb::where([
                    'name' => $suburbName,
                    'state_id' => $stateId,
                    'postcode' => $postcode
                ])->first();
                if ($suburb) {
                    \Log::info("[PropertyImportSeeder] Found existing suburb '{$suburbName}' (ID: {$suburb->id}) for property ID {$property->id} with state_id {$stateId} and postcode {$postcode}");
                } else {
                    $suburb = \App\Models\Suburb::create([
                        'name' => $suburbName,
                        'state_id' => $stateId,
                        'postcode' => $postcode
                    ]);
                    \Log::info("[PropertyImportSeeder] Created new suburb '{$suburbName}' (ID: {$suburb->id}) for property ID {$property->id} with state_id {$stateId} and postcode {$postcode}");
                }
            } elseif ($suburbName && (!$stateId || !$postcode)) {
                $missing = [];
                if (!$stateId) $missing[] = 'state';
                if (!$postcode) $missing[] = 'postcode';
                \Log::warning("[PropertyImportSeeder] Suburb '{$suburbName}' found but missing " . implode(' and ', $missing) . " for property ID {$property->id}. Skipping suburb creation.");
            } else {
                \Log::warning("[PropertyImportSeeder] No suburb/town found for property ID {$property->id}. Available keys: " . json_encode(array_keys($row)) . ", attributes: " . json_encode(array_keys($attributes)));
            }

            // Address fallback: use more possible keys
            $streetKeys = ['street_name', 'address', 'street', 'street_address'];
            $streetName = null;
            foreach ($streetKeys as $key) {
                if (!empty($attributes[$key])) {
                    $streetName = $attributes[$key];
                    break;
                } elseif (!empty($row[$key])) {
                    $streetName = $row[$key];
                    break;
                }
            }
            if (!empty($streetName)) {
                $addressData = [
                    'property_id' => $property->id,
                    'suburb_id' => $suburb ? $suburb->id : null,
                    'country_id' => 1, // Set to 1 (Australia) or update to match your country table if needed
                    'state_id' => $stateId,
                    'street_number' => $attributes['street_number'] ?? $row['street_number'] ?? null,
                    'street_name' => $streetName,
                    'unit_number' => $attributes['unit_number'] ?? $row['unit_number'] ?? null,
                    'lot_number' => $attributes['lot_number'] ?? $row['lot_number'] ?? null,
                    'site_name' => $attributes['site_name'] ?? $row['site_name'] ?? null,
                    'region_name' => $attributes['region_name'] ?? $row['region_name'] ?? null,
                    'lat' => $attributes['lat'] ?? $row['lat'] ?? null,
                    'long' => $attributes['long'] ?? $row['long'] ?? null,
                    'postcode' => $attributes['postcode'] ?? $row['postcode'] ?? null,
                    'display_address_on_map' => isset($attributes['display_address_on_map']) && $attributes['display_address_on_map'] !== '' ? $attributes['display_address_on_map'] : (isset($row['display_address_on_map']) && $row['display_address_on_map'] !== '' ? $row['display_address_on_map'] : 0),
                    'display_street_view' => isset($attributes['display_street_view']) && $attributes['display_street_view'] !== '' ? $attributes['display_street_view'] : (isset($row['display_street_view']) && $row['display_street_view'] !== '' ? $row['display_street_view'] : 0),
                ];
                \App\Models\Address::updateOrCreate(
                    ['property_id' => $property->id],
                    $addressData
                );
                \Log::info("[PropertyImportSeeder] Created/updated address for property ID {$property->id} (street_name='{$streetName}')");
            } else {
                \Log::warning("[PropertyImportSeeder] Skipped address for property ID {$property->id} (no street_name). Available keys: " . json_encode(array_keys($row)) . ", attributes: " . json_encode(array_keys($attributes)));
            }

            // Attach images (Media)
            $propertyImages = $imagesByListing[$row['listingsdb_id']] ?? collect();
            if ($propertyImages->isEmpty()) {
                \Log::info("[PropertyImportSeeder] No images found for property ID {$property->id}");
            }
            foreach ($propertyImages as $img) {
                $imageName = $img['listingsimages_file_name'];
                $sourceImagePath = storage_path('app/public/media/' . $imageName);
                if (file_exists($sourceImagePath)) {
                    $mediaUrl = 'media/' . $imageName;
                    Media::create([
                        'property_id' => $property->id,
                        'type' => 'image',
                        'url' => $mediaUrl,
                    ]);
                    \Log::info("[PropertyImportSeeder] Linked image '{$imageName}' to property ID {$property->id}");
                } else {
                    \Log::warning("[PropertyImportSeeder] Image file missing: {$imageName} for property ID {$property->id}");
                }
            }

            // Attach categories (property classes) using Laravel pivot table
            $classIds = $classlistingsByListing[$row['listingsdb_id']]?->pluck('class_id')->toArray() ?? [];
            if (empty($classIds)) {
                \Log::info("[PropertyImportSeeder] No categories/classes found for property ID {$property->id}");
            }
            $categoryIds = [];
            foreach ($classIds as $classId) {
                if (isset($categoriesById[$classId])) {
                    $category = Category::firstOrCreate([
                        'name' => $categoriesById[$classId]['class_name'],
                        'category_type_id' => 1, // default or actual type id
                    ], [
                        'slug' => \Str::slug($categoriesById[$classId]['class_name']),
                        'display_name' => $categoriesById[$classId]['class_name'],
                    ]);
                    $categoryIds[] = $category->id;
                }
            }
            if (!empty($categoryIds)) {
                // Use the property_category pivot table for the relationship
                \DB::table('property_category')->where('property_id', $property->id)->delete();
                foreach ($categoryIds as $catId) {
                    \DB::table('property_category')->insertOrIgnore([
                        'property_id' => $property->id,
                        'category_id' => $catId,
                    ]);
                }
            }

            // Create price record for property
            $rawPrice = $mappedFields['price'] ?? $attributes['price'] ?? $row['listingsdb_price'] ?? null;
            if (empty($rawPrice)) {
                \Log::info("[PropertyImportSeeder] No price found for property ID {$property->id}");
            }
            $priceValue = null;
            $priceType = $isForLease ? 'rent_weekly' : 'sale';
            if (!empty($rawPrice)) {
                // Sanitize 'Contact' price: remove HTML tags
                $rawPriceSanitized = is_string($rawPrice) ? strip_tags($rawPrice) : $rawPrice;
                // Extract numeric value
                if (is_numeric($rawPriceSanitized)) {
                    $priceValue = $rawPriceSanitized;
                } else {
                    // Remove currency symbols, commas, and extract first number
                    if (preg_match('/([\d,.]+)/', $rawPriceSanitized, $matches)) {
                        $priceValue = str_replace([',', ' '], '', $matches[1]);
                    }
                    // Detect price type from keywords
                    $priceStr = strtolower($rawPriceSanitized);
                    if (preg_match('/week|weekly|p\/w/', $priceStr)) {
                        $priceType = 'rent_weekly';
                    } elseif (preg_match('/month|monthly|p\/m/', $priceStr)) {
                        $priceType = 'rent_monthly';
                    } elseif (preg_match('/year|annual|per annum|yearly|p\/a/', $priceStr)) {
                        $priceType = 'rent_yearly';
                    } elseif (preg_match('/offers?[_ ]?above/i', $priceStr)) {
                        $priceType = 'offers_above';
                    } elseif (preg_match('/offers?[_ ]?between/i', $priceStr)) {
                        $priceType = 'offers_between';
                    } elseif (preg_match('/enquire|contact|call|negotiable|fixed|tba/', $priceStr)) {
                        // Map to special types
                        if (preg_match('/enquire/', $priceStr)) $priceType = 'enquire';
                        elseif (preg_match('/contact/', $priceStr)) $priceType = 'contact';
                        elseif (preg_match('/call/', $priceStr)) $priceType = 'call';
                        elseif (preg_match('/negotiable/', $priceStr)) $priceType = 'negotiable';
                        elseif (preg_match('/fixed/', $priceStr)) $priceType = 'fixed';
                        elseif (preg_match('/tba/', $priceStr)) $priceType = 'tba';
                    }
                }
            }
            if ($priceValue !== null) {
                \App\Models\Price::create([
                    'property_id' => $property->id,
                    'amount' => $priceValue,
                    'price_type' => $priceType,
                ]);
            }
        }
    }

    private function csvToArray($filename)
    {
        $rows = [];
        if (!file_exists($filename)) {
            return $rows;
        }
        if (($handle = fopen($filename, 'r')) !== false) {
            $header = null;
            while (($data = fgetcsv($handle, 10000, ',')) !== false) {
                if (!$header) {
                    $header = $data;
                } else {
                    if (count($data) === count($header)) {
                        $rows[] = array_combine($header, $data);
                    }
                }
            }
            fclose($handle);
        }
        return $rows;
    }
}
