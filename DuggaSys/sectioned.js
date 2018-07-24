// -------------==============######## Globals ###########==============-------------

var querystring = parseGet();
var retdata;
var newversid;
var active_lid;
var isClickedElementBox = false;
var testsAvailable;
var nameSet = false;
var hoverMenuTimer;
var xelink;

// Stores everything that relates to collapsable menus and their state.
var menuState = {
	idCounter: 0, 		/* Used to give elements unique ids. This might? brake
						   because an element is not guaranteed to recieve the
						   same id every time. */
	hiddenElements: [], // Stores the id of elements who's childs should be hidden.
	arrowIcons: [] 		// Stores ids of arrows whose state needs to be remembered.
}

function setup() {
	AJAXService("get", {}, "SECTION");
}

// -------------==============######## Help Functions ###########==============-------------

//----------------------------------------------------------------------------------
// makeoptions: Prepares a dropdown list with highlighting of previously selected item
//----------------------------------------------------------------------------------

function makeoptions(option,optionlist,valuelist)
{
		var str="";
		for(var i=0;i<optionlist.length;i++){
				str+="<option ";
				if(valuelist[i]==option){
						str+="selected='selected' ";
				}
				str+="value='"+valuelist[i]+"'>"+optionlist[i]+"</option>";
		}
		return str;
}

//----------------------------------------------------------------------------------
// makeoptionsItem: Prepares a dropdown list specifically for items such as code examples / dugga etc
//----------------------------------------------------------------------------------

function makeoptionsItem(option,optionlist,optionstring,valuestring)
{
		var str="";
		for(var i=0;i<optionlist.length;i++){
				str+="<option ";
				if(optionlist[i][valuestring]==option){
						str+="selected='selected' ";
				}
				str+="value='"+optionlist[i][valuestring]+"'>"+optionlist[i][optionstring]+"</option>";
		}
		alert(str);
		return str;
}

//----------------------------------------------------------------------------------
// makeparams: Help function for hassle free preparation of a clickable param list 
//----------------------------------------------------------------------------------

function makeparams(paramarray)
{
		var str="";
		for(var i=0;i<paramarray.length;i++){
				if(i>0) str+=",";
				str+="\""+paramarray[i]+"\"";
		}
		return str;
}

//----------------------------------------------------------------------------------
// navigatePage: Local function for converting static page navigation to dynamic
//----------------------------------------------------------------------------------

function navigatePage(pagename)
{
		changeURL(pagename+"?cid=" + querystring['courseid'] + "&coursevers="+ querystring['coursevers']);
}

// -------------==============######## Dialog Handling ###########==============-------------

//----------------------------------------------------------------------------------
// selectItem: Prepare item editing dialog after cog-wheel has been clicked
//----------------------------------------------------------------------------------

function selectItem(lid, entryname, kind, evisible, elink, moment, gradesys, highscoremode, comments, group = "UNK") {
	nameSet = false;
	if (entryname == "undefined") entryname = "New Header";
	if (kind == "undefined") kind = 0;
	xelink = elink;
	// Display Select Marker
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$("#I" + lid).css("border", "2px dashed #FC5");
	$("#I" + lid).css("box-shadow", "1px 1px 3px #000 inset");

	// Set GradeSys, Kind, Visibility, Tabs (tabs use gradesys)
	$("#gradesys").html(makeoptions(gradesys,["-","U-G-VG","U-G","U-3-4-5"],[0,1,2,3]));
	$("#type").html(makeoptions(kind,["Header","Section","Code","Test","Moment","Link","Group Activity","Message"],[0,1,2,3,4,5,6,7]));	
	$("#visib").html(makeoptions(evisible,["Hidden","Public","Login"],[0,1,2]));
	$("#tabs").html(makeoptions(gradesys,["0 tabs","1 tabs","2 tabs","3 tabs","end","1 tab + end","2 tabs + end"],[0,1,2,3,4,5,6]));
	$("#highscoremode").html(makeoptions(highscoremode,["None","Time Based","Click Based"],[0,1,2]));	
	$("#group").html("<option value='UNK'>Select Group</option>"+makeoptionsItem(group,retdata['groups'],"groupName","groupID"));
	
	// Set Link
	$("#link").val(elink);	
	if(kind==2){
			$("#link").html(makeoptionsItem(xelink,retdata['codeexamples'],'exampleid','sectionname'));		
	}else if(kind==3){
			$("#link").html(makeoptionsItem(xelink,retdata['duggor'],'id','qname'));		
	}else if(kind==5){
			$("#link").html(makeoptionsItem(xelink,retdata['links'],'filename','filename'));		
	}else{
			$("#link").html("<option value='-1'>-=# Not Applicable #=-</option>");		
	}
	
	// Set Moments - requires iteration since we only process kind 4
	str = "";
	if (retdata['entries'].length > 0) {

		// Account for null
		if (moment == "") str += "<option selected='selected' value='null'>&lt;None&gt;</option>"
		else str += "<option value='null'>&lt;None&gt;</option>";

		// Account for rest of moments!
		for (var i = 0; i < retdata['entries'].length; i++) {
			var item = retdata['entries'][i];
			if (item['kind'] == 4) {
				if (parseInt(moment) == parseInt(item['lid'])) str += "<option selected='selected' "
					+ "value='" + item['lid'] + "'>" + item['entryname'] + "</option>";
				else str += "<option value='" + item['lid'] + "'>" + item['entryname'] + "</option>";
			}
		}
	}
	$("#moment").html(str);

	// Set Name
	$("#sectionname").val(entryname);
	$("sectionnamewrapper").html("<input type='text' class='form-control textinput' id='sectionname' value='" + entryname + "' style='width:448px;'/>");

	// Set Comment
	$("#comments").val(comments);
	$("sectionnamewrapper").html("<input type='text' class='form-control textinput' id='comments' value='" + comments + "' style='width:448px;'/>");

	// Set Lid
	$("#lid").val(lid);

	// Display Dialog
	$("#editSection").css("display","flex");

}

//----------------------------------------------------------------------------------
// changedType: When kind of section has been changed we must update dropdown lists accordingly
//----------------------------------------------------------------------------------

function changedType(kind)
{
		// Prepares option list for code example (2)/dugga (3) dropdown/links (5) / Not applicable
		if(kind==2){
				$("#link").html(makeoptionsItem(xelink,retdata['codeexamples'],'exampleid','sectionname'));		
		}else if(kind==3){
				$("#link").html(makeoptionsItem(xelink,retdata['duggor'],'id','qname'));		
		}else if(kind==5){
				$("#link").html(makeoptionsItem(xelink,retdata['links'],'filename','filename'));		
		}else{
				$("#link").html("<option value='-1'>-=# Not Applicable #=-</option>");		
		}
}

//----------------------------------------------------------------------------------
// showEditVersion: Displays Edit Version Dialog
//----------------------------------------------------------------------------------

function showEditVersion(versid, versname, startdate, enddate) {
	startdate = new Date(startdate)
	enddate = new Date(enddate)
	var startHour = startdate.getHours()
	var startMinute = startdate.getMinutes()
	var endHour = enddate.getHours()
	var endMinute = enddate.getMinutes()

	startdate = getDateFormat(startdate);
	enddate = getDateFormat(enddate);

	$("#eversname").val(versname);
	$("#eversid").val(versid);
	$("#estartdate").val(startdate);
	$("#eenddate").val(enddate);
	$("#hourPickerStartEditVersion").val(startHour);
	$("#minutePickerStartEditVersion").val(startMinute);
	$("#hourPickerEndEditVersion").val(endHour);
	$("#minutePickerEndEditVersion").val(endMinute);
	$("#editCourseVersion").css("display", "flex");
}


function displaymessage() {
	$(".messagebox").css("display", "block");
}

// Show the hamburger menu
function bigMac() {
	$(".hamburgerMenu").toggle();
}

$(document).ready(function () {
	$(".messagebox").hover(function () {
		$("#testbutton").css("background-color", "red");
	});
	$(".messagebox").mouseout(function () {
		$("#testbutton").css("background-color", "#614875");
	});
	$('#estartdate').datepicker({
		dateFormat: "yy-mm-dd"
	});
	$('#eenddate').datepicker({
		dateFormat: "yy-mm-dd"
	});
	$('#startdate').datepicker({
		dateFormat: "yy-mm-dd"
	});
	$('#enddate').datepicker({
		dateFormat: "yy-mm-dd"
	});
	addMinuteOptions();
	addHourOptions();

});

function addMinuteOptions(){
	var str = "";
	for(var i = 0; i < 60; i+=5){
		if(i < 10){
			str+= "<option value=" + i + ">0" + i + "</option>";
		}else{
			str+= "<option value=" + i + ">" + i + "</option>";
		}
	}
	$("#minutePickerStartNewVersion").html(str);
	$("#minutePickerEndNewVersion").html(str);
	$("#minutePickerStartEditVersion").html(str);
	$("#minutePickerEndEditVersion").html(str);
}

function addHourOptions(){
	var str = "";
	for(var i = 0; i < 24; i++){
		if(i < 10){
			str+= "<option value=" + i + ">0" + i + "</option>";
		}else{
			str+= "<option value=" + i + ">" + i + "</option>";
		}
	}
	$("#hourPickerStartNewVersion").html(str);
	$("#hourPickerEndNewVersion").html(str);
	$("#hourPickerStartEditVersion").html(str);
	$("#hourPickerEndEditVersion").html(str);
}


function showSubmitButton() {
	$(".submitDugga").css("display", "inline-block");
	$(".updateDugga").css("display", "none");
	$(".closeDugga").css("display", "inline-block");
}

