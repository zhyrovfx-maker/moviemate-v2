<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'trending';
$query = trim($_GET['query'] ?? '');
$movieId = $_GET['id'] ?? null;

// Helper function to call TMDB API from server
function callTMDB($endpoint, $params = []) {
    $params['12e3bd54e8e29009b67ab59524bc0660'] = TMDB_API_KEY;
    $url = TMDB_BASE_URL . $endpoint . '?' . http_build_query($params);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    
    curl_close($ch);

    return $response ? json_decode($response, true) : null;
}

// 1. SEARCH MOVIES
if ($action === 'search' && $query) {
    $data = callTMDB('/search/movie', ['query' => $query]);
    if ($data && !empty($data['results'])) {
        sendJSON(['results' => $data['results']]);
    }
}

// 2. MOVIE DETAILS
if ($action === 'details' && $movieId) {
    $data = callTMDB('/movie/' . $movieId, ['append_to_response' => 'videos,credits,similar']);
    if ($data) {
        sendJSON($data);
    }
}

// 3. TRENDING MOVIES (DEFAULT)
$data = callTMDB('/trending/movie/week');
if ($data && !empty($data['results'])) {
    sendJSON(['results' => $data['results']]);
} else {
    sendJSON(['error' => 'Unable to fetch movies from server API.'], 500);
}
