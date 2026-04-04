<?php
session_start();
if (!isset($_SESSION['admin_logged'])) {
    http_response_code(403);
    die("Acceso denegado");
}

require_once '../config/db.php';

$nombre = $_POST['nombre'];
$precio = $_POST['precio'];
$imagen = $_POST['imagen'];
$descripcion = $_POST['descripcion'];
$categoria = $_POST['categoria'];

$stmt = $conn->prepare("INSERT INTO productos (nombre, precio, imagen, descripcion, categoria) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sdsss", $nombre, $precio, $imagen, $descripcion, $categoria);

if ($stmt->execute()) {
    echo "Producto agregado correctamente";
} else {
    echo "Error: " . $stmt->error;
}
?>