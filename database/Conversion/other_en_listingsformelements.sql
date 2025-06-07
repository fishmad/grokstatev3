-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 08, 2025 at 04:37 AM
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
-- Table structure for table `other_en_listingsformelements`
--

CREATE TABLE `other_en_listingsformelements` (
  `listingsformelements_id` int(11) NOT NULL,
  `listingsformelements_field_type` varchar(20) NOT NULL DEFAULT '',
  `listingsformelements_field_name` varchar(80) NOT NULL DEFAULT '',
  `listingsformelements_field_caption` varchar(80) NOT NULL DEFAULT '',
  `listingsformelements_default_text` text NOT NULL,
  `listingsformelements_field_elements` text NOT NULL,
  `listingsformelements_rank` int(11) NOT NULL DEFAULT 0,
  `listingsformelements_search_rank` int(11) NOT NULL DEFAULT 0,
  `listingsformelements_search_result_rank` int(11) NOT NULL DEFAULT 0,
  `listingsformelements_required` varchar(3) NOT NULL DEFAULT '',
  `listingsformelements_location` varchar(50) NOT NULL,
  `listingsformelements_display_on_browse` varchar(3) NOT NULL DEFAULT '',
  `listingsformelements_searchable` int(11) NOT NULL DEFAULT 0,
  `listingsformelements_search_type` varchar(50) DEFAULT NULL,
  `listingsformelements_search_label` varchar(50) DEFAULT NULL,
  `listingsformelements_search_step` varchar(25) DEFAULT NULL,
  `listingsformelements_display_priv` int(11) NOT NULL DEFAULT 0,
  `listingsformelements_field_length` int(11) NOT NULL,
  `listingsformelements_tool_tip` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `other_en_listingsformelements`
--

INSERT INTO `other_en_listingsformelements` (`listingsformelements_id`, `listingsformelements_field_type`, `listingsformelements_field_name`, `listingsformelements_field_caption`, `listingsformelements_default_text`, `listingsformelements_field_elements`, `listingsformelements_rank`, `listingsformelements_search_rank`, `listingsformelements_search_result_rank`, `listingsformelements_required`, `listingsformelements_location`, `listingsformelements_display_on_browse`, `listingsformelements_searchable`, `listingsformelements_search_type`, `listingsformelements_search_label`, `listingsformelements_search_step`, `listingsformelements_display_priv`, `listingsformelements_field_length`, `listingsformelements_tool_tip`) VALUES
(1, 'text', 'town', 'Suburb', '', '', 16, 10, 20, 'No', 'top_right', 'Yes', 1, 'ptext', 'Suburb', '0', 0, 0, ''),
(2, 'text', 'address', 'Address', '', '', 15, 5, 15, 'No', 'top_right', 'Yes', 1, 'ptext', 'Address', '0', 0, 0, ''),
(5, 'select', 'status', 'Status', 'For Sale', 'For Sale||Sold||Deposit Taken||For Lease||Under Contract||Relisted', 2, 3, 90, 'No', 'top_right', 'Yes', 0, 'pulldown', '', '0', 0, 0, ''),
(6, 'text', 'lot_size', 'Lot Size', '', '', 39, 75, 70, 'No', 'top_left', 'Yes', 0, '', '', '0', 0, 0, ''),
(7, 'text', 'garage_size', 'Garage/Car Space', '', '', 40, 50, 55, 'No', 'top_left', 'Yes', 0, 'pulldown', 'Garage', '0', 0, 0, ''),
(8, 'text', 'year_built', 'Year Built', '', '', 42, 70, 65, 'No', 'top_left', 'Yes', 0, '', '', '0', 0, 0, ''),
(9, 'number', 'sq_mtr', 'Dwelling Size m2', '', '', 37, 67, 60, 'No', 'top_right', 'Yes', 0, '', '', '0', 0, 0, ''),
(10, 'number', 'baths', 'Bathrooms', '', '', 35, 45, 40, 'No', 'top_left', 'Yes', 0, 'pulldown', 'Baths', '0', 0, 0, ''),
(11, 'number', 'floors', 'Floors', '', '', 38, 55, 45, 'No', 'top_left', 'Yes', 0, 'pulldown', 'Levels', '0', 2, 0, ''),
(12, 'number', 'beds', 'Beds', '', '', 30, 40, 35, 'No', 'top_left', 'Yes', 0, 'fpulldown', 'Beds', '0', 0, 0, ''),
(13, 'textarea', 'full_desc', 'Description:', '8', '10', 1, 20, 10, 'No', 'center', 'Yes', 0, 'fcheckbox', 'Descriptions', '0', 0, 0, ''),
(15, 'text', 'price', 'Price', '', '', 4, 35, 12, 'No', 'top_left', 'Yes', 1, 'minmax', 'Price Range', '5000', 0, 0, ''),
(16, 'text', 'postcode', 'Postcode', '', '', 19, 20, 30, 'No', 'top_right', 'Yes', 1, 'ptext', 'Postcode', '0', 0, 0, ''),
(17, 'select', 'state', 'State', 'NSW', 'NSW||QLD||VIC||TAS||NT||WA||ACT||SA', 18, 15, 25, 'No', 'top_right', 'Yes', 1, 'pulldown', 'State', '0', 0, 0, ''),
(18, 'checkbox', 'home_features', 'Home Features', '', '<span>Air Conditioning||Ducted air conditioning||Reverse Cycle Airconditioning||</span><span>Balcony/Patio/Terrace||</span><span>Basement||</span><span>Bath||</span><span>Broadband||</span><span>Built-ins||Walk in Robe||Modern Kitchen||</span><span>Dishwasher||Ceaserstone Benches||Stainless Steel Appliances||Modern Bathroom||</span><span>Ensuite</span><span>||</span><span>Formal Lounge||Seperate Dining Room||</span><span>Furnished||</span><span>Gas Enabled||Gas Heating||Fireplace|| Fireplaces||</span><span>Heating||</span><span>Internal Laundry||</span><span>Lift||</span><span>Pay TV Enabled||</span><span>Polished Timber Floors||Hardwood Floors||Carpeted Floors||Tile Floors||</span><span>Remote Garage||Carport||Renovated||</span><span>Renovated Bathroom||</span><span>Renovated Kitchen||Office||</span><span>Study</span>||Granny Flat||<span>Vacuum System||</span>Balcony||Views||Waterfront||Pool||Outdoor Entertaining Area||Water Tank||Cable/Satellite TV||Wheelchair Access||Absolute waterfront||Laundry||Basement||Alarm System||Concierge/Manager||Intercom||Safe||Security Light||Security Windows||Swipe Card', 22, 60, 75, 'No', 'feature1', 'Yes', 0, 'optionlist', 'Features', '0', 0, 0, ''),
(19, 'checkbox', 'community_features', 'Community Features', '', 'Fitness Center||Golf Course||Pool||Beaches||Sports Complex||Tennis Courts||Bike Paths||Boating||Courtyard||Playground/Park||Walking Track||Shopping Centre||Hospital||Public Transportation||Schools||Waterfront||Quiet location||<span>Absolute Waterfront||</span><span>Beach/Coastal||Property</span> <span>Golf||Property</span> <span>Nature||Property</span> <span>Prestige||Property</span> <span>Resort||Property</span> <span>Retirement||Property</span> <span>Ski Property</span> ', 48, 70, 80, 'No', 'feature2', 'Yes', 0, 'optionlist', 'Community', '0', 0, 0, ''),
(20, 'select', 'country', 'Country', 'Australia', 'Abkhazia||Afghanistan||Aland||Albania||Algeria||American Samoa||Andorra||Angola||Anguilla||Antarctica||Antigua and Barbuda||Argentina||Armenia||Aruba||Ascension||Ashmore and Cartier Islands||Australia||Australian Antarctic Territory||Austria||Azerbaijan||&quot;Bahamas, The&quot;||Bahrain||Baker Island||Bangladesh||Barbados||Belarus||Belgium||Belize||Benin||Bermuda||Bhutan||Bolivia||Bosnia and Herzegovina||Botswana||Bouvet Island||Brazil||British Antarctic Territory||British Indian Ocean Territory||British Sovereign Base Areas||British Virgin Islands||Brunei||Bulgaria||Burkina Faso||Burundi||Cambodia||Cameroon||Canada||Cape Verde||Cayman Islands||Central African Republic||Chad||Chile||&quot;China, People\'s Republic of&quot;||&quot;China, Republic of (Taiwan)&quot;||Christmas Island||Clipperton Island||Cocos (Keeling) Islands||Colombia||Comoros||&quot;Congo, Democratic Republic of the (Congo &ndash; Kinshasa)&quot;||&quot;Congo, Republic of the (Congo &ndash; Brazzaville)&quot;||Cook Islands||Coral Sea Islands||Costa Rica||Cote d\'Ivoire (Ivory Coast)||Croatia||Cuba||Cyprus||Czech Republic||Denmark||Djibouti||Dominica||Dominican Republic||Ecuador||Egypt||El Salvador||Equatorial Guinea||Eritrea||Estonia||Ethiopia||Falkland Islands (Islas Malvinas)||Faroe Islands||Fiji||Finland||France||French Guiana||French Polynesia||French Southern and Antarctic Lands||Gabon||&quot;Gambia, The&quot;||Georgia||Germany||Ghana||Gibraltar||Greece||Greenland||Grenada||Guadeloupe||Guam||Guatemala||Guernsey||Guinea||Guinea-Bissau||Guyana||Haiti||Heard Island and McDonald Islands||Honduras||Hong Kong||Howland Island||Hungary||Iceland||India||Indonesia||Iran||Iraq||Ireland||Isle of Man||Israel||Italy||Jamaica||Japan||Jarvis Island||Jersey||Johnston Atoll||Jordan||Kazakhstan||Kenya||Kingman Reef||Kiribati||&quot;Korea, Democratic People\'s Republic of (North Korea)&quot;||&quot;Korea, Republic of (South Korea)&quot;||Kosovo||Kuwait||Kyrgyzstan||Laos||Latvia||Lebanon||Lesotho||Liberia||Libya||Liechtenstein||Lithuania||Luxembourg||Macau||Macedonia||Madagascar||Malawi||Malaysia||Maldives||Mali||Malta||Marshall Islands||Martinique||Mauritania||Mauritius||Mayotte||Mexico||Micronesia||Midway Islands||Moldova||Monaco||Mongolia||Montenegro||Montserrat||Morocco||Mozambique||Myanmar (Burma)||Nagorno-Karabakh||Namibia||Nauru||Navassa Island||Nepal||Netherlands||Netherlands Antilles||New Caledonia||New Zealand||Nicaragua||Niger||Nigeria||Niue||Norfolk Island||Northern Cyprus||Northern Mariana Islands||Norway||Oman||Pakistan||Palau||Palestinian Territories (Gaza Strip and West Bank)||Palmyra Atoll||Panama||Papua New Guinea||Paraguay||Peru||Peter I Island||Philippines||Pitcairn Islands||Poland||Portugal||Pridnestrovie (Transnistria)||Puerto Rico||Qatar||Queen Maud Land||Reunion||Romania||Ross Dependency||Russia||Rwanda||Saint Barthelemy||Saint Helena||Saint Kitts and Nevis||Saint Lucia||Saint Martin||Saint Pierre and Miquelon||Saint Vincent and the Grenadines||Samoa||San Marino||Sao Tome and Principe||Saudi Arabia||Senegal||Serbia||Seychelles||Sierra Leone||Singapore||Slovakia||Slovenia||Solomon Islands||Somalia||Somaliland||South Africa||South Georgia and the South Sandwich Islands||South Ossetia||Spain||Sri Lanka||Sudan||Suriname||Svalbard||Swaziland||Sweden||Switzerland||Syria||Tajikistan||Tanzania||Thailand||Timor-Leste (East Timor)||Togo||Tokelau||Tonga||Trinidad and Tobago||Tristan da Cunha||Tunisia||Turkey||Turkmenistan||Turks and Caicos Islands||Tuvalu||U.S. Virgin Islands||Uganda||Ukraine||United Arab Emirates||United Kingdom||United States||Uruguay||Uzbekistan||Vanuatu||Vatican City||Venezuela||Vietnam||Wake Island||Wallis and Futuna||Western Sahara||Yemen||Zambia||Zimbabwe', 20, 25, 85, 'Yes', 'top_right', 'Yes', 0, 'fpulldown', 'Country', '0', 2, 0, ''),
(21, 'text', 'propertyid', 'Property #', '', '', 3, 11, 50, 'No', 'headline', 'Yes', 1, 'ptext', 'Property ID', '0', 0, 0, ''),
(22, 'textarea', 'Contact', 'Contact details', '4', '', 50, 99, 45, 'No', 'bottom_left', 'Yes', 0, '', '', '0', 0, 0, 'Contact Details:'),
(24, 'date-time', 'OH_Start', 'Open House Start Date/Time', '', '', 62, 5, 4, 'No', '', 'Yes', 0, '', '', '0', 0, 0, 'Leave blank if you are not having an Open House event.'),
(25, 'date-time', 'OH_Finish', 'Open House Finish Date/Time', '', '', 63, 10, 5, 'No', '', 'Yes', 0, '', '', '0', 0, 0, 'Leave this blank if you are not having an Open House event.'),
(26, 'select', 'open_house', 'Open House Event?', '', '||Yes', 60, 2, 3, 'No', '', 'Yes', 0, '', '', '0', 0, 0, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `other_en_listingsformelements`
--
ALTER TABLE `other_en_listingsformelements`
  ADD PRIMARY KEY (`listingsformelements_id`),
  ADD KEY `idx_searchable` (`listingsformelements_searchable`),
  ADD KEY `idx_field_type` (`listingsformelements_field_type`),
  ADD KEY `idx_browse` (`listingsformelements_display_on_browse`),
  ADD KEY `idx_field_name` (`listingsformelements_field_name`),
  ADD KEY `idx_rank` (`listingsformelements_rank`),
  ADD KEY `idx_search_rank` (`listingsformelements_search_rank`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `other_en_listingsformelements`
--
ALTER TABLE `other_en_listingsformelements`
  MODIFY `listingsformelements_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