function showSaveButton() {
	$(".submitDugga").css("display", "none");
	$(".updateDugga").css("display", "block");
	$(".closeDugga").css("display", "block");
}

function editSectionDialogTitle(title) {
	// Change title of the edit section dialog
	if (title === "newItem") {
		document.getElementById("editSectionDialogTitle").innerHTML = "New item";
	} else {
		document.getElementById("editSectionDialogTitle").innerHTML = "Edit item";
	}
}

// Displaying and hidding the dynamic comfirmbox for the section edit dialog
function confirmBox(operation, item = null) {
	if (operation == "openConfirmBox") {
		active_lid = item ? $(item).parents('table').attr('value') : null;
		$("#sectionConfirmBox").css("display", "flex");
	} else if (operation == "deleteItem") {
		deleteItem(active_lid);
		$("#sectionConfirmBox").css("display", "none");
	} else if (operation == "closeConfirmBox") {
		$("#sectionConfirmBox").css("display", "none");
		$("#noMaterialConfirmBox").css("display", "none");
	}
}

function deleteItem(item_lid = null) {
	var lid = item_lid ? item_lid : $("#lid").val();
	AJAXService("DEL", { lid: lid }, "SECTION");
	$("#editSection").css("display", "none");
}

// Checks if the title name includes any invalid characters

function validateName() {
	nameSet = true;
	var name = document.getElementById("sectionname");
	if (isNameValid() && isTypeValid()){ // if both are valid, show buttons
		$('#tooltipTxt').fadeOut();
		$('#saveBtn').removeAttr('disabled');
		$('#submitBtn').removeAttr('disabled');
		name.style.backgroundColor = "#fff";

	}else{ // if not, disable buttons
		$('#saveBtn').attr('disabled', 'disabled');
		$('#submitBtn').attr('disabled', 'disabled');
		if(!isNameValid()){
			$('#tooltipTxt').fadeIn();
			name.style.backgroundColor = "#f57";
		} else { // test must not be valid, remove our own tooltip and error-color
 			$('#tooltipTxt').fadeOut();
			name.style.backgroundColor = "#fff";
		}
	}
}

function isNameValid(){
	var nme = document.getElementById("sectionname");

	if (nme.value.match(/^[A-Za-zÅÄÖåäö\s\d(),.]+$/)) {
		return true;
	}
	return false;
}



function isTypeValid(){
	kind = $("#type").val();
	var nme = document.getElementById("type");
	if(retdata['duggor'].length == 0 && kind == 3){
		return false;
	} else if (retdata['codeexamples'].length <= 1 && kind == 2){
		return false;
	} else if (retdata['links'].length == 0 && kind == 5){
		return false;
	}
	return true;
}

function validateType() {
	var type = document.getElementById("type");
	if (isTypeValid() && isNameValid()){
		$('#tooltipType').fadeOut();
		$('#saveBtn').removeAttr('disabled');
		$('#submitBtn').removeAttr('disabled');
		type.style.backgroundColor = "#fff";
	} else {
		$('#saveBtn').attr('disabled', 'disabled');
		$('#submitBtn').attr('disabled', 'disabled');
		if (!isTypeValid()){
			if (type.value == 2){ //Code
				$("#tooltipType").html("Create a Code example before you can use it for a Code section.");
			} else if (type.value == 3){ //Test
				$("#tooltipType").html("Create a Dugga before you can use it for a Test section.");
			} else if (type.value == 5){ // Link
				$("#tooltipType").html("Create a Link before you can use it for a Link section.");
			}

			$('#tooltipType').fadeIn();
			for (i = 0; i < type.options.length; i++) {
				type.options[i].style.backgroundColor = "#fff";
			}
			type.style.backgroundColor = "#f57";
		} else if (!isNameValid()){
			$('#tooltipType').fadeOut();
			type.style.backgroundColor = "#FFF";
		}
	}
}


function updateItem() {
	var tabs = $("#tabs").val();
	var lid = $("#lid").val();
	var kind = $("#type").val();
	var link = $("#link").val();
	var highscoremode = $("#highscoremode").val();
	var sectionname = $("#sectionname").val();
	var visibility = $("#visib").val();
	var moment = $("#moment").val();
	var gradesys = $("#gradesys").val();
	var comments = $("#comments").val();
	var group = $("#group").val();

	// Storing tabs in gradesys column!
	if (kind == 0 || kind == 1 || kind == 2 || kind == 5 || kind == 7) gradesys = tabs;
	AJAXService(
		"UPDATE", {
			lid: lid,
			kind: kind,
			link: link,
			sectname: sectionname,
			visibility: visibility,
			moment: moment,
			gradesys: gradesys,
			highscoremode: highscoremode,
			comments: comments,
			group:group
		}, "SECTION");
	$("#sectionConfirmBox").css("display", "none");
	$("#editSection").css("display", "none");

}

function newItem() {
	var tabs = $("#tabs").val();
	var lid = $("#lid").val();
	var kind = $("#type").val();
	var link = $("#link").val();
	var highscoremode = $("#highscoremode").val();
	var sectionname = $("#sectionname").val();
	var visibility = $("#visib").val();
	var moment = $("#moment").val();
	var gradesys = $("#gradesys").val();
	var comment = $("#deadlinecomment").val();
	var group = $("#group").val();

	// Storing tabs in gradesys column!
	if (kind == 0 || kind == 1 || kind == 2 || kind == 5 || kind == 7) gradesys = tabs;
	AJAXService(
		"NEW", {
			lid: lid,
			kind: kind,
			link: link,
			sectname: sectionname,
			visibility: visibility,
			moment: moment,
			gradesys: gradesys,
			highscoremode: highscoremode,
			comment: comment,
			group:group
		}, "SECTION");
	$("#editSection").css("display", "none");
	setTimeout(scrollToBottom, 200); // Scroll to the bottom to show newly created items.
}

function closeSelect() {
	$(".item").css("border", "none");
	$(".item").css("box-shadow", "none");
	$("#editSection").css("display", "none");
	defaultNewItem();
}


function defaultNewItem() {

	$('#saveBtn').removeAttr('disabled');  							 		// Resets save button to its default form
	$('#submitBtn').removeAttr('disabled');									// Resets submit button to its default form
	document.getElementById("sectionname").style.backgroundColor = "#fff"; 	// Resets color for name input
	$('#tooltipTxt').hide();							 		           	// Resets tooltip text to its default form
}


function showCreateVersion() {
	$("#newCourseVersion").css("display", "flex");

}

function createVersion() {

	var cid = querystring['courseid'];
	var versid = $("#versid").val();
	newversid = versid;
	var versname = $("#versname").val();
	var coursecode = $("#course-coursecode").text();
	var courseid = $("#course-courseid").text();
	var coursename = $("#course-coursename").text();
	var makeactive = $("#makeactive").is(':checked');
	var coursevers = $("#course-coursevers").text();
	var copycourse = $("#copyvers").val();
	var comments = $("#comments").val();
	var startdate = $("#startdate").val();
	var enddate = $("#enddate").val();
	var startHour = ($("#hourPickerStartNewVersion").val());
	var startMinute = ($("#minutePickerStartNewVersion").val());
	var endHour = ($("#hourPickerEndNewVersion").val());
	var endMinute = ($("#minutePickerEndNewVersion").val());
	startdate = new Date(startdate)
	enddate = new Date(enddate)
	startdate.setHours(startHour)
	startdate.setMinutes(startMinute)
	enddate.setHours(endHour)
	enddate.setMinutes(endMinute);

	startdate = getDateFormat(startdate, "hourMinuteSecond");
	enddate = getDateFormat(enddate, "hourMinuteSecond");

	if (versid == "" || versname == "") {
		alert("Version Name and Version ID must be entered!");
	} else {
		if (coursevers == "null") {
			makeactive = true;
		}

		if (copycourse != "None") {
			//create a copy of course version
			AJAXService("CPYVRS", {
				cid: cid,
				versid: versid,
				versname: versname,
				coursecode: coursecode,
				coursename: coursename,
				copycourse: copycourse,
				startdate: startdate,
				enddate: enddate,
				makeactive: makeactive
			}, "COURSE");

		} else {
			//create a fresh course version
			AJAXService("NEWVRS", {
				cid: cid,
				versid: versid,
				versname: versname,
				coursecode: coursecode,
				coursename: coursename,
				makeactive: makeactive
			}, "COURSE");
		}

		$("#newCourseVersion").css("display", "none");


	}

}

function returnedCourse(data) {
	if (data['debug'] != "NONE!") alert(data['debug']);
	window.setTimeout(function () {
		changeURL("sectioned.php?courseid=" + querystring["courseid"]
			+ "&coursename=" + querystring["coursename"] + "&coursevers=" + newversid);
	}, 1000);
}

function updateVersion() {

	var cid = $("#cid").val();
	var versid = $("#eversid").val();
	var versname = $("#eversname").val();
	var startdate = $("#estartdate").val();
	var enddate = $("#eenddate").val();
	var coursecode = $("#course-coursecode").text();
	var makeactive = $("#emakeactive").is(':checked');
	var startdate = $("#estartdate").val();
	var enddate = $("#eenddate").val();
	var startHour = ($("#hourPickerStartEditVersion").val());
	var startMinute = ($("#minutePickerStartEditVersion").val());
	var endHour = ($("#hourPickerEndEditVersion").val());
	var endMinute = ($("#minutePickerEndEditVersion").val());


	startdate = new Date(startdate)
	enddate = new Date(enddate)
	startdate.setHours(startHour)
	startdate.setMinutes(startMinute)
	enddate.setHours(endHour)
	enddate.setMinutes(endMinute);

	startdate = getDateFormat(startdate, "hourMinuteSecond");
	enddate = getDateFormat(enddate, "hourMinuteSecond");

	AJAXService("UPDATEVRS", {
		cid: cid,
		versid: versid,
		versname: versname,
		coursecode: coursecode,
		startdate: startdate,
		enddate: enddate
	}, "SECTION");

	if (makeactive) {
		AJAXService("CHGVERS", {
			cid: cid,
			versid: versid,
		}, "SECTION");
	}

	$("#editCourseVersion").css("display", "none");

}

