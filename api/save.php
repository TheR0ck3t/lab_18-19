<?php
$config = require '../config.php';
require '../db/db.php';
if (!file_exists($config['db_path'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Baza danych nie istnieje']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Nieprawidłowa metoda']);
    exit;
}
if (!isset($_SERVER['CONTENT_TYPE']) || strpos($_SERVER['CONTENT_TYPE'], 'application/json') === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Nieprawidłowy typ treści']);
    exit;
}
$type = $_GET['type'] ?? null;
if (!$type) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak typu']);
    exit;
}

try {
    $json = json_decode(file_get_contents("php://input"), true);
    if (!$json) throw new Exception("Błąd dekodowania JSON");

    $fileName = trim($json['fileName'] ?? '');
    $data = $json['data'] ?? null;

    if (!$fileName || !$data) throw new Exception("Brakuje danych");
    
    switch ($type) {
        case 'template' : 
            $stmt = $pdo->prepare("INSERT INTO templates (template_name, data) VALUES (?, ?)");
            $stmt->execute([$fileName, json_encode($data)]);
            echo json_encode(['message' => 'Szablon zapisany']);
            break;
        case 'form' :
            $stmt = $pdo->prepare("INSERT INTO forms (form_name, data) VALUES (?, ?)");
            $stmt->execute([$fileName, json_encode($data)]);
            echo json_encode(['message' => 'Formularz zapisany']);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Nieznany typ']);
            exit;
    };

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}