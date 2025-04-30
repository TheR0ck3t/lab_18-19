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
if (!in_array($type, ['templates', 'forms', 'fields'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nieznany typ']);
    exit;
}
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak ID']);
    exit;
}

try {
    switch ($type) {
        case 'templates':
            $stmt = $pdo->prepare("SELECT id, template_name, data, created_at FROM templates WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $template = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$template) {
                http_response_code(404);
                echo json_encode(['error' => 'Nie znaleziono szablonu']);
                break;
            }
            else {
                header('Content-type: application/json');
                echo json_encode($template);
                break;
            }
        case 'forms':
            $stmt = $pdo->prepare("SELECT id, form_name, data, created_at FROM forms WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $form = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$form) {
                http_response_code(404);
                echo json_encode(['error' => 'Nie znaleziono formularza']);
                break;
            }
            else {
                header('Content-type: application/json');
                echo json_encode($form);
                break;
            }
        case 'fields':
            $stmt = $pdo->prepare("SELECT id, field_name FROM fields WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $field = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$field) {
                http_response_code(404);
                echo json_encode(['error' => 'Nie znaleziono pola']);
                break;
            }
            else {
                header('Content-type: application/json');
                echo json_encode($field);
                break;
            }
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Nieznany typ']);
            exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
