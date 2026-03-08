-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2026 at 07:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food-ordering`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `food_item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `food_item_id`, `quantity`, `created_at`, `updated_at`) VALUES
(68, 5, 16, 3, '2026-01-16 03:20:13', '2026-01-17 00:25:50'),
(69, 5, 28, 1, '2026-01-16 03:20:52', '2026-01-16 03:20:52'),
(70, 5, 23, 1, '2026-01-16 03:21:00', '2026-01-16 03:21:00'),
(72, 5, 19, 2, '2026-01-16 04:34:58', '2026-01-16 04:48:29'),
(73, 5, 18, 1, '2026-01-16 04:48:17', '2026-01-16 04:48:17'),
(75, 5, 17, 3, '2026-01-17 00:23:08', '2026-01-17 00:41:38'),
(76, 5, 10, 1, '2026-01-17 00:27:47', '2026-01-17 00:27:47'),
(77, 5, 32, 1, '2026-01-30 23:14:06', '2026-01-30 23:14:06');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `image`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Panner', '1766481697.jpg', 1, '2025-12-17 06:16:18', '2025-12-23 03:52:02'),
(4, 'Biryani', '1766481769.jpg', 1, '2025-12-19 06:36:30', '2025-12-23 03:52:49'),
(5, 'Pizza', '1766481856.jpg', 1, '2025-12-22 00:55:51', '2025-12-23 03:54:16'),
(6, 'burger', '1766481899.jpg', 1, '2025-12-22 07:02:16', '2025-12-23 03:54:59'),
(7, 'Sea Food', '1766481941.jpg', 1, '2025-12-23 02:24:06', '2025-12-23 03:55:41'),
(8, 'snacks', '1766478698.jpg', 1, '2025-12-23 03:01:38', '2025-12-23 03:01:38'),
(9, 'Shakes', '1766490987.jpg', 1, '2025-12-23 06:26:27', '2025-12-23 06:26:44'),
(10, 'Today\'s Special', '1766640685.png', 1, '2025-12-25 00:01:25', '2025-12-25 00:01:25'),
(11, 'chinese', '1767162316.png', 1, '2025-12-31 00:55:16', '2025-12-31 00:56:45'),
(12, 'Desserts', '1767426181.png', 1, '2026-01-03 02:13:01', '2026-01-03 02:13:01');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `festival_banners`
--

CREATE TABLE `festival_banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `food_item_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `festival_banners`
--

