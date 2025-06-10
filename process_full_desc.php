<?php
// Usage: php process_full_desc.php input.csv output.csv
// Requires: composer require wamania/php-stemmer (or use your preferred NLP/spellcheck library)

require __DIR__ . '/vendor/autoload.php';

$inputFile = $argv[1] ?? null;
$outputFile = $argv[2] ?? null;

if (!$inputFile || !$outputFile) {
    echo "Usage: php process_full_desc.php input.csv output.csv\n";
    exit(1);
}

// Use a simple spellchecker (pspell) if available, else fallback to basic PHP functions
$usePspell = function_exists('pspell_new');
if ($usePspell) {
    $pspell_link = pspell_new('en');
}

function correct_text($text, $pspell_link = null) {
    // Basic cleanup: remove extra spaces, fix capitalization, etc.
    $text = preg_replace('/\s+/', ' ', $text);
    $text = trim($text);
    // Optionally, split into sentences and capitalize
    $text = preg_replace_callback('/(^|[.!?]\s+)([a-z])/', function($m) {
        return $m[1] . strtoupper($m[2]);
    }, $text);
    // Spellcheck each word if pspell is available
    if ($pspell_link) {
        $words = explode(' ', $text);
        foreach ($words as &$word) {
            $clean = preg_replace('/[^a-zA-Z\']/', '', $word);
            if ($clean && !pspell_check($pspell_link, $clean)) {
                $suggestions = pspell_suggest($pspell_link, $clean);
                if ($suggestions && count($suggestions) > 0) {
                    $word = str_replace($clean, $suggestions[0], $word);
                }
            }
        }
        $text = implode(' ', $words);
    }
    return $text;
}

$in = fopen($inputFile, 'r');
if (!$in) {
    echo "Could not open input file: $inputFile\n";
    exit(1);
}
$out = fopen($outputFile, 'w');
if (!$out) {
    echo "Could not open output file: $outputFile\n";
    fclose($in);
    exit(1);
}

// Remove header logic, process all rows
while (($row = fgetcsv($in)) !== false) {
    // If the second column is 'full_desc', process the third column
    if (isset($row[1]) && strtolower(trim($row[1])) === 'full_desc' && isset($row[2])) {
        $row[2] = correct_text($row[2], $usePspell ? $pspell_link : null);
    }
    fputcsv($out, $row, ',', '"');
}

fclose($in);
fclose($out);
echo "Done. Output written to $outputFile\n";
