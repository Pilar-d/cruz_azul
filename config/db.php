<?php
// Configuración de conexión a MariaDB en EC2 (subred privada)
define('DB_HOST', '10.0.2.10');        // IP privada del servidor BD
define('DB_USER', 'cruzazul_user');
define('DB_PASS', 'Segura123!');
define('DB_NAME', 'farmacia_cruzazul');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>