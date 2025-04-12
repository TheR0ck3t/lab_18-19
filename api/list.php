<?php
$config = require '../config.php';
require '../db/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Nieprawidłowa metoda']);
    exit;
}

$type = $_GET['type'] ?? null;
if (!$type) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak typu']);
    exit;
}
if (!in_array($type, ['templates', 'forms'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nieznany typ']);
    exit;
}

try {

    switch ($type) {
        case 'templates':
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
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Nieznany typ']);
            exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd podczas przetwarzania żądania']);
    exit;
}
