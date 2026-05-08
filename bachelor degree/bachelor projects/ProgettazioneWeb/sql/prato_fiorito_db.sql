-- SQL Dump Anonimizzato Progetto Prato Fiorito
-- Database: prato_fiorito_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- 1. Creazione dello Schema Generico
DROP DATABASE IF EXISTS prato_fiorito_db;
CREATE DATABASE prato_fiorito_db;
USE prato_fiorito_db;

-- 2. Definizione Tabella Utenti 
DROP TABLE IF EXISTS `utenti`;
CREATE TABLE `utenti` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Definizione Tabella Partite 
DROP TABLE IF EXISTS `partite`;
CREATE TABLE `partite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utente_id` int(11) NOT NULL,
  `tempo` int(11) DEFAULT NULL,
  `difficolta` enum('facile','medio','difficile') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utente_id` (`utente_id`),
  KEY `difficolta` (`difficolta`),
  CONSTRAINT `partite_ibfk_1` FOREIGN KEY (`utente_id`) REFERENCES `utenti` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reset degli indici 
ALTER TABLE `utenti` AUTO_INCREMENT = 1;
ALTER TABLE `partite` AUTO_INCREMENT = 1;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;