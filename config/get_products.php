<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$result = $conn->query("SELECT id, nombre, precio, imagen, descripcion, categoria FROM productos WHERE activo = 1");
$productos = [];

while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode($productos);
?>