function getDateFormat(date, operation = ""){
	if(operation == "hourMinuteSecond"){
		return date.getFullYear() + "-"
			+ ('0' + (date.getMonth()+1)).slice(-2) + '-'
			+ ('0' + date.getDate()).slice(-2)
			+ "T" + date.getHours() + ":" + date.getMinutes() + ":"
			+ date.getSeconds();
	}else if(operation == "dateMonth"){
		return ('0' + date.getDate()).slice(-2) + '-'
			+ ('0' + (date.getMonth()+1)).slice(-2);

	}
	return date.getFullYear() + "-"
			+ ('0' + (date.getMonth()+1)).slice(-2) + '-'
			+ ('0' + date.getDate()).slice(-2)
}

function goToVersion(selected) {
	var value = selected.value;
	changeURL("sectioned.php" + value)
}

function accessCourse() {
	var coursevers = $("#course-coursevers").text();
	window.location.href = "accessed.php?cid=" + querystring['courseid'] + "&coursevers=" + coursevers;
}

function weeksBetween(firstDate, secondDate){
	var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
	var diff = Math.abs(firstDate - secondDate);
	return Math.round(diff / ONE_WEEK);
}

//----------------------------------------
// Renderer
//----------------------------------------
var momentexists = 0;
var resave = false;
function returnedSection(data) {
	retdata = data;

	Date.prototype.getWeek = function () {
		var date = new Date(this.getTime());
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		var week1 = new Date(date.getFullYear(), 0, 4);
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6 ) % 7) / 7);
	}


	var now = new Date();
	var startdate = new Date(retdata['startdate']);
	var enddate = new Date(retdata['enddate']);

	var numberOfParts = 0;
	for(var i = 0; i < retdata['entries'].length; i++){
		var item = retdata['entries'][i];
		if(item['kind'] == 4){
			numberOfParts++;
		}
	}

	if (data['debug'] != "NONE!") alert(data['debug']);

	if (querystring['coursevers'] != "null") {
		// Fill section list with information
		var versionname = "";
		if (retdata['versions'].length > 0) {
			for (var j = 0; j < retdata['versions'].length; j++) {
				var itemz = retdata['versions'][j];
				if (retdata['courseid'] == itemz['cid']) {

					var vversz = itemz['vers'];
					var vnamez = itemz['versname'];
					if (retdata['coursevers'] == vversz) {
						versionname = vnamez;
					}
				}
			}
		}

		var str = "";

		if (data['writeaccess']) {
				// <option value='?courseid=" + retdata['courseid']&coursename=" + retdata['coursename'] + "&coursevers=" + vvers + "'";ssstr += "<option value='" + vvers + "'";
				// showEditVersion(\"" + querystring['coursevers'] + "\",\"" + versionname + "\",\""+ startdate + "\",\"" + enddate + "\");
				// changeURL(\"resulted.php?cid=" + querystring['courseid'] + "&coursevers="+ querystring['coursevers'] + "\")

				// Build dropdowns
				var bstr="";
				for (var i = 0; i < retdata['versions'].length; i++) {
						var item = retdata['versions'][i];
						if (retdata['courseid'] == item['cid']){
								bstr+="<option value='"+item['vers']+"'";
								if (retdata['coursevers'] == item['vers']) {
										bstr += " selected";
								}
								bstr+=">"+item['versname']+" - "+item['vers']+"</option>";
						}
				}
				document.getElementById("courseDropdownTop").innerHTML = bstr;
				document.getElementById("copyvers").innerHTML = bstr;
			
				// Show FAB / Menu
				document.getElementById("TopMenuStatic").style.display = "Block";
				document.getElementById("FABStatic").style.display = "Block";
				

		} else {
			// Hide FAB / Menu
			document.getElementById("TopMenuStatic").style.display = "None";
			document.getElementById("FABStatic").style.display = "None";

		}
		
		// hide som elements if to narrow
		var hiddenInline = "";
		var showInline = true;
		if ($(window).width() < 480) {
			showInline = false;
			hiddenInline = "none";
		} else {
			showInline = true;
			hiddenInline = "inline";
		}

		str += "<div class='course' style='display:flex; align-items:center; justify-content:flex-end;'>";
		str += "<div style='flex-grow:1'>"
		str += "<span id='course-coursename' class='nowrap ellipsis' style='margin-left: 90px;"
			+ "margin-right:10px;' title='" + data.coursename + " " + data.coursecode + " " + versionname + "'>" + data.coursename + "</span>";
		str += "<span id='course-coursecode' style='margin-right:10px;'>" + data.coursecode + "</span>";
		str += "<span id='course-versname' class='courseVersionField'>" + versionname + "</span>";
		str += "</div>";

		// If one has writeaccess (eg a teacher) the new item button is created, in shape of button with a '+'-sign
		if (retdata["writeaccess"]) {
			if (item['kind'] == undefined) {
				item['kind'] = 0;
				// Need to change it to a zero so it will default to type Header when creating new item.
			}

			str += "<div id='course-newitem' style='display: flex;'>";
			str += "<input id='addElement' type='button' value='+' class='submit-button-newitem' title='New Item'"
				+ " onclick='selectItem("
				+ "\"" + item['lid'] + "\","
				+ "\"" + item['entryname'] + "\","
				+ "\"" + item['kind'] + "\","
				+ "\"" + item['visible'] + "\","
				+ "\"" + item['link'] + "\","
				+ "\"" + momentexists + "\","
				+ "\"" + item['gradesys'] + "\","
				+ "\"" + item['highscoremode'] + "\", null"
				+ "); showSubmitButton(); validateType(); "
				+ "editSectionDialogTitle(\"newItem\"); defaultNewItem();'>";
			str += "</div>";
		}

		str += "<div id='course-coursevers' style='display:none; margin-right:10px;'>"
		+ data.coursevers + "</div>";
		str += "<div id='course-courseid' style='display:none; margin-right:10px;'>"
		+ data.courseid + "</div>";

		str += "</div>";

		str += "<div id='courseList'>";
		str += "<!-- Statistics List -->";
		str += "<div id='statisticsList'>";
		str += "<div id='statistics' class='statistics' style='display:inline-block; cursor:pointer;'>";
		str += "<div style='margin:10px;'>";
		str += "<img src='../Shared/icons/right_complement.svg' id='arrowStatisticsOpen'>";
		str += "<img src='../Shared/icons/desc_complement.svg' id='arrowStatisticsClosed'>";
		str += "</div>";
		str += "<div class='nowrap' style='padding-left:5px' title='statistics'>";
		str += "<span class='listentries-span noselect' style='writing-mode:vertical-rl;text-orientation: sideways;'>Deadlines</span>";
		str += "</div></div>";
		str += "<div class='statisticsContent' style='display:inline-block;'>";

		str += "<div id='statisticsPie' class='statisticsInnerBox'>";
		str += "<canvas id='pieChart' width='300px' height='255px'"
		+	"style='padding: 10px; display:flex; margin: auto;'></canvas>"; // Contains pie chart.
		str += "</div>";

		str	+= "<div id='deadlineInfoBox' class='statisticsInnerBox' "
		+ "style='padding: 10px;'>";
		str += "<h2 id='deadlineInfoTitle'>Upcoming Deadlines</h2>";
		str += "<div class='deadlineInfo'><span style='width:100%;'id='deadlineInfoFirstText'></span>";
		str += "<span id='deadlineInfoFirstDate' style='margin-right:5px; width:35px;'></span></div>";
		str += "<div class='deadlineInfo'><span style='width:100%;' id='deadlineInfoSecondText'></span>";
		str += "<span id='deadlineInfoSecondDate' style='margin-right:5px; width:35px;'> </span></div>";
		str += "<div class='deadlineInfo'> <span style='width:100%;' id='deadlineInfoThirdText'></span>";
		str += "<span id='deadlineInfoThirdDate' style='margin-right:5px; width:35px;'></span></div>";
		str += "<div class='deadlineInfo'> <span style='width:100%;' id='deadlineInfoFourthText'></span>";
		str += "<span id='deadlineInfoFourthDate' style='margin-right:5px; width:35px;'></span></div>";
		str += "<div class='deadlineInfo'> <span style='width:100%;' id='deadlineInfoFifthText'></span>";
		str += "<span id='deadlineInfoFifthDate' style='margin-right:5px; width:35px;'></span></div>";
		str += "</div>";

		str += "<div id='statisticsSwimlanes' class='statisticsInnerBox' style='display:flex;'>";
		str += "<div style='display:inline-block;'>";
		str += "<canvas id='swimlanesMoments' style='padding:10px;'></canvas>";	// Contains swimlanes.
		str += "</div>";
		str += "<div style='width: 350px; overflow-x: auto; white-space: nowrap; "
		+ "display: inline-block; margin: 10px 10px 10px -10px'>";
		str += "<canvas id='swimlanesWeeks'></canvas>";	// Contains swimlanes.
		str += "</div>";
		str += "</div>";
		str += "</div></div>"; // Closing div for statisticsContent
		str += "<div id='Sectionlistc'>";

		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			var kk = 0;
			for (i = 0; i < data['entries'].length; i++) {
				var item = data['entries'][i];
				var deadline = item['deadline'];
				var released = item['release'];

				// Separating sections into different classes
				if (parseInt(item['kind']) === 0) {
					str+="<div id='header"+menuState.idCounter+data.coursecode+"' class='header' style='display:block'>";
				} else if (parseInt(item['kind']) === 1) {
					str+="<div id='section"+menuState.idCounter+data.coursecode+"' class='section' style='display:block'>";
				} else if (parseInt(item['kind']) === 2) {
					str+="<div id='code"+menuState.idCounter+data.coursecode+"' class='code' style='display:block'>";
				} else if (parseInt(item['kind']) === 3) {
					str+="<div id='test"+menuState.idCounter+data.coursecode+"' class='test' style='display:block'>";
				} else if (parseInt(item['kind']) === 4) {
					str+= "<div class='moment' style='display:block'>";
				} else if (parseInt(item['kind']) === 5) {
					str+="<div id='link"+menuState.idCounter+data.coursecode+"' class='link' style='display:block'>";
				} else if (parseInt(item['kind']) === 6) {
					str+="<div id='group"+menuState.idCounter+data.coursecode+"' class='group' style='display:block'>";
				} else if (parseInt(item['kind']) === 7) {
					str+="<div id='message"+menuState.idCounter+data.coursecode+"' class='message' style='display:block'>";
				}
				
				menuState.idCounter++;
				// All are visible according to database

				// Content table

				str += "<table id='lid" + item['lid'] + "' value='" + item['lid'] + "' style='width:100%;"
					+ "table-layout:fixed;'><tr style='height:32px;' ";
				if (kk % 2 == 0) {
					str += " class='hi' ";
				} else {
					str += " class='lo' ";
				}
				str += " >";

				var blorf = "";
				if (parseInt(item['visible']) === 0) {
					blorf = " hidden";
				} else if (parseInt(item['visible']) === 3) {
					blorf = " deleted";
				} else if (parseInt(item['visible']) === 2) {
					blorf = " login";
				} else {
					blorf = "";
				}

				// kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link || 6 Group-Moment
				var itemKind = parseInt(item['kind']);
				if (itemKind === 3 || itemKind === 4 || itemKind === 6) {

					// Styling for quiz row e.g. add a tab spacer
					if (itemKind === 3) str += "<td style='width:36px;'><div class='spacerLeft'></div></td>";
					var grady = -1;
					var status = "";
					var marked;
					var submitted;
					var lastSubmit = null;

					for (var jjj = 0; jjj < data['results'].length; jjj++) {
						var lawtem = data['results'][jjj];
						if ((lawtem['moment'] == item['lid'])) {
							grady = lawtem['grade'];
							status = "";
							var st = lawtem['submitted'];
							if (st !== null) {
								submitted = new Date(st);
							} else {
								submitted = null;
							}
							var mt = lawtem['marked'];
							if (mt !== null) {
								marked = new Date(mt);
							} else {
								marked = null;
							}

							if (itemKind === 3 || itemKind === 6) {
								if (lawtem["useranswer"] !== null && submitted !== null && marked === null) {
									status = "pending";
								}

								if (submitted !== null && marked !== null && (submitted.getTime() > marked.getTime())) {
									status = "pending";
								}
								if (lastSubmit === null) {
									lastSubmit = submitted;
								} else if (submitted !== null) {
									if (lastSubmit.getTime() < submitted.getTime()) {
										lastSubmit = submitted;
									}
								}
							}
						}
					}
					if (itemKind === 3 || itemKind === 6) {
						str += "<td class='LightBox" + blorf + "'>";
					} else if (itemKind === 4) {
						str += "<td class='LightBoxFilled" + blorf + "'>";
					}
					if ((grady == -1 || grady == 0 || grady == null) && status === "") {
						// Nothing submitted nor marked (White)
						str += "<div class='StopLight WhiteLight'></div>";
					} else if (status === "pending") {
						//	Nothing marked yet (Yellow)
						str += "<div class='StopLight YellowLight' title='Status: Handed in\nDate: " + lastSubmit + "' ></div>";
					} else if (grady == 1) {
						//	Marked Fail! (Red)
						str += "<div class='StopLight RedLight' title='Status: Failed\nDate: " + marked + "' ></div>";
					} else if (grady > 1) {
						//	Marked Pass i.e. G/VG/3/4/5 (Green)
						str += "<div class='StopLight GreenLight'  title='Status: Pass\nDate: " + marked + "' ></div>";
					}
					str += "</td>";
				}


				// Make tabs to align each section element
				// kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link
				if(itemKind === 0 || itemKind === 1 || itemKind === 2 || itemKind === 5 || itemKind === 7 ){
					var itemGradesys = parseInt(item['gradesys']);
					var itemVisible = item['visible'];

					if (itemGradesys > 0 && itemGradesys < 4){
						for (var numSpacers = 0; numSpacers < itemGradesys;numSpacers++){
							str+=
								"<td style='width:36px;overflow:hidden;"
								+addColorsToTabSections(itemKind, itemVisible) + "'>"
								+"<div class='spacerLeft'></div></td>";
						}
					} else if (itemGradesys == 4){
						str+="<td style='" + addColorsToTabSections(itemKind, itemVisible) + "'"
						+"class='LightBox'><div class='spacerEnd'></div></td>";
					}else if (itemGradesys == 5){
						str+="<td style='" + addColorsToTabSections(itemKind, itemVisible) + "'"
						+"class='LightBox'><div class='spacerLeft'></div></td>"

						str+= "<td style='" + addColorsToTabSections(itemKind, itemVisible) + "'"
						+"class='LightBox'><div class='spacerEnd'></div></td>";

					}else if (itemGradesys == 6){
						str+="<td style='" + addColorsToTabSections(itemKind, itemVisible) + "'"
						+"class='LightBox'><div class='spacerLeft'></div></td>"

						str+="<td style='" + addColorsToTabSections(itemKind, itemVisible) + "'"
						+"class='LightBox'><div class='spacerLeft'></div></td>"

						str+="<td style='" + addColorsToTabSections(itemKind, itemVisible) + "'"
						+"class='LightBox'><div class='spacerEnd'></div></td>";
					}
				}


				// kind 0 == Header || 1 == Section || 2 == Code  || 3 == Test (Dugga)|| 4 == Moment || 5 == Link
				if (itemKind === 0) {									// Header
					// Styling for header row
					str += "</td><td class='header item" + blorf + "' placeholder='" + momentexists + "'id='I" + item['lid'] + "' ";
					kk = 0;
				} else if (itemKind === 1) {						// Section
					// Styling for Section row
					str += "<td class='section item" + blorf + "' placeholder='" + momentexists + "'id='I" + item['lid'] + "' style='cursor:pointer;' ";
					kk = 0;
				} else if (itemKind === 2) {						// Code Example
					str += "<td";

					if (kk == 0) {
						if (kk % 2 == 0) {
							str += " class='example item" + blorf + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
						} else {
							str += " class='example item" + blorf + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
						}
					} else {
						if (kk % 2 == 0) {
							str += " class='example item" + blorf + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
						} else {
							str += " class='example item" + blorf + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
						}
					}
					kk++;
				} else if (itemKind === 3 || itemKind === 6) {						// Dugga
					if (item['highscoremode'] != 0 && itemKind == 3) {
						str += "<td style='width:20px;'><img style=';' title='Highscore'"
							+ "src='../Shared/icons/top10.png' onclick='showHighscore(\"" + item['link'] + "\",\"" + item['lid'] + "\")'/></td>";
					}
					str += "<td ";
					if (kk % 2 == 0) {
						str += " class='example item" + blorf + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
					} else {
						str += " class='example item" + blorf + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
					}
					kk++;
				} else if (itemKind === 4) {					// Moment
					//new moment bool equals true
					momentexists = item['lid'];

					// Styling for moment row
					str += "<td class='moment item" + blorf + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' style='cursor:pointer;' ";
					kk = 0;
				} else if (itemKind === 5) {					// Link
					str += "<td";
					if (kk % 2 == 0) {
						str += " class='example item' placeholder='" + momentexists + "'id='I" + item['lid'] + "' ";
					} else {
						str += " class='example item' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
					}
					kk++;
				} else if (itemKind === 7) { //Message
					str += "<td style='width:25px; padding:5px'><img src='../Shared/icons/Message_icon.svg' style='width:100%;'/></td><td class='section-message item' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
				}

				// Close Information
				str += ">";

				// Content of Section Item
				if (itemKind == 0) { // Header
					str +=
						"<span style='padding-left:5px;' title='"
						+ item['entryname'] + "'>" + item['entryname'] + "</span>";
				}

				else if (itemKind == 1) { // Section
					var arrowID = item['entryname'].split(' ').join('').split(',').join('') + data.coursecode;
					str +=
						"<div class='nowrap"
						+ blorf + "' style='padding-left:5px;' title='"
						+ item['entryname'] + "'><span class='ellipsis listentries-span'>"
						+ item['entryname'] + "</span>";
						if (item['groupName'].length) {
							str += " <img src='../Shared/icons/groupicon2.svg' class='' style='max-height: 25px; max-width:8%; min-width:18px;'/> " + item['groupName'];
						}
						str += "<img src='../Shared/icons/desc_complement.svg'"
						+ "id='arrowComp" + arrowID
						+ "' class='arrowComp' style='display:inline-block;'>"
						+ "<img src='../Shared/icons/right_complement.svg'"
						+ "id='arrowRight" + arrowID
						+ "' class='arrowRight' style='display:none;'></div>";
				}

				else if (itemKind == 4) { // Moment
					var strz = "";
					var arrowID = item['entryname'].split(' ').join('').split(',').join('') + data.coursecode;

					if (item['gradesys'] == 0) {
						strz = "";
					}
					else if (item['gradesys'] == 1) {
						strz = "(U-G-VG)";
					}
					else if (item['gradesys'] == 2) {
						strz = "(U-G)";
					}
					else if (item['gradesys'] == 3) {
						strz = "(U-3-4-5)";
					}

					str += "<div class='nowrap"
						+ blorf + "' style='padding-left:5px;' title='"
						+ item['entryname'] + "'><span class='ellipsis listentries-span'>"
						+ item['entryname'] + " " + strz + " </span>";
					if (item['groupName'].length) {
						str += " <img src='../Shared/icons/groupicon2.svg' class='' style='max-height: 25px; max-width:8%;min-width:18px;'/> " + item['groupName'];
					}

					str +=  "<img src='../Shared/icons/desc_complement.svg'"
						+ "id='arrowComp" + arrowID
						+ "' class='arrowComp' style='display:inline-block;'>"
						+ "<img src='../Shared/icons/right_complement.svg'"
						+ "id='arrowRight" + arrowID
						+ "' class='arrowRight' style='display:none;'></div>";
				}

				else if (itemKind == 2) { // Code Example
					str +=
						"<div class='ellipsis nowrap'><span><a class='" + blorf
						+ "' style='margin-left:15px;' href='codeviewer.php?exampleid="
						+ item['link'] + "&courseid=" + querystring['courseid']
						+ "&cvers=" + querystring['coursevers'] + "' title='"
						+ item['entryname'] + "'>" + item['entryname'] + "</a></span></div>";
				}

				else if (itemKind == 3) { // Test Title
					str +=
						"<div class='ellipsis nowrap'><a class='" + blorf
						+ "' style='cursor:pointer;margin-left:15px;' "
						+ "onClick='changeURL(\"showDugga.php?cid=" + querystring['courseid']
						+ "&coursevers=" + querystring['coursevers'] + "&did="
						+ item['link'] + "&moment=" + item['lid'] + "&segment="
						+ momentexists + "&highscoremode=" + item['highscoremode']
						+ "&comment=" + item['comments'] + "&deadline="
						+ item['deadline'] + "\");' title='" + item['entryname']
						+ "'><span><span>"
						+ item['entryname'] + "</span></span></a></div>";
				}

				else if (itemKind == 5) { // Link
					if (item['link'].substring(0, 4) === "http") {
						str +=
							"<a class='" + blorf + "' style='cursor:pointer;margin-left:15px;' href="
							+ item['link'] + " target='_blank' >" + item['entryname'] + "</a>";
					} else {
						str +=
							"<a class='" + blorf + "' style='cursor:pointer;margin-left:15px;'"
							+ "onClick='changeURL(\"showdoc.php?cid=" + querystring['courseid']
							+ "&coursevers=" + querystring['coursevers'] + "&fname="
							+ item['link'] + "\");' >" + item['entryname'] + "</a>";
					}
				} else if (itemKind == 6) { // Group
					str +=
						"<div class='ellipsis nowrap'><a class='" + blorf
						+ "' style='cursor:pointer;margin-left:15px;'"
						+ "onClick='alert(\"There should be some group functionality here\");'"
						+ 'title=' + item['entryname'] + '><span><span>' + item['entryname']
						+ "</span></span></a></div>";
				} else if (itemKind == 7) { // Message
					str +=
						"<span style='padding-left:5px;' title='"
						+ item['entryname'] + "'>" + item['entryname'] + "</span>";
				}

				str += "</td>";




				// Add generic td for deadlines if one exists
				if ((itemKind === 3) && (deadline !== null || deadline === "undefined")) {
					var dl = deadline.split(" ");
					var timeFilterAndFormat = "00:00:00"; // time to filter away
					var yearFormat = "0000-";
					var dateFormat = "00-00";

					str += "<td class='dateSize' style='text-align:right;overflow:hidden;'><div class='margin-4' style='white-space:nowrap;'>";

					if (dl[1] == timeFilterAndFormat) {
						str += "<div class='dateField'>";
						str += deadline.slice(0, yearFormat.length)
						str += "</div>";
						str += deadline.slice(yearFormat.length, yearFormat.length + dateFormat.length);
					} else {
						str += "<span class='dateField'>" + deadline.slice(0, yearFormat.length) + "</span>";
						str += deadline.slice(yearFormat.length, yearFormat.length + dateFormat.length + 1 + timeFilterAndFormat.length - 3);
					}

					str += "</div></td>";
				}

				// Due to date and time format problems slice is used to make the variable submitted the same format as variable deadline
				if (submitted) {
					var dateSubmitted = submitted.toJSON().slice(0, 10).replace(/-/g, '-');
					var timeSubmitted = submitted.toJSON().slice(11, 19).replace(/-/g, '-');
					var dateTimeSubmitted = dateSubmitted + [' '] + timeSubmitted;

					// create a warning if the dugga is submitted after the set deadline
					if ((status === "pending") && (dateTimeSubmitted > deadline)) {
						str += "<td style='width:25px;'><img style='width:25px; padding-top:3px'"
							+ "title='This dugga is not guaranteed to be marked due to submition after deadline.'"
							+ "src='../Shared/icons/warningTriangle.svg'/></td>";
					}
				}

				// Cog Wheel
				if (data['writeaccess']) {
					str +="<td style='width:32px;' ";
					
					if(itemKind===0) str+="class='header"+blorf+"' ";
					if(itemKind===1) str+="class='section"+blorf+"' ";
					if(itemKind===4) str+="class='moment"+blorf+"' ";
				
					str +="><img id='dorf' class='margin-4' src='../Shared/icons/Cogwheel.svg' ";
					str +=" onclick='selectItem("+makeparams([item['lid'],item['entryname'], item['kind'],item['visible'],item['link'],momentexists,item['gradesys'],item['highscoremode'],item['comments']])+");' />";
					str +="</td>";
				}

				// trashcan
				if (data['writeaccess']) {
					str += "<td style='width:36" + "px;";

					if (itemKind === 0) {
						str +=
							"' class='header" + blorf + "'>"
							+ "<img id='dorf' class='margin-4' src='../Shared/icons/Trashcan.svg'"
							+ "onclick='confirmBox(\"openConfirmBox\", this);'></td>";
					} else if (itemKind === 1) {
						str +=
							"' class='section" + blorf + "'>"
							+ "<img id='dorf' class='margin-4' src='../Shared/icons/Trashcan.svg'"
							+ "onclick='confirmBox(\"openConfirmBox\", this);'></td>";
					} else if (itemKind === 4) {
						str +=
							"' class='moment" + blorf + "'>"
							+ "<img id='dorf' class='margin-4' src='../Shared/icons/Trashcan.svg'"
							+ "onclick='confirmBox(\"openConfirmBox\", this);'></td>";
					} else if (itemKind === 6) {
						str +=
							"' class='group" + blorf + "'>"
							+ "<img id='dorf' class='margin-4' src='../Shared/icons/Trashcan.svg'"
							+ "onclick='confirmBox(\"openConfirmBox\", this);'></td>";
					} else {
						str +=
							"' ><img id='dorf' class='margin-4' src='../Shared/icons/Trashcan.svg'"
							+ "onclick='confirmBox(\"openConfirmBox\", this);'></td>";
					}
				}

				str += "</tr>";
				str += "</table></div>";
			} // End of for-loop

		} else {
			// No items were returned!
			str += "<div class='bigg'>";
			str += "<span>You either have no access or there isn't anything under this course</span>";
			str += "</div>";
		}

		str += "</div></div>";
		var slist = document.getElementById('Sectionlist');
		slist.innerHTML = str;
		if (resave == true) {
			str = "";
			$("#Sectionlist").find(".item").each(function (i) {
				if (i > 0) str += ",";
				ido = $(this).attr('id');
				phld = $(this).attr('placeholder')
				str += i + "XX" + ido.substr(1) + "XX" + phld;

			});

			AJAXService("REORDER", { order: str }, "SECTION");
			resave = false;
		}
		if (data['writeaccess']) {
			// Enable sorting always if we are superuser as we refresh list on update

			$("#Sectionlistc").sortable({
				helper: 'clone',
				update: function (event, ui) {
					str = "";
					$("#Sectionlist").find(".item").each(function (i) {
						if (i > 0) str += ",";
						ido = $(this).attr('id');
						phld = $(this).attr('placeholder')
						str += i + "XX" + ido.substr(1) + "XX" + phld;

					});

					AJAXService("REORDER", { order: str }, "SECTION");
					resave = true;
					return false;
				}

			});
		}
	} else {
		str = "<div class='course'><div id='course-coursename' style='display: inline-block; margin-right:10px;'>" + data.coursename + "</div>"
			+ "<div id='course-coursecode' style='display: inline-block; margin-right:10px;'>" + data.coursecode + "</div>"
			+ "<div id='course-coursevers' style='display: inline-block; margin-right:10px;'>" + data.coursevers + "</div>"
			+ "<div id='course-courseid' style='display: none; margin-right:10px;'>" + data.courseid + "</div></div>";
		str += "<div class='err'><span style='font-weight:bold;'>Bummer!</span>This version does not seem to exist!</div>";
		var slist = document.getElementById('Sectionlist');
		slist.innerHTML = str;
		showCreateVersion();

	}

	// The next 5 lines are related to collapsable menus and their state.
	getHiddenElements();
	hideCollapsedMenus();
	getArrowElements();
	toggleArrows();
	menuState.idCounter = 0;

	// Change title of the current page depending on which page the user is on.
	document.getElementById("sectionedPageTitle").innerHTML = data.coursename + " - " + data.coursecode;

	drawPieChart(); // Create the pie chart used in the statistics section.
	fixDeadlineInfoBoxesText(); // Create the upcomming deadlines used in the statistics section
	drawSwimlanes(); // Create the swimlane used in the statistics section.

	// Change the scroll position to where the user was last time.
	$(window).scrollTop(localStorage.getItem("sectionEdScrollPosition" + retdata.coursecode));
}

