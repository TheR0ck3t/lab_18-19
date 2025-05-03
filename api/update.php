<?php
$config = require '../config.php';
require '../db/db.php';
if (!file_exists($config['db_path'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Baza danych nie istnieje']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
    $json = json_decode(file_get_contents("php://input"), true);
    if (!$json) throw new Exception("Błąd dekodowania JSON");

    $data = $json['data'] ?? null;
    $form_name = $json['form_name'] ?? null;
    $template_name = $json['template_name'] ?? null;
    $field_name = $json['field_name'] ?? null;


    switch ($type) {
        case 'templates' : 
            if (!$template_name || !$data) throw new Exception("Brakuje danych szablonu");
            $stmt = $pdo->prepare("UPDATE templates SET data = ?, template_name = ? WHERE id = ?");
            $dataToSave = is_string($data) ? $data : json_encode($data);
            if (!$stmt->execute([$dataToSave, $template_name, $id])) {
                throw new Exception("Błąd SQL: " . implode(", ", $stmt->errorInfo()));
            }
            echo json_encode(['message' => 'Szablon zaktualizowany']);
            break;
        case 'forms' :
            if (!$form_name || !$data) throw new Exception("Brakuje danych formularza");
            $stmt = $pdo->prepare("UPDATE forms SET data = ?, form_name = ? WHERE id = ?");
            $dataToSave = is_string($data) ? $data : json_encode($data);
            if (!$stmt->execute([$dataToSave, $form_name, $id])) {
                throw new Exception("Błąd SQL: " . implode(", ", $stmt->errorInfo()));
            }
            echo json_encode(['message' => 'Formularz zaktualizowany']);
            break;
        case 'fields' :
            if (!$field_name) throw new Exception("Brakuje nazwy pola");
            $stmt = $pdo->prepare("UPDATE fields SET field_name = ? WHERE id = ?");
            if (!$stmt->execute([$field_name, $id])) {
                throw new Exception("Błąd SQL: " . implode(", ", $stmt->errorInfo()));
            }
            echo json_encode(['message' => 'Pole zaktualizowane']);
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