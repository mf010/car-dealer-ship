-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: cardealership
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_deposits`
--

DROP TABLE IF EXISTS `account_deposits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_deposits` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `deposit_date` date NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_deposits_account_id_foreign` (`account_id`),
  CONSTRAINT `account_deposits_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_deposits`
--

LOCK TABLES `account_deposits` WRITE;
/*!40000 ALTER TABLE `account_deposits` DISABLE KEYS */;
INSERT INTO `account_deposits` VALUES (1,1,1000.00,'2026-01-07',NULL,'2026-01-07 18:21:06','2026-01-07 18:21:06'),(2,1,1000.00,'2026-01-08',NULL,'2026-01-08 11:33:21','2026-01-08 11:33:21'),(3,21,1000.00,'2026-01-08',NULL,'2026-01-08 15:25:06','2026-01-08 15:25:06'),(4,13,5000.00,'2026-01-08',NULL,'2026-01-08 15:26:07','2026-01-08 15:26:07'),(5,2,0.10,'2026-01-08',NULL,'2026-01-08 15:26:35','2026-01-08 15:26:35'),(6,21,1000.00,'2026-01-08',NULL,'2026-01-08 15:31:02','2026-01-08 15:31:02');
/*!40000 ALTER TABLE `account_deposits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_withdrawals`
--

DROP TABLE IF EXISTS `account_withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_withdrawals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `withdrawal_date` date NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_withdrawals_account_id_foreign` (`account_id`),
  CONSTRAINT `account_withdrawals_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_withdrawals`
--

LOCK TABLES `account_withdrawals` WRITE;
/*!40000 ALTER TABLE `account_withdrawals` DISABLE KEYS */;
INSERT INTO `account_withdrawals` VALUES (1,5,370.42,'1979-07-05',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(2,5,312.28,'2018-06-23',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(3,1,689.13,'2023-11-22',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(4,2,311.26,'1973-07-30',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(5,4,413.41,'2004-06-26',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(6,4,901.26,'2015-07-16',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(7,4,890.00,'2000-08-12',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(8,5,326.71,'1974-05-21',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(9,4,269.27,'2018-02-03',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(10,4,866.48,'1979-01-04',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(11,8,333.11,'1993-03-19',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(12,7,602.40,'1971-09-03',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(13,9,695.29,'2017-05-01',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(14,6,792.43,'1999-03-02',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(15,10,205.53,'2010-05-30',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(16,7,190.96,'2012-11-24',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(17,10,179.29,'1976-04-12',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(18,7,374.16,'1989-07-16',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(19,8,528.69,'2015-05-17',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(20,6,390.11,'1970-02-04',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(21,13,776.54,'1986-01-25',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(22,14,750.65,'2000-10-15',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(23,12,197.84,'1999-03-23',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(24,13,370.73,'2004-02-07',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(25,11,435.51,'2003-04-19',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(26,13,433.09,'1987-11-06',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(27,11,592.45,'2005-02-18',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(28,11,550.32,'1983-01-11',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(29,14,481.76,'1985-04-03',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(30,13,977.31,'2012-11-17',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(31,19,432.59,'2011-06-01',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(32,19,548.49,'2024-06-02',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(33,18,610.21,'1995-07-11',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(34,17,525.24,'2016-08-28',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(35,19,364.02,'1973-08-21',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(36,19,344.93,'2024-02-17',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(37,18,554.36,'1978-07-26',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(38,17,977.44,'1980-03-04',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(39,18,946.79,'1986-01-05',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(40,19,389.13,'2023-05-24',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(41,1,4850.00,'2026-01-07',NULL,'2026-01-07 16:43:06','2026-01-07 16:43:06'),(42,10,1000.00,'2026-01-08',NULL,'2026-01-08 11:32:55','2026-01-08 11:32:55'),(43,1,1000.00,'2026-01-08',NULL,'2026-01-08 11:33:07','2026-01-08 11:33:07'),(44,1,1000.00,'2026-01-08',NULL,'2026-01-08 11:33:41','2026-01-08 11:33:41'),(45,21,1000.00,'2026-01-08',NULL,'2026-01-08 14:14:16','2026-01-08 14:14:16'),(46,21,1000.00,'2026-01-08',NULL,'2026-01-08 15:25:19','2026-01-08 15:25:19'),(47,21,10.00,'2026-01-08',NULL,'2026-01-08 15:25:31','2026-01-08 15:25:31');
/*!40000 ALTER TABLE `account_withdrawals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'Denis Towne','(708) 416-9654',0.44,'2025-12-26 14:50:42','2026-01-08 11:33:41',NULL),(2,'Prof. Justyn King PhD','727.935.2536',379.07,'2025-12-26 14:50:42','2026-01-08 15:26:35',NULL),(3,'Ona Labadie IV','+1 (657) 555-8774',42065.11,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(4,'Liliana Stoltenberg','743.547.8704',39.59,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(5,'Dr. Rosalyn Bayer Jr.','+1 (737) 230-2414',32057.18,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(6,'Joe Kutch','(850) 999-4422',47149.96,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(7,'Faye Schroeder','(424) 215-7148',26382.99,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(8,'Peggie Murray','+1.539.970.4636',34026.63,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(9,'Griffin Heaney','(564) 296-0301',45300.55,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(10,'Myrtis Jerde','+17608101884',5469.97,'2025-12-26 14:52:02','2026-01-08 11:32:55',NULL),(11,'Dr. Maximo Mosciski II','1-346-547-2627',41219.91,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(12,'Percival Abernathy','669-400-0226',16843.31,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(13,'Yessenia Brown','385.575.6108',23058.32,'2025-12-26 14:53:30','2026-01-08 15:26:07',NULL),(14,'Mr. Grover King','(641) 523-6666',42752.59,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(15,'Cecilia Lang IV','+1 (505) 829-9273',1109.58,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(16,'Karli Nikolaus','+14178027848',25206.09,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(17,'Kurtis Nikolaus','989-592-2253',46948.40,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(18,'Solon Ernser II','+1 (831) 243-7484',7592.33,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(19,'Jeanette Koch III','1-949-432-5032',43851.42,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(20,'Crystel Lubowitz','+1 (404) 227-7752',29024.10,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(21,'علي','01900923',990.00,'2026-01-07 16:43:56','2026-01-08 15:31:02',NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-aDGUiZOdx4SygIzA','a:1:{s:11:\"valid_until\";i:1766770501;}',1767976981),('laravel-cache-e5gGF96zTURqRjcg','a:1:{s:11:\"valid_until\";i:1767624074;}',1768833675),('laravel-cache-U4WBxP6YPjH2GYZZ','a:1:{s:11:\"valid_until\";i:1767616308;}',1768825908);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_expenses`
--

DROP TABLE IF EXISTS `car_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `car_expenses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `car_id` bigint(20) unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expense_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car_expenses_car_id_foreign` (`car_id`),
  CONSTRAINT `car_expenses_car_id_foreign` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_expenses`
--

LOCK TABLES `car_expenses` WRITE;
/*!40000 ALTER TABLE `car_expenses` DISABLE KEYS */;
INSERT INTO `car_expenses` VALUES (1,27,'Doloremque sint rerum atque saepe eum consequatur voluptatibus laboriosam.',479.29,'1999-05-03','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(2,20,'Numquam quia optio veritatis mollitia.',232.40,'1975-12-11','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(3,2,'Voluptate voluptas placeat eum aut sequi.',533.79,'2002-03-13','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(4,25,'Suscipit quia non sunt veniam.',653.22,'2001-03-14','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(5,4,'Expedita ipsam dolorem voluptas minus voluptas eaque.',555.57,'1992-01-03','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(6,20,'Et ab nesciunt veritatis tenetur.',164.35,'2005-12-10','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(7,28,'Est id quia non et sed libero.',236.29,'1994-05-30','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(8,8,'Ut magni est eos voluptas nesciunt.',109.49,'1993-04-03','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(9,16,'Ex minus necessitatibus quaerat.',45.90,'2012-06-19','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(10,12,'Maxime sequi eveniet quo odio delectus voluptas.',350.51,'2025-10-04','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(11,15,'Ut fugiat officiis hic labore quam.',952.39,'2019-08-22','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(12,29,'Repellendus animi minus laboriosam ipsum ea.',323.05,'2023-07-10','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(13,19,'Officiis voluptatem dolorem sit non cum corrupti.',43.45,'2010-09-09','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(14,28,'Illo odio nesciunt error dicta est qui eos.',320.16,'2000-10-20','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(15,26,'Fuga voluptatem eligendi tempora dignissimos in temporibus velit.',752.32,'1979-08-20','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(16,27,'Aut ducimus debitis iste.',943.55,'1977-01-18','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(17,26,'Architecto quis cumque repellendus adipisci dolor.',267.25,'2022-02-03','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(18,1,'Dolores et maiores voluptatem molestiae quaerat.',404.50,'1990-04-11','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(19,28,'Maiores veritatis consequatur repellat porro.',335.61,'1990-01-07','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(20,4,'Eum porro dolor error ut.',873.77,'2012-01-12','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(21,1,'Adipisci et ut soluta perferendis ad.',259.69,'2015-07-19','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(22,18,'Possimus eum debitis pariatur ut.',440.04,'1975-10-20','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(23,2,'Voluptatem dolorem et aut amet porro optio.',463.46,'2004-08-06','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(24,3,'Accusantium numquam aut dignissimos exercitationem aliquid.',755.04,'1987-08-07','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(25,8,'Cupiditate ut ut debitis repellendus ut.',849.33,'1993-11-21','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(26,1,'Expedita et repellat ducimus dicta tempora.',72.48,'1971-07-30','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(27,30,'Dolor cum dicta perspiciatis ullam et ea officiis.',462.27,'1988-10-05','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(28,6,'Quas velit excepturi vel quia delectus qui et.',217.32,'2000-05-20','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(29,13,'Earum perspiciatis placeat non est tempora.',147.86,'2013-11-04','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(30,26,'Unde voluptate earum sed rerum non.',141.94,'2006-08-11','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(31,16,'Est aut dolorum aut provident et et sit pariatur.',397.14,'1991-05-26','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(32,8,'Quis minima nam sequi placeat soluta.',191.71,'2012-12-08','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(33,14,'Aspernatur praesentium in eveniet ducimus.',275.00,'1991-12-02','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(34,10,'Alias in voluptas architecto numquam sunt dolorum nihil eveniet.',557.12,'2020-09-14','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(35,27,'Sed consequuntur eos cumque cum culpa quaerat.',294.26,'2015-01-23','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(36,1,'Dolor magni a assumenda ut id error aliquam.',376.36,'1985-10-04','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(37,4,'Est et repudiandae sit soluta sit qui.',126.45,'2013-01-26','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(38,25,'Commodi necessitatibus corrupti fuga sed qui.',572.65,'1981-06-03','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(39,21,'Repudiandae nesciunt adipisci non eos facilis omnis.',240.48,'2018-04-02','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(40,2,'Aut voluptatem laborum quia aut ea.',734.40,'2000-03-22','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(41,9,'Quos dolor eligendi sit quaerat placeat.',861.92,'1972-11-15','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(42,4,'Quisquam ipsam dicta alias delectus assumenda incidunt autem numquam.',948.08,'2009-03-19','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(43,22,'Corporis corporis architecto ut in.',442.51,'2008-06-14','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(44,26,'Ad alias soluta rerum et.',459.02,'1982-09-12','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(45,10,'Architecto fuga impedit maxime magni praesentium sint qui quo.',361.73,'1997-10-25','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(46,6,'Tempora a nihil at enim officia molestiae voluptas.',922.25,'1979-12-29','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(47,22,'Ea vel numquam voluptas est non numquam.',267.36,'2025-01-31','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(48,1,'Autem repudiandae autem iure est quis sit.',731.26,'1993-06-10','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(49,27,'Aut et aut at error ea laboriosam.',685.17,'1971-06-15','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(50,13,'Et fugiat nesciunt non et maiores.',540.47,'1999-12-28','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(51,57,'Aut animi et deserunt dolore est et non.',733.36,'1980-05-19','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(52,55,'Et ipsum sint non error et in nemo excepturi.',20.59,'2018-04-28','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(53,48,'Deserunt nisi voluptatem soluta.',692.42,'1982-12-24','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(54,37,'Numquam incidunt quaerat dolor dicta.',583.96,'1979-05-25','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(55,50,'Sit maxime unde optio enim.',72.63,'1999-03-08','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(56,50,'Qui cum sunt deserunt.',776.05,'1993-12-20','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(57,46,'Quas quam alias rerum alias reprehenderit.',33.09,'2018-07-14','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(58,58,'Deleniti aut beatae amet qui assumenda est nisi.',536.35,'2023-05-17','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(59,32,'Eos officia harum quis asperiores.',691.12,'1978-03-01','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(60,60,'Earum aliquid sunt deleniti quia molestiae.',941.06,'2022-08-08','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(61,53,'Voluptatibus velit est voluptatem et consequatur quasi et ipsum.',414.05,'1989-05-20','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(62,48,'Maxime rerum eum vel qui similique.',990.32,'1994-06-23','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(63,59,'Nobis voluptates ratione amet.',375.25,'1991-02-25','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(64,40,'Eum reprehenderit veritatis quos ut.',905.97,'1982-08-12','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(65,31,'Temporibus optio modi explicabo et soluta sed.',812.59,'1981-05-03','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(66,55,'Suscipit sapiente optio incidunt repudiandae.',810.97,'1988-03-11','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(67,36,'Enim et odio et rerum aperiam cum rem.',321.33,'1996-08-30','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(68,55,'Vel modi quod laborum est totam.',42.52,'2017-03-26','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(69,51,'Non explicabo aspernatur est beatae est.',438.49,'2023-03-23','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(70,43,'Cum et magnam commodi sed nobis excepturi numquam.',67.34,'1998-12-10','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(71,32,'Quia dolores voluptatem voluptatum rerum.',243.53,'2009-04-21','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(72,43,'Qui consectetur fugiat sint ratione ad iusto error.',613.24,'1981-04-03','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(73,42,'Labore doloribus aut reprehenderit ea tempora quibusdam facilis.',364.25,'1972-09-29','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(74,40,'Et nihil eius accusamus aliquam deleniti temporibus est.',416.14,'1998-05-12','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(75,39,'Deleniti voluptas reprehenderit aut necessitatibus dolorum non.',981.40,'1987-01-07','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(76,54,'Nemo et iste impedit cupiditate voluptate.',562.65,'2003-07-10','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(77,54,'Magnam quia fugit eos id.',831.54,'2002-02-07','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(78,56,'Aut veritatis nam sit laboriosam.',41.48,'1992-01-26','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(79,50,'Est ex explicabo doloremque nam rerum rerum esse.',934.77,'1970-03-27','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(80,36,'Incidunt voluptas assumenda necessitatibus enim necessitatibus.',718.29,'2025-04-28','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(81,47,'Cumque consequatur cupiditate sit ipsa sed accusamus id aut.',706.64,'1993-11-22','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(82,57,'Accusamus ducimus vero mollitia quibusdam quod culpa.',782.65,'2021-08-06','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(83,33,'Rem corrupti cupiditate aliquam magnam aspernatur ut nihil.',275.23,'1971-04-26','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(84,58,'Et ea qui excepturi doloribus facere et pariatur doloremque.',614.33,'1985-11-17','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(85,56,'Enim aliquid eius aut nihil aperiam ut.',418.76,'2012-10-27','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(86,35,'Sit impedit aut aut et fuga molestiae.',840.59,'2004-01-31','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(87,39,'Facilis ut molestias et quaerat temporibus.',108.50,'2021-10-29','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(88,49,'Id sed voluptatem deleniti velit et.',133.15,'2021-02-15','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(89,39,'Sit officia minus autem amet sed aut aperiam dolor.',810.88,'2011-12-24','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(90,43,'Facere numquam aut ut consectetur.',21.09,'1972-06-23','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(91,46,'Et praesentium veritatis molestias ea est.',430.52,'1999-08-31','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(92,55,'Dolores porro nulla est ducimus.',851.89,'1980-06-28','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(93,37,'At necessitatibus dolores repellendus quos asperiores omnis ducimus.',738.50,'2024-12-08','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(94,51,'Perspiciatis neque nulla qui earum hic eos animi.',384.97,'1981-06-24','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(95,50,'Voluptatibus veniam quis eum et.',171.79,'2002-04-13','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(96,43,'Odio est vitae cupiditate et autem dolores.',65.47,'2010-10-13','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(97,60,'Blanditiis corrupti qui sed quia beatae vel.',859.65,'1972-10-04','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(98,32,'Quae nihil qui ipsa laborum.',145.68,'2018-01-28','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(99,54,'Necessitatibus qui repellendus ut sit.',17.20,'2009-04-17','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(100,31,'Nam dolor alias accusantium necessitatibus ut voluptates quod qui.',109.29,'1983-09-27','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(101,86,'Et ut delectus rerum velit velit sed similique.',216.69,'2002-04-05','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(102,78,'Qui debitis iusto et rerum.',362.38,'2006-08-24','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(103,74,'Natus itaque ea ipsam molestiae porro ex optio.',865.52,'2016-09-08','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(104,76,'Doloribus earum delectus sit laudantium.',440.43,'1978-10-02','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(105,89,'Aut aliquam natus omnis esse repellendus ullam pariatur similique.',875.39,'1996-04-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(106,86,'Aut voluptatem aut qui animi sequi neque.',497.92,'2000-07-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(107,65,'Eveniet beatae neque harum nemo a.',744.12,'1999-02-27','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(108,62,'Nam sequi nihil voluptates dolorum.',778.83,'1981-09-06','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(109,90,'Id omnis nam corrupti ipsam voluptas.',721.55,'1980-06-25','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(110,88,'Repellendus et nulla ut deleniti facere mollitia non.',584.69,'2000-02-08','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(111,81,'Reprehenderit ratione minima non consequuntur.',951.02,'1975-02-02','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(112,89,'Neque dolorem ad vero est nihil temporibus sapiente occaecati.',864.16,'1998-10-08','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(113,82,'Neque rerum dolores laudantium et sunt.',686.88,'2016-03-14','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(114,79,'Vero saepe voluptatem molestias totam iste odit.',518.72,'1975-04-03','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(115,77,'Deserunt corrupti vel porro est nam.',477.04,'2021-02-09','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(116,65,'Provident maiores et id consequatur consequuntur deserunt ab.',940.56,'2017-11-05','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(117,76,'Voluptas aut molestias eum sed quia consectetur molestiae autem.',209.84,'2020-01-10','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(118,79,'Eius dolorum ea dolores enim est harum iste.',794.96,'1990-12-21','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(119,70,'Possimus numquam velit possimus quia doloribus.',578.19,'1982-02-26','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(120,84,'Eum harum mollitia nihil temporibus a quis earum.',660.35,'2008-11-03','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(121,64,'Magni aut accusantium recusandae quas dignissimos doloremque inventore.',983.57,'2012-09-25','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(122,79,'Dolore excepturi earum neque ipsa veniam magni alias eum.',806.63,'2024-08-06','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(123,71,'Sunt error est quis non sit in eum.',162.42,'2017-09-06','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(124,82,'Eaque et optio architecto nesciunt vitae fugit id.',423.17,'1979-04-30','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(125,66,'Reiciendis tempore sit vel non.',626.15,'1991-01-31','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(126,82,'Aperiam possimus dolorem iste possimus sed earum et distinctio.',868.44,'1981-01-10','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(127,78,'Placeat quasi tenetur enim quo id unde.',80.51,'2016-03-04','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(128,62,'Quia cupiditate nihil aut illo.',221.78,'1970-07-29','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(129,76,'Sit nostrum optio quisquam debitis dignissimos sed dignissimos.',855.10,'1994-10-21','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(130,82,'Non repellat voluptate ut odit aliquid illo.',274.14,'2022-08-22','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(131,64,'Ut et a aliquid.',831.86,'2020-10-30','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(132,79,'Saepe occaecati voluptas sit distinctio ipsum.',674.44,'1983-03-11','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(133,73,'Expedita qui tempora consequatur dignissimos impedit et aut.',790.33,'1973-07-15','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(134,74,'Vitae repellendus atque adipisci blanditiis corporis.',280.52,'2024-04-05','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(135,64,'Est nesciunt voluptate quisquam adipisci nesciunt.',219.16,'2024-02-13','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(136,83,'Quaerat perferendis eos ipsam est qui veniam mollitia.',408.79,'2018-10-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(137,68,'Nam dolores fugit autem nobis voluptate iusto rerum.',455.23,'1991-02-16','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(138,83,'Sit molestiae et qui nemo deserunt.',837.39,'1975-11-06','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(139,78,'Rerum ut non ea quae nam ut.',92.85,'2025-03-09','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(140,90,'Quos praesentium hic nobis quo doloribus.',303.65,'2016-01-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(141,72,'Dolorem eum est quam laboriosam.',57.10,'1992-04-28','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(142,85,'Qui harum et rerum a iusto.',251.67,'2008-08-09','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(143,81,'Quis dolores ea quos dolor maiores.',688.32,'2007-04-29','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(144,86,'Et molestias qui consectetur.',353.95,'1991-05-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(145,85,'Id quidem blanditiis eum non vitae perferendis.',205.36,'1981-08-30','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(146,81,'Beatae error est consequuntur tenetur aut nemo corporis tempore.',904.86,'2014-01-22','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(147,79,'Nulla aut quam necessitatibus aspernatur sit sed fugiat et.',999.68,'2018-11-25','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(148,89,'Quibusdam rerum aut expedita doloremque.',791.61,'1980-03-20','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(149,83,'Non modi praesentium quos vero deserunt et.',869.72,'1970-10-20','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(150,71,'Id sequi qui cumque assumenda.',365.39,'1988-04-11','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(151,101,'Eaque aspernatur aut non totam nobis sit adipisci doloremque.',763.19,'1987-07-13','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(152,104,'Et sint corrupti et culpa voluptatem dolorem quo.',247.55,'2009-07-09','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(153,113,'Assumenda exercitationem blanditiis eligendi magni.',777.76,'1980-12-09','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(154,116,'Id dolorum nesciunt voluptatibus quia error.',923.02,'2016-09-02','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(155,113,'Ea porro porro pariatur aut eum quo.',745.88,'2017-01-20','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(156,99,'Adipisci natus pariatur odit nulla dolor exercitationem.',674.52,'2004-08-11','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(157,92,'Aspernatur reprehenderit veritatis quibusdam nam.',474.83,'2007-02-21','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(158,120,'Sequi placeat porro ex eius odio totam nihil.',903.82,'2008-10-18','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(159,116,'Est modi voluptas quas omnis quibusdam.',539.41,'1973-03-05','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(160,98,'In modi quod accusamus.',394.31,'2014-04-16','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(161,113,'Hic perspiciatis ratione amet velit soluta.',332.63,'2005-12-26','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(162,91,'Ut nisi voluptas delectus quia consequatur.',157.25,'1983-05-04','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(163,113,'Optio quas quo magnam hic soluta pariatur.',433.23,'2001-06-24','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(164,97,'Aliquam nihil nisi et ea tenetur voluptatem est quos.',692.88,'1995-01-17','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(165,119,'Facere porro ut qui sed quam et.',178.26,'1996-03-07','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(166,93,'Dolores quae odit voluptatibus consectetur rem doloribus et.',877.55,'2012-08-22','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(167,91,'Aliquam dicta dolor velit qui.',50.90,'1993-09-20','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(168,101,'Nemo dolorem non quam natus iusto.',998.22,'2017-11-07','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(169,109,'Doloribus temporibus inventore similique consequatur velit ad ex.',169.23,'2000-10-24','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(170,97,'Incidunt temporibus animi voluptatem.',636.75,'1985-02-25','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(171,92,'Itaque fuga cupiditate veniam aut sed vero.',226.76,'2009-09-30','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(172,119,'Ut eos quisquam numquam est.',479.84,'1980-09-28','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(173,101,'Aut deleniti qui in commodi.',36.91,'1976-05-13','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(174,104,'Et est aut magni enim enim hic.',453.46,'2008-12-07','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(175,98,'Labore est quam nobis nisi explicabo debitis sapiente.',67.67,'2012-07-15','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(176,107,'Fuga deleniti et in reprehenderit sequi aut.',179.55,'1983-06-17','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(177,109,'In modi delectus minus vitae vel.',161.47,'2004-08-16','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(178,119,'Nesciunt corporis pariatur suscipit architecto.',827.47,'1997-11-02','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(179,99,'Aut assumenda architecto tempore non omnis.',187.62,'1971-07-16','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(180,107,'Dolores nihil sit deserunt est repudiandae occaecati qui aliquam.',456.92,'1997-09-05','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(181,99,'Temporibus laborum iure consequatur soluta voluptas adipisci nihil.',656.14,'2011-04-10','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(182,116,'Repellat repudiandae voluptatem quia et consequatur.',879.58,'2000-03-22','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(183,108,'Voluptatibus voluptate sit distinctio nihil et sed.',331.32,'1994-06-30','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(184,112,'Dolores sit dolores sunt id rem temporibus possimus.',911.76,'1991-01-12','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(185,94,'Enim laudantium asperiores porro laudantium consectetur est.',670.85,'2023-10-12','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(186,115,'Tenetur deleniti odio enim rem id qui.',106.60,'1981-01-11','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(187,100,'Rem est voluptate exercitationem dolores quo et.',955.07,'2018-12-28','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(188,92,'Accusamus blanditiis consectetur aut atque beatae aut dolorum.',860.85,'1972-12-04','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(189,103,'Voluptas dolores necessitatibus possimus velit dolor molestias delectus.',293.53,'2011-12-17','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(190,97,'Et fugit architecto veniam laborum.',938.06,'1993-08-24','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(191,117,'Aut laboriosam doloribus nemo labore odit totam exercitationem.',998.88,'2003-04-11','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(192,100,'Debitis et ut recusandae at fuga provident corrupti.',485.26,'2013-12-15','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(193,92,'Et iusto at ducimus aut quasi id.',518.01,'1973-05-02','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(194,112,'Iure dolorem natus voluptatem debitis quia.',604.98,'2024-06-16','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(195,94,'Voluptate aut accusantium et laborum.',659.66,'2004-07-26','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(196,108,'Eius et facere vitae dolorem.',655.67,'2006-11-22','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(197,111,'Suscipit accusantium dolore laudantium magnam minima.',417.43,'2024-11-07','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(198,99,'Et fuga voluptate reprehenderit necessitatibus saepe voluptate.',692.27,'2008-09-15','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(199,94,'Eius minus nostrum soluta molestiae laborum.',46.56,'2024-10-21','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(200,104,'Reiciendis sunt et voluptates vero mollitia.',417.44,'1985-05-15','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL);
/*!40000 ALTER TABLE `car_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_models`
--

DROP TABLE IF EXISTS `car_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `car_models` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `make_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car_models_make_id_foreign` (`make_id`),
  CONSTRAINT `car_models_make_id_foreign` FOREIGN KEY (`make_id`) REFERENCES `makes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_models`
--

LOCK TABLES `car_models` WRITE;
/*!40000 ALTER TABLE `car_models` DISABLE KEYS */;
INSERT INTO `car_models` VALUES (1,'vel',1,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(2,'possimus',2,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(3,'est',5,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(4,'quo',4,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(5,'molestiae',1,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(6,'nemo',3,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(7,'tenetur',4,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(8,'dolor',5,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(9,'qui',2,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(10,'illum',5,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(11,'ratione',3,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(12,'nemo',5,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(13,'consequuntur',3,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(14,'et',4,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(15,'quidem',2,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(16,'veritatis',4,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(17,'voluptatibus',5,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(18,'excepturi',5,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(19,'quam',1,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(20,'quia',5,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(21,'numquam',10,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(22,'dolores',8,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(23,'harum',9,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(24,'vero',9,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(25,'et',9,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(26,'totam',6,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(27,'dolorem',7,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(28,'ut',6,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(29,'qui',10,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(30,'ut',7,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(31,'sit',7,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(32,'eveniet',6,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(33,'aperiam',9,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(34,'ea',10,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(35,'ut',6,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(36,'numquam',8,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(37,'nemo',8,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(38,'suscipit',8,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(39,'odio',7,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(40,'eligendi',6,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(41,'sit',12,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(42,'tempore',11,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(43,'inventore',12,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(44,'voluptates',11,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(45,'sed',13,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(46,'atque',12,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(47,'corporis',14,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(48,'sit',15,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(49,'quaerat',11,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(50,'animi',13,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(51,'molestiae',11,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(52,'corporis',15,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(53,'debitis',11,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(54,'eius',13,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(55,'perspiciatis',12,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(56,'sint',11,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(57,'commodi',14,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(58,'est',11,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(59,'rerum',12,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(60,'accusamus',13,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(61,'eos',16,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(62,'modi',20,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(63,'sapiente',19,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(64,'dolorem',16,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(65,'dolor',18,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(66,'dolore',19,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(67,'cumque',18,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(68,'nobis',20,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(69,'est',18,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(70,'expedita',19,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(71,'quasi',17,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(72,'assumenda',17,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(73,'expedita',16,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(74,'dolorem',16,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(75,'in',19,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(76,'quia',20,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(77,'atque',17,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(78,'quis',16,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(79,'voluptas',20,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(80,'facere',16,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL);
/*!40000 ALTER TABLE `car_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cars` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `car_model_id` bigint(20) unsigned NOT NULL,
  `status` enum('available','sold') NOT NULL DEFAULT 'available',
  `purchase_price` decimal(10,2) NOT NULL,
  `total_expenses` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cars_car_model_id_foreign` (`car_model_id`),
  CONSTRAINT `cars_car_model_id_foreign` FOREIGN KEY (`car_model_id`) REFERENCES `car_models` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (1,'beatae',5,'sold',32397.18,0.00,'2025-12-26 14:50:42','2025-12-26 14:58:43',NULL),(2,'ducimus',10,'available',17678.06,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(3,'nesciunt',4,'available',29563.28,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(4,'officia',13,'sold',23360.73,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(5,'animi',20,'available',12856.34,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(6,'iusto',13,'sold',38719.49,0.00,'2025-12-26 14:50:42','2025-12-26 15:03:24',NULL),(7,'neque',8,'sold',12073.67,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(8,'et',16,'sold',9852.69,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(9,'est',8,'available',23893.72,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(10,'et',15,'available',29387.51,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(11,'doloremque',12,'sold',28664.50,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(12,'ratione',17,'available',41595.60,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(13,'vitae',5,'sold',30503.48,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(14,'qui',12,'sold',49728.79,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(15,'facilis',13,'sold',45176.80,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(16,'at',19,'sold',35149.31,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(17,'et',1,'available',15213.44,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(18,'omnis',3,'sold',12970.30,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(19,'et',14,'sold',40588.82,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(20,'ea',6,'sold',22671.51,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(21,'voluptas',16,'available',41963.25,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(22,'est',14,'available',21809.18,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(23,'placeat',16,'sold',24854.28,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(24,'optio',12,'available',24422.78,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(25,'libero',2,'sold',49190.00,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(26,'doloremque',4,'sold',12084.92,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(27,'iusto',18,'available',47935.50,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(28,'eius',16,'sold',38545.72,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(29,'dolore',14,'available',21769.12,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(30,'qui',18,'sold',15310.14,0.00,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(31,'blanditiis',23,'sold',27683.09,0.00,'2025-12-26 14:52:02','2026-01-13 17:14:58',NULL),(32,'beatae',25,'available',37389.30,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(33,'et',25,'available',14131.94,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(34,'in',30,'available',26414.02,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(35,'ducimus',35,'available',10493.43,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(36,'ea',34,'available',43506.32,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(37,'optio',34,'available',17358.92,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(38,'unde',29,'available',10869.74,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(39,'et',29,'available',49097.42,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(40,'officia',21,'available',39620.15,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(41,'sed',37,'sold',38000.39,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(42,'sed',26,'sold',31748.81,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(43,'quasi',28,'sold',27454.15,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(44,'amet',36,'sold',25214.94,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(45,'vitae',24,'sold',12291.09,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(46,'laborum',37,'sold',22381.32,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(47,'temporibus',23,'sold',5129.09,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(48,'distinctio',22,'sold',11821.03,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(49,'tempora',35,'sold',43833.12,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(50,'quos',33,'sold',20364.63,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(51,'facilis',28,'sold',8245.05,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(52,'cum',30,'sold',29765.31,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(53,'temporibus',36,'sold',40976.79,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(54,'sed',36,'sold',27762.02,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(55,'qui',21,'sold',36320.96,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(56,'autem',23,'sold',17738.76,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(57,'nulla',34,'sold',13394.32,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(58,'provident',28,'sold',22454.55,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(59,'quia',30,'sold',44869.09,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(60,'dolores',27,'sold',28985.86,0.00,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(61,'nulla',45,'available',44092.83,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(62,'ad',59,'available',5231.14,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(63,'voluptate',42,'available',8500.43,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(64,'consequatur',58,'available',43891.98,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(65,'in',41,'available',8512.13,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(66,'dolores',55,'available',12628.70,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(67,'rem',53,'available',46788.15,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(68,'explicabo',47,'available',18556.98,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(69,'nostrum',59,'available',23943.66,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(70,'earum',57,'available',31697.87,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(71,'nisi',51,'sold',30721.33,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(72,'quia',44,'sold',34714.22,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(73,'id',55,'sold',46906.99,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(74,'aliquid',47,'sold',15962.37,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(75,'et',51,'sold',36232.01,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(76,'tempora',56,'sold',33474.52,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(77,'repudiandae',51,'sold',46905.40,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(78,'qui',45,'sold',27453.67,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(79,'quam',48,'sold',21638.71,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(80,'commodi',47,'sold',18864.72,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(81,'quos',50,'sold',15427.88,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(82,'enim',42,'sold',23043.11,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(83,'quasi',41,'sold',19992.42,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(84,'sequi',56,'sold',44038.03,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(85,'sed',54,'sold',18588.25,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(86,'quia',51,'sold',26504.65,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(87,'molestiae',44,'sold',33246.62,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(88,'non',54,'sold',10414.95,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(89,'omnis',53,'sold',44461.03,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(90,'ad',49,'sold',40432.59,0.00,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(91,'enim',79,'available',44243.51,208.15,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(92,'est',66,'available',35556.69,2080.45,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(93,'et',61,'available',20053.91,877.55,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(94,'quam',78,'available',31333.78,1377.07,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(95,'cumque',80,'available',28432.10,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(96,'quaerat',65,'available',11534.11,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(97,'cumque',72,'available',24236.60,2267.69,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(98,'corporis',80,'available',36596.48,461.98,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(99,'ut',63,'available',23794.78,2210.55,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(100,'modi',76,'available',21441.28,1440.33,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(101,'quia',74,'sold',22188.53,1798.32,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(102,'aperiam',62,'sold',46328.41,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(103,'ut',79,'sold',44226.01,293.53,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(104,'placeat',78,'sold',14902.57,1118.45,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(105,'odit',65,'sold',34340.17,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(106,'aut',73,'sold',20131.23,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(107,'sint',73,'sold',42858.98,636.47,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(108,'deserunt',62,'sold',43623.01,986.99,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(109,'dolores',78,'sold',28451.74,330.70,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(110,'nisi',72,'sold',22007.81,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(111,'earum',72,'sold',43179.69,417.43,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(112,'laborum',69,'sold',49867.35,1516.74,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(113,'quod',69,'sold',22557.48,2289.50,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(114,'natus',75,'sold',19020.44,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(115,'distinctio',67,'sold',9465.49,106.60,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(116,'libero',62,'sold',11711.58,2342.01,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(117,'officiis',65,'sold',14206.49,998.88,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(118,'molestiae',64,'sold',33518.17,0.00,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(119,'non',63,'sold',44475.55,1485.57,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(120,'neque',62,'sold',15459.18,903.82,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL);
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `personal_id` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Madyson Paucek','(480) 697-4403','6296888275','56332 Howell Mill Apt. 420\nNew Abdul, KS 27968-5907',105421.86,'2025-12-26 14:50:42','2025-12-26 15:04:27',NULL),(2,'Prof. Dereck Conn','+1.754.344.2694','2642993826','934 Kerluke Court Apt. 448\nNorth Elisabury, IL 87816',1475.45,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(3,'Eden Thiel MD','+1-737-614-9179','0967958760','223 Manuela Junction Suite 668\nFraneckistad, VA 04155-6724',-14995553.81,'2025-12-26 14:50:42','2026-01-13 17:14:58',NULL),(4,'Ivah Cronin','(913) 335-3455','3766414413','96933 Kozey Street Suite 317\nYostville, AL 56031-0861',5281.64,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(5,'Dr. Thaddeus Medhurst DDS','1-757-365-3513','6638960464','74556 Marta Parkway\nWest Lazaroside, WY 77965-1166',3688.74,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(6,'Ms. Francesca Rath','+1-341-519-7788','7479139994','856 Florian Squares Suite 074\nGiuseppeview, NM 26256-6173',10700.90,'2025-12-26 14:50:42','2025-12-26 14:54:33',NULL),(7,'Miss Kellie Flatley Jr.','1-719-295-2101','1832750575','7855 Vandervort Rapid\nSouth Gracielahaven, NM 31939',16076.36,'2025-12-26 14:50:42','2026-01-13 17:25:30',NULL),(8,'Mr. Olen Jakubowski II','+1.425.273.7772','5230503130','3745 Noah Cliffs\nFannieport, MN 16408',2436.02,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(9,'Tomasa Roberts','1-351-435-2503','2399268323','8529 Connelly Prairie\nEast Osbaldo, LA 70122-8624',8624.49,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(10,'Dr. Frederick Kling','+1-820-276-1688','5921625819','60621 Parisian Shore\nAbshirehaven, VA 81935',8363.17,'2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(11,'Brandi Schaefer','432-742-7764','4423914240','25650 Ericka Tunnel Suite 097\nEast Mireillefurt, MA 44315-3361',5533.72,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(12,'Modesto O\'Kon PhD','+1 (857) 430-3322','5741842730','4220 Lehner Passage\nPort Emersontown, NC 06575-2218',8978.73,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(13,'Devonte Mayer','(703) 670-7072','9804114037','823 Danielle Plains Suite 503\nSouth Brigittefort, KY 23813',3786.48,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(14,'Rick Bayer III','+1.907.635.5543','7567393625','9148 Kuhic Run Suite 994\nKiarrabury, AZ 05735',3178.08,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(15,'Lucie Dare','507-264-2286','8231973881','627 Oren Throughway Suite 769\nSouth Winifred, GA 17533-7653',4094.37,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(16,'Dallin Little','+1.603.422.7373','4385803509','52819 Rowe Bridge Apt. 426\nNorth Rebekahhaven, FL 24270',9885.12,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(17,'Emiliano Keebler','(337) 616-8778','8580511610','833 Robert Road Suite 438\nLake Jesse, KS 62522',8549.51,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(18,'Prof. Jared Feest DDS','+1.727.338.3101','8747770197','3470 Estrella Drives Suite 086\nLake Enriqueburgh, WV 97577',3357.53,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(19,'Susana Sanford V','+1 (732) 645-4261','4942463654','466 Samir Way Apt. 414\nNorth Alecmouth, HI 90045-1883',3609.57,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(20,'Prof. Geoffrey Hauck','820-663-9349','4260262703','44315 Moriah Tunnel\nWest Salmaview, IA 16660-8148',1886.89,'2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(21,'Jeramie Maggio III','531-767-5390','8271508071','6099 Bergnaum Way Apt. 422\nGradyside, NH 80679',9720.85,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(22,'Dr. Arlene Corkery PhD','(646) 820-2483','0218600876','34965 Jerde Ford\nNew Gilda, PA 75219-5340',7610.28,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(23,'Colton Rolfson','347.634.3464','2778430401','30615 Wade Rapid\nMarquismouth, AL 19229',5780.48,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(24,'Hollie Bogisich Sr.','(717) 491-8305','9032477993','5860 Sipes Dam\nJeffstad, ID 00619-3314',5609.34,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(25,'Mrs. Myrtle Grant','+1.805.554.7212','0143197659','28137 Farrell Dale Suite 979\nNorth Laurineport, MS 35738',6489.52,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(26,'Prudence Conn','1-559-382-9476','6116601532','90584 Jaskolski Expressway Suite 043\nAlexandratown, TX 62743',4631.46,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(27,'Torrey Yost','716.494.7285','0606107405','586 Kerluke Keys\nMoorefort, UT 36085-9772',5969.25,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(28,'Wyman Aufderhar','+1-747-496-7042','1293557668','37210 Layne Throughway\nNicolasside, OK 86759',1668.24,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(29,'Ally Kshlerin','251-879-7085','1660518508','17385 Jacynthe Spurs\nDiegobury, MD 73342',8853.47,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(30,'Linnea Olson','828.232.3035','4467950153','31184 Stephanie Hollow\nCathrineville, SD 53071',223.18,'2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(31,'Dr. Edna Marquardt II','+1.425.883.7472','7686524646','125 Jerde Isle Apt. 022\nJaydeview, TX 17387-1315',6071.98,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(32,'Hosea Grant','+13516608040','6032156884','9855 Parisian Mountain\nLake Oswaldfurt, VT 52448-0583',2401.93,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(33,'Ms. Kailyn Veum','+1-712-745-8569','9050674720','1398 Flatley Plains\nEast Chaimside, SD 10712',2761.05,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(34,'Vincenzo Schiller','+1 (781) 476-8704','5686589869','843 Jayson Parkways Suite 132\nBrekkechester, AZ 31044-4047',2798.77,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(35,'Ed Hamill IV','+1 (816) 386-0312','3896264272','50153 Keyon Turnpike\nSouth Lenny, LA 31734',7899.64,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(36,'Prof. Napoleon Rippin MD','281.648.3912','4784627029','612 Dolly Light Suite 412\nSporerhaven, ME 77035-1377',9353.19,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(37,'Mr. Lyric Funk MD','+1-737-892-5827','6244331111','8578 Lavada Squares\nRogahnmouth, PA 99087',401.59,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(38,'Onie Gleichner','562-801-5126','1012565317','9498 Adrien Mills\nWest Gisselle, ID 32700',9493.54,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(39,'Rose Schinner','283-372-3103','9196058167','289 Will Island\nSouth Hank, ME 30421',7757.85,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(40,'Prof. Orlo Morar PhD','+1 (225) 716-5544','7349523002','44309 Corkery Mall Suite 526\nHauckside, AZ 43540',8472.56,'2025-12-26 14:55:26','2025-12-26 14:55:26',NULL);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealer_ship_expenses`
--

DROP TABLE IF EXISTS `dealer_ship_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dealer_ship_expenses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expense_date` date NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealer_ship_expenses`
--

LOCK TABLES `dealer_ship_expenses` WRITE;
/*!40000 ALTER TABLE `dealer_ship_expenses` DISABLE KEYS */;
INSERT INTO `dealer_ship_expenses` VALUES (1,'Libero consequatur dolores molestias expedita dolorem.',730.42,'1998-03-14',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(2,'Quos quos magnam similique necessitatibus sit eum.',227.53,'2011-04-02',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(3,'Id repellendus expedita et aperiam blanditiis veniam.',46.84,'2018-02-24',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(4,'Sit voluptas dolor enim libero accusamus commodi.',648.66,'2003-05-17',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(5,'Tempore commodi sed necessitatibus.',144.15,'1970-10-25',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(6,'Temporibus eveniet aut eveniet et.',303.53,'2015-02-25',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(7,'Voluptatem necessitatibus voluptatibus dolores aperiam fugiat.',881.06,'2014-11-22',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(8,'Magnam sunt eligendi provident velit iure.',371.10,'1987-05-10',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(9,'Tempora quo qui est perspiciatis quis vitae.',123.04,'1999-10-13',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(10,'Assumenda eos officiis est vel.',405.28,'2001-12-04',NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(11,'Reprehenderit maxime molestiae dolorem.',42.92,'1976-05-18',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(12,'Enim et molestiae nobis voluptates eligendi quia.',25.77,'2024-06-14',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(13,'Et voluptas quis dolorem molestiae rerum neque ut quaerat.',28.67,'2013-07-26',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(14,'Et aut aliquid natus omnis eveniet sed beatae.',81.17,'2012-10-14',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(15,'Sint ut inventore enim nihil molestiae.',258.01,'2011-10-19',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(16,'Ducimus rerum facere aspernatur autem.',170.26,'2013-06-06',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(17,'Doloribus blanditiis qui odit ab.',105.08,'2013-03-23',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(18,'Dolorum in sunt repellat aliquam dolorum neque sed fugiat.',369.63,'2016-12-01',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(19,'Voluptatem doloribus illum id asperiores consequatur ut praesentium.',714.79,'2005-12-12',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(20,'Tempora nam deleniti quia totam.',511.41,'2025-08-26',NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(21,'Numquam aspernatur ratione inventore commodi illo.',847.86,'2006-07-18',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(22,'Nam modi ab quaerat.',362.72,'1997-05-20',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(23,'Officia quasi quas atque ea temporibus ullam et pariatur.',783.22,'2011-07-31',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(24,'Atque ipsam magnam et quidem fugiat vel quia.',459.99,'2006-05-27',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(25,'Tempore autem et officiis magni eos quaerat.',113.68,'2010-11-17',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(26,'Sit consequuntur rerum voluptatem eligendi quidem et voluptatem.',265.91,'1994-02-17',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(27,'Adipisci atque nihil sed porro.',684.36,'2023-11-17',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(28,'Est molestias consequuntur delectus sed corrupti.',295.36,'2019-03-01',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(29,'Deleniti ea ipsam repudiandae quaerat.',65.07,'1982-08-04',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(30,'Eaque corrupti qui voluptas labore et quia.',556.20,'2013-08-23',NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(31,'Quidem reiciendis et sint illum sint.',626.90,'1974-04-11',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(32,'Cum dolor est est ea ratione aliquid.',486.44,'1974-02-09',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(33,'Aut unde modi aut qui corrupti.',238.60,'2010-08-20',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(34,'Voluptates dolores voluptatem rerum.',148.54,'1974-09-25',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(35,'Nihil similique atque sed.',967.21,'1986-12-24',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(36,'Rerum perspiciatis eveniet expedita corrupti.',404.69,'1990-05-16',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(37,'Quasi eos recusandae harum aut est vel ex.',392.13,'1983-10-16',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(38,'Veniam explicabo veritatis est fugiat rerum.',946.65,'2007-07-18',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(39,'Rerum magnam quo exercitationem est.',38.65,'1973-06-30',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(40,'Asperiores doloribus id et quos.',931.95,'1987-01-02',NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26');
/*!40000 ALTER TABLE `dealer_ship_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint(20) unsigned NOT NULL,
  `account_id` bigint(20) unsigned DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `invoice_date` date NOT NULL,
  `car_id` bigint(20) unsigned NOT NULL,
  `payed` decimal(10,2) NOT NULL,
  `account_cut` decimal(10,2) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoices_client_id_foreign` (`client_id`),
  KEY `invoices_account_id_foreign` (`account_id`),
  KEY `invoices_car_id_foreign` (`car_id`),
  CONSTRAINT `invoices_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `invoices_car_id_foreign` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  CONSTRAINT `invoices_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,7,5,8823.38,'1994-01-16',28,12898.35,781.12,NULL,'2025-12-26 14:50:42','2026-01-13 17:25:30'),(2,1,2,31688.86,'1973-11-16',26,5089.36,954.60,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(3,7,3,17944.85,'2007-10-12',18,2290.01,204.07,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(4,2,4,42125.25,'1975-07-20',10,4542.78,611.35,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(5,6,1,6869.54,'2025-03-20',20,11184.78,494.44,NULL,'2025-12-26 14:50:42','2025-12-26 14:54:33'),(6,9,5,55869.93,'1990-01-22',5,5918.03,402.76,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(7,2,3,49485.36,'1971-12-15',2,3520.82,780.79,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(8,4,3,21923.29,'1987-02-02',25,4892.07,425.50,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(9,8,1,11576.35,'1980-07-16',10,1528.50,334.23,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(10,1,3,18597.28,'1982-03-18',30,3256.07,855.25,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(11,3,5,52397.99,'1981-08-08',2,4658.27,190.12,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(12,7,5,32040.37,'1990-05-12',13,5348.24,237.23,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(13,2,3,16924.46,'1975-11-16',6,2886.74,989.38,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(14,8,1,44765.86,'1991-01-27',17,5920.86,220.01,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(15,3,1,20677.16,'1976-05-29',4,1646.25,337.01,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(16,2,1,45133.54,'1991-10-22',1,5999.00,160.78,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(17,7,5,35512.72,'1993-01-08',21,1530.92,282.86,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(18,9,1,46842.64,'1998-01-05',24,1530.50,335.05,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(19,4,4,22177.84,'1988-06-02',6,3244.56,507.95,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(20,9,1,59554.27,'2007-02-11',30,1650.83,974.11,NULL,'2025-12-26 14:50:42','2025-12-26 14:50:42'),(21,15,8,6573.22,'2001-10-10',41,1270.84,787.22,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(22,13,10,34564.96,'2019-09-16',42,3903.33,894.64,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(23,19,9,8088.12,'1987-08-09',43,3620.22,797.74,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(24,16,8,44546.84,'2021-08-11',44,2813.06,523.66,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(25,17,10,27077.35,'2009-05-23',45,5280.09,363.97,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(26,18,6,14844.43,'2023-11-11',46,2162.59,767.64,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(27,15,9,51659.13,'2017-07-04',47,2581.52,743.54,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(28,20,10,10879.44,'2010-03-15',48,3609.04,739.66,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(29,16,10,41660.93,'1985-12-26',49,5026.72,881.06,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(30,13,7,32063.56,'2022-03-23',50,2152.14,689.79,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(31,14,9,19449.64,'2015-07-26',51,5688.69,697.27,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(32,12,6,9451.46,'1980-03-04',52,2203.39,682.95,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(33,13,7,23916.70,'2009-05-11',53,1629.43,905.45,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(34,17,9,31604.29,'1998-09-03',54,4529.56,936.86,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(35,14,6,41058.85,'1977-09-12',55,5740.23,445.03,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(36,13,7,44562.90,'2016-01-24',56,3425.29,337.93,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(37,20,9,18497.29,'1971-09-22',57,4810.54,161.17,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(38,16,9,15094.35,'1973-02-15',58,1824.42,756.20,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(39,17,10,48876.03,'2020-11-07',59,1233.65,734.72,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(40,18,7,35872.49,'1988-06-06',60,1945.64,535.63,NULL,'2025-12-26 14:52:02','2025-12-26 14:52:02'),(41,28,14,27786.60,'2014-05-21',71,1486.12,805.58,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(42,30,14,11639.65,'1983-03-05',72,4473.79,326.52,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(43,22,11,53094.68,'1993-02-28',73,5805.99,913.83,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(44,26,15,16860.09,'1992-08-25',74,3058.19,796.76,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(45,23,13,13691.26,'1992-05-05',75,3710.69,594.37,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(46,21,14,25419.26,'1976-07-22',76,3829.69,645.81,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(47,29,12,14388.26,'2006-04-14',77,1267.35,108.27,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(48,21,13,15380.84,'1978-03-31',78,3552.12,951.20,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(49,23,15,39606.87,'1991-04-08',79,5224.20,437.34,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(50,23,13,8191.23,'1978-08-16',80,3193.78,266.03,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(51,26,13,10071.93,'2007-02-20',81,2747.25,180.30,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(52,23,13,42390.46,'1973-09-04',82,5068.67,528.47,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(53,24,14,31722.46,'1976-05-26',83,1423.05,301.37,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(54,22,13,49776.34,'2017-06-17',84,1030.33,675.16,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(55,25,12,14553.99,'2015-02-26',85,1537.41,520.12,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(56,23,12,21055.80,'2020-01-22',86,3873.22,277.84,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(57,21,13,41608.78,'2002-08-08',87,4863.81,406.61,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(58,22,12,41656.60,'1994-07-15',88,4696.46,867.72,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(59,30,12,46941.34,'1976-08-09',89,2496.64,963.99,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(60,27,15,56933.68,'1988-04-17',90,5980.03,706.95,NULL,'2025-12-26 14:53:30','2025-12-26 14:53:30'),(61,32,19,22487.86,'2025-05-22',101,2151.61,482.90,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(62,33,16,27259.43,'1992-07-03',102,3901.85,121.04,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(63,36,17,27401.67,'1998-05-14',103,2965.99,207.81,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(64,32,17,50787.15,'2007-06-29',104,4323.25,522.46,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(65,37,16,35916.36,'2013-11-01',105,4698.92,501.02,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(66,31,19,13461.61,'2019-12-05',106,2784.56,574.51,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(67,31,19,29403.16,'2023-07-09',107,3995.74,610.85,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(68,33,17,11538.53,'1987-08-11',108,5666.72,998.92,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(69,40,17,31951.24,'1971-04-13',109,2347.17,645.73,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(70,39,18,46158.31,'2024-11-27',110,2570.97,901.13,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(71,37,16,52454.46,'2025-04-13',111,1270.85,196.89,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(72,35,17,18367.27,'1977-12-31',112,3564.14,344.26,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(73,40,18,13496.03,'2023-10-09',113,1828.60,349.65,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(74,40,20,8812.29,'1975-12-02',114,1415.64,560.61,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(75,33,19,40083.97,'2010-11-16',115,5770.05,464.44,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(76,38,19,54810.83,'1971-04-07',116,5870.67,529.54,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(77,31,17,40614.61,'2003-09-15',117,2727.80,659.33,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(78,33,17,21721.53,'1999-12-05',118,4844.48,791.12,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(79,37,18,50584.60,'1979-06-21',119,5243.81,139.65,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(80,33,17,22458.47,'1998-09-26',120,3042.88,993.93,NULL,'2025-12-26 14:55:26','2025-12-26 14:55:26'),(81,1,NULL,50000.00,'2025-12-26',1,50000.00,0.00,NULL,'2025-12-26 14:58:43','2025-12-26 14:59:22'),(82,1,NULL,99999.87,'2025-12-26',6,198999.74,0.00,NULL,'2025-12-26 15:03:24','2025-12-26 15:04:27'),(83,3,NULL,14999995.61,'2026-01-13',31,0.00,0.00,NULL,'2026-01-13 17:14:58','2026-01-13 17:14:58');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `makes`
--

DROP TABLE IF EXISTS `makes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `makes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `makes`
--

LOCK TABLES `makes` WRITE;
/*!40000 ALTER TABLE `makes` DISABLE KEYS */;
INSERT INTO `makes` VALUES (1,'dolorum','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(2,'pariatur','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(3,'accusamus','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(4,'molestias','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(5,'est','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(6,'eaque','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(7,'reprehenderit','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(8,'molestiae','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(9,'recusandae','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(10,'officiis','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(11,'amet','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(12,'expedita','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(13,'assumenda','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(14,'excepturi','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(15,'sapiente','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(16,'omnis','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(17,'error','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(18,'ad','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(19,'id','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(20,'magni','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL);
/*!40000 ALTER TABLE `makes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_10_08_220902_create_makes_table',1),(5,'2025_10_08_220915_create_car_models_table',1),(6,'2025_10_08_220944_create_clients_table',1),(7,'2025_10_08_220949_create_accounts_table',1),(8,'2025_10_08_221002_create_cars_table',1),(9,'2025_10_08_223154_create_invoices_table',1),(10,'2025_10_08_224202_create_payments_table',1),(11,'2025_10_08_224453_create_account_withdrawals_table',1),(12,'2025_10_08_224823_create_car_expenses_table',1),(13,'2025_10_08_224936_create_dealer_ship_expenses_table',1),(14,'2025_11_04_191825_add_deleted_at_to_car_expenses_table',1),(15,'2026_01_07_210000_create_account_deposits_table',2),(16,'2026_01_08_000001_create_account_deposits_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,5,974.32,'1972-09-30','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(2,14,954.25,'2020-10-24','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(3,20,927.31,'2022-04-22','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(4,7,410.00,'2025-04-02','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(5,8,100.11,'2006-12-25','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(6,7,491.01,'2019-03-09','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(7,18,775.60,'2016-07-02','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(8,15,390.85,'1981-06-09','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(9,11,472.93,'1978-06-21','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(10,17,682.59,'2014-07-26','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(11,6,337.22,'1987-03-13','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(12,11,547.54,'1996-04-24','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(13,11,136.90,'2009-11-02','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(14,15,427.80,'2019-09-13','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(15,4,607.64,'2008-10-31','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(16,10,536.65,'2013-09-05','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(17,7,154.30,'2025-03-11','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(18,20,144.48,'2017-03-20','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(19,6,524.19,'1998-03-20','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(20,4,493.19,'1987-09-22','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(21,10,888.39,'1984-01-20','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(22,9,414.66,'1992-12-24','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(23,14,375.26,'1991-07-31','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(24,14,849.26,'2009-04-25','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(25,1,122.37,'1999-04-21','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(26,6,548.58,'1976-01-17','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(27,14,137.70,'2008-06-05','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(28,20,553.20,'2010-04-21','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(29,3,680.75,'2023-03-10','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(30,12,864.50,'2024-12-21','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(31,17,410.04,'1975-04-24','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(32,4,818.55,'2010-02-04','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(33,8,675.07,'1996-09-28','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(34,12,936.29,'2016-09-13','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(35,18,892.63,'2002-07-01','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(36,19,414.10,'1979-07-25','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(37,6,981.87,'2004-03-08','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(38,5,542.20,'2009-11-01','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(39,6,178.81,'1975-08-06','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(40,15,669.75,'2012-11-08','2025-12-26 14:50:42','2025-12-26 14:50:42',NULL),(41,33,512.55,'1990-10-16','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(42,37,168.24,'2003-10-16','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(43,36,545.90,'2017-06-30','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(44,34,391.44,'1970-06-25','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(45,30,729.37,'2005-12-04','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(46,31,418.49,'2000-03-13','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(47,38,711.75,'2021-08-29','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(48,34,804.52,'1976-05-22','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(49,21,168.29,'2012-12-01','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(50,28,673.67,'2010-03-30','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(51,29,702.36,'2018-05-04','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(52,39,660.29,'1986-07-18','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(53,33,273.22,'2018-05-24','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(54,39,297.00,'2013-01-05','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(55,28,225.32,'2008-08-05','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(56,38,948.16,'2024-03-03','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(57,38,104.29,'2006-04-02','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(58,21,613.29,'2021-02-24','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(59,25,867.89,'1988-07-07','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(60,30,801.83,'1996-09-15','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(61,21,797.14,'2000-03-13','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(62,39,545.63,'2025-06-30','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(63,23,641.24,'1981-12-08','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(64,27,300.88,'2017-08-29','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(65,22,897.42,'1994-06-27','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(66,22,447.16,'1992-02-19','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(67,29,769.13,'1981-01-09','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(68,40,303.23,'2011-03-12','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(69,36,645.20,'1983-08-31','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(70,28,410.58,'2019-10-01','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(71,39,996.53,'1985-02-01','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(72,37,141.22,'1993-06-27','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(73,40,187.56,'2006-07-07','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(74,30,574.50,'2000-03-26','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(75,34,191.98,'2007-10-17','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(76,36,892.92,'2000-03-01','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(77,38,193.33,'2005-09-24','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(78,21,219.10,'1982-02-12','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(79,24,836.43,'1974-04-13','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(80,25,703.99,'2001-03-01','2025-12-26 14:52:02','2025-12-26 14:52:02',NULL),(81,45,565.76,'1995-06-19','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(82,52,484.51,'2005-03-01','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(83,51,448.88,'1987-06-05','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(84,54,590.03,'1991-12-28','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(85,42,161.95,'1990-11-30','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(86,60,301.09,'1993-02-16','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(87,44,284.70,'1974-12-21','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(88,56,262.33,'2006-04-10','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(89,49,113.16,'2025-06-19','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(90,41,309.54,'1987-04-11','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(91,45,408.18,'2020-11-23','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(92,42,379.32,'1979-03-05','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(93,50,825.64,'1994-01-19','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(94,54,682.98,'1999-11-17','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(95,51,927.43,'1998-11-03','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(96,43,369.61,'2014-06-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(97,43,689.05,'1998-12-08','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(98,60,724.78,'1992-08-15','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(99,43,561.62,'1991-08-22','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(100,49,425.08,'2017-09-28','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(101,53,872.07,'2002-10-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(102,45,758.77,'1972-09-17','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(103,42,502.34,'2007-07-25','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(104,44,128.86,'1984-09-25','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(105,47,627.20,'1983-06-04','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(106,60,424.24,'2005-03-29','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(107,58,825.64,'1985-10-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(108,49,361.06,'2011-08-14','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(109,58,108.97,'2004-07-12','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(110,48,868.74,'2025-07-18','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(111,56,937.21,'1986-02-02','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(112,44,684.80,'1972-08-09','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(113,42,695.90,'1984-11-16','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(114,52,704.79,'1989-03-29','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(115,57,941.09,'2021-05-27','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(116,42,614.63,'2011-03-26','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(117,59,486.19,'2000-09-06','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(118,55,556.68,'2019-05-07','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(119,58,503.88,'1982-07-30','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(120,48,624.21,'2003-02-25','2025-12-26 14:53:30','2025-12-26 14:53:30',NULL),(121,5,5353.02,'2025-12-26','2025-12-26 14:54:33','2025-12-26 14:54:33',NULL),(122,70,578.52,'2016-06-03','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(123,66,724.87,'1970-09-30','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(124,76,813.07,'2002-11-28','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(125,75,171.46,'1995-01-29','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(126,67,401.64,'1975-08-08','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(127,78,778.78,'2000-12-05','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(128,76,832.22,'1972-12-02','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(129,65,207.69,'1999-10-25','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(130,78,108.85,'1983-02-17','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(131,66,590.28,'2001-08-18','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(132,76,660.09,'2017-11-03','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(133,64,866.86,'2002-04-22','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(134,78,532.10,'1988-03-13','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(135,61,869.70,'2004-05-19','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(136,79,356.41,'2004-08-13','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(137,70,972.08,'2025-01-20','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(138,62,999.76,'1981-05-19','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(139,64,300.43,'1981-01-16','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(140,74,736.41,'1975-07-21','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(141,69,618.36,'1970-04-17','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(142,70,549.63,'1973-02-19','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(143,70,406.44,'1979-02-24','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(144,68,420.35,'1977-11-27','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(145,79,519.41,'2002-01-11','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(146,63,181.93,'1995-10-04','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(147,68,499.13,'2003-08-03','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(148,64,387.04,'2023-10-01','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(149,76,287.61,'1973-07-09','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(150,74,158.60,'2018-03-07','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(151,69,310.75,'1989-12-08','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(152,77,854.62,'2015-12-24','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(153,65,409.62,'2025-01-23','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(154,72,265.14,'2014-11-02','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(155,69,192.70,'2012-10-01','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(156,68,607.61,'2001-12-04','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(157,69,438.33,'2007-09-02','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(158,65,817.47,'2007-01-27','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(159,80,362.15,'1994-07-18','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(160,78,184.26,'2004-05-22','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(161,80,785.46,'1993-09-10','2025-12-26 14:55:26','2025-12-26 14:55:26',NULL),(162,81,1000.00,'2025-12-26','2025-12-26 14:58:43','2025-12-26 14:58:43',NULL),(163,81,49000.00,'2025-12-26','2025-12-26 14:59:22','2025-12-26 14:59:22',NULL),(164,82,1000.00,'2025-12-26','2025-12-26 15:03:24','2025-12-26 15:03:24',NULL),(165,82,98999.87,'2025-12-26','2025-12-26 15:04:25','2025-12-26 15:04:25',NULL),(166,82,98999.87,'2025-12-26','2025-12-26 15:04:27','2025-12-26 15:04:27',NULL),(167,1,8701.00,'2026-01-13','2026-01-13 17:25:30','2026-01-13 17:25:30',NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('1GuqJa9zv5VwH1CJHvZlrm286PgrjChtYrE7ThwZ',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNjhYYVlJNDdFUkp3cEtrcWpRVGtUR0pPcVRTb1d6Y1NQeXl6aUlBUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hY2NvdW50LXRyYW5zYWN0aW9ucyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1767893442),('etURjpOwgzxNGdvKkPEi824F30MjhHVmrJD5e0ap',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHZqN3dRTHJWc0VyUUE3amVuSThzU1BaQXNReU8zQktScDJwNzlLbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1768333673),('hcmPLKBkhpBgNv8OmipeKNVRDSi1IFLHN2ydu1VJ',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmdLZmpGVHZSektQaXcyM2p5ajRnNElxSXNBMER6RmNLRllyekJRbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1767888551),('lNA4hLgHGQBFPH9nhEe839c19fbnQYW0x94nY5Wz',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoidkxGNzg1SnNCMXVzajB5eVhhbVY3U0FiNkhzN3lhZlFlOXdQaTIxNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1767885919),('mz60k0rMu9bjxL1p6PwwnukKyk9B7wn0P6K0PFQR',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoibFNOUnlGNmp0TWRqNzFZd2VqVTROSWxUM2lDVVNpWmVjaUFSRE5DRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hY2NvdW50LXRyYW5zYWN0aW9ucyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1767893089),('UpR6vpZyrnogeFAHio90YtMJgFBdk3nX9LCw4wa7',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoieU1MaTY3bGQ4SVlGMlB0RXJhZk5icVFHcTJyTldNWWo5ZkNZc1lscCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hY2NvdW50LXRyYW5zYWN0aW9ucz90YWI9ZGVwb3NpdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1767895571),('vj4usjIbMVApd0xNkbKkG9po9wAbln5LLoFV84AT',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSEdxRFZLTlc3eFA4YlFESE5zdTVTWGFLcmJrbTFKb1B6cHIxM2ZnVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1768333620);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@example.com',NULL,'$2y$12$aifNDp0CRwF5F5seEX3DgucN6TCs4DPpPC.bo5tG/Eo2dtC3FVayS','user',NULL,'2025-12-26 14:41:29','2025-12-26 14:41:29'),(2,'Ms. Patience Dibbert','lowell.kuphal@example.org','2025-12-26 14:53:29','$2y$12$jFyaf3ZZ4RAZhV4Qe8mDa.RiBRcjZ1n6rKWR2Ps3BUo6eyz6Jr/Wi','user','uZ7vN7XiyG','2025-12-26 14:53:30','2025-12-26 14:53:30'),(3,'Susie Denesik','johnny.ziemann@example.com','2025-12-26 14:53:30','$2y$12$jFyaf3ZZ4RAZhV4Qe8mDa.RiBRcjZ1n6rKWR2Ps3BUo6eyz6Jr/Wi','user','zFTZcrYDBq','2025-12-26 14:53:30','2025-12-26 14:53:30'),(4,'Heaven Schroeder','brenna21@example.org','2025-12-26 14:53:30','$2y$12$jFyaf3ZZ4RAZhV4Qe8mDa.RiBRcjZ1n6rKWR2Ps3BUo6eyz6Jr/Wi','user','2RTML4tmyC','2025-12-26 14:53:30','2025-12-26 14:53:30'),(5,'Torrance Auer','hilda27@example.org','2025-12-26 14:53:30','$2y$12$jFyaf3ZZ4RAZhV4Qe8mDa.RiBRcjZ1n6rKWR2Ps3BUo6eyz6Jr/Wi','user','ffs6nfdNjl','2025-12-26 14:53:30','2025-12-26 14:53:30'),(6,'Monserrate Bahringer','roberto67@example.org','2025-12-26 14:53:30','$2y$12$jFyaf3ZZ4RAZhV4Qe8mDa.RiBRcjZ1n6rKWR2Ps3BUo6eyz6Jr/Wi','user','lmX5WFgPRh','2025-12-26 14:53:30','2025-12-26 14:53:30'),(7,'Dr. Hal Christiansen MD','jazmyne.schmeler@example.net','2025-12-26 14:55:25','$2y$12$IfFJ8z9silTRoK20AH1.5eb.gI1IlGKEb46RR6NwsTLDivjVL7O4C','user','fcDgZ97fVt','2025-12-26 14:55:26','2025-12-26 14:55:26'),(8,'Pascale Boyle','maria00@example.com','2025-12-26 14:55:26','$2y$12$IfFJ8z9silTRoK20AH1.5eb.gI1IlGKEb46RR6NwsTLDivjVL7O4C','user','KGsnILHKot','2025-12-26 14:55:26','2025-12-26 14:55:26'),(9,'Mallory Daugherty','francisco17@example.net','2025-12-26 14:55:26','$2y$12$IfFJ8z9silTRoK20AH1.5eb.gI1IlGKEb46RR6NwsTLDivjVL7O4C','user','bwqpx5widl','2025-12-26 14:55:26','2025-12-26 14:55:26'),(10,'Cassandre Stark','clair.flatley@example.org','2025-12-26 14:55:26','$2y$12$IfFJ8z9silTRoK20AH1.5eb.gI1IlGKEb46RR6NwsTLDivjVL7O4C','user','LrWP5dRY30','2025-12-26 14:55:26','2025-12-26 14:55:26'),(11,'Karina Emard','mabernathy@example.net','2025-12-26 14:55:26','$2y$12$IfFJ8z9silTRoK20AH1.5eb.gI1IlGKEb46RR6NwsTLDivjVL7O4C','user','BcZnsJvVTR','2025-12-26 14:55:26','2025-12-26 14:55:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-13 21:48:37