INSERT INTO `festival_banners` (`id`, `title`, `image`, `is_active`, `start_date`, `end_date`, `created_at`, `updated_at`, `food_item_id`) VALUES
(3, 'Christmas', '1767003313.jpg', 1, NULL, NULL, '2025-12-23 04:52:08', '2025-12-29 04:45:13', NULL),
(4, 'Sankranti Special', '1766992743.jpg', 0, NULL, NULL, '2025-12-25 00:04:13', '2026-01-30 23:40:36', 10);

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `type` enum('veg','non-veg') NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`id`, `category_id`, `name`, `description`, `price`, `image`, `type`, `is_available`, `created_at`, `updated_at`) VALUES
(6, 8, 'Samosa', 'mcnndsijskjdcischsicsdcwhfuwuw', 50.00, '1766478920.jpg', 'veg', 1, '2025-12-23 03:05:20', '2025-12-23 03:05:20'),
(10, 10, 'Til gud - laddoo', 'kjhvhiushvsvhushusu', 100.00, '1766640763.jpg', 'veg', 1, '2025-12-25 00:02:43', '2025-12-25 00:02:43'),
(16, 2, 'Matar Paneer', 'dssufhusfusfusu', 250.00, '1766986592.jpg', 'veg', 1, '2025-12-29 00:06:32', '2025-12-29 00:06:32'),
(17, 2, 'Palak Paneer', 'dkldsiffdji', 200.00, '1766989394.jpg', 'veg', 1, '2025-12-29 00:53:14', '2025-12-29 00:53:14'),
(18, 2, 'Paneer Masala', 'ksuifhuwf', 300.00, '1766989444.jpg', 'veg', 1, '2025-12-29 00:54:04', '2025-12-29 00:54:04'),
(19, 2, 'Paneer Pulao', 'fsnshufihufw', 250.00, '1766989715.jpg', 'veg', 1, '2025-12-29 00:58:35', '2025-12-29 00:58:35'),
(20, 2, 'Paneer Tikka', 'kjdshhfuisihfu', 320.00, '1766989811.jpg', 'veg', 1, '2025-12-29 01:00:11', '2025-12-29 01:00:11'),
(21, 2, 'Paneer Curry', 'kdkjeahiuieueu', 280.00, '1766989840.jpg', 'veg', 1, '2025-12-29 01:00:40', '2025-12-29 01:00:40'),
(22, 4, 'veg biryani', 'ddlasjiajiodqq', 300.00, '1766990209.jpg', 'veg', 1, '2025-12-29 01:06:49', '2025-12-29 01:06:49'),
(23, 4, 'Mutton Biryani', 'sadnanjhduaaud', 260.00, '1766990373.jpg', 'non-veg', 1, '2025-12-29 01:09:33', '2025-12-29 01:09:33'),
(24, 4, 'Chicken Biryani', 'masodaoida', 300.00, '1766990398.jpg', 'non-veg', 1, '2025-12-29 01:09:58', '2025-12-29 01:09:58'),
(25, 5, 'Margherita Pizza', 'kfksfofiosio', 199.00, '1766991014.jpg', 'veg', 1, '2025-12-29 01:20:14', '2025-12-29 01:20:14'),
(26, 5, 'Corn Pizza', 'nfsjdshwe', 200.00, '1766991148.jpg', 'veg', 1, '2025-12-29 01:22:28', '2025-12-29 01:22:28'),
(27, 5, 'Paneer Pizza', 'dfnwuiwefuw', 200.00, '1766991295.jpg', 'veg', 1, '2025-12-29 01:24:55', '2025-12-29 01:24:55'),
(28, 5, 'Veggie Pizza', 'sknehuwwe', 250.00, '1766991415.jpg', 'veg', 1, '2025-12-29 01:26:55', '2025-12-29 01:26:55'),
(29, 5, 'Bbq Chicken Pizza', 'asndjahduaa', 350.00, '1766991526.jpg', 'non-veg', 1, '2025-12-29 01:28:46', '2025-12-29 01:28:46'),
(30, 5, 'Chicken Pizza', 'dnjuiiqueueiqeq', 200.00, '1766991696.jpg', 'non-veg', 1, '2025-12-29 01:31:36', '2025-12-29 01:31:36'),
(31, 6, 'Burger', 'caahduahu', 49.00, '1766992144.jpg', 'veg', 1, '2025-12-29 01:35:08', '2025-12-29 01:39:04'),
(32, 6, 'Chicken Burger', 'dkfnhfahhf', 100.00, '1769834394.png', 'non-veg', 1, '2025-12-29 01:42:01', '2026-01-30 23:09:54'),
(33, 2, 'xyz paneer', 'njcvdzvdsnvui', 250.00, '1769836314.png', 'veg', 0, '2026-01-30 23:41:54', '2026-01-30 23:42:16');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_12_17_083340_create_categories_table', 2),
(6, '2025_12_17_083708_create_food_items_table', 3),
(7, '2025_12_17_091052_add_is_admin_to_users_table', 4),
(8, '2025_12_18_093646_create_carts_table', 5),
(9, '2025_12_18_112604_create_orders_table', 6),
(10, '2025_12_18_112811_create_order_items_table', 6),
(11, '2025_12_19_050053_add_payment_fields_to_orders_table', 7),
(12, '2025_12_19_052558_add_food_items_to_order_items_table', 8),
(13, '2025_12_19_121437_create_notifications_table', 9),
(14, '2025_12_19_121706_create_notifications_table', 10),
(15, '2025_12_20_045347_add_delivery_address_to_orders_table', 11),
(16, '2025_12_20_054030_create_user_addresses_table', 12),
(17, '2025_12_20_060824_make_delivery_columns_nullable_in_orders_table', 13),
(18, '2025_12_20_092700_add_address_id_to_orders_table', 14),
(19, '2025_12_23_065537_add_images_to_categories_table', 15),
(20, '2025_12_23_085016_create_festival_banners_table', 16),
(21, '2025_12_25_051425_add_food_item_id_to_festival_banners_table', 17),
(22, '2025_12_30_112032_add_structured_fields_to_user_addresses', 18),
(23, '2026_01_02_064055_create_ratings_table', 19),
(24, '2026_02_28_071618_add_roles_to_users_table', 20),
(25, '2026_02_28_073750_add_delivery_boy_id_to_orders_table', 21),
(26, '2026_03_02_051807_add_phone_to_users_table', 22),
(27, '2026_03_02_053551_add_is_approved_to_users_table', 23),
(28, '2026_03_04_072855_add_is_active_to_users_table', 24),
(29, '2026_03_04_075519_add_location_to_users_table', 25);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 1, 'Your order #54 status has been updated to preparing', 1, '2025-12-19 06:54:30', '2025-12-19 07:06:59'),
(2, 1, 'Your order #54 status has been updated to delivered', 1, '2025-12-19 06:55:25', '2025-12-19 07:06:59'),
(3, 1, 'Your order #3 status has been updated to preparing', 1, '2025-12-19 07:07:21', '2025-12-19 07:07:27'),
(4, 1, 'Your order #3 status has been updated to accepted', 1, '2025-12-19 07:07:37', '2025-12-19 07:07:48'),
(5, 1, 'Your order #3 status has been updated to preparing', 1, '2025-12-19 07:15:45', '2025-12-19 07:15:53'),
(6, 1, 'Your order #55 status has been updated to preparing', 1, '2025-12-20 00:44:52', '2025-12-20 00:44:59'),
(7, 2, 'Your order #56 status has been updated to delivered', 1, '2025-12-20 02:17:02', '2025-12-20 03:20:32'),
(8, 1, 'Your order #63 status has been updated to preparing', 1, '2025-12-20 06:21:39', '2025-12-20 06:21:57'),
(9, 3, 'Your order #64 status has been updated to delivered', 0, '2025-12-20 06:53:21', '2025-12-20 06:53:21'),
(10, 2, 'Your order #66 status has been updated to accepted', 1, '2025-12-22 07:01:48', '2025-12-22 07:38:32'),
(11, 2, 'Your order #66 status has been updated to preparing', 1, '2025-12-22 07:02:01', '2025-12-22 07:38:32'),
(12, 2, 'Your order #69 status has been updated to out_for_delivery', 1, '2025-12-25 05:55:59', '2025-12-26 04:11:12'),
(13, 1, 'Your order #70 status has been updated to accepted', 1, '2025-12-25 05:56:54', '2025-12-25 05:57:01'),
(14, 1, 'Your order #70 status has been updated to preparing', 1, '2025-12-25 05:57:06', '2025-12-25 06:00:53'),
(15, 1, 'Your order #70 status has been updated to out_for_delivery', 1, '2025-12-25 05:57:52', '2025-12-25 06:00:53'),
(16, 1, 'Your order #70 status has been updated to delivered', 1, '2025-12-25 05:59:01', '2025-12-25 06:00:53'),
(17, 1, 'Your order #77 status has been updated to delivered', 1, '2026-01-02 01:19:43', '2026-01-02 01:19:52'),
(18, 1, 'Your order #76 status has been updated to delivered', 1, '2026-01-02 05:49:10', '2026-01-02 05:57:29'),
(19, 1, 'Your order #83 status has been updated to accepted', 1, '2026-01-30 23:45:00', '2026-01-30 23:45:09'),
(20, 1, 'Your order #83 status has been updated to out_for_delivery', 1, '2026-02-27 23:30:25', '2026-02-28 04:37:07'),
(21, 1, 'Your order #83 status has been updated to delivered', 1, '2026-02-27 23:30:49', '2026-02-28 04:37:07'),
(22, 1, 'Your order #81 status has been updated to delivered', 1, '2026-02-27 23:54:55', '2026-02-28 04:37:07'),
(23, 1, 'Your order #83 status has been updated to accepted', 1, '2026-02-27 23:55:24', '2026-02-28 04:37:07'),
(24, 1, 'Your order #83 status has been updated to delivered', 1, '2026-02-27 23:55:37', '2026-02-28 04:37:07'),
(25, 1, 'Your order #85 status has been updated to delivered', 1, '2026-02-28 00:06:08', '2026-02-28 04:37:07'),
(26, 1, 'Your order #77 status has been updated to preparing', 1, '2026-02-28 00:12:35', '2026-02-28 04:37:07'),
(27, 1, 'Your order #77 status has been updated to delivered', 1, '2026-02-28 00:12:45', '2026-02-28 04:37:07'),
(28, 1, 'Your order #3 status has been updated to delivered', 1, '2026-02-28 00:13:01', '2026-02-28 04:37:07'),
(29, 1, 'Your order #84 status has been updated to delivered', 1, '2026-02-28 01:23:38', '2026-02-28 04:37:07'),
(30, 1, 'Your order #85 status has been updated to out_for_delivery', 1, '2026-02-28 03:55:50', '2026-02-28 04:37:07');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `delivery_name` varchar(255) DEFAULT NULL,
  `delivery_phone` varchar(255) DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `delivery_city` varchar(255) DEFAULT NULL,
  `delivery_pincode` varchar(255) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `address_id` bigint(20) UNSIGNED DEFAULT NULL,
  `delivery_boy_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `delivery_name`, `delivery_phone`, `delivery_address`, `delivery_city`, `delivery_pincode`, `total_amount`, `payment_method`, `payment_status`, `status`, `created_at`, `updated_at`, `address_id`, `delivery_boy_id`) VALUES
(1, 1, '', '', '', '', '', 600.00, '', 'pending', 'cancelled', '2025-12-18 06:57:12', '2025-12-19 03:19:22', NULL, NULL),
(2, 1, '', '', '', '', '', 600.00, '', 'pending', 'out_for_delivery', '2025-12-18 23:12:03', '2025-12-19 00:05:55', NULL, NULL),
(3, 1, '', '', '', '', '', 300.00, 'online', 'pending', 'delivered', '2025-12-18 23:36:50', '2026-02-28 00:13:01', NULL, NULL),
(4, 1, '', '', '', '', '', 600.00, 'cod', 'unpaid', 'delivered', '2025-12-18 23:37:10', '2025-12-19 00:04:52', NULL, NULL),
(53, 1, '', '', '', '', '', 300.00, 'cod', 'unpaid', 'cancelled', '2025-12-19 00:44:07', '2025-12-19 03:24:12', NULL, NULL),
(54, 1, '', '', '', '', '', 300.00, 'cod', 'unpaid', 'delivered', '2025-12-19 06:10:51', '2025-12-19 06:55:25', NULL, NULL),
(55, 1, '', '', '', '', '', 900.00, 'cod', 'unpaid', 'preparing', '2025-12-19 06:11:11', '2025-12-20 00:44:52', NULL, NULL),
(56, 2, NULL, NULL, NULL, NULL, NULL, 1000.00, 'cod', 'unpaid', 'delivered', '2025-12-20 00:39:18', '2025-12-20 02:17:02', NULL, NULL),
(57, 1, NULL, NULL, NULL, NULL, NULL, 250.00, 'cod', 'unpaid', 'cancelled', '2025-12-20 01:06:23', '2025-12-20 01:06:32', NULL, NULL),
(58, 1, NULL, NULL, NULL, NULL, NULL, 300.00, 'cod', 'unpaid', 'pending', '2025-12-20 04:03:56', '2025-12-20 04:03:56', 2, NULL),
(59, 1, NULL, NULL, NULL, NULL, NULL, 1250.00, 'cod', 'unpaid', 'pending', '2025-12-20 04:33:59', '2025-12-20 04:33:59', NULL, NULL),
(60, 1, NULL, NULL, NULL, NULL, NULL, 600.00, 'cod', 'unpaid', 'pending', '2025-12-20 04:59:38', '2025-12-20 04:59:38', NULL, NULL),
(61, 1, NULL, NULL, NULL, NULL, NULL, 300.00, 'cod', 'unpaid', 'pending', '2025-12-20 05:11:37', '2025-12-20 05:11:37', NULL, NULL),
(63, 1, NULL, NULL, NULL, NULL, NULL, 300.00, 'cod', 'unpaid', 'preparing', '2025-12-20 05:33:33', '2025-12-20 06:21:39', 6, NULL),
(64, 3, NULL, NULL, NULL, NULL, NULL, 950.00, 'cod', 'unpaid', 'delivered', '2025-12-20 06:50:34', '2025-12-20 06:53:21', 7, NULL),
(65, 1, NULL, NULL, NULL, NULL, NULL, 120.00, 'cod', 'unpaid', 'pending', '2025-12-22 00:59:00', '2025-12-22 00:59:00', 2, NULL),
(66, 2, NULL, NULL, NULL, NULL, NULL, 700.00, 'cod', 'unpaid', 'preparing', '2025-12-22 06:56:37', '2025-12-22 07:02:01', 1, NULL),
(67, 2, NULL, NULL, NULL, NULL, NULL, 300.00, 'cod', 'unpaid', 'pending', '2025-12-22 07:32:15', '2025-12-22 07:32:15', 1, NULL),
(68, 1, NULL, NULL, NULL, NULL, NULL, 600.00, 'cod', 'unpaid', 'pending', '2025-12-23 06:03:46', '2025-12-23 06:03:46', 2, NULL),
(69, 2, NULL, NULL, NULL, NULL, NULL, 300.00, 'cod', 'unpaid', 'out_for_delivery', '2025-12-23 12:03:12', '2025-12-25 05:55:59', 1, NULL),
(70, 1, NULL, NULL, NULL, NULL, NULL, 1800.00, 'cod', 'unpaid', 'delivered', '2025-12-25 05:56:41', '2025-12-25 05:59:01', 6, NULL),
(71, 2, NULL, NULL, NULL, NULL, NULL, 1400.00, 'cod', 'unpaid', 'pending', '2025-12-27 01:47:02', '2025-12-27 01:47:02', 1, NULL),
(72, 1, NULL, NULL, NULL, NULL, NULL, 250.00, 'cod', 'unpaid', 'pending', '2025-12-30 03:22:48', '2025-12-30 03:22:48', 8, NULL),
(73, 1, NULL, NULL, NULL, NULL, NULL, 519.00, 'cod', 'unpaid', 'pending', '2025-12-30 03:25:26', '2025-12-30 03:25:26', 9, NULL),
(74, 1, NULL, NULL, NULL, NULL, NULL, 620.00, 'cod', 'unpaid', 'pending', '2025-12-30 03:36:03', '2025-12-30 03:36:03', 10, NULL),
(75, 1, NULL, NULL, NULL, NULL, NULL, 450.00, 'cod', 'unpaid', 'pending', '2025-12-30 06:14:46', '2025-12-30 06:14:46', 11, NULL),
(76, 1, NULL, NULL, NULL, NULL, NULL, 100.00, 'cod', 'unpaid', 'delivered', '2025-12-31 00:57:33', '2026-01-02 05:49:10', 11, NULL),
(77, 1, NULL, NULL, NULL, NULL, NULL, 250.00, 'cod', 'paid', 'delivered', '2025-12-31 07:05:24', '2026-02-28 00:12:45', 12, NULL),
(78, 5, NULL, NULL, NULL, NULL, NULL, 1050.00, 'cod', 'unpaid', 'pending', '2026-01-09 05:24:24', '2026-03-06 04:03:51', 13, 13),
(79, 1, NULL, NULL, NULL, NULL, NULL, 200.00, 'cod', 'unpaid', 'pending', '2026-01-09 05:27:30', '2026-01-09 05:27:30', 15, NULL),
(80, 1, NULL, NULL, NULL, NULL, NULL, 300.00, 'cod', 'unpaid', 'pending', '2026-01-09 05:28:44', '2026-01-09 05:28:44', 2, NULL),
(81, 1, NULL, NULL, NULL, NULL, NULL, 200.00, 'cod', 'paid', 'delivered', '2026-01-09 05:47:08', '2026-02-27 23:54:55', 16, NULL),
(82, 5, NULL, NULL, NULL, NULL, NULL, 450.00, 'cod', 'paid', 'delivered', '2026-01-15 05:22:30', '2026-03-06 04:04:22', 17, 13),
(83, 1, NULL, NULL, NULL, NULL, NULL, 750.00, 'cod', 'paid', 'delivered', '2026-01-30 23:44:03', '2026-02-27 23:55:37', 5, NULL),
(84, 1, NULL, NULL, NULL, NULL, NULL, 450.00, 'cod', 'paid', 'delivered', '2026-02-27 23:57:43', '2026-02-28 03:55:42', 18, 8),
(85, 1, NULL, NULL, NULL, NULL, NULL, 250.00, 'cod', 'paid', 'delivered', '2026-02-28 00:05:56', '2026-02-28 04:00:59', 19, 8),
(86, 9, NULL, NULL, NULL, NULL, NULL, 250.00, 'cod', 'paid', 'delivered', '2026-02-28 04:34:13', '2026-02-28 04:57:08', 20, 8),
(87, 1, NULL, NULL, NULL, NULL, NULL, 250.00, 'cod', 'unpaid', 'out_for_delivery', '2026-02-28 04:37:45', '2026-03-07 00:46:50', 18, 15);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `food_item_id` bigint(20) UNSIGNED NOT NULL,
  `food_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `food_item_id`, `food_name`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(35, 72, 16, 'Matar Paneer', 1, 250.00, '2025-12-30 03:22:48', '2025-12-30 03:22:48'),