function showHighscore(did, lid) {
	AJAXService("GET", { did: did, lid: lid }, "DUGGAHIGHSCORE");
}

function returnedHighscore(data) {

	var str = "";

	str += "<tr>";
	str += "<th>Rank</th>";
	str += "<th>Name</th>";
	str += "<th>Score</th>";
	str += "</tr>";

	if (data['highscores'].length > 0) {
		for (i = 0; i < data['highscores'].length; i++) {
			var item = data['highscores'][i];
			if (!isNaN(data["user"][0]) && data["user"][0] === i) {
				str += "<tr class='highscoreUser'>"
			} else {
				str += "<tr>";
			}
			str += "<td>";
			str += (i + 1);
			str += "</td>";

			str += "<td>";
			str += item['username'];
			str += "</td>"
			str += "<td>";
			str += "Score: ";
			str += item['score']
			str += "</td>";
			str += "</tr>";
		}
	}

	if (data["user"]["username"]) {
		str += "<tr class='highscoreUser'>";
		str += "<td>";
		str += "";
		str += "</td>";
		str += "<td>";
		str += data["user"]["username"];
		str += "</td>"
		str += "<td>";
		str += "Score: ";
		str += data["user"]["score"]
		str += "</td>";
		str += "</tr>";
	}

	var highscorelist = document.getElementById('HighscoreTable').innerHTML = str;
	$("#HighscoreBox").css("display", "block");
}

