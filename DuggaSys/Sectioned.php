<?php
include_once("../../coursesyspw.php");	
include_once("../Shared/database.php");
include_once("../Shared/courses.php");
include_once("../Shared/sessions.php");	
include_once("basic.php");

dbConnect();
session_start();
?>
<!DOCTYPE html>
<html>
	<head>
			<!--<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />-->
            <link type="text/css" href="css/style.css" rel="stylesheet" />
			<link type="text/css" href="css/duggasys.css" rel="stylesheet" />
			<script type="text/javascript" src="../Shared/js/jquery-1.11.0.min.js"></script>
			<script src="http://code.jquery.com/ui/1.9.1/jquery-ui.js"></script>
			<script type="text/javascript" src="duggasys.js"></script>
			<script type="text/javascript" src="startpage.js"></script>
            <script type="text/javascript" src="../CodeViewer/js/tooltips.js"></script>
			<script>
				setupLogin();
				<?php
					//Sets up a session kind variable in javascript depending on the users rights on the course	
					if(isset($_GET['courseid'])&&isset($_GET['vers'])){
							echo 'var courseID="'.$_GET['courseid'].'";';
							echo 'var vers="'.$_GET['vers'].'";';
					}else{
							echo 'var courseID="NONE!";';
							echo 'var vers="NONE!";';					
					}

					if(array_key_exists('uid', $_SESSION)) {
						echo 'var sessionkind=' . (hasAccess($_SESSION['uid'], $_GET['courseid'], 'w') ? 1 : 0) .';';				
					} else {
						echo 'var sessionkind=0';
					}
				?>			
				
				function AJAXServiceSection(opt,para)
				{
						$.ajax({url: "SectionedService.php", type: "POST", data: "coursename="+courseID+"&vers="+vers+"&opt="+opt+para, dataType: "json", success: returnedSection});
				}

			</script>
            
            <!--Linkans fula meddelande som kommer upp när du har gjort en dragNdrop-->
	<div id="dragupdate"></div>
	</head>
<div id="content">
<?php
		if(isset($_GET['courseid'])&&isset($_GET['vers'])){
				$courseID=$_GET['courseid'];
				if(courseexists($courseID)){
						// If course exists - check login credentials
						// Logged in and with credentials - show full editor otherwise show viewer version 

						if(checklogin()){
							$ha=hasAccess($_SESSION['uid'], $courseID, 'w');
							if($ha){
										// Allowed to edit this course
										editsectionmenu(true);
										?>
										<script>
											setupDrag();
										</script>
<?php
							} else {
										// No editing
										editsectionmenu(false);
							}
						}else{
								editsectionmenu(false);
						}			
				} else {
						// Print Warning If course does not exist!
						bodywarning("This course does not seem to exist!");
				}
		}else{
						bodywarning("This course does not seem to exist!");
		}
		loginwins();

?>
</div>		
</html>


<!--Place tooltips on all objects with a title-->
<script>
    $( document ).ready(function() {
        setTimeout(function() {
            $("*[title]").tooltips();
        }, 800);
    });
</script>
