<?php
/**
 * Open-Realty
 *
 * Open-Realty is free software; you can redistribute it and/or modify
 * it under the terms of the Open-Realty License as published by
 * Transparent Technologies; either version 1 of the License, or
 * (at your option) any later version.
 *
 * Open-Realty is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Open-Realty License for more details.
 * http://www.open-realty.org/license_info.html
 *
 * You should have received a copy of the Open-Realty License
 * along with Open-Realty; if not, write to Transparent Technologies
 * RR1 Box 162C, Kingsley, PA  18826  USA
 *
 * @author Ryan C. Bonham <ryan@transparent-tech.com>
 * @copyright Transparent Technologies 2004
 * @link http://www.open-realty.org Open-Realty Project
 * @link http://www.transparent-tech.com Transparent Technologies
 * @link http://www.open-realty.org/license_info.html Open-Realty License
 */

class propertyclass {
	function insert_property_class()
	{
		global $conn, $config, $lang;
		require_once($config['basepath'] . '/include/misc.inc.php');
		$misc = new misc();
		$display = '';

		if ($_POST['class_name']) {
			$class_name = $misc->make_db_safe($_POST['class_name']);
			$class_rank = $misc->make_db_safe($_POST['class_rank']);
			$sql = 'INSERT INTO ' . $config['table_prefix'] . 'class (class_name,class_rank) VALUES (' . $class_name . ',' . $class_rank . ')';
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}else {
				$new_class_id = $conn->Insert_ID();
			}
			if (isset($_POST['field_id']) && $_POST['field_id'] != '')
			{
				foreach ($_POST['field_id'] as $field_id)
				{
					$sql = 'INSERT INTO ' . $config['table_prefix_no_lang'] . 'classformelements (class_id,listingsformelements_id) VALUES ('.$new_class_id.','.$field_id.')';
					$recordSet2 = $conn->Execute($sql);
					if (!$recordSet2) {
						$misc->log_error($sql);
					}
				}
			}
			$display .= $lang['property_class_updated'] . '<br />';
			$display .= propertyclass::show_classes();
      
		} else {
    
			// Get Max rank
			$sql = 'SELECT max(class_rank) as max_rank FROM ' . $config['table_prefix'] . 'class';
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$rank = $recordSet->fields['max_rank'];
			$rank++;
			$display .= '
      
          <form class="form-horizontal" action="index.php?action=insert_property_class" method="POST">
  
              <legend>Create new property class type</legend>
              
                <!--' . $lang['property_class_name'] . ': <input type="text" value="" name="class_name" />-->
                <!--' . $lang['property_class_rank'] . ': <input type="text" value="' . $rank . '" name="class_rank" />-->
                    
                <div class="form-group has-feedback required">
                  <label for="inputClassName" class="col-sm-3 control-label">Class Name</label>
                  <div class="col-sm-5">
                    <input class="form-control" type="text" id="inputClassName" name="class_name" placeholder="Rental or Land or Business etc...." required="">
                  </div>
                </div>
           
                <div class="form-group has-feedback required">
                  <label for="inputClassRank" class="col-sm-3 control-label">Class Menu Order</label>
                  <div class="col-sm-3">
                    <input class="form-control" type="number" id="inputClassRank" name="class_rank" value="' . $rank . '" required="">
                    <div class="help-block"></div>
                  </div>
                </div>
            
      ';

			$sql = 'SELECT listingsformelements_id, listingsformelements_field_caption FROM ' . $config['table_prefix'] . 'listingsformelements ORDER BY listingsformelements_field_caption';
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
      
			$display .= '
      
        <div class="form-group">
          <div class="col-sm-offset-3 col-sm-9">

            <div class="table-responsive">
              <table class="table table-condensed table-hover">
                <thead>
                  <tr>
                    <th colspan="3">' . $lang['property_class_apply'] . '</th>
                  </tr>
                </thead>
                <tbody>
      ';
            
			$count = 1;
      $numcols = 3;
            
			$display .= '
              <tr>
      ';
      
			while (!$recordSet->EOF) {
				$field_id = $recordSet->fields['listingsformelements_id'];
				$field_caption = $recordSet->fields['listingsformelements_field_caption'];
        
				$display .= '
                  <td>
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" name="field_id[]" value="' . $field_id . '"> ' . $field_caption . '
                      </label>
                    </div>
                  </td>
        ';
        
				if ($count % $numcols == 0) {
					$display .= '
                </tr>
                ';
				}
				$count++;
        
			$recordSet->MoveNext();
			}
      
			$display .= '
                </tbody>
              </table>
            </div>
          
          </div>
        </div>
        
        <div class="form-group">
          <div class="col-sm-offset-3 col-sm-9">
            <button type="submit" class="btn btn-default">Save new class</button>
          </div>
        </div>

      </form>';
		}
		return $display;
	}
  
  
	function delete_property_class() {
		global $conn, $config, $lang;
		require_once($config['basepath'] . '/include/misc.inc.php');
		$misc = new misc();
		$display = '';
		if (isset($_GET['id'])) {
			$class_id = intval($_GET['id']);
			// Now remove any fields associated with the class that are no longer associtaed with any other classes
			// First we have to determine which form elements belong to other classes.
			$sql = "SELECT DISTINCT (listingsformelements_id) FROM " . $config['table_prefix_no_lang'] . "classformelements WHERE class_id <> $class_id";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$other_class_id = '';
			while (!$recordSet->EOF) {
				if ($other_class_id == '') {
					$other_class_id .= $recordSet->fields['listingsformelements_id'];
				}else {
					$other_class_id .= ',' . $recordSet->fields['listingsformelements_id'];
				}

				$recordSet->MoveNext();
			}
			if ($other_class_id == '') {
				$other_class_id = '0';
			}
			// Ok now grab a list of the id's to delete them from the listingformelements table.
			// Also delete them from the lass_form_elements.
			$sql = "SELECT DISTINCT (listingsformelements_id) FROM " . $config['table_prefix_no_lang'] . "classformelements WHERE class_id = $class_id and listingsformelements_id NOT IN ($other_class_id)";

			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$ids = '';
			while (!$recordSet->EOF) {
				if ($ids == '') {
					$ids .= $recordSet->fields['listingsformelements_id'];
				}else {
					$ids .= ',' . $recordSet->fields['listingsformelements_id'];
				}
				$recordSet->MoveNext();
			}
			if ($ids == '') {
				$ids = '0';
			}
			$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . "classformelements WHERE listingsformelements_id  IN ($ids)";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$sql = "SELECT listingsformelements_field_name FROM " . $config['table_prefix'] . "listingsformelements WHERE listingsformelements_id  IN ($ids)";
			$recordSet1 = $conn->Execute($sql);
			if (!$recordSet1) {
				$misc->log_error($sql);
			} while (!$recordSet1->EOF) {
				$field_name = $misc->make_db_safe($recordSet1->fields['listingsformelements_field_name']);
				// Delete All Translationf for this field.
				$configured_langs = explode(',', $config['configured_langs']);
				while (!$recordSet->EOF) {
					$listingsformelements_id = $recordSet->fields['listingsformelements_id'];
					foreach($configured_langs as $configured_lang) {
						$sql = "DELETE FROM " . $config['table_prefix_no_lang'] . $configured_lang . "_listingsformelements WHERE listingsformelements_id IN ($ids)";
						$recordSet = $conn->Execute($sql);
						if (!$recordSet) {
							$misc->log_error($sql);
						}
					}
				}
				// Cleanup any listingdbelemts entries from this field.
				$sql = "SELECT listingsdbelements_id FROM " . $config['table_prefix'] . "listingsdbelements WHERE listingsdbelements_field_name = $field_name";
				$recordSet = $conn->Execute($sql);
				if (!$recordSet) {
					$misc->log_error($sql);
				} while (!$recordSet->EOF) {
					$listingsdbelements_id = $recordSet->fields['listingsdbelements_id'];
					foreach($configured_langs as $configured_lang) {
						$sql = "DELETE FROM " . $config['table_prefix_no_lang'] . $configured_lang . "_listingsdbelements WHERE listingsdbelements_id = $listingsdbelements_id";
						$recordSet = $conn->Execute($sql);
						if (!$recordSet) {
							$misc->log_error($sql);
						}
					}
				}
				$recordSet1->MoveNext();
			}
			// Get all listings that are in this class only.
			$sql = "SELECT DISTINCT (listingsdb_id) FROM " . $config['table_prefix_no_lang'] . "classlistingsdb WHERE class_id <> $class_id";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$other_class_id = '';
			while (!$recordSet->EOF) {
				if ($other_class_id == '') {
					$other_class_id .= $recordSet->fields['listingsdb_id'];
				}else {
					$other_class_id .= ',' . $recordSet->fields['listingsdb_id'];
				}

				$recordSet->MoveNext();
			}
			if ($other_class_id == '') {
				$other_class_id = '0';
			}
			// Ok now grab a list of the listing id's to delete
			$sql = "SELECT DISTINCT (listingsdb_id) FROM " . $config['table_prefix_no_lang'] . "classlistingsdb WHERE class_id = $class_id and listingsdb_id NOT IN ($other_class_id)";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$ids = '';
			while (!$recordSet->EOF) {
				if ($ids == '') {
					$ids .= $recordSet->fields['listingsdb_id'];
				}else {
					$ids .= ',' . $recordSet->fields['listingsdb_id'];
				}
				$recordSet->MoveNext();
			}
			if ($ids == '') {
				$ids = '0';
			}
			// now that we have the listingids delete the listings and any associated listingsdbelements
			$configured_langs = explode(',', $config['configured_langs']);
			$listingsformelements_id = $recordSet->fields['listingsformelements_id'];
			foreach($configured_langs as $configured_lang) {
				$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . $configured_lang . "_listingsdb WHERE listingsdb_id  IN ($ids)";
				$recordSet = $conn->Execute($sql);
				if (!$recordSet) {
					$misc->log_error($sql);
				}
				$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . $configured_lang . "_listingsdbelements WHERE listingsdb_id  IN ($ids)";
				$recordSet = $conn->Execute($sql);
				if (!$recordSet) {
					$misc->log_error($sql);
				}
			}
			// Get all images and vtours and delete the images.
			// vtourimages_id, userdb_id, vtourimages_caption, vtourimages_file_name, vtourimages_thumb_file_name, vtourimages_description, listingsdb_id, vtourimages_rank, vtourimages_active
			$sql = "SELECT  vtourimages_thumb_file_name, vtourimages_file_name FROM  " . $config['table_prefix'] . "vtourimages WHERE listingsdb_id  IN ($ids)";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			} while (!$recordSet->EOF()) {
				$file_name = $recordSet->fields['vtourimages_file_name'];
				$thumb_name = $recordSet->fields['vtourimages_thumb_file_name'];
				@unlink("$config[vtour_upload_path]/$file_name");
				@unlink("$config[vtour_upload_path]/$file_name");
				$recordSet->MoveNext();
			}
			// listingsimages_id, userdb_id, listingsimages_caption, listingsimages_file_name, listingsimages_thumb_file_name, listingsimages_description, listingsdb_id, listingsimages_rank, listingsimages_active
			$sql = "SELECT  listingsimages_thumb_file_name, listingsimages_file_name FROM  " . $config['table_prefix'] . "listingsimages WHERE listingsdb_id  IN ($ids)";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			} while (!$recordSet->EOF()) {
				$file_name = $recordSet->fields['listingsimages_file_name'];
				$thumb_name = $recordSet->fields['listingsimages_thumb_file_name'];
				@unlink("$config[listings_upload_path]/$file_name");
				@unlink("$config[listings_upload_path]/$file_name");
				$recordSet->MoveNext();
			}
			// Now delete DB records of the images and vtours for all langs.
			foreach($configured_langs as $configured_lang) {
				$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . $configured_lang . "_listingsimages WHERE listingsdb_id  IN ($ids)";
				$recordSet = $conn->Execute($sql);
				if (!$recordSet) {
					$misc->log_error($sql);
				}
				$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . $configured_lang . "_vtourimages WHERE listingsdb_id  IN ($ids)";
				$recordSet = $conn->Execute($sql);
				if (!$recordSet) {
					$misc->log_error($sql);
				}
			}
			// Now we jsut need to delete all associates from the classformelements and default_classlistingsdb and class tables.
			$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . "classformelements WHERE class_id = $class_id";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . "classlistingsdb WHERE class_id = $class_id";
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$configured_langs = explode(',', $config['configured_langs']);
			$listingsformelements_id = $recordSet->fields['listingsformelements_id'];
			foreach($configured_langs as $configured_lang) {
				$sql = "DELETE FROM  " . $config['table_prefix_no_lang'] . $configured_lang . "_class WHERE class_id = $class_id";
				$recordSet = $conn->Execute($sql);
				if (!$recordSet) {
					$misc->log_error($sql);
				}
			}
			$display .= $lang['property_class_deleted'] . '<br />';
			$display .= propertyclass::show_classes();
		}
		return $display;
	}
  
  
	function modify_property_class() {
		global $conn, $config, $lang;
		require_once($config['basepath'] . '/include/misc.inc.php');
		$misc = new misc();
		$display = '';
		if (isset($_GET['id'])) {
			$display .= '<span class="section_header">' . $lang['property_class_editor'] . '</span><br /><br />';
			$display .= '<form action="index.php?action=modify_property_class" method="POST"><fieldset><legend>' . $lang['property_class_update'] . '</legend>';
			$class_id = intval($_GET['id']);
			$sql = 'SELECT class_name, class_rank FROM ' . $config['table_prefix'] . 'class WHERE class_id = ' . $class_id;
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			} while (!$recordSet->EOF) {
				$class_name = $misc->make_db_unsafe($recordSet->fields['class_name']);
				$class_rank = $misc->make_db_unsafe($recordSet->fields['class_rank']);
				$display .= ''.$lang['property_class_name_update'].'<input type="text" value="' . $class_name . '" name="class_name" />';
				$display .= ''.$lang['property_class_rank_update'].'<input type="text" value="' . $class_rank . '" name="class_rank" /><input type="hidden" name="class_id" value="' . intval($_GET['id']) . '" />';
				$recordSet->MoveNext();
			}
			$display .= ' <input type="submit" value="'.$lang['submit'].'" /></fieldset></form>';
		}elseif ($_POST['class_id']) {
			$class_id = $misc->make_db_safe($_POST['class_id']);
			$class_name = $misc->make_db_safe($_POST['class_name']);
			$class_rank = $misc->make_db_safe($_POST['class_rank']);
			$sql = 'UPDATE ' . $config['table_prefix'] . 'class SET class_name = ' . $class_name . ',class_rank = ' . $class_rank . ' WHERE class_id = ' . $class_id;
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			}
			$display .= ''.$lang['property_class_updated'].'<br />';
			$display .= propertyclass::show_classes();
		}

		return $display;
	}
  
  
	function show_classes() {
		global $conn, $config, $lang;
		require_once($config['basepath'] . '/include/misc.inc.php');
		$misc = new misc();
    
		// Verify User is an Admin
		$security = login::loginCheck('edit_property_classes', true);
		$display = '';
    
		if ($security === true) {
			$display .= '
      <h1>' . $lang['property_class_editor'] . '</h1>      
        <div class="table-responsive">
          <table class="table table-condensed table-hover">
            <thead>
              <tr>
                <th>'.$lang['property_class_id'] .'</th>
                <th>'.$lang['property_class_name'] .'</th>
                <th>Menu order</th>
                <th>Actions</th>
              </tr>
            <tbody>
      ';      
      
      
			$sql = 'SELECT * FROM ' . $config['table_prefix'] . 'class ORDER BY class_rank';
			$recordSet = $conn->Execute($sql);
			if (!$recordSet) {
				$misc->log_error($sql);
			} while (!$recordSet->EOF) {
				$class_name = $misc->make_db_unsafe($recordSet->fields['class_name']);
				$class_id = $misc->make_db_unsafe($recordSet->fields['class_id']);
				$class_rank = $misc->make_db_unsafe($recordSet->fields['class_rank']);
				$display .= '
                <tr>
                  <td>'.$class_id.'</td>
                  <td>'.$class_name.'</td>
                  <td>'.$class_rank.'</td>
                  <td>
                  
                    <!--<a href="index.php?action=delete_property_class&amp;id='.$class_id.'" onclick="return confirmDelete(\'' . $lang['delete_prop_class'] . '\')">'.$lang['delete'] .'</a>-->
                    
                    <a class="btn btn-primary btn-xs" href="index.php?action=modify_property_class&amp;id='.$class_id.'" role="button">Edit</a>
                    <form action="index.php?action=delete_property_class" method="post" id="delete" accept-charset="UTF-8">
                      <input type="hidden" name="delete" value="yes">
                      <input type="hidden" name="id" value="'.$class_id.'">
                      <button type="button" class="btn btn-default btn-xs" name="ok" value="Delete" data-toggle="modal" data-target="#confirmDelete" data-title="Confirm Deletion" data-message="Are you sure you want to delete this class? ' . $class_id . ' ' . $class_name . '">Delete</button>
                    </form>
                
                  </td>
                </tr>
                ';
				$recordSet->MoveNext();
			}
			$display .= '
              </tbody>
            </table>
      ';
			$display .= '<br /><a href="index.php?action=insert_property_class">' . $lang['property_class_insert'] . '</a>';
		}else {
		}
		return $display;
	}
}

?>