(36, 73, 25, 'Margherita Pizza', 1, 199.00, '2025-12-30 03:25:26', '2025-12-30 03:25:26'),
(37, 73, 20, 'Paneer Tikka', 1, 320.00, '2025-12-30 03:25:26', '2025-12-30 03:25:26'),
(38, 74, 20, 'Paneer Tikka', 1, 320.00, '2025-12-30 03:36:03', '2025-12-30 03:36:03'),
(39, 74, 22, 'veg biryani', 1, 300.00, '2025-12-30 03:36:03', '2025-12-30 03:36:03'),
(40, 75, 16, 'Matar Paneer', 1, 250.00, '2025-12-30 06:14:46', '2025-12-30 06:14:46'),
(41, 75, 17, 'Palak Paneer', 1, 200.00, '2025-12-30 06:14:46', '2025-12-30 06:14:46'),
(42, 76, 10, 'Til gud - laddoo', 1, 100.00, '2025-12-31 00:57:33', '2025-12-31 00:57:33'),
(43, 77, 16, 'Matar Paneer', 1, 250.00, '2025-12-31 07:05:24', '2025-12-31 07:05:24'),
(44, 78, 18, 'Paneer Masala', 1, 300.00, '2026-01-09 05:24:24', '2026-01-09 05:24:24'),
(45, 78, 16, 'Matar Paneer', 1, 250.00, '2026-01-09 05:24:24', '2026-01-09 05:24:24'),
(46, 78, 17, 'Palak Paneer', 1, 200.00, '2026-01-09 05:24:24', '2026-01-09 05:24:24'),
(47, 78, 22, 'veg biryani', 1, 300.00, '2026-01-09 05:24:24', '2026-01-09 05:24:24'),
(48, 79, 17, 'Palak Paneer', 1, 200.00, '2026-01-09 05:27:30', '2026-01-09 05:27:30'),
(49, 80, 18, 'Paneer Masala', 1, 300.00, '2026-01-09 05:28:44', '2026-01-09 05:28:44'),
(50, 81, 17, 'Palak Paneer', 1, 200.00, '2026-01-09 05:47:08', '2026-01-09 05:47:08'),
(51, 82, 17, 'Palak Paneer', 1, 200.00, '2026-01-15 05:22:30', '2026-01-15 05:22:30'),
(52, 82, 16, 'Matar Paneer', 1, 250.00, '2026-01-15 05:22:30', '2026-01-15 05:22:30'),
(53, 83, 16, 'Matar Paneer', 1, 250.00, '2026-01-30 23:44:03', '2026-01-30 23:44:03'),
(54, 83, 17, 'Palak Paneer', 1, 200.00, '2026-01-30 23:44:03', '2026-01-30 23:44:03'),
(55, 83, 22, 'veg biryani', 1, 300.00, '2026-01-30 23:44:03', '2026-01-30 23:44:03'),
(56, 84, 16, 'Matar Paneer', 1, 250.00, '2026-02-27 23:57:43', '2026-02-27 23:57:43'),
(57, 84, 17, 'Palak Paneer', 1, 200.00, '2026-02-27 23:57:43', '2026-02-27 23:57:43'),
(58, 85, 16, 'Matar Paneer', 1, 250.00, '2026-02-28 00:05:56', '2026-02-28 00:05:56'),
(59, 86, 16, 'Matar Paneer', 1, 250.00, '2026-02-28 04:34:13', '2026-02-28 04:34:13'),
(60, 87, 16, 'Matar Paneer', 1, 250.00, '2026-02-28 04:37:45', '2026-02-28 04:37:45');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `food_item_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `review` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `user_id`, `food_item_id`, `order_id`, `rating`, `review`, `created_at`, `updated_at`) VALUES
(2, 1, 16, 77, 5, NULL, '2026-01-02 05:48:35', '2026-01-02 05:48:35'),
(4, 1, 10, 76, 4, NULL, '2026-01-02 05:49:22', '2026-01-02 05:49:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `is_admin`, `remember_token`, `created_at`, `updated_at`, `role`, `is_approved`, `is_active`, `latitude`, `longitude`) VALUES
(1, 'Bhagyashri Rajesh Tatewar', 'btatewar3@gmail.com', NULL, NULL, '$2y$10$Hxw/a/qVCH7JVJKaMzZIZOac.QV0fcq07wIbQZcph3Uu6qhR.MZ5q', 1, '1Iu8pQZsC0MIvXIehmcyBPHTwlMMW4cao3gYOXI0QxQWrkqektsyAaRH5i4F', '2025-12-17 03:20:47', '2026-01-29 04:12:17', 'admin', 0, 1, NULL, NULL),
(2, 'Arya Wakchawre', 'arya@gmail.com', NULL, NULL, '$2y$10$TXyKAJamlAqhOcGTQUdVTOlcYs7fGZ93h8aTcoVhUoOFiE7O5KVHe', 0, NULL, '2025-12-17 03:52:30', '2025-12-17 03:52:30', 'user', 0, 1, NULL, NULL),
(3, 'Atharva Tatewar', 'atharva@gmail.com', NULL, NULL, '$2y$10$IPYxX.zQRe6H86tvwtPqn.ApEO9t8sbL81ZcDftUoBY.IcunCMe7m', 0, NULL, '2025-12-20 06:49:10', '2025-12-20 06:49:10', 'user', 0, 1, NULL, NULL),
(4, 'Bhavna Vishwakarma', 'bhavna@gmail.com', NULL, NULL, '$2y$10$ZHLyxQkNzMd3Kq4K0RxVB.60zBliIp9AJPN2xKeCNBN1B4KPUEF0i', 0, NULL, '2025-12-27 06:35:21', '2025-12-27 06:35:21', 'user', 0, 1, NULL, NULL),
(5, 'Angadh Dhole', 'angadh@gmail.com', NULL, NULL, '$2y$10$d.5DzUQIpMTb.C3oMwj7wuHFFUPhCvrzZPi.3sT8KA6eWEnldCoyu', 0, NULL, '2026-01-07 06:23:56', '2026-01-07 06:23:56', 'user', 0, 1, NULL, NULL),
(6, 'Snigdha', 'snig@gmail.com', NULL, NULL, '$2y$10$BtvopI4lsMYmw7XEsLeNwe7y7XWtCo.pWaCBj4ofGYHn7h4vXR0Oe', 0, NULL, '2026-01-08 04:20:59', '2026-01-08 04:20:59', 'user', 0, 1, NULL, NULL),
(7, 'Abc', 'abc@gmail.com', NULL, NULL, '$2y$10$ntQKNyRYWbbzd5sTd3puFeS/N/2.8cHQNCVJVN0yAI1Q0TUBXYAqW', 0, NULL, '2026-01-15 23:49:10', '2026-01-15 23:49:10', 'user', 0, 1, NULL, NULL),
(8, 'Xyz', 'xyz@gmail.com', '8766772212', NULL, '$2y$10$1lsYP6FzJc.XN0Kpz6laPuruRPlVR2mf9svhM/F5PhMz1DliUNZqS', 0, NULL, '2026-01-15 23:56:48', '2026-03-04 01:25:24', 'delivery', 1, 1, NULL, NULL),
(9, 'Bhavika', 'bhavi@gmail.com', NULL, NULL, '$2y$10$bQIicZ/s82TywrPi1OM8QOc74nkOiwa8Dt8TiaMm91j8MRcfPaC0u', 0, NULL, '2026-02-28 04:32:29', '2026-02-28 04:32:29', 'user', 0, 1, NULL, NULL),
(10, 'Sachin Sudhakar Gawai', 'sachin@gmail.com', NULL, NULL, '$2y$10$knFRxBtg0gXxrQ19bk9r5eh4/iV4rItnxEh471Az5FVkvbtUeJb/W', 0, NULL, '2026-03-04 00:22:29', '2026-03-04 01:24:24', 'delivery', 1, 1, NULL, NULL),
(11, 'Siddhart Shukla', 'sid@gmail.com', NULL, NULL, '$2y$10$LGQZCd7Y/GExICMBBj5zvupd7UJIzB2MLo6YnrsTfs2.pEAzIUgd.', 0, NULL, '2026-03-04 00:46:05', '2026-03-04 00:46:05', 'user', 0, 1, NULL, NULL),
(12, 'Vaidahi Rahate', 'vaid@gmail.com', NULL, NULL, '$2y$10$p3Jn6XUHw7RIctjQ9go9Jespmh8xVwqHC4cLlm3o1mfFqiyBeDvFG', 0, NULL, '2026-03-04 00:47:35', '2026-03-04 00:47:35', 'user', 0, 1, NULL, NULL),
(13, 'Jagat Singh', 'jagat@gmail.com', '1234567890', NULL, '$2y$10$xWBGDJBi9CaJwA/oJKYx6eMz/Aoa3WTDYw0BSBHM9sDOekFOd25Ma', 0, NULL, '2026-03-04 00:53:30', '2026-03-04 02:53:45', 'delivery', 1, 1, 21.0966108, 79.0749913),
(15, 'Delivery', 'delivery@gmail.com', '9632014587', NULL, '$2y$10$F/IoP.ifTsu2gC06Upe3Eun08hUzKg6e1M1iARMiBrta5sg0Z.yda', 0, NULL, '2026-03-07 00:33:03', '2026-03-07 00:52:25', 'delivery', 1, 1, NULL, NULL),
(16, 'Delivery2', 'delivery2@gmail.com', '1234567890', NULL, '$2y$10$SzKY21brEcA5gMrafnOmSeakjpLOdDTk5CyLrtqtnBCqQ5jZ7CrwC', 0, NULL, '2026-03-07 01:03:59', '2026-03-07 01:03:59', 'delivery', 0, 1, NULL, NULL),
(17, 'Delivery3', 'delivery3@gmail.com', '9876543210', NULL, '$2y$10$EZTWH2w6Wpvf7GnG3RfVVeztV4KnY8IZl4HngEZSzxl/vJIlNu6ve', 0, NULL, '2026-03-07 01:07:56', '2026-03-07 01:07:56', 'delivery', 0, 1, NULL, NULL),
(18, 'Delivery4', 'delivery4@gmail.com', '9638520147', NULL, '$2y$10$33sO8DLLK1/ATSxMhQCKs.AQXr27Az3EdpTBrA0FnHvZjxcE8fOQa', 0, NULL, '2026-03-07 01:09:57', '2026-03-07 01:11:08', 'delivery', 1, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `house_no` varchar(255) DEFAULT NULL,
  `building_name` varchar(255) DEFAULT NULL,
  `street_name` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `label`, `name`, `phone`, `house_no`, `building_name`, `street_name`, `landmark`, `address`, `city`, `pincode`, `is_default`, `created_at`, `updated_at`, `latitude`, `longitude`) VALUES
(1, 2, 'Home', 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'Friends Colony Katol Road', 'Nagpur', '440013', 0, '2025-12-20 00:19:15', '2025-12-20 00:19:15', NULL, NULL),
(2, 1, 'Office', 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'Friends Colony Katol Road', 'Nagpur', '440013', 0, '2025-12-20 01:06:18', '2025-12-20 01:06:18', NULL, NULL),
(3, 1, 'Home', 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'Chattrapati sqr,Nagpur', 'Nagpur', '440013', 0, '2025-12-20 04:30:49', '2025-12-20 04:30:49', NULL, NULL),
(4, 1, 'Office', 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'Ujjwal ngr,nagpur', 'Nagpur', '440013', 0, '2025-12-20 04:40:41', '2025-12-20 04:40:41', NULL, NULL),
(5, 1, 'Home', 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'GNIT', 'Nagpur', '440013', 0, '2025-12-20 05:07:00', '2025-12-20 05:07:00', NULL, NULL),
(6, 1, 'Office', 'Bhagyashri Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'BhagatSingh Sqr, Wani', 'Wani', '445304', 0, '2025-12-20 05:33:28', '2025-12-22 02:24:26', NULL, NULL),
(7, 3, 'Home', 'Atharva Tatewar', '8766040170', NULL, NULL, NULL, NULL, 'BhagatSingh Sqr, Wani', 'Wani', '445304', 0, '2025-12-20 06:50:07', '2025-12-20 06:50:07', NULL, NULL),
(8, 1, NULL, 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'Friends Colony Katol Road', 'Nagpur', '440013', 0, '2025-12-30 03:17:43', '2025-12-30 03:17:43', NULL, NULL),
(9, 1, NULL, 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'Friends Colony Katol Road', 'Nagpur', '440013', 0, '2025-12-30 03:25:21', '2025-12-30 03:25:21', 21.1771438, 79.0463038),
(10, 1, NULL, 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, 'abhilasha apt,beside HDFC bank, Friends Colony, katol road, nagpur - 440013', 'Nagpur', '440013', 0, '2025-12-30 03:35:50', '2025-12-30 03:35:50', 21.1785350, 79.0457779),
(11, 1, 'Home', 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, '', 'Nagpur', '440013', 0, '2025-12-30 06:14:40', '2025-12-30 06:14:40', 21.1774840, 79.0465076),
(12, 1, 'Office', 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, '', 'Nagpur', '440013', 0, '2025-12-31 07:05:18', '2025-12-31 07:05:18', 21.1773639, 79.0465612),
(13, 5, NULL, 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, '', 'Nagpur', '440013', 0, '2026-01-09 05:24:17', '2026-01-09 05:24:17', 21.0854010, 79.0757927),
(14, 1, NULL, 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, '', 'Nagpur', '440013', 0, '2026-01-09 05:26:56', '2026-01-09 05:26:56', 21.0854010, 79.0757927),
(15, 1, NULL, 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, '', 'Nagpur', '440013', 0, '2026-01-09 05:27:20', '2026-01-09 05:27:20', 21.0854010, 79.0757927),
(16, 1, NULL, 'Bhagyashri Rajesh Tatewar', '08766772212', NULL, NULL, NULL, NULL, '', 'Nagpur', '440013', 0, '2026-01-09 05:47:00', '2026-01-09 05:47:00', 21.0854010, 79.0757927),
(17, 5, NULL, 'Bhagyashri Tatewar', '08766772212', NULL, NULL, NULL, NULL, '', 'Wani', '445304', 0, '2026-01-15 05:22:06', '2026-01-15 05:22:06', 21.0965121, 79.0751715),
(18, 1, 'vmdfkldfko', 'bvhbvdfsbvdbvhdbv', '7896541023', NULL, NULL, NULL, NULL, 'vjcbbvhdsbfbvxcbvhdfdbvbhbvhx', 'Nagpur', '440013', 0, '2026-02-27 23:57:30', '2026-02-27 23:57:30', 21.1458000, 79.0882000),
(19, 1, 'kncvncv', 'ncvnjcvnjcnvjcn', '1234567890', NULL, NULL, NULL, NULL, 'ncdjndjjdncndjndj', 'ngp', '440013', 0, '2026-02-28 00:05:45', '2026-02-28 00:05:45', 21.1458000, 79.0882000),
(20, 9, 'Home', 'Bhavika', '214563078', NULL, NULL, NULL, NULL, 'Narendra Ngr', 'Nagpur', '440013', 0, '2026-02-28 04:34:05', '2026-02-28 04:34:05', 21.1458000, 79.0882000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_user_id_foreign` (`user_id`),
  ADD KEY `carts_food_item_id_foreign` (`food_item_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `festival_banners`
--
ALTER TABLE `festival_banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `festival_banners_food_item_id_foreign` (`food_item_id`);

--
-- Indexes for table `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `food_items_category_id_foreign` (`category_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_address_id_foreign` (`address_id`),
  ADD KEY `orders_delivery_boy_id_foreign` (`delivery_boy_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_food_item_id_foreign` (`food_item_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ratings_user_id_order_id_food_item_id_unique` (`user_id`,`order_id`,`food_item_id`),
  ADD KEY `ratings_order_id_foreign` (`order_id`),
  ADD KEY `ratings_food_item_id_foreign` (`food_item_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_addresses_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `festival_banners`
--
ALTER TABLE `festival_banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `festival_banners`
--
ALTER TABLE `festival_banners`
  ADD CONSTRAINT `festival_banners_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `user_addresses` (`id`),
  ADD CONSTRAINT `orders_delivery_boy_id_foreign` FOREIGN KEY (`delivery_boy_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`),
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
