<?php

// Config
$inputFile = __DIR__ . '/database/conversion/in/other_en_listingsdbelements.csv';
$outputFile = __DIR__ . '/database/conversion/out/cleaned_listingsV2.csv';

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
        'anchorage' => 'Anchorage',
        'ave.' => 'Avenue',
        'ave' => 'Avenue',
        'ave' => 'Avenue',
        'beach' => 'Beach',
        'bend' => 'Bend',
        'blvd' => 'Boulevard',
        'bvld' => 'Boulevard',
        'broadway' => 'Broadway',
        'cct' => 'Circuit',
        'cl' => 'Close',
        'cres.' => 'Crescent',
        'cres' => 'Crescent',
        'crt' => 'Court',
        'ct.' => 'Court',
        'ct' => 'Court',
        'cutting' => 'Cutting',
        'dr' => 'Drive',
        'drv' => 'Drive',
        'dv' => 'Drive',
        'dve' => 'Drive',
        'entrance' => 'Entrance',
        'esplanade' => 'Esplanade',
        'garden' => 'Garden',
        'gardens' => 'Gardens',
        'grove' => 'Grove',
        'heights' => 'Heights',
        'h/way' => 'Highway',
        'h\'way' => 'Highway',
        'hwy.' => 'Highway',
        'hwy' => 'Highway',
        'island' => 'Island',
        'ln' => 'Lane',
        'loop' => 'Loop',
        'mews' => 'Mews',
        'mount' => 'Mount',
        'mountain' => 'Mountain',
        'monte' => 'Monte',
        'nook' => 'Nook',
        'outlook' => 'Outlook',
        'park' => 'Park',
        'parkway' => 'Parkway',
        'passage' => 'Passage',
        'pass' => 'Pass',
        'pde' => 'Parade',
        'pl' => 'Place',
        'place,' => 'Place',
        'promenade' => 'Promenade',
        'rise' => 'Rise',
        'rd.' => 'Road',
        'rd' => 'Road',
        'sq' => 'Square',
        'st.' => 'Street',
        'st' => 'Street',
        'tce' => 'Terrace',
        'ter' => 'Terrace',
        'track' => 'Track',
        'turn' => 'Turn',
        'trl' => 'Trail',
        'way' => 'Way',
        'wayqueensland' => 'Way',
];

// Helper: Proper-case a string
function properCase($str) {
    return ucwords(strtolower(trim($str)));
}

// Helper: Proper-case a string, including after hyphens
function properCaseHyphenated($str) {
    // Lowercase, then ucwords for spaces and hyphens
    $str = strtolower(trim($str));
    $str = ucwords($str, " -");
    // Ensure letter after hyphen is uppercase (for cases like O'dwyer, Smith-Jones)
    $str = preg_replace_callback('/\b([a-z])/', function($m) { return strtoupper($m[1]); }, $str); // first letter
    $str = preg_replace_callback('/-([a-z])/', function($m) { return '-' . strtoupper($m[1]); }, $str);
    // Also handle O'dwyer style (apostrophe)
    $str = preg_replace_callback("/'([a-z])/", function($m) { return "'" . strtoupper($m[1]); }, $str);
    return $str;
}

