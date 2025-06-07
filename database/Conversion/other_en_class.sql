-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 08, 2025 at 04:38 AM
-- Server version: 10.6.21-MariaDB-cll-lve
-- PHP Version: 8.3.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sese2394_smho`
--

-- --------------------------------------------------------

--
-- Table structure for table `other_en_class`
--

CREATE TABLE `other_en_class` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(80) NOT NULL DEFAULT '',
  `class_rank` smallint(6) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `other_en_class`
--

INSERT INTO `other_en_class` (`class_id`, `class_name`, `class_rank`) VALUES
(1, 'Residential', 1),
(2, 'Residential Rentals', 4),
(3, 'Land/Acreage Residential', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `other_en_class`
--
ALTER TABLE `other_en_class`
  ADD PRIMARY KEY (`class_id`),
  ADD KEY `idx_class_rank` (`class_rank`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `other_en_class`
--
ALTER TABLE `other_en_class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
