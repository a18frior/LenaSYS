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
	<td class='hamburger hamburgerClickable'>
		<div tabindex='0' class='package'>
			<div id='hamburgerIcon' class='submit-button hamburger' onclick='hamburgerChange();bigMac();' >
				<div class='container'>
					<div class='bar1'></div>
					<div class='bar2'></div>
					<div class='bar3'></div>
				</div>
			</div>
		</div>
		<div class='hamburgerMenu'>
			<ul class='hamburgerList'>
				<li class='results'>
					<button class='submit-button menuButton Ranking' onclick='closeWindows(); navigatePage("resulted.php");' title=''>Ranking</button>
				</li>
				<li class='tests'>
						<button class='submit-button menuButton lineDiagram' onclick='closeWindows(); navigatePage("duggaed.php");' title='Show tests'>Line Diagram</button>
				</li>
				<li class='files'>
						<button class='submit-button menuButton barDiagram' onclick='closeWindows(); navigatePage("fileed.php");' title='Show files'>Bar Diagram</button>
				</li>
				<li class='access'>
						<button class='submit-button menuButton access' onclick='closeWindows(); navigatePage("accessed.php");' title='Give students access to the selected version'>Access</button>
				</li>
			</ul>
		</div>
	</td>

	<td class='ranking menuButton' style='display: inline-block;'>
		<div class='results menuButton'>
			<input type='button' value='Ranking' class='submit-button' title='Show the ranking in a table' onclick='navigatePage("resulted.php");' />
		</div>
	</td>
	<td class='lineDiagram menuButton' style='display: inline-block;'>
		<div class='tests menuButton'>
			<input type='button' value='Line Diagram' class='submit-button' id='testbutton' title='Line diagram of contributions' onclick='navigatePage("duggaed.php")'/>
		</div>
	</td>
	<td class='barDiagram menuButton' style='display: inline-block;'>
		<div class='files menuButton'>
			<input type='button' value='Bar Diagram' class='submit-button' title='Bar diagram of contributions' onclick='navigatePage("fileed.php")'/>
		</div>
	</td>
	<td class='Contributions menuButton' style='display: inline-block;'>
		<div class='access menuButton'>
			<input type='button' value='Contributions' class='submit-button' title='See all of your contributions' onclick='navigatePage("accessed.php");'/>
		</div>
	</td>


	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">

	</div>
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>

</body>
</html>
