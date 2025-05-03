<?php
// Wczytanie konfiguracji i połączenia z bazą danych
$config = require '../config.php';
require '../db/db.php';

// Sprawdzenie czy metoda HTTP to GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

try {
    switch ($type) {
        case 'templates':
            // Pobieranie listy wszystkich szablonów
            $templates = $pdo->query("SELECT id, template_name ,data ,created_at FROM templates")->fetchAll(PDO::FETCH_ASSOC);
            if (!$templates) {
                http_response_code(404);
                echo json_encode(['error' => 'Nie znaleziono szablonów']);
                break;
            }
            else {
                header('Content-type: application/json');
                echo json_encode([$templates]);
                break;
            }
        case 'forms':
            // Pobieranie listy wszystkich formularzy
            $forms = $pdo->query("SELECT id, form_name, data, created_at FROM forms")->fetchAll(PDO::FETCH_ASSOC);
            if (!$forms) {
                http_response_code(404);
                echo json_encode(['error' => 'Nie znaleziono formularzy']);
                break;
            }
            else {
                header('Content-type: application/json');
                echo json_encode([$forms]);
                break;
            }
        case 'fields':
            // Pobieranie listy wszystkich pól
            $fields = $pdo->query("SELECT id, field_name FROM fields")->fetchAll(PDO::FETCH_ASSOC);
            if (!$fields) {
                http_response_code(404);
                echo json_encode(['error' => 'Nie znaleziono pól']);
                break;
            }
            else {
                header('Content-type: application/json');
                echo json_encode([$fields]);
                break;
            }
        default:
            // Nieznany typ zasobu
            http_response_code(400);
            echo json_encode(['error' => 'Nieznany typ']);
            exit;
    }
} catch (Exception $e) {
    // Obsługa błędów
    http_response_code(500);
    echo json_encode(['error' => 'Błąd podczas przetwarzania żądania']);
    exit;
}