// Toggle content for each moment
$(document).on('click', '.moment, .section, .statistics', function () {
	/* The event handler returns two elements. The following two if statements
	   gets the element of interest. */
	if (this.id.length > 0) {
		saveHiddenElementIDs(this.id);
	}
	if (this.id.length > 0) {
		saveArrowIds(this.id);
	}
	hideCollapsedMenus();
	toggleArrows();
});


// Save ids of all elements, whose state needs to be remembered, in local storage.
function saveHiddenElementIDs(clickedElement) {
	addOrRemoveFromArray(clickedElement, menuState.hiddenElements);
	localStorage.setItem('hiddenElements', JSON.stringify(menuState.hiddenElements));
}

// Save ids of all arrows, whose state needs to be remembered, in local storage.
function saveArrowIds(clickedElement) {
	var childNodes = document.getElementById(clickedElement).firstChild.childNodes;
	for (var i = 0; i < childNodes.length; i++) {
		if (childNodes[i].nodeName == "IMG") {
			addOrRemoveFromArray(childNodes[i].id, menuState.arrowIcons);
		}
	}
	localStorage.setItem('arrowIcons', JSON.stringify(menuState.arrowIcons));
}

/* Hide all child elements to the moment and section elements in the
   hiddenElements array. */
function hideCollapsedMenus() {
	$('.header, .section, .code, .test, .link, .group, .statisticsContent').show();
	for (var i = 0; i < menuState.hiddenElements.length; i++) {
		var ancestor = findAncestor($("#" + menuState.hiddenElements[i])[0], "moment");
		if ((ancestor != undefined || ancestor != null) && ancestor.classList.contains('moment')) {
			jQuery(ancestor).nextUntil('.moment').hide();
		}
		ancestor = findAncestor($("#" + menuState.hiddenElements[i])[0], "section");
		if ((ancestor != undefined || ancestor != null) && ancestor.classList.contains('section')) {
			jQuery(ancestor).nextUntil('.section').hide();
		}

		if(menuState.hiddenElements[i] == "statistics"){
			$(".statistics").nextAll().hide();
		}
	}
}

