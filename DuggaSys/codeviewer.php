<?php
	session_start();
	include_once("../../coursesyspw.php");
	include_once("../Shared/basic.php");
	include_once("../Shared/sessions.php");
	include_once("../Shared/database.php");
	include_once("../Shared/courses.php");
	// Database connection
	pdoConnect();
	
	// Fetch examplename from database to use for title		
	$exampleid = getOPG('exampleid');		
	$query = $pdo->prepare( "SELECT examplename FROM codeexample WHERE exampleid = :exampleid;");		
	$query->bindParam(':exampleid', $exampleid);		
	$query-> execute();		
			
	$row = $query -> fetch(PDO::FETCH_ASSOC);		
	$exampleName = $row['examplename'];		
	//Title used for the codeviewer page		
	$title = $exampleName;
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title><?php echo $title; ?></title>
		<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
		<link type="text/css" href="../Shared/css/style.css" rel="stylesheet" />
		<link type="text/css" href="../Shared/css/whiteTheme.css" rel="stylesheet" />
		<link type="text/css" href="../Shared/css/codeviewer.css" rel="stylesheet" />
		<link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet" />
		<link rel="shortcut icon" href="../Shared/icons/placeholder.ico"/>
		<script type="text/javascript" src="../Shared/markdown.js"></script>
		<script type="text/javascript" src="../Shared/js/jquery-1.11.0.min.js"></script>
		<script type="text/javascript" src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
		<script type="text/javascript" src="../Shared/dugga.js"></script>
		<script type="text/javascript" src="codeviewer.js"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>

<!--
Code Viewer V5.20 (CV5)  

Version History

 1.0	2010       - 	Code viewer version 1 - mostly manual with many issues
 2.0    2012       - 	Improved code viewer code by A. Grahn and J. Grimling
 3.0    2013-08-10 - 	Refactoring of existing code viewer (v1 and v2) base code together with working css demonstrator for independent scrolling windows
 3.01   2013-08-15 - 	Cockford parser implemented for c-like languages
 3.02   2013-08-16 - 	Improved back-end using database definition, ideas and code from WEBUG/DVP project 2013
			Forward/Backward
                        Code
                        File list from upload directory 
                        Name of Example                        
 3.03    2013-08-18 - 	First iteration of back-end 
 3.05    2013-08-21 - 	Added new features to back-end
 			Separate tables for Important words and descriptions
 			Fields for play link and chosen wordlist
 			Updates of database from back-end 
 			Navigation using arrows (dropdown still missing)
 3.06	2013-08-21 - 	Create new example and save description 
 3.07   2013-08-22 - 	Section Editor
 3.08   2013-08-25 - 	Section Editor Back-End finished and more minor bug fixes
			Linked to external CSS anf JS
 3.09   2013-08-30 - 	Login / Logout
                     	Viewer Functionality if not logged in
 3.10	2013-10-10 - 
 4.00   2014-05-30 - 	Release version from WEBUG/DVP project 2013
 5.00   2014-10-30 - 	Redacted version of 4.00
 5.10	2015-02-27 - 	Fixes for duggasys form
 5.20	2015-05-05 -	Added feature resizable windows
			Updated design of edit window
			Updated database with real data
			Cleaning of code
			Documentation of functions added
Bugs:
	Some examples are not properly functioning

Fixed Bugs:
Missing/desired Features:
	Collapsible code
	Changing language - All Strings in File that can be translated to fit other languages.... including language change.

Testing Link: 
	codeviewer.php?exampleid=1&courseid=1&cvers=2013
