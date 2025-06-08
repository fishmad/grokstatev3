<?php

// Config
$inputFile = __DIR__ . '/database/Conversion/other_en_listingsdbelements_BUP.csv';
$outputFile = __DIR__ . '/database/Conversion/other_en_listingsdbelements.csv';

// Download Geonames AU towns list if not present
$geonamesUrl = 'https://download.geonames.org/export/dump/AU.zip';
$geonamesZip = __DIR__ . '/AU.zip';
$geonamesTxt = __DIR__ . '/AU.txt';

if (!file_exists($geonamesTxt)) {
    echo "Downloading Geonames AU towns list...\n";
    file_put_contents($geonamesZip, file_get_contents($geonamesUrl));
    $zip = new ZipArchive;
    if ($zip->open($geonamesZip) === TRUE) {
        $zip->extractTo(__DIR__);
        $zip->close();
    }
    unlink($geonamesZip);
}

// Build set of official town names (title case)
$townNames = [];
$handle = fopen($geonamesTxt, 'r');
while (($line = fgets($handle)) !== false) {
    $parts = explode("\t", $line);
    if (isset($parts[1])) {
        $name = trim($parts[1]);
        $townNames[strtolower($name)] = $name;
    }
}
fclose($handle);

// Street type mapping
$streetTypes = [
    'st' => 'Street',
    'rd' => 'Road',
    'ave' => 'Avenue',
    'blvd' => 'Boulevard',
    'ct' => 'Court',
    'cres' => 'Crescent',
    'dr' => 'Drive',
    'drv' => 'Drive',
    'hwy' => 'Highway',
    'ln' => 'Lane',
    'pl' => 'Place',
    'pde' => 'Parade',
    'ter' => 'Terrace',
    'way' => 'Way',
    'sq' => 'Square',
    'trl' => 'Trail',
    'cct' => 'Circuit',
    'gr' => 'Grove',
    'cl' => 'Close',
    'walk' => 'Walk',
    'mews' => 'Mews',
    'bvd' => 'Boulevard',
];

// Helper: Proper-case a string
function properCase($str) {
    return ucwords(strtolower(trim($str)));
}

// Helper: Normalize town
function normalizeTown($town, $townNames) {
    $t = trim($town);
    if ($t === '') return '';
    $tLower = strtolower($t);
    if (isset($townNames[$tLower])) {
        return $townNames[$tLower];
    }
    // Try fuzzy match (ignore case, whitespace)
    foreach ($townNames as $officialLower => $official) {
        if (preg_replace('/\\s+/', '', $officialLower) === preg_replace('/\\s+/', '', $tLower)) {
            return $official;
        }
    }
    return properCase($t);
}

// Helper: Normalize suburb/town (remove parentheses, state, region info)
function normalizeSuburb($suburb) {
    $t = trim($suburb);
    if ($t === '' || strtolower($t) === 'unknown') return '';
    // Remove anything in parentheses
    $t = preg_replace('/\s*\([^)]*\)/', '', $t);
    // Remove trailing state/region info (e.g., 'Nsw', 'Qld', etc.)
    $t = preg_replace('/\b(NSW|Nsw|Qld|QLD|Vic|VIC|Tas|TAS|SA|WA|NT|ACT|Central Highlands|South Coast|North Shore|Gold Coast|Byron Bay|Wollongong Mall)\b.*/i', '', $t);
    // Remove extra whitespace and commas
    $t = trim(preg_replace('/[\s,]+$/', '', $t));
    return properCase($t);
}

// Helper: Normalize address (extract street only, null if unknown or just state/postcode)
function normalizeAddress($address, $streetTypes) {
    $address = trim($address);
    if ($address === '' || strtolower($address) === 'unknown') return '';
    // Remove postcode/state ONLY if at the very end (e.g. 'Palm St Maleny Qld 4552')
    $address = preg_replace('/\s+(NSW|Nsw|Qld|QLD|Vic|VIC|Tas|TAS|SA|WA|NT|ACT)?\s*\d{4,5}$/i', '', $address);
    // Remove trailing state ONLY if at the very end (e.g. 'Palm St Maleny Qld')
    $address = preg_replace('/\s+(NSW|Nsw|Qld|QLD|Vic|VIC|Tas|TAS|SA|WA|NT|ACT)$/i', '', $address);
    // Remove anything in parentheses
    $address = preg_replace('/\s*\([^)]*\)/', '', $address);
    // If after cleaning it's empty or just a number, return ''
    if (preg_match('/^\s*\d*\s*$/', $address)) return '';
    // Proper-case
    $address = preg_replace_callback('/\b([a-zA-Z\']+)\b/', function($matches) {
        return properCase($matches[1]);
    }, $address);
    // Expand street types at end
    $address = preg_replace_callback('/\b([A-Za-z]{2,5})\.?$/', function($matches) use ($streetTypes) {
        $abbr = strtolower($matches[1]);
        return isset($streetTypes[$abbr]) ? $streetTypes[$abbr] : $matches[1];
    }, $address);
    $address = trim($address, ', ');
    return $address === '' ? '' : $address;
}

// Process CSV
$in = fopen($inputFile, 'r');
$out = fopen($outputFile, 'w');
$header = fgetcsv($in);
if (!is_array($header)) {
    fclose($in);
    fclose($out);
    echo "Input CSV is empty or missing a valid header.\n";
    exit(1);
}
fputcsv($out, $header);

while (($row = fgetcsv($in)) !== false) {
    // Skip empty or malformed rows
    if (!is_array($row) || count($row) !== count($header)) {
        continue;
    }
    $assoc = array_combine($header, $row);
    if ($assoc === false) {
        continue;
    }
    if ($assoc['listingsdbelements_field_name'] === 'town') {
        // Normalize and trim town and address fields
        $assoc['listingsdbelements_field_value'] = trim($assoc['listingsdbelements_field_value']);
        $assoc['listingsdbelements_field_value'] = normalizeSuburb($assoc['listingsdbelements_field_value']);
    }
    if ($assoc['listingsdbelements_field_name'] === 'address') {
        // Normalize and trim town and address fields
        $assoc['listingsdbelements_field_value'] = trim($assoc['listingsdbelements_field_value']);
        $assoc['listingsdbelements_field_value'] = normalizeAddress($assoc['listingsdbelements_field_value'], $streetTypes);
        if ($assoc['listingsdbelements_field_value'] === '') {
            $assoc['listingsdbelements_field_value'] = null;
        }
    }
    // Strip HTML from home_features, community_features, description, contact, and full_desc
    if (in_array($assoc['listingsdbelements_field_name'], ['home_features', 'community_features', 'description', 'contact', 'full_desc'])) {
        $val = $assoc['listingsdbelements_field_value'];
        // Replace <br> and <br /> with space
        $val = preg_replace('/<br\s*\/?>/i', ' ', $val);
        $val = strip_tags($val);
        $val = html_entity_decode($val, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $val = trim(preg_replace('/\s+/', ' ', $val)); // Remove extra whitespace and line breaks
        if ($val === '') {
            $val = null;
        }
        $assoc['listingsdbelements_field_value'] = $val;
    }
    // Always wrap every value in double quotes for CSV output, escaping any existing quotes
    $quoted = array_map(function($v) {
        if ($v === null) $v = '';
        $v = str_replace('"', '""', $v); // Escape quotes
        return '"' . $v . '"';
    }, array_values($assoc));
    fwrite($out, implode(',', $quoted) . "\r\n");
}
fclose($in);
fclose($out);

echo "Done! Normalized CSV written to $outputFile\n";