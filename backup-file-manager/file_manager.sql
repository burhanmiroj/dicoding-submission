-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.33 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for file_manager
DROP DATABASE IF EXISTS `file_manager`;
CREATE DATABASE IF NOT EXISTS `file_manager` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `file_manager`;

-- Dumping structure for table file_manager.tb_files
DROP TABLE IF EXISTS `tb_files`;
CREATE TABLE IF NOT EXISTS `tb_files` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `file` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `size` varchar(50) NOT NULL DEFAULT '0',
  `folder_name` varchar(50) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `unique_id` (`id`),
  KEY `index` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table file_manager.tb_files: ~0 rows (approximately)
DELETE FROM `tb_files`;
/*!40000 ALTER TABLE `tb_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_files` ENABLE KEYS */;

-- Dumping structure for table file_manager.tb_folders
DROP TABLE IF EXISTS `tb_folders`;
CREATE TABLE IF NOT EXISTS `tb_folders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `folder_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `unique_id` (`id`),
  KEY `index` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table file_manager.tb_folders: ~0 rows (approximately)
DELETE FROM `tb_folders`;
/*!40000 ALTER TABLE `tb_folders` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_folders` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
