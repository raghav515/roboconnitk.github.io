var college_map;
var directionsDisplay;
var directionsService;
var from = null;
var to   = null;
var all_markers = [];

function initMap() {
	var LatLng = data[0]['coords'];
	college_map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: LatLng
	});
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
	directionsDisplay.setMap(college_map);
	
	for (var i = 0; i < data.length; i++) {
		var marker = new google.maps.Marker({
			position: data[i]['coords'],
			map: college_map,
			title: data[i]['name']
		});
		all_markers.push(marker);
		var infoWindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infoWindow.setContent(data[i]['cont']);
				infoWindow.open(map, marker);
			}
		})(marker, i)
		);
	}
}

$(document).ready( function() {
	$('#autocomplete-input-search').autocomplete({
		data: getAllNames(data),
		limit:5,
		onAutocomplete:function(val){
			selectedMarker = all_markers.filter(function(marker){ return marker.title===val?true: false;})[0];
			new google.maps.event.trigger(selectedMarker, 'click');
		}
	});


	$('#autocomplete-input-directions-from').autocomplete({
		data: getAllNames(data),
		limit:5,
		onAutocomplete:function(val){
			selectedMarker = all_markers.filter(function(marker){ return marker.title===val?true: false;})[0];
			LatLng = selectedMarker.position;
			from = new google.maps.LatLng(LatLng.lat(), LatLng.lng());
			if(to!==null) findRoute(from,to);
		}
	});


	$('#autocomplete-input-directions-to').autocomplete({
		data: getAllNames(data),
		limit:5,
		onAutocomplete:function(val){
			selectedMarker = all_markers.filter(function(marker){ return marker.title===val?true: false;})[0];
			LatLng = selectedMarker.position;
			to = new google.maps.LatLng(LatLng.lat(), LatLng.lng());
			findRoute(from,to);
		}
	});

	$('#autocomplete-input-directions-from').keyup(function(){
		if($(this).val()==="")
		{
			$('#autocomplete-input-directions-to').val("").prop("disabled",true);
			directionsDisplay.setMap(null);
		}
		else
			$('#autocomplete-input-directions-to').removeAttr("disabled");
	})

	for (var x = 0; x < data.length; x++) {
		$("#place-tags").append("<div class=\"chip\">" + data[x]["name"] + "</div>")
	}

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	if (isMobile.any()) {
		console.log($(window).height());
		$('.row #map').css('height', parseInt($(window).height() - $('header').height() - $('.p-left').height() - 25) + "px");
	}
	else {
		$('.row #map').css('height', parseInt($(window).height() - $('header').height()) + "px");
	}
});

function getAllNames(data){
	return data.reduce(function(accumulator, currentDatum){
		accumulator[currentDatum.name] = null;
		return accumulator;
	},{});
}

function findRoute(from, to) {
	var request = {
		origin: from,
		destination: to,
		travelMode: google.maps.TravelMode["WALKING"]
	};
	directionsService.route(request, function(response, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(response);
		}
	});
}
