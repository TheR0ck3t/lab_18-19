<?php
// Wczytanie konfiguracji i połączenia z bazą danych
$config = require '../config.php';
require '../db/db.php';

// Sprawdzenie czy baza danych istnieje
if (!file_exists($config['db_path'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Baza danych nie istnieje']);
    exit;
}

// Sprawdzenie czy metoda HTTP to DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Nieprawidłowa metoda']);
    exit;
}

// Pobranie typu zasobu z parametrów URL
$type = $_GET['type'] ?? null;
if (!$type) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak typu']);
    exit;
}

// Sprawdzenie czy typ jest prawidłowy
if (!in_array($type, ['templates', 'forms', 'fields'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nieznany typ']);
    exit;
}

// Pobranie identyfikatora zasobu
$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak ID']);
    exit;
}

try {
    // Przygotowanie odpowiedniego zapytania DELETE w zależności od typu zasobu
    switch ($type) {
        case 'templates':
            $stmt = $pdo->prepare("DELETE FROM templates WHERE id = ?");
            break;
        case 'forms':
            $stmt = $pdo->prepare("DELETE FROM forms WHERE id = ?");
            break;
        case 'fields':
            $stmt = $pdo->prepare("DELETE FROM fields WHERE id = ?");
            break;
    }
    
    // Wykonanie zapytania
    if (!$stmt->execute([$id])) {
        throw new Exception("Błąd SQL: " . implode(", ", $stmt->errorInfo()));
    }
    
    // Zwrócenie odpowiedzi
    echo json_encode(['message' => 'Usunięto']);
} catch (Exception $e) {
    // Obsługa błędów
    http_response_code(500);
    echo json_encode(['error' => 'Błąd serwera: ' . $e->getMessage()]);
}