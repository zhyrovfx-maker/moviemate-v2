<?php
// MovieMate v2 Configuration File

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'moviemate_v2');

// Server-side TMDB API Configuration (Live Active Keys)
define('TMDB_API_KEY', '4e44d9029b1270a757cddc766a1bcb63');
define('TMDB_BACKUP_KEY', '1cf50e6248dc270629e802686245c2c8');
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
define('TMDB_IMAGE_BASE', 'https://image.tmdb.org/t/p/w500');
define('TMDB_BACKDROP_BASE', 'https://image.tmdb.org/t/p/w1280');

// Database Connection Helper
function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            return null; // Return null if DB is not installed yet
        }
    }
    return $pdo;
}

// JSON Response Helper
function sendJSON($data, $statusCode = 200) {
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}
