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

// Sprawdzenie czy metoda HTTP to POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Nieprawidłowa metoda']);
    exit;
}

// Sprawdzenie czy typ zawartości to JSON
if (!isset($_SERVER['CONTENT_TYPE']) || strpos($_SERVER['CONTENT_TYPE'], 'application/json') === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Nieprawidłowy typ treści']);
    exit;
}

// Pobranie typu zasobu z parametrów URL
$type = $_GET['type'] ?? null;
if (!$type) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak typu']);
    exit;
}

try {
    // Dekodowanie danych JSON z żądania
    $json = json_decode(file_get_contents("php://input"), true);
    if (!$json) throw new Exception("Błąd dekodowania JSON");

    // Pobranie danych z żądania
    $data = $json['data'] ?? null;
    $form_name = $json['form_name'] ?? null;
    $template_name = $json['template_name'] ?? null;
    $field_name = $json['field_name'] ?? null;
    $dataToSave = is_string($data) ? $data : json_encode($data, JSON_UNESCAPED_UNICODE);

    switch ($type) {
        case 'templates':
            // Tworzenie nowego szablonu
            if (!$template_name || !$data) throw new Exception("Brakuje danych szablonu");
            $stmt = $pdo->prepare("INSERT INTO templates (template_name, data) VALUES (?, ?)");
            if (!$stmt->execute([$template_name, $dataToSave])) {
                throw new Exception("Błąd SQL: " . implode(", ", $stmt->errorInfo()));
            }
            echo json_encode(['message' => 'Szablon zapisany']);
            break;
        case 'forms':
            // Tworzenie nowego formularza
            if (!$form_name || !$data) throw new Exception("Brakuje danych formularza");
            $stmt = $pdo->prepare("INSERT INTO forms (form_name, data) VALUES (?, ?)");
            if (!$stmt->execute([$form_name, $dataToSave])) {
                throw new Exception("Błąd SQL: " . implode(", ", $stmt->errorInfo()));
            }
            echo json_encode(['message' => 'Formularz zapisany']);
            break;
        case 'fields':
            // Tworzenie nowych pól
            if (!$field_name || !is_array($field_name)) throw new Exception("Brak pól");
            $stmt = $pdo->prepare("INSERT INTO fields (field_name) VALUES (?)");
            foreach ($field_name as $field) {
                if (!$stmt->execute([$field])) {
                    throw new Exception("Błąd SQL: " . implode(", ", $stmt->errorInfo()));
                }
            }
            echo json_encode(['message' => 'Pola zapisane']);
            break;
        default:
            // Nieznany typ zasobu
            http_response_code(400);
            echo json_encode(['error' => 'Nieznany typ']);
            exit;
    }

} catch (Exception $e) {
    // Obsługa błędów
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}