// Helper: Normalize suburb/town (remove parentheses, state, region info, punctuation, and only accept GeoNames matches)
function normalizeSuburb($suburb, $townNames = null) {
    $t = trim($suburb);
    if ($t === '' || strtolower($t) === 'unknown') return '';
    // Remove anything in parentheses
    $t = preg_replace('/\s*\([^)]*\)/', '', $t);
    // Remove trailing state/region info (e.g., 'Nsw', 'Qld', etc.)
    $t = preg_replace('/\b(NSW|Nsw|Qld|QLD|Vic|VIC|Tas|TAS|SA|WA|NT|ACT|Central Highlands|South Coast| - Tasmania|North Shore|Gold Coast|Byron Bay|Kurrajong |Wollongong Mall|Tasmania)\b.*/i', '', $t);
    // Remove comma and everything after
    $t = preg_replace('/,.*/', '', $t);
    // Remove forward slash and everything after
    $t = preg_replace('/\/.*$/', '', $t);
    // Remove dash and everything after
    $t = preg_replace('/-.*$/', '', $t);
    // Remove all numbers
    $t = preg_replace('/\d+/', '', $t);
    // Remove apostrophes and periods
    $t = str_replace(["'", "."], '', $t);
    // Remove extra whitespace and commas
    $t = trim(preg_replace('/[\s,]+$/', '', $t));
    $t = preg_replace('/\s+/', ' ', $t);
    $t = properCaseHyphenated($t);
    // If $townNames provided, match against official list after normalization
    if (is_array($townNames) && $t !== '') {
        $tLower = strtolower($t);
        if (isset($townNames[$tLower])) {
            return $townNames[$tLower];
        }
        // Try fuzzy match (ignore case, whitespace)
        foreach ($townNames as $officialLower => $official) {
            if (preg_replace('/\s+/', '', $officialLower) === preg_replace('/\s+/', '', $tLower)) {
                return $official;
            }
        }
        // If not found in GeoNames, return the normalized value instead of blank
        return $t;
    }
    return $t;
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
    // Remove commas
    $address = str_replace(',', '', $address);
    // Remove 'Work Unit' (case-insensitive) and any whitespace before/after
    $address = preg_replace('/\bWork\s*Unit\b/i', '', $address);
    // Remove whitespace around forward slashes
    $address = preg_replace('/\s*\/\s*/', '/', $address);
    // Remove whitespace around dashes between numbers (e.g. 40 - 46 -> 40-46)
    $address = preg_replace('/(\d)\s*-\s*(\d)/', '$1-$2', $address);
    // If after cleaning it's empty or just a number, return ''
    if (preg_match('/^\s*\d*\s*$/', $address)) return '';
    // Always preserve the street type as the last word, and delete anything after it
    $streetTypesList = array_values($streetTypes);
    $streetTypePattern = implode('|', array_map(function($t) { return preg_quote($t, '/'); }, $streetTypesList));
    $abbrPattern = implode('|', array_map(function($t) { return preg_quote($t, '/'); }, array_keys($streetTypes)));
    // Match up to and including the last street type (abbreviation or full), delete anything after
    $pattern = '/^(.+?\b(?:' . $streetTypePattern . '|' . $abbrPattern . ')\b)(?:\s+.*)?$/i';
    if (preg_match($pattern, $address, $matches)) {
        $address = $matches[1];
        // Expand abbreviation at end if needed
        $address = preg_replace_callback('/\b(' . $abbrPattern . ')\b$/i', function($m) use ($streetTypes) {
            $abbr = strtolower($m[1]);
            return isset($streetTypes[$abbr]) ? $streetTypes[$abbr] : $m[1];
        }, $address);
    }
    // Proper-case the whole address, including after hyphens
    $address = properCaseHyphenated($address);
    // Collapse multiple spaces into one
    $address = preg_replace('/\s+/', ' ', $address);
    $address = trim($address, ', ');
    return $address === '' ? '' : $address;
}

