<?php
require_once __DIR__ . '/../config/config.php';

session_start();

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJSON(['status' => 'ok']);
}

// 1. REGISTER
if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $name = trim($input['name'] ?? '');
    $email = trim(strtolower($input['email'] ?? ''));
    $password = trim($input['password'] ?? '');

    if (!$name || !$email || !$password) {
        sendJSON(['error' => 'Please provide name, email, and password.'], 400);
    }

    $pdo = getDBConnection();
    if ($pdo) {
        // Check existing user
        $stmt = $pdo->prepare("SELECT user_id FROM user WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            sendJSON(['error' => 'Email address is already registered.'], 400);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, 'user')");
        $stmt->execute([$name, $email, $hash]);

        $userId = $pdo->lastInsertId();
        $userData = ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => 'user'];
        $_SESSION['user'] = $userData;
        sendJSON(['success' => true, 'user' => $userData]);
    } else {
        // Fallback for standalone demo mode
        $userData = ['id' => time(), 'name' => $name, 'email' => $email, 'role' => 'user'];
        sendJSON(['success' => true, 'user' => $userData]);
    }
}

// 2. LOGIN
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $email = trim(strtolower($input['email'] ?? ''));
    $password = trim($input['password'] ?? '');
    $isAdminLogin = !empty($input['admin_login']);

    if (!$email || !$password) {
        sendJSON(['error' => 'Please provide email and password.'], 400);
    }

    // Default hardcoded admin / user credentials check
    if ($email === 'admin@moviemate.com' && ($password === 'admin123' || $password === 'admin')) {
        $adminUser = ['id' => 1, 'name' => 'Administrator', 'email' => 'admin@moviemate.com', 'role' => 'admin'];
        $_SESSION['user'] = $adminUser;
        sendJSON(['success' => true, 'user' => $adminUser]);
    }

    if ($email === 'user@moviemate.com' && ($password === 'user123' || $password === 'user')) {
        $testUser = ['id' => 2, 'name' => 'Alex Mercer', 'email' => 'user@moviemate.com', 'role' => 'user'];
        $_SESSION['user'] = $testUser;
        sendJSON(['success' => true, 'user' => $testUser]);
    }

    $pdo = getDBConnection();
    if ($pdo) {
        $table = $isAdminLogin ? 'admin' : 'user';
        $idCol = $isAdminLogin ? 'admin_id' : 'user_id';
        $role = $isAdminLogin ? 'admin' : 'user';

        $stmt = $pdo->prepare("SELECT * FROM $table WHERE email = ?");
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        if ($row && password_verify($password, $row['password'])) {
            $userData = [
                'id' => $row[$idCol],
                'name' => $row['name'],
                'email' => $row['email'],
                'role' => $row['role'] ?? $role
            ];
            $_SESSION['user'] = $userData;
            sendJSON(['success' => true, 'user' => $userData]);
        }
    }

    sendJSON(['error' => 'Invalid email or password credentials.'], 401);
}

// 3. CHECK SESSION
if ($action === 'session') {
    if (!empty($_SESSION['user'])) {
        sendJSON(['loggedIn' => true, 'user' => $_SESSION['user']]);
    } else {
        sendJSON(['loggedIn' => false]);
    }
}

// 4. LOGOUT
if ($action === 'logout') {
    unset($_SESSION['user']);
    session_destroy();
    sendJSON(['success' => true]);
}

sendJSON(['error' => 'Invalid endpoint action.'], 400);
