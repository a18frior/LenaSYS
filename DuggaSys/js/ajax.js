 function submitNewCourse() 
 {
 	if (validateNewCourseSubmit()) {
 		$.ajax({
 			dataType: "json",
			type: "POST",
			url: "ajax/createNewCourse.php",
			data: {
				coursename: document.newCourse.coursename.value,
				coursecode: document.newCourse.coursecode.value,
				visib: document.newCourse.visib.value
			},
			success:function(data) {
				if (data.cid>0) {
					changeURL("sectioned?courseid="+data.cid);	
				} else if(data==="no access") {
					alert("ap ap ap!");	
				}
				
			},
			error:function() {
				console.log("Something went wrong");
			}
		});

$.ajax({
		dataType: "json",
		type: "POST",
		url: 'addstudent_ajax.php',
		data: {
		string: $("#string").val()
	},
		success: function (data) {
		//console.log(data);
		showPopUp('show', data)
	},
	});


 	};
 }