// Helper: Clean Contact field (replace </p><p> and <br> with \n, sanitize, strip HTML)
function cleanContactField($val) {
    $val = str_replace('</p><p>', "\r\n", $val);
    $val = str_replace('</strong>', "  ", $val);
    $val = preg_replace('/<br\s*\/?>/i', "\r\n", $val);
    $val = str_replace('&nbsp;', " ", $val);
    $val = strip_tags($val);
    $val = html_entity_decode($val, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $val = preg_replace('/[ \t]+/', ' ', $val); // collapse spaces/tabs
    $val = preg_replace('/\s*\n\s*/', "\r\n", $val); // clean up newlines
    $val = trim($val);
    if ($val === '') {
        $val = null;
    }
    return $val;
}

// Helper: Clean full_desc field (remove HTML, decode entities, trim whitespace)
function cleanFullDescField($val) {
    // Replace multiple consecutive <br> tags with a single line break
    $val = preg_replace('/((<br\s*\/?>)\s*)+/i', "\r\n", $val);
    // Replace multiple consecutive <p> tags with a double line break
    $val = preg_replace('/((<p><\/p>)\s*)+/i', "\r\n", $val);
    $val = str_replace('&nbsp;', " ", $val);
    $val = str_replace(' ,', ", ", $val);
    // Add a space before removing tags to preserve word boundaries
    $val = preg_replace('/<[^>]+>/', ' ', $val); // replace all tags with a space
    $val = html_entity_decode($val, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $val = preg_replace('/[ \t]+/', ' ', $val); // collapse spaces/tabs
    // Remove whitespace before and after \r\n
    $val = preg_replace('/[ \t]*\r\n[ \t]*/', "\r\n", $val);
    $val = preg_replace('/\s+/', ' ', $val); // collapse all whitespace to single space
    $val = trim($val);
    if ($val === '') {
        $val = null;
    }
    return $val;
}

// Helper: Clean features field (replace double pipe with comma, strip HTML, decode entities, trim whitespace)
function cleanFeaturesField($val) {
    $val = str_replace('||', ',', $val);
    $val = preg_replace('/<br\s*\/?>/i', ' ', $val);
    $val = strip_tags($val);
    $val = html_entity_decode($val, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $val = preg_replace('/\s*,\s*/', ',', $val); // remove spaces around commas
    $val = preg_replace('/[ \t]+/', ' ', $val); // collapse spaces/tabs
    $val = trim($val, ', '); // remove leading/trailing commas and spaces
    if ($val === '') {
        $val = null;
    }
    return $val;
}

// Helper: Remove emojis and non-ASCII characters
function removeEmojisAndNonAscii($text) {
    if ($text === null) return '';
    // Remove all non-ASCII characters (including emojis)
    $text = preg_replace('/[\x80-\xFF]+/', '', $text);
    // Remove multi-byte Unicode emoji (safe fallback)
    $text = preg_replace('/[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]+/u', '', $text);
    return $text;
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

$maxGrammarChecks = PHP_INT_MAX; // Remove limit for production (process all records)
$grammarChecks = 0;

while (($row = fgetcsv($in)) !== false) {
    // Skip empty or malformed rows
    if (!is_array($row) || count($row) !== count($header)) {
        continue;
    }
    $assoc = array_combine($header, $row);
    if ($assoc === false) {
        continue;
    }
    if (in_array($assoc['listingsdbelements_field_name'], ['town', 'suburb'])) {
        // Normalize and trim town/suburb fields using GeoNames
        $assoc['listingsdbelements_field_value'] = trim($assoc['listingsdbelements_field_value']);
        $assoc['listingsdbelements_field_value'] = normalizeSuburb($assoc['listingsdbelements_field_value'], $townNames);
    }
    if ($assoc['listingsdbelements_field_name'] === 'address') {
        // Normalize and trim town and address fields
        $assoc['listingsdbelements_field_value'] = trim($assoc['listingsdbelements_field_value']);
        $assoc['listingsdbelements_field_value'] = normalizeAddress($assoc['listingsdbelements_field_value'], $streetTypes);
        if ($assoc['listingsdbelements_field_value'] === '') {
            $assoc['listingsdbelements_field_value'] = null;
        }
        // If address is null, try to extract from full_desc
        if ($assoc['listingsdbelements_field_value'] === null && isset($assoc['listingsdb_id'])) {
            // Find the corresponding full_desc for this listingsdb_id
            $fullDesc = null;
            // Rewind file pointer to start after header
            $currentPos = ftell($in);
            rewind($in);
            fgetcsv($in); // skip header
            while (($searchRow = fgetcsv($in)) !== false) {
                $searchAssoc = array_combine($header, $searchRow);
                if ($searchAssoc && $searchAssoc['listingsdb_id'] === $assoc['listingsdb_id'] && $searchAssoc['listingsdbelements_field_name'] === 'full_desc') {
                    $fullDesc = $searchAssoc['listingsdbelements_field_value'];
                    break;
                }
            }
            fseek($in, $currentPos); // restore file pointer
            if ($fullDesc) {
                // Clean HTML and decode entities before address extraction
                $fullDescText = html_entity_decode(strip_tags($fullDesc), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                // Improved regex: allow for address after any whitespace or punctuation, unit prefix optional
                $pattern = '/(?:^|[\s,;:])((?:Unit|Flat|Villa|Shop)?\s*\d+[A-Za-z]?\/)?\d+[A-ZaZ]?(-\d+[A-Za-z]?)?\s+[A-Z][a-zA-Z\'\-]{2,}\s+(Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Court|Ct|Crescent|Cres|Drive|Dr|Lane|Ln|Place|Pl|Parade|Pde|Terrace|Ter|Way|Square|Sq|Trail|Trl|Circuit|Cct|Grove|Gr|Close|Cl|Mews|Bvd|Highway|Hwy)\b/';
                if (preg_match($pattern, $fullDescText, $matches)) {
                    // Remove any leading non-alphanumeric chars (e.g. space, comma, semicolon)
                    $foundAddress = isset($matches[0]) ? ltrim($matches[0], " \t\n\r\0\x0B,;:") : '';
                    $assoc['listingsdbelements_field_value'] = normalizeAddress($foundAddress, $streetTypes);
                    // Debug output
                    echo "[DEBUG] listingsdb_id={$assoc['listingsdb_id']} extracted address: '{$assoc['listingsdbelements_field_value']}'\n";
                } else {
                    // Debug output for no match
                    echo "[DEBUG] listingsdb_id={$assoc['listingsdb_id']} no address found in full_desc\n";
                }
            }
        }
    }
    // Special handling for Contact field: replace </p><p> and <br> with \n, then sanitize
    if ($assoc['listingsdbelements_field_name'] === 'Contact') {
        $assoc['listingsdbelements_field_value'] = cleanContactField($assoc['listingsdbelements_field_value']);
        $assoc['listingsdbelements_field_value'] = removeEmojisAndNonAscii($assoc['listingsdbelements_field_value']);
    }
    // Only clean/tidy for full_desc, no grammar/spellcheck
    else if ($assoc['listingsdbelements_field_name'] === 'full_desc') {
        $assoc['listingsdbelements_field_value'] = cleanFullDescField($assoc['listingsdbelements_field_value']);
        $assoc['listingsdbelements_field_value'] = removeEmojisAndNonAscii($assoc['listingsdbelements_field_value']);
    } else if (in_array($assoc['listingsdbelements_field_name'], ['home_features', 'community_features'])) {
        // Only clean/tidy, no grammar/spellcheck
        $assoc['listingsdbelements_field_value'] = cleanFeaturesField($assoc['listingsdbelements_field_value']);
        $assoc['listingsdbelements_field_value'] = removeEmojisAndNonAscii($assoc['listingsdbelements_field_value']);
    }
    // Trim numeric fields
    $numericFields = ['lot_size', 'sq_mtr', 'garage_size', 'price', 'building_size', 'land_size'];
    if (in_array($assoc['listingsdbelements_field_name'], $numericFields)) {
        $assoc['listingsdbelements_field_value'] = trim($assoc['listingsdbelements_field_value']);
    }
    // Always wrap every value in double quotes for CSV output, escaping any existing quotes
    $quoted = array_map(function($v) {
        // Ensure $v is always a string to avoid PHP 8.1+ deprecation warning
        if ($v === null) $v = '';
        $v = (string)$v;
        $v = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}\x{2028}\x{2029}\x{2060}\x{00A0}\x{180E}\x{2000}-\x{200A}\x{202F}\x{205F}\x{3000}]/u', '', $v);
        $v = str_replace('"', '""', $v); // Escape quotes
        return '"' . $v . '"';
    }, array_values($assoc));
    fwrite($out, implode(',', $quoted) . "\n"); // Use LF only
}
fclose($in);
fclose($out);

// After processing all rows, sort the output CSV by listingsdb_id, then listingsdbelements_field_name
// Read the output file into an array
$rows = [];
if (($handle = fopen($outputFile, 'r')) !== false) {
    $header = fgetcsv($handle);
    while (($data = fgetcsv($handle)) !== false) {
        $rowAssoc = array_combine($header, $data);
        $rows[] = $rowAssoc;
    }
    fclose($handle);
}
// Sort by listingsdb_id, then listingsdbelements_field_name
usort($rows, function($a, $b) {
    $idCmp = strcmp($a['listingsdb_id'], $b['listingsdb_id']);
    if ($idCmp !== 0) return $idCmp;
    return strcmp($a['listingsdbelements_field_name'], $b['listingsdbelements_field_name']);
});
// Write sorted rows back to the output file
$out = fopen($outputFile, 'w');
fputcsv($out, $header);
foreach ($rows as $row) {
    // Always wrap every value in double quotes for CSV output, escaping any existing quotes
    $quoted = array_map(function($v) {
        if ($v === null) $v = '';
        $v = (string)$v;
        $v = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}\x{2028}\x{2029}\x{2060}\x{00A0}\x{180E}\x{2000}-\x{200A}\x{202F}\x{205F}\x{3000}]/u', '', $v);
        $v = str_replace('"', '""', $v); // Escape quotes
        return '"' . $v . '"';
    }, array_values($row));
    fwrite($out, implode(',', $quoted) . "\n");
}
fclose($out);

echo "Done! Normalized CSV written to $outputFile\n";