function initMap() {
	var mapCenter = {
		lat: 40.805,
		lng: -73.965
	};
	var map = new google.maps.Map(document.getElementById('map'), {
		center: mapCenter,
		zoom: 12
	});
	var marker = new google.maps.Marker({
		position: mapCenter,
		map: map
	});
}

initMap();

var config = {
	apiKey: "AIzaSyCxOydvIUBMsgPQwRaQisaw2bAcWt5cDrg",
	authDomain: "ls-restaurant-site.firebaseapp.com",
	databaseURL: "https://ls-restaurant-site.firebaseio.com",
	storageBucket: "ls-restaurant-site.appspot.com",
	messagingSenderId: "903157649297"
};

firebase.initializeApp(config);

var database = firebase.database();


$('form').on('submit', function (e) {
	e.preventDefault;
	$('form').validate();
	var userName = $('#userName').val();
	var userDate = $('#resDate').val();
	$('#userName').val('');
	$('#resDate').val('');
	var reservationsRef = database.ref('reservations');
	reservationsRef.push({
		name: userName,
		date: userDate
	});
});

database.ref('reservations').on("value", function (results) {
	var allReservations = results.val();
	var reservations = [];
	for (var item in allReservations) {
		var context = {
			name: allReservations[item].name,
			date: allReservations[item].date,
			reservationId: item
		};
		//get HTML from handlebars reservation template
		var source = $('#reservation-template').html();
		//compile handlebars template
		var template = Handlebars.compile(source);
		//pass data for this reservation (context) into the template
		var reservationElement = template(context);
		//push newly created element to array of reservations
		reservations.push(reservationElement);
	}
	//remove all reservations from DOM before appending items
	$('#reservationsList').empty();
	//append each reservation to the table of reservations in the DOM
	for (var i in reservations) {
		$('#reservationsList').append(reservations[i]);
	}

}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});