-->

	<body onload="setup();">
		<!-- content START -->
		<div id="content">
		<?php 
			$exampleid = getOPG('exampleid');
			$courseID = getOPG('courseid');
			$cvers = getOPG('cvers');
			
			// Fetch content from database
			$query = $pdo->prepare( "SELECT public FROM codeexample WHERE exampleid = :exampleid';");
			$query->bindParam(':exampleid', $exampleid);
			$query-> execute();
			$row = $query -> fetch(PDO::FETCH_ASSOC);
			$public=$row['public'];	// Gets the info if the course are in public mode.
			$noup="SECTION"; 	// Is called for in Shared/navheader.php, used to call for generic Home/Backbuttons
			$codeviewer = true;	// Is used in navheader.php@line52: Makes it possible to view the content in the code example. If codeviewer is allocated "false" then one of the error message is gong to be presented.
			$codeviewerkind=false;	// Is used in navheader.php@line61/62: This checks if the user have rights to change the settings in codeviewer by using true or false. True means yes, the user have the rights. Codeviewerkind is in use in navheader.php to make the settings button visible.
			
			// userid is set, either as a registered user or as guest
			// TODO: Check if possible bug; userid is set to 1 if guest in codeviewerService.php, should userid be set there or here?
			if(isset($_SESSION['uid'])){
				$userid=$_SESSION['uid'];	// userid of registered users
			}else{
				$userid="00";		// Guest ID is intentionally different from registered users, it begins with a double-zero to indicate guest
			}
			
			// Gets username based on uid
			$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
			$query->bindParam(':uid', $userid);
			$query-> execute();

			// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set
			while ($row = $query->fetch(PDO::FETCH_ASSOC)){
				$username = $row['username'];
			}
			if($userid == "00"){
				$username = "Guest" . $userid . rand(0,50000); // Guests have a random number between 0 and 50k added, this means there's a very small chance some guests have the same ID. These are only used for logging at the moment so this should not be an issue
			}
			// Logs users who view example, along with the example they have viewed
			logUserEvent($username, EventTypes::DuggaRead, $exampleid." ".$courseID." ".$cvers);

			// This checks if courseID and exampleid is not UNK and if it is UNK then it will appliances codeviewer "false" and a error message will be presented
			if($courseID!="UNK"&&$exampleid!="UNK"){
				//checks if $courseid exists. 
				if(courseexists($courseID)){ 
					// If the course exists- check login credentials
					// Logged in and with credentials - show full editor otherwise show viewer version 
					if(checklogin()){
						$ha=getAccessType($_SESSION['uid'], $courseID);
						if($ha == "w"){
							// Allow to edit this course (full editor)
							$codeviewerkind=true;
						}else{
							// Not allowed to edit (viewer version) 
							$codeviewerkind=false;
						}
						include '../Shared/navheader.php';
					}else{	
						// if the course isn't public then a error message will display
						if($public == 0){
							$codeviewerkind=false;									
							include '../Shared/navheader.php';
							echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have to be logged in to view this code example.</div>";
						}else{
							$codeviewerkind=false;
							include '../Shared/navheader.php';
						}
					}
				}else{
					// This will show an error message if the course id doesnt exist.
					$codeviewer = false;
					include '../Shared/navheader.php';
					// Print Warning If course does not exist!
					echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Course does not seem to exist!</div>";
				}
			}else{
				// If $courseID is "UNK" and $exampleid is also "UNK"
				// This will show an error message if the courseid or the Code Example doesnt exist. 
				$codeviewer = false;
				include '../Shared/navheader.php';
				echo "<div class='err'><span style='font-weight:bold;'>Bummer!</span> Course or Code Example does not seem to exist! <a href='./codeviewer.php?exampleid=1&courseid=1&cvers=2013'>Click here</a> to redirect to example 1.</div>";
			}
			//This text is always shown at the beginning of the page load but is removed if all checks succeeds and all is well. It also serves as error message is all checks weren't successful
			if($codeviewer) echo "<div id='div2'>If this text remains this means there is an uncaught error. Please contact the administrators</div>";
			echo "</div>";
		?>						
		<!-- Dropdowns START -->
		<span id='backwdrop' style='left:40px;display:none;' class='dropdown dropdownStyle backwdrop'><div class='dropdownback dropdownbackStyle'>Backw</div><span id='backwdropc'>oii</span></span>
		<span id='forwdrop' style='left:100px;display:none;' class='dropdown dropdownStyle forwdrop'><div class='dropdownback dropdownbackStyle'>Forw</div><span id='forwdropc'>bii</span></span>
		<!-- Dropdowns END -->
		<!-- Example Content Cog Wheel Dialog START -->
		<div id='editContent' class='loginBox' style='width:464px;display:none;'>
			<div class='loginBoxheader'>
				<h3>Edit Content</h3>
				<div onclick='closeEditContent();'>x</div>
			</div>	
			<table width="100%" style="table-layout:fixed;">
				<tr>
					<td>Title:</td>
					<td>Kind:</td>
				</tr>
				<tr>
					<td><input class='form-control textinput' type='text' id='boxtitle' value='Title' /></td>		
					<td><select id='boxcontent' onchange='changeDirectory(this);'><option value='DOCUMENT'>Document</option><option value='CODE'>Code</option><option value='IFRAME'>Preview</option></select></td>
				</tr>
				<tr>
					<td>Wordlist:</td>
					<td>File:</td>
				</tr>
				<tr>
					<td><select id='wordlist'></select></td>
					<td><select id='filename'></select></td>
				</tr>
				<tr>
					<td>Font size:</td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td><select id='fontsize'><?php for($i = 9; $i <= 22; $i++) echo '<option value="' . $i . '">' . $i .' px</option>'; ?></select></td>
					<td>&nbsp;</td>
				</td>
				</tr>
				<tr>
					<td>Important Rows:</td>
				</tr>
				<tr>
					<td colspan="1"><select id='improws'></select></td>
					<td colspan="1"><input style="width:32px; float: none;" class='submit-button' type='button' value='-' onclick='editImpRows("-");' /></td>
				</tr>		
				<tr>
					<td colspan="1"><input style="width:91px;" class='form-control textinput' min='0' type='number' id='improwfrom' placeholder='From #' />&nbsp;-&nbsp;<input style="width:91px;" class='form-control textinput' min='0' type='number' id='improwto' placeholder='To #' /></td>
					<td colspan="1"><input style="width: 32px; float: none;" class='submit-button' type='button' value='+' onclick='editImpRows("+");' /></td>
				</tr>		
			</table>
			<table width="100%">
				<tr>
					<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateContent();' /></td>
				</tr>
			</table>
		</div>
		<!-- Example Content Cog Wheel Dialog END -->
		<script>
		
		$(document).ready(function(){
  $('.md-dialogButton').wrap('<div class="button-wrap"></div>');
});

