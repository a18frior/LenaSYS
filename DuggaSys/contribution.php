<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Contribution</title>


	<!--<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">-->
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="contribution.js"></script>
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">

<!--the inline CSS was moved to the file shared/css/style.css-->

</head>
<body>

	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>
<div class="tabContainer">
	<button class="tablink" onclick="openPage('Ranking', this)">Ranking</button>
	<button class="tablink" onclick="openPage('barDiagram', this)" id="defaultOpen">Bar Diagram</button>
	<button class="tablink" onclick="openPage('lineDiagram', this)">Line Diagram</button>
	<button class="tablink" onclick="openPage('dailyActivities', this)">Daily activities</button>
	<button class="tablink" onclick="openPage('allContributions', this)">All contributions</button>
</div>
	<!-- content START -->
	<div id="content">

	</div>
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>

</body>
</html>
