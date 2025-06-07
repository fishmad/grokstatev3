<?php
        			
				$sql_filter = '';
				if (isset($_POST['filter'])) {
					if ($_POST['filter'] == 'active') {
						$sql_filter = " AND listingsdb_active = 'yes' ";
					}
					if ($_POST['filter'] == 'inactive') {
						$sql_filter = " AND listingsdb_active = 'no' ";
					}
					if ($_POST['filter'] == 'expired') {
						$sql_filter = " AND listingsdb_expiration < ".$conn->DBDate(time());
					}
					if ($_POST['filter'] == 'featured') {
						$sql_filter = " AND listingsdb_featured = 'yes' ";
					}
					if ($_POST['filter'] == 'created_1week') {
						$sql_filter = " AND listingsdb_creation_date >= ".$conn->DBDate(date('Y-m-d', strtotime('-1 week')));
					}
					if ($_POST['filter'] == 'created_1month') {
						$sql_filter = " AND listingsdb_creation_date >= ".$conn->DBDate(date('Y-m-d', strtotime('-1 month')));
					}
					if ($_POST['filter'] == 'created_3month') {
						$sql_filter = " AND listingsdb_creation_date >= ".$conn->DBDate(date('Y-m-d', strtotime('-3 month')));
					}
				}
        
				$lookup_sql = '';
				if (isset($_POST['lookup_field']) && isset($_POST['lookup_value']) && $_POST['lookup_field'] != 'listingsdb_id' && $_POST['lookup_field'] != 'listingsdb_title' && $_POST['lookup_value'] != '') {
					$lookup_field = $misc->make_db_safe($_POST['lookup_field']);
					$lookup_value = $misc->make_db_safe('%' . $_POST['lookup_value'] . '%');
          
					$sql = 'SELECT listingsdb_id FROM ' . $config['table_prefix'] . 'listingsdbelements WHERE listingsdbelements_field_name = ' . $lookup_field.' AND listingsdbelements_field_value LIKE ' . $lookup_value;
					$recordSet = $conn->Execute($sql);
					if ($recordSet === false) {
						$misc->log_error($sql);
					}
					$listing_ids=array();
					while(!$recordSet->EOF){
						$listing_ids[] = $recordSet->fields['listingsdb_id'];
						$recordSet->MoveNext();
					}
					if(count($listing_ids) > 0) {
						$listing_ids = implode(',',$listing_ids);
					} else {
						$listing_ids = '0';
					}
					$lookup_sql = ' AND listingsdb_id IN (' . $listing_ids.') ';
				}

				if (isset($_POST['lookup_field']) && isset($_POST['lookup_value']) && $_POST['lookup_field'] == 'listingsdb_title' && $_POST['lookup_value'] != '') {
					$lookup_value = $misc->make_db_safe('%' . $_POST['lookup_value'] . '%');
					$sql = 'SELECT listingsdb_id FROM ' . $config['table_prefix'] . 'listingsdb WHERE listingsdb_title  LIKE ' . $lookup_value;
					$recordSet = $conn->Execute($sql);
					if ($recordSet === false) {
						$misc->log_error($sql);
					}
					$listing_ids=array();
					while(!$recordSet->EOF){
						$listing_ids[] = $recordSet->fields['listingsdb_id'];
						$recordSet->MoveNext();
					}
					if(count($listing_ids) > 0) {
						$listing_ids = implode(',',$listing_ids);
					} else {
						$listing_ids = '0';
					}
					$lookup_sql = ' AND listingsdb_id IN (' . $listing_ids.') ';
				}

				if (isset($_POST['pclass_filter']) &&  $_POST['pclass_filter'] != '')	{
          $pclass_filter = $misc->make_db_safe($_POST['pclass_filter']);
          $sql = 'SELECT listingsdb_id FROM ' . $config['table_prefix_no_lang'] . 'classlistingsdb WHERE class_id = ' . $pclass_filter;
          $recordSet = $conn->Execute($sql);
            if ($recordSet === false) {
              $misc->log_error($sql);
            }
          $listing_ids=array();
            while(!$recordSet->EOF){
              $listing_ids[] = $recordSet->fields['listingsdb_id'];
              $recordSet->MoveNext();
            }
            if(count($listing_ids) > 0) {
              $listing_ids = implode(',',$listing_ids);
            } else {
              $listing_ids = '0';
            }
          $pclass_sql = ' AND listingsdb_id IN (' . $listing_ids.') ';
				}

				if (isset($_POST['agent_filter']) &&  $_POST['agent_filter'] != '') {
          $agent_filter = $misc->make_db_safe($_POST['agent_filter']);
          $sql = 'SELECT listingsdb_id FROM ' . $config['table_prefix'] . 'listingsdb WHERE userdb_id = ' . $agent_filter;
          $recordSet = $conn->Execute($sql);
            if ($recordSet === false) {
              $misc->log_error($sql);
            }
          $listing_ids=array();
            while(!$recordSet->EOF){
              $listing_ids[] = $recordSet->fields['listingsdb_id'];
              $recordSet->MoveNext();
            }
            if(count($listing_ids) > 0) {
              $listing_ids = implode(',',$listing_ids);
            } else {
              $listing_ids = '0';
            }
            $agent_sql = ' AND listingsdb_id IN (' . $listing_ids.') ';
				}
				// grab the number of listings from the db
        

        if(isset($_GET['agent_filter']) || $_GET['agent_filter']>="1") {


          $agent_id = $misc->make_db_safe($_GET['agent_filter']);
          $sql = 'SELECT * FROM ' . $config['table_prefix'] . 'userdb WHERE userdb_id = ' . $agent_id;
          $recordSet = $conn->Execute($sql);
            if ($recordSet === false) {
              $misc->log_error($sql);
            }

          $agents_name = $recordSet->fields['userdb_user_first_name'] . " " . $recordSet->fields['userdb_user_last_name'];

          $display .= '
          <div class="row">

            <div class="col-sm-8">
               <h1 style="margin: 0px 0 10px 0"><i class="fa fa-address-book-o" aria-hidden="true"></i> Listings from ' . ucwords($agents_name) . ' </h1>
            </div>

            <hr class="visible-xs-block" style="margin: 5px 0">

            <div class="col-sm-4 text-right text-sm-left">
							<button type="button" class="btn btn-primary btn-md" onclick="history.back()" title="Go Back"><i class="fa fa-arrow-left" aria-hidden="true"></i> Back</button>
							<a class="btn btn-info btn-md" href="/admin/index.php?action=user_manager&edit=' . $_GET['agent_filter'] . '"><i class="fa fa-user" aria-hidden="true"></i> View User</a>
            </div>
						
            <hr class="visible-xs-block" style="margin: 5px 0">

        </div><!-- /.row -->

        <div class="row">
          <hr style="margin: 5px 0">
        </div><!-- /.row -->
        ';

        }

        if ($only_my_listings == true) {
          $sql = "SELECT listingsdb_id, listingsdb_title, listingsdb_mlsexport, listingsdb_notes,	listingsdb_expiration, listingsdb_active, listingsdb_featured, listingsdb_hit_count, userdb_emailaddress FROM " . $config['table_prefix'] . "listingsdb, " . $config['table_prefix'] . "userdb WHERE " . $config['table_prefix'] . "listingsdb.userdb_id = " . $config['table_prefix'] . "userdb.userdb_id AND (" . $config['table_prefix'] . "userdb.userdb_id = '$_SESSION[userID]') $sql_filter $lookup_sql $pclass_sql $agent_sql ORDER BY listingsdb_id ASC";
        } else {
          $sql = "SELECT listingsdb_id, listingsdb_title, listingsdb_mlsexport, listingsdb_notes,	listingsdb_expiration, listingsdb_active, listingsdb_featured, listingsdb_hit_count, userdb_emailaddress FROM " . $config['table_prefix'] . "listingsdb, " . $config['table_prefix'] . "userdb WHERE " . $config['table_prefix'] . "listingsdb.userdb_id = " . $config['table_prefix'] . "userdb.userdb_id $sql_filter $lookup_sql $pclass_sql $agent_sql ORDER BY listingsdb_id DESC";
        }
        $recordSet = $conn->Execute($sql);
        if ($recordSet === false) {
          $misc->log_error($sql);
        }
        $num_rows = $recordSet->RecordCount();
        if (!isset($_GET['cur_page'])) {
          $_GET['cur_page'] = 0;
        }

        $next_prev = $misc->next_prev($num_rows,$_GET['cur_page'],"",'',TRUE); // put in the next/previous stuff

        if(!isset($_GET['agent_filter']) || $_GET['agent_filter']=="0") {
          $display .= listing_editor::show_quick_edit_bar($next_prev,$only_my_listings);
        }

				
				// build the string to select a certain number of listings per page
				$limit_str = $_GET['cur_page'] * $config['listings_per_page'];
				$recordSet = $conn->SelectLimit($sql, $config['listings_per_page'], $limit_str);
				if ($recordSet === false) {
					$misc->log_error($sql);
				}
				$count = 0;
				$display .= "";
				$page->load_page($config['admin_template_path'] . '/edit_listings.html');
				$page->replace_lang_template_tags();
				$page->replace_tags();
				$addons = $page->load_addons();
				$listing_section = $page->get_template_section('listing_dataset');
				while (!$recordSet->EOF) {
					// alternate the colors
					if ($count == 0) {
						$count = $count + 1;
					} else {
						$count = 0;
					}
					$listing .= $listing_section;
					// strip slashes so input appears correctly
					$title = $misc->make_db_unsafe($recordSet->fields['listingsdb_title']);
					$notes = $misc->make_db_unsafe($recordSet->fields['listingsdb_notes']);
					$active = $misc->make_db_unsafe($recordSet->fields['listingsdb_active']);
					$featured = $misc->make_db_unsafe($recordSet->fields['listingsdb_featured']);
					$mlsexport = $misc->make_db_unsafe($recordSet->fields['listingsdb_mlsexport']);
					$email = $misc->make_db_unsafe($recordSet->fields['userdb_emailaddress']);
					$formatted_expiration = $recordSet->UserTimeStamp($recordSet->fields['listingsdb_expiration'], $config["date_format_timestamp"]);
					$listingID = $recordSet->fields['listingsdb_id'];
					$hit_count = $misc->make_db_unsafe($recordSet->fields['listingsdb_hit_count']);
          
          $hit_count = '<span class="btn btn-info btn-xs">Hits: ' . $hit_count . '</span>';
          
					if ($active == 'yes') {
						$active = '<span class="btn btn-success btn-xs">Active Listing</span>';
					} elseif ($active == 'no') {
						$active = '<span class="btn btn-danger btn-xs">Inactive</span>';
					}
					if ($featured == 'yes') {
						$featured = '<span class="btn btn-warning btn-xs">Featured</span>';
					} elseif ($featured == 'no') {
						$featured = '';
					}
					// Add filters to link
					if(isset($_POST['lookup_field']) && isset($_POST['lookup_value'])){
					$_GET['lookup_field'] =$_POST['lookup_field'];
					$_GET['lookup_value'] =$_POST['lookup_value'];
					}
					if(isset($_GET['lookup_field']) && isset($_GET['lookup_value'])){
						$_POST['lookup_field'] =$_GET['lookup_field'];
						$_POST['lookup_value'] =$_GET['lookup_value'];
					}

					if ($only_my_listings == true) {
						$edit_link = $config['baseurl'] . '/admin/index.php?action=edit_my_listings&amp;edit=' . $listingID;
						$delete_link = $config['baseurl'] . '/admin/index.php?action=edit_my_listings&amp;delete=' . $listingID;

					} else {
						$edit_link = $config['baseurl'] . '/admin/index.php?action=edit_listings&amp;edit=' . $listingID;
						$delete_link = $config['baseurl'] . '/admin/index.php?action=edit_listings&amp;delete=' . $listingID;
					}
					$email_link = 'mailto:' . $email;
					$listing = $page->replace_listing_field_tags($listingID,$listing);
					$listing = $page->parse_template_section($listing, 'listingid', $listingID);
					$listing = $page->parse_template_section($listing, 'edit_listing_link', $edit_link);
					$listing = $page->parse_template_section($listing, 'delete_listing_link', $delete_link);
					$listing = $page->parse_template_section($listing, 'email_agent_link', $email_link);
					$listing = $page->parse_template_section($listing, 'listing_active_status', $active);
					$listing = $page->parse_template_section($listing, 'listing_featured_status', $featured);
					$listing = $page->parse_template_section($listing, 'listing_expiration', $formatted_expiration);
					$listing = $page->parse_template_section($listing, 'listing_notes', $notes);
					$listing = $page->parse_template_section($listing, 'row_num_even_odd', $count);
					$listing = $page->parse_template_section($listing, 'listing_hit_count', $hit_count);
					$addon_fields = $page->get_addon_template_field_list($addons);
					$listing = $page->parse_addon_tags($listing, $addon_fields);
					if ($config["use_expiration"]  == 0) {
						$listing = $page->remove_template_block('show_expiration', $listing);
					} else {
						$listing = $page->cleanup_template_block('show_expiration', $listing);
					}
					$recordSet->MoveNext();
				} // end while


				$page->replace_template_section('listing_dataset', $listing);
				$page->replace_permission_tags();
				$display .= $page->return_page();

					
				$display .= $next_prev;

        if(isset($_GET['agent_filter']) || $_GET['agent_filter']>="1") {
          if ($next_prev != '') {
            $display .= $next_prev;
          }
        }
				
?>