/* Show down arrow by default and then hide this arrow and show the right
   arrow if it is in the arrowIcons array.
	 The other way around for the statistics section. */
function toggleArrows() {
	$('.arrowComp').show();
	$('.arrowRight').hide();
	for (var i = 0; i < menuState.arrowIcons.length; i++) {
		/* If the string 'arrowComp' is a part of the string on the current
		   index of the arrowIcons array, hide down arrow and show right arrow. */
		if (menuState.arrowIcons[i].indexOf('arrowComp') > -1) {
			$('#' + menuState.arrowIcons[i]).hide();
		} else {
			$('#' + menuState.arrowIcons[i]).show();
		}
	}

	$('#arrowStatisticsOpen').show();
	$('#arrowStatisticsClosed').hide();
	for (var i = 0; i < menuState.hiddenElements.length; i++){
		if (menuState.hiddenElements[i] == "statistics"){
			$('#arrowStatisticsOpen').hide();
			$('#arrowStatisticsClosed').show();
		}
	}
}

// Get all element ids from local storage (who's children should be hidden).
function getHiddenElements() {
	menuState.hiddenElements = JSON.parse(localStorage.getItem('hiddenElements'));
	if (menuState.hiddenElements === null) {
		menuState.hiddenElements = [];
	}
}

// Get all arrow image ids from local storage that should be toggled.
function getArrowElements() {
	menuState.arrowIcons = JSON.parse(localStorage.getItem('arrowIcons'));
	if (menuState.arrowIcons === null) {
		menuState.arrowIcons = [];
	}
}

// Finds the nearest parent element of "element" that contains the class "className".
function findAncestor(element, className) {
	if (element != undefined || element != null) {
		while ((element = element.parentElement) && !element.classList.contains(className));
		return element;
	}
}

/* Toggle string in array.
   Add string to array if it does not exist in the array.
   Remove string from array if it exist in the array. */
function addOrRemoveFromArray(elementID, array) {
	var exists = false;
	for (var i = 0; i < array.length; i++) {
		if (elementID == array[i]) {
			exists = true;
			array.splice(i, 1);
			break;
		}
	}
	if (!exists) {
		array.push(elementID);
	}
}

// Finds all ancestors to the element with classname Hamburger and toggles them.
// added some if-statements so escapePress wont always toggle
function hamburgerChange(operation = 'click') {
	if (operation != "click") {
		if (findAncestor(document.getElementById("hamburgerIcon"), "change") != null) {
			toggleHamburger();
		}
	} else {
		toggleHamburger();
	}
}

function toggleHamburger() {
	var x = document.getElementById("hamburgerIcon");
	findAncestor(x, "hamburger").classList.toggle("change");
}

// Toggles action bubbles when pressing the FAB button
function toggleFabButton() {
	if (!$('.fab-btn-sm').hasClass('scale-out')) {
		$('.fab-btn-sm').toggleClass('scale-out');
		$('.fab-btn-list').delay(100).fadeOut(0);
	} else {
		$('.fab-btn-list').fadeIn(0);
		$('.fab-btn-sm').toggleClass('scale-out');
	}
}

function createQuickItem(){
	selectItem("undefined","New Item","2","undefined","undefined","0","undefined","undefined", "UNK");
	newItem();
}

//kind 0 == Header || 1 == Section || 2 == Code  || 3 == Test (Dugga)|| 4 == Moment || 5 == Link || 6 == Group Activity || 7 == Message
function fabValidateType(kind) {
	if (kind == 0){
		selectItem("undefined","New Header","0","undefined","undefined","0","undefined","undefined", "undefined");
		newItem();
	} else if (kind == 1){
		selectItem("undefined","New Section","1","undefined","undefined","0","undefined","undefined", "UNK");
		newItem();
	} else if (kind == 2){
		if(retdata['codeexamples'].length <= 1){ //Index 1 in the array has a hard coded code example.
			toggleFabButton();
			testsAvailable = true;
			$("#noMaterialText").html("Create a Code example before you can use it for a Code section.");
			$("#noMaterialConfirmBox").css("display", "flex");
		} else {
			selectItem("undefined","New Code","2","undefined","undefined","0","undefined","undefined", "UNK");
			newItem();
		}
	} else if (kind == 3){
		if(retdata['duggor'].length == 0){
			toggleFabButton();
			$("#noMaterialText").html("Create a Dugga before you can use it for a Test section.");
			$("#noMaterialConfirmBox").css("display", "flex");
		} else {
			selectItem("undefined","New Test","3","undefined","undefined","0","undefined","undefined", "UNK");
			newItem();
		}
	} else if (kind == 4){
		selectItem("undefined","New Moment","4","undefined","undefined","0","undefined","undefined", "UNK");
		newItem();
	} else if (kind == 5){
		if(retdata['links'].length == 0){
			toggleFabButton();
			$("#noMaterialText").html("Create a Link before you can use it for a Link section.");
			$("#noMaterialConfirmBox").css("display", "flex");
		} else {
			selectItem("undefined","New Link","5","undefined","undefined","0","undefined","undefined", "UNK");
			newItem();
		}
	} else if (kind == 6){
		selectItem("undefined","New Group Activity","6","undefined","undefined","0","undefined","undefined", "UNK");
		newItem();
	} else if (kind == 7){
		selectItem("undefined","New Message","7","undefined","undefined","0","undefined","undefined", "UNK");
		newItem();
	}
}

function addColorsToTabSections(kind, visible){
	var retStr = "";
	if(kind == 1){
		retStr += "background-color:#927b9e;";
		if(visible == 0){
			retStr += "opacity:0.3;";
		}
	}
	return retStr;
}


/* Statistic-sections functions, for drawing out all the statistics
   (pie chart and swimlanes) and upcomming deadlines. */
function drawPieChart() {
		var c = document.getElementById('pieChart');
		var ctx = c.getContext('2d');
		var width = c.width;
		var height = 200;
		var pieChartRadius = height / 2;
		var overviewBlockSize = 11;

		var totalQuizes = 0;
		var passedQuizes = 0;
		var notGradedQuizes = 0;
		var failedQuizes = 0;
		var notSubmittedQuizes = 0;

		// Calculate total quizes.
		for(var i = 0; i < retdata['entries'].length; i++) {
			if(retdata['entries'][i].kind == "3") {
				totalQuizes++;
			}
		}

		// Calculate passed, failed and not graded quizes.
		for(var i = 0; i < retdata['results'].length; i++) {
				// Moments are also stored in ['results'] but do not have a useranswer, so we dont care about these	
				if(retdata['results'][i]['useranswer'] != null){ 
						if(retdata['results'][i].grade == 2){
							passedQuizes++;
						}else if(retdata['results'][i].grade == 1){
							failedQuizes++;
						}else {
							notGradedQuizes++;
						}
				}
		}

		// Calculate non submitted quizes.
		notSubmittedQuizes = totalQuizes - (passedQuizes + failedQuizes + notGradedQuizes);

		if(totalQuizes == 0){ 	// if a course has no tests, this will make the piechart
			totalQuizes++; 			// show that the student has 100% not submitted tests.
			notSubmittedQuizes++;
		}

		// PCT = Percentage
		var passedPCT = 100 * (passedQuizes / totalQuizes);
		var notGradedPCT = 100 * (notGradedQuizes / totalQuizes);
		var failedPCT = 100 * (failedQuizes / totalQuizes);
		var notSubmittedPCT = 100 * (notSubmittedQuizes / totalQuizes);

		// Only use 2 decimal places and round up if necessary
		passedPCT = Math.round(passedPCT * 100) / 100;
		notGradedPCT = Math.round(notGradedPCT * 100) / 100;
		failedPCT = Math.round(failedPCT * 100) / 100;
		notSubmittedPCT = Math.round(notSubmittedPCT * 100) / 100;

		var lastend = -1.57; /* Chart start point. -1.57 is a quarter the number of
		radians in a circle, i.e. start at 12 o'clock */
		var testsData = [passedQuizes, notGradedQuizes, failedQuizes, notSubmittedQuizes];
		var colors = {
			'passedQuizes': '#00E676',        // Green
			'notGradedQuizes': '#FFEB3B',     // Yellow
			'failedQuizes': '#E53935',        // Red
			'notSubmittedQuizes': '#BDBDBD'   // Grey
		}

		ctx.save();
		ctx.translate(50, 0);

		for (var i = 0; i < testsData.length; i++) {

				if(i == 0) {
					ctx.fillStyle = colors['passedQuizes'];
				} else if(i == 1) {
					ctx.fillStyle = colors['notGradedQuizes'];
				} else if(i == 2) {
					ctx.fillStyle = colors['failedQuizes'];
				} else {
					ctx.fillStyle = colors['notSubmittedQuizes'];
				}

				ctx.beginPath();
				ctx.moveTo(pieChartRadius, height / 2);

				// Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
				ctx.arc(pieChartRadius, height / 2, height / 2, lastend,lastend+(Math.PI * 2 * (testsData[i] / totalQuizes)), false);

				//Parameter for lineTo: x,y
				ctx.lineTo(pieChartRadius, height / 2);
				ctx.fill();

				lastend += Math.PI * 2 * (testsData[i] / totalQuizes);
		}

		ctx.restore();
		// Pie chart overview
		ctx.save();
		ctx.translate(10, 220);

		ctx.fillStyle = colors['passedQuizes'];
		ctx.fillRect(0, 0, overviewBlockSize, overviewBlockSize);

		ctx.fillStyle = colors['failedQuizes'];
		ctx.fillRect(0, 20, overviewBlockSize, overviewBlockSize);

		ctx.font = "12px Arial";
		ctx.fillStyle = "#000";

		ctx.translate(20, 10);
		ctx.fillText("Passed (" + passedPCT + "%)", 0, 0);
		ctx.fillText("Failed (" + failedPCT + "%)", 0, 20);

		ctx.restore();

		ctx.save();
		ctx.translate(145, 190);

		ctx.fillStyle = colors['notGradedQuizes'];
		ctx.fillRect(0, 30, overviewBlockSize, overviewBlockSize);

		ctx.fillStyle = colors['notSubmittedQuizes'];
		ctx.fillRect(0, 50, overviewBlockSize, overviewBlockSize);

		ctx.font = "12px Arial";
		ctx.fillStyle = "#000";

		ctx.fillText("Not Graded (" + notGradedPCT + "%)", 20, 40);
		ctx.fillText("Not Submitted (" + notSubmittedPCT + "%)", 20, 60);

		ctx.restore();
}

function fixDeadlineInfoBoxesText(){
	var closestDeadlineArray = [];
	var duggaEntries = retdata['entries'].slice();
	var allDeadlineTexts = [];
	allDeadlineTexts.push(document.getElementById("deadlineInfoFirstText"));
	allDeadlineTexts.push(document.getElementById("deadlineInfoSecondText"));
	allDeadlineTexts.push(document.getElementById("deadlineInfoThirdText"));
	allDeadlineTexts.push(document.getElementById("deadlineInfoFourthText"));
	allDeadlineTexts.push(document.getElementById("deadlineInfoFifthText"));
	var deadLineDates = [];
	deadLineDates.push(document.getElementById("deadlineInfoFirstDate"));
	deadLineDates.push(document.getElementById("deadlineInfoSecondDate"));
	deadLineDates.push(document.getElementById("deadlineInfoThirdDate"));
	deadLineDates.push(document.getElementById("deadlineInfoFourthDate"));
	deadLineDates.push(document.getElementById("deadlineInfoFifthDate"));
	var isAnyUpcomingDugga = false;

	// remove everything from Entries that isnt a Test
	for(var i = duggaEntries.length - 1; i >= 0; i--){
		if(duggaEntries[i]['kind'] != 3){
			duggaEntries.splice(i, 1);
		}
	}

	// to find the lowest-valued-element
	if(duggaEntries.length != 0){
		duggaEntries.reduce(function(prev, curr){
			return prev.deadline < curr.deadline ? prev : curr;
		});

		Array.prototype.hasMin = function(attrib){
			if(this.length != 0){
				return this.reduce(function(prev, curr){
					return prev[attrib] < curr[attrib] ? prev : curr;
				});
			}
		}
	}

	if(duggaEntries.length > 0){
		while(closestDeadlineArray.length < allDeadlineTexts.length){
			if(closestDeadlineArray.length > 4){ // we only want 5 elements
				break;
			}
			var lowestElement = duggaEntries.hasMin('deadline');
			if(lowestElement == undefined) break; // bad solution to check if array is empty
			var testDate = new Date(lowestElement['deadline']);
			if(Date.now() < testDate.getTime()){ // if deadline hasn't already happened we save it
				closestDeadlineArray.push(lowestElement);
			}
			duggaEntries.splice(duggaEntries.indexOf(lowestElement), 1);
		}
		for(var i = 0; i < closestDeadlineArray.length; i++){
			if(closestDeadlineArray[i]['entryname'].length > 23){
				allDeadlineTexts[i].innerHTML = " " + closestDeadlineArray[i]['entryname'].slice(0, 23) + "...";
			}else{
				allDeadlineTexts[i].innerHTML = " " + closestDeadlineArray[i]['entryname'];
			}
			deadLineDates[i].innerHTML = " " + removeYearFromDate(closestDeadlineArray[i]['deadline']);
		}
	}

	if(closestDeadlineArray.length == 0){ // if we have no deadlines, put this nice text instead
		allDeadlineTexts[0].innerHTML = "No upcoming deadlines"
	}
}

function removeYearFromDate(date){
	var remadeDate = new Date(date);
	return getDateFormat(remadeDate, "dateMonth").replace("-" ,"/");
}

function drawSwimlanes(){
	var swimMoments = document.getElementById('swimlanesMoments');
	var swimWeeks = document.getElementById('swimlanesWeeks');
	var ctxMoments = swimMoments.getContext('2d');
	var ctxWeeks = swimWeeks.getContext('2d');
	var colors = {
		'passedQuizes': '#00E676',        	// Green
		'notGradedQuizes': '#FFEB3B',     	// Yellow
		'failedQuizes': '#E53935',        	// Red
		'notSubmittedQuizes': '#BDBDBD',  	// Dark grey
		'weeksOdd': '#8a7a9a',				// Purple
		'momentsOdd': '#ededed'				// Light gray
 	}

	var startdate = new Date(retdata['startdate']);
	var enddate = new Date(retdata['enddate']);
	var totalNumberOfTests = 0;

	for (var i = 0; i < retdata['entries'].length; i++){
		if (retdata['entries'][i]['kind'] == 3){
			totalNumberOfTests++;
		}
	}

	var weekLength = weeksBetween(startdate, enddate);

	var widthVar = 30;
	var momentWidth = [];
	var momentList = [];
	var numberOfMoments = 0;

	for(var i = 0; i < retdata['entries'].length; i++){
		var item = retdata['entries'][i];
		if(item['kind'] == 4){
			momentWidth.push(widthVar);
			widthVar = 30;
			momentList.push(item);
			numberOfMoments++;
		} else {
			widthVar += 30;
		}
	}

	//	Dynamic width and height for the canvases, depending on how many weeks a
	//	course is and how many moments exist in the course.
	swimMoments.width = 100;
	if(numberOfMoments != 0){ // Dynamic height, depending on number of moments
		// 60 is height of the Weeks/Moments label.
		swimMoments.height = (30 * totalNumberOfTests) + 60;
		swimWeeks.height = swimMoments.height;
	}

	if(weekLength != 0){ // Dynamic width, depending on number of weeks
		swimWeeks.width = weekLength * 35;
	}

	ctxMoments.fillStyle = 'white';
	ctxMoments.fillRect(0, 0, 100, 60);

	ctxMoments.moveTo(0, 0);
	ctxMoments.strokeStyle = colors['notSubmittedQuizes'];
	ctxMoments.lineTo(100, 60);
	ctxMoments.stroke();

	ctxMoments.fillStyle = 'black';
	ctxMoments.font = '12px Arial';
	ctxMoments.fillText('Week', 50, 20);
	ctxMoments.fillText('Moment', 10, 50);

	// Prints out the moment rows to the swimlane table.
	var y = 60;
	var isGray = true;
	for(var i = 0; i < retdata['entries'].length; i++){
		var item = retdata['entries'][i];
		if (item['kind'] == 4){
			if (isGray){
				ctxMoments.fillStyle = colors['momentsOdd'];
				ctxWeeks.fillStyle = colors['momentsOdd'];
				isGray = false;
			} else {
				ctxMoments.fillStyle = 'white';
				ctxWeeks.fillStyle = 'white';
				isGray = true;
			}
		} else if (item['kind'] == 3){
			ctxMoments.fillRect(0, y, swimMoments.width, 30);
			ctxWeeks.fillRect(0, y, swimWeeks.width, 30);
			y += 30;
		}
	}

	//	Prints out the name on the moment in the moments column.
	y = 60;
	for (var i = 0; i < retdata['entries'].length; i++){
		var item = retdata['entries'][i];
		if (item['kind'] == 4){
			ctxMoments.fillStyle = 'black';
			ctxMoments.fillText(item['entryname'], 5, y + 20);
		} else if (item['kind'] == 3){
			y += 30;
		}
	}

	// Prints out the week columns to the swimlane table.
	var x = 0;
	for(var i = 1; i < weekLength + 1; i++){
		if(i % 2 == 0){
			ctxWeeks.fillStyle = 'white';
			ctxWeeks.fillRect(x, 0, 35, 60);
			ctxWeeks.fillStyle = 'black';
			ctxWeeks.font = '12px Arial';
			ctxWeeks.fillText(i, x + 12, 33);
		}
		else {
			ctxWeeks.fillStyle = colors['weeksOdd'];
			ctxWeeks.fillRect(x, 0, 35, 60);
			ctxWeeks.fillStyle = 'black';
			ctxWeeks.font = '12px Arial';
			ctxWeeks.fillText(i, x + 12, 33);
		}
		x += 35;
	}

	ctxMoments.moveTo(99, 60);
	ctxMoments.strokeStyle = colors['notSubmittedQuizes'];
	ctxMoments.lineTo(99, swimMoments.height);
	ctxMoments.stroke();

	ctxWeeks.moveTo(0, 60);
	ctxWeeks.strokeStyle = colors['notSubmittedQuizes'];
	ctxWeeks.lineTo(swimWeeks.width, 60);
	ctxWeeks.stroke();

	// Prints out all the tests.
	var oneDay = 24 * 60 * 60 * 1000;
	y = 60;
	for (var i = 0; i < retdata['entries'].length; i++){
		var item = retdata['entries'][i];
		var result = retdata['results'];
		var testStartDate;

		if (item['qstart'] == null){
			testStartDate = new Date(retdata['startdate']);
		} else {
			testStartDate = new Date(item['qstart']);
		}

		var testEndDate = new Date(item['deadline']);
		var courseStartDate = new Date(retdata['startdate']);
		var testDuration = Math.round(Math.abs(
			+ (testStartDate.getTime() - testEndDate.getTime())/(oneDay)));
		var untilTestStart = Math.round(Math.abs(
			+ (courseStartDate.getTime() - testStartDate.getTime())/(oneDay)));

		ctxWeeks.fillStyle = colors['notSubmittedQuizes'];
		if (item['kind'] == 3){
			y += 5;
			for (var j = 0; j < result.length; j++){
				if (item['lid'] == result[j]['moment']){
					if(result[j]['grade'] == null) {
						ctxWeeks.fillStyle = colors['notGradedQuizes'];
			    } else if(result[j]['grade'] == 1) {
			      ctxWeeks.fillStyle = colors['failedQuizes'];
			    } else if(result[j]['grade'] == 2) {
						ctxWeeks.fillStyle = colors['passedQuizes'];
			    } else {
						ctxWeeks.fillStyle = colors['notSubmittedQuizes'];
					}
				}
			}

			ctxWeeks.fillRect(untilTestStart * 5, y, testDuration * 5, 20);
			y += 25;
		}
	}

	// Timeline
	var currentDate = new Date();
	var courseDay = Math.round(Math.abs(
		+ (courseStartDate.getTime() - currentDate.getTime())/(oneDay)));

	ctxWeeks.fillStyle = '#000';
	ctxWeeks.fillRect(courseDay * 5, 0, 2, swimWeeks.height);
}


// Event listeners
$(document).ready(function () {
	// Function to prevent collapsing when clicking icons
	$(document).on('click', '#corf', function (e) {
		e.stopPropagation();
	});
	$(document).on('click', '#dorf', function (e) {
		e.stopPropagation();
	});
});

$(window).load(function () {
	//There is an issue with using this code, it generates errors that stop execution
	$(window).keyup(function (event) {
		if (event.keyCode == 27) {
			closeWindows();
			closeSelect();
			showSaveButton();
			hamburgerChange("escapePress");
			document.activeElement.blur(); // to lose focus from the newItem button when pressing enter
		} else if (event.keyCode == 13) {
			//Remember that keycode 13 = enter button
			document.activeElement.blur();
			var saveButtonDisplay = ($('#saveBtn').css('display'));
			var editSectionDisplay = ($('#editSection').css('display'));
			var submitButtonDisplay = ($('#submitBtn').css('display'));
			var deleteButtonDisplay = ($('#sectionConfirmBox').css('display'));
			var errorMissingMaterialDisplay = ($('#noMaterialConfirmBox').css('display'));
			if (saveButtonDisplay == 'block' && editSectionDisplay == 'flex' && isNameValid() && isTypeValid()) {
				updateItem();
			} else if (submitButtonDisplay == 'block' && editSectionDisplay == 'flex' && isNameValid() && isTypeValid()) {
				newItem();
				showSaveButton();
			} else if (isTypeValid() && testsAvailable == true){
				confirmBox("closeConfirmBox");
				testsAvailable = false;
			} else if (errorMissingMaterialDisplay == 'flex'){
				closeWindows();
			}

		}
	});
});

// Detects clicks
$(document).mousedown(function (e) {
	var box = $(e.target);

	if (box[0].classList.contains("loginBox")) { // is the clicked element a loginbox?
		isClickedElementBox = true;
	} else if ((findAncestor(box[0], "loginBox") != null) // or is it inside a loginbox?
		&& (findAncestor(box[0], "loginBox").classList.contains("loginBox"))) {
		isClickedElementBox = true;
	} else {
		isClickedElementBox = false;
	}
});

$(document).mouseup(function (e) {


	// Click outside the loginBox
	if ($('.loginBox').is(':visible') && !$('.loginBox').is(e.target) // if the target of the click isn't the container...
		&& $('.loginBox').has(e.target).length === 0 // ... nor a descendant of the container
		&& (!isClickedElementBox)) // or if we have clicked inside box and dragged it outside and released it
	{
		closeWindows();
		closeSelect();
		showSaveButton();
	} else if (!findAncestor(e.target, "hamburgerClickable") && $('.hamburgerMenu').is(':visible')) {
		hamburgerChange("notAClick");
		closeWindows();
		closeSelect();
		showSaveButton();
	}
});

$(document).scroll(function(e){
	localStorage.setItem("sectionEdScrollPosition" + retdata.coursecode, $(window).scrollTop());
});

// Function that scrolls the page to the bottom
function scrollToBottom() {
	var scrollingElement = (document.scrollingElement || document.body)
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
}


$(document).mousedown(function(e) {
	// If the fab list is visible, there should be no timeout to toggle the list
	if ($('.fab-btn-list').is(':visible')) {
		if ($('.fab-btn-list').is(':visible') && $('#fabBtn').is(e.target)) toggleFabButton();
	} else {
      if (e.target.id == "fabBtn") {
				pressTimer = window.setTimeout(function() { toggleFabButton(); }, 200);
		}
	}
}).mouseup(function(e) {
	// A quick item should be created on a "fast click" if the fab list isn't visible / Click outside the FAB list / if the target of the click isn't the container...
	if ((e.target.id=="fabBtn") && !$('.fab-btn-list').is(':visible')) {
			clearTimeout(pressTimer);
			createQuickItem();
    }else if ($('.fab-btn-list').is(':visible') && (e.target.id!="fabBtn")) {
        toggleFabButton();
	}
}).on("touchstart", function(e){
	if ($('.fab-btn-list').is(':visible')) {
	} else {
			if (e.target.id == "fabBtn") { 
				pressTimer = window.setTimeout(function() { toggleFabButton(); }, 200); return false;
			}
	}
}).on("touchend", function(e){
    //abrupts and clears the timer for touchstart when the user lets go of the fab
    // The "Add Course Local File" popup should appear on
	// a "fast click" if the fab list isn't visible
	if ((e.target.id=="fabBtn") && !$('.fab-btn-list').is(':visible')) {
			clearTimeout(pressTimer);
			createQuickItem();
           return false;
    }// Click outside the FAB list
});