$(document).delegate('.md-dialogButton', 'click', function(e) {
    parent = $(this).parent();
    e.preventDefault();
  
    //create .ink element if it doesn't exist
    if (parent.find(".ink").length == 0) {
      parent.prepend("<span class='ink'></span>");
    }

    ink = parent.find("> .ink");
    //incase of quick double clicks stop the previous animation
    ink.removeClass("animate");

    //set size of .ink
    if (!ink.height() && !ink.width()) {
      //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
      d = Math.max(parent.outerWidth(), parent.outerHeight());
      ink.css({
        height: d,
        width: d
      });
    }

    //get click coordinates
    //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
    x = e.pageX - parent.offset().left - ink.width() / 2;
    y = e.pageY - parent.offset().top - ink.height() / 2;

    //set the position and add class .animate
    ink.css({
      top: y + 'px',
      left: x + 'px'
    }).addClass("animate");

  });
		
		var isResizing = false,
		lastDownX = 0;
		lastDownY = 0;

$(function () {
    var container = $('body'),
        //left = $('#left_panel'),
        right = $('#editExample'),
        handleRight = $('#editDragRight');
				handleLeft = $('#editDragLeft');

				handleRight.on('mousedown', function (e) {
		        isResizing = true;
						lastDownX = e.clientX;
						lastDownY = e.clientY;
		    });
				handleLeft.on('mousedown', function (e) {
		        isResizing = true;
		        lastDownX = e.clientX;
						lastDownY = e.clientY;
		    });

    $(document).on('mousemove', function (e) {
        // we don't want to do anything if we aren't resizing.
        if (!isResizing) 
            return;
        
        var offsetRight = container.width() - (e.clientX - container.offset().left);
				console.log(offsetRight);

        //left.css('right', offsetRight);
        right.css('width', offsetRight);
    }).on('mouseup', function (e) {
        // stop resizing
        isResizing = false;
    });
});
		</script>
		
		<!-- Code Example Cog Wheel Dialog START -->
		<div id="overlay" style="display:none;"></div>		
		<div id='editExample' class='md-dialog' style=''>
			<div id="editDragRight" style="position: absolute;right: -4px;top: 0;bottom: 4px;width: 8px;cursor: w-resize; "></div>
			<div id="editDragLeft" style="position: absolute;left: -4px;top: 0;bottom: 0;width: 8px;cursor: w-resize;"></div>			
			<div id="editDragBottom" style="position: absolute;left: 4px;right: 4px;bottom: -4px;height: 8px;cursor: n-resize;"></div>
			<div id="editDragRightQ" style="position: absolute;right: -4px;bottom: -4px;width: 8px;height:8px;cursor: se-resize;"></div>			
			<div id="editDragLeftQ" style="position: absolute;left: -4px;height: 8px;bottom: -4px;width: 8px;cursor: sw-resize;"></div>
			<div class='md-dialogBoxheader'>
				<h3>Edit Example</h3>
				<div onclick='closeEditExample();'>x</div>
			</div>
			<!--<div class="md-dialogFieldset">-->
				<!--<div class="md-dialogFieldsetCaption"> Example Info </div>-->
				<div class="md-dialogFlexRow">
					<label class="md-dialogFlexItem">Section Title:<input class='form-control textinput' type='text' id='secttitle' value='&lt;Section Title&gt;' /></label>		
					<label class="md-dialogFlexItem">Example Title:<input class='form-control textinput' type='text' id='title' value='&lt;Title&gt;' /></label>		
				</div>
				<div class="md-dialogFlexRow">
					<label class="md-dialogFlexItem">Previous Example:<select id='before' style="width:100%"></select></label>		
					<label class="md-dialogFlexItem">Next Example:<select id='after' style="width:100%"></select></label>		
				</div>

				<div class="md-dialogFlexRow md-dialogFlexGrow">
					<label class="md-dialogFlexItem">Play Link:<input class='form-control textinput' type='text' id='playlink' value='User Name' /></label>
					<div class="md-dialogFlexCol md-dialogFlexItem">
								<label>Important Words:</label>
								<div class="md-dialogFlexItem">
									<input class="md-dialogFlexGrow" style="border:0;" class='form-control textinput' type='text' id='impword' placeholder="<Important word>" />
									<input style="width:32px;margin-top:3px;margin-bottom:3px;" class='md-dialogButton' type='button' value='+' onclick='editImpWords("+");' />
								</div>
								<div class="md-dialogFlexItem">
									<select class="md-dialogFlexGrow" style="width:100%; border:0; margin-top:3px;" id='impwords'></select>
									<input style="width:32px;margin-top:3px;" class='md-dialogButton' type='button' value='-' onclick='editImpWords("-");' />
								</div>		
					</div>
				<!--</div>-->
				</div>
				<div class="md-dialogFlexRow md-dialogFlexRight">
						<label><input class='md-dialogButton' type='button' value='Save' onclick='updateExample();' /></label>
				</div>

		</div>
		<!-- Code Example Cog Wheel Dialog END -->
		<div id='chooseTemplate' class='loginBox' style='width:464px;display:none;'>
			<div class='loginBoxheader'>
				<h3>Edit Example</h3>
				<div onclick='closeTemplateWindow();'>x</div>
			</div>
			<table width="100%">
				<tr>
					<td id="templat1" class="tmpl"><input id="templateno" type="hidden" value="0" />
						<img class='templatethumbicon wiggle' onclick='changetemplate("1");' src='../Shared/icons/template1_butt.svg' />
					</td>
					<td id="templat2" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("2");' src='../Shared/icons/template2_butt.svg' /></td>
					<td id="templat3" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("3");' src='../Shared/icons/template3_butt.svg' /></td>
					<td id="templat4" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("4");' src='../Shared/icons/template4_butt.svg' /></td>
					<td id="templat5" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("5");' src='../Shared/icons/template5_butt.svg' /></td>
					<td id="templat6" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("6");' src='../Shared/icons/template6_butt.svg' /></td>
					<td id="templat7" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("7");' src='../Shared/icons/template7_butt.svg' /></td>
					<td id="templat8" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("8");' src='../Shared/icons/template8_butt.svg' /></td>
					<td id="templat9" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("9");' src='../Shared/icons/template9_butt.svg' /></td>
				</tr>		
			</table>
			<table width="100%">
				<tr>
					<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateTemplate();' /></td>
				</tr>
			</table>
		</div>
		<div id="underlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;opacity:0.6;background-color:#000; z-index:8000;"></div>
		<!-- Template Choosing Box -->
		<?php
			// Adding page logging 
			logExampleLoadEvent($courseID, $exampleid, EventTypes::pageLoad);
			
			include '../Shared/loginbox.php';
		?>		
	</body>
</html>
