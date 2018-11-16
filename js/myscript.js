var slist = new Array();
var newstudent;
var studentRowId;

function Student(fullName, studentLogin, studentNumber, studentPicture) {
	this.fullName = fullName;
	this.studentLogin = studentLogin;
	this.studentNumber = studentNumber;
	this.studentPicture = studentPicture;
}

function Term(term, definition, icon, reference, referenceUrl) {
	this.term = term;
	this.definition = definition;
	this.icon = icon;
	this.reference = reference;
	this.referenceUrl = referenceUrl
}

//creating variables for products info 
var list = new Array();
var newProduct;

//creating array to hold product info
function Product(bname, dname, desc, admin, conOne, conTwo) {
	this.bname = bname;
	this.dname = dname;
	this.desc = desc;
	this.admin = admin;
	this.conOne = conOne;
	this.conTwo = conTwo;
}

$(document).on("pagecreate", "#main", function() {
	$.getJSON("students.json", function (data) {
		
		var student = data.students.student;
		console.log(student);
		for(x=0;x<student.length;x++){
			newstudent = new Student(student[x].fullName,
									student[x].studentLogin,
									student[x].studentNumber,
									student[x].studentPicture)
			slist.push(newstudent);
			$(".studentPops").append("<li li-id='"+x+"'><a href='#studentPopup' data-rel='dialog' class='ui-btn'>"+
								"<img src='"+student[x].studentPicture+"' class='studenticon'></a></li>");
		}
	});	
});


$(document).on("click","ul.studentPops >li",function(){
	rowid = $(this).closest("li").attr("li-id");
});

$(document).on("pageshow","#studentPopup",function(){
	$("#fullName").html(slist[rowid].fullName);
	$("#studentLogin").html(slist[rowid].studentLogin);
	$("#studentNumber").html(slist[rowid].studentNumber);
	$("#studentImage").html("<img src='"+slist[rowid].studentPicture+"'/>");
});


$(document).on("pagecreate", "#general", function() {
	$.getJSON("JSON02-generalhealthdefinitions.json", function (data) {
		
		var start = data.generalHealth['term-group'];
	
		var termList = new Array();

		for (x=0; x < start.length; x++) {
			term = new Term(start[x].term, start[x].definition, start[x].icon, start[x]._reference,
				start[x]['_reference-url'])
			termList.push(term);
		}
		loadGeneralHealth(termList);
	});
});

function loadGeneralHealth(terms) {
	$("#terms").html("");
	for (x=0; x < terms.length; x++) {
		$("#terms").append(
					"<section data-role='collapsible'>" +
						"<h3 class='ui-btn ui-icon-"+
							terms[x].term.split(' ')[0].toLowerCase()+
							" ui-btn-icon-left'>"+
							"<span id='n"+x+"'>"+
								terms[x].term+
							"</span>"+
						"</h3>"+
						"<p>" +
							"<table>" +
								"<tr><th>Definition</th><td>" + terms[x].definition + "</td></tr>" +
								"<tr><th>Reference</th><td>" + terms[x].reference + "</td></tr>" +
								"<tr><th>Reference URL</th><td><a href='" + terms[x].referenceUrl + "'>" +
								terms[x].referenceUrl + "</td></tr>" +
								"<tr><td colspan='2' ><div align=center class='Gicon'><img src='"+terms[x].icon+"'/></div></td></tr>"+
							"</table>" +
						"</p>" +	
					"</section>"
		);
			
	}
	$("#terms").collapsibleset("refresh");
}



$(document).on("ready", function () {
	$.ajax({url: 'pharmaceutical.xml',
			data: {},
			type: 'GET',
			dataType: 'xml',
			success: function(result){
						var name =  $(result).find('company-name').text();
						var phone = $(result).find('phone-number').text();
						lat = Number($(result).find('latitude').text());
						lng = Number($(result).find('longitude').text());
						initMap(name, phone, lat, lng);

			} 
	});
});

function initMap(name, phone, lat, lng) {
	var mapCampus = new google.maps.LatLng(lat, lng);
	
	var mapOptions = {
	  center: mapCampus,
	  zoom: 15,
	  mapTypeID : google.maps.MapTypeId.HYBRID
	}

	var mapSH = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	var myLoc = new google.maps.Marker({
		map : mapSH, //required
		position : mapCampus, //required
		icon : "pushpin.gif",
		animation : google.maps.Animation.DROP
	});

	var info = new google.maps.InfoWindow({
				content : "COMPANY INFO:<br>" + 
				"Name: " + name + "<br>" + 
				"Phone: " + phone
	});

	google.maps.event.addListener(myLoc, "click", function(){
				info.open(mapSH, myLoc);
	});

}


//pharmaceutical page
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
       myFunction(this);
   }
};
xhttp.open("GET", "pharmaceutical.xml", true);
xhttp.send();
function myFunction(xml) {

	var xmlDoc = xml.responseXML;

	//populating products
	product = xmlDoc.getElementsByTagName("product");
		
	for(x = 0, y = 0; x < product.length; x++, y+=2){
		bname = xmlDoc.getElementsByTagName("brand-name")[x].childNodes[0].nodeValue;
		dname = xmlDoc.getElementsByTagName("drug-name")[x].childNodes[0].nodeValue;
		desc = xmlDoc.getElementsByTagName("description")[x].childNodes[0].nodeValue;
		admin = xmlDoc.getElementsByTagName("administration")[x].childNodes[0].nodeValue;
		conOne = xmlDoc.getElementsByTagName("contraindication")[y].childNodes[0].nodeValue;
		conTwo = xmlDoc.getElementsByTagName("contraindication")[y+1].childNodes[0].nodeValue;
		
		newProduct = new Product(bname, dname, desc, admin, conOne, conTwo)
			list.push(newProduct);
		}
		loadData();
} //end of myFunction

//populating product info
function loadData(){
	$("#products").html("");
	for(x = 0; x < list.length; x++){
		$("#products").append(
			"<section data-role='collapsible'>" +
			"<h3>" + 
			"<span id='n" + x + "'>" + 
				list[x].bname + "</span>" + 
			"</h3>" + 
			"<p>" +
				"<table>" +
					"<tr><th>DRUG NAME</th><td>" + list[x].dname + "</td></tr>" +
					"<tr><th>DESCRIPTION</th><td>" + list[x].desc + "</td></tr>" +
					"<tr><th>ADMINISTRATION</th><td>" + list[x].admin + "</td></tr>" +									
					"<tr><th>CONTRAINDICATION</th><td>" + list[x].conOne + "<br>" + list[x].conTwo + "</td></tr>" +
				"</table>" +
			"</section>"
		); //end of append - product info
	} //end of for loop

	// $("#products").collapsibleset("refresh");

} //end of loadData function



	
