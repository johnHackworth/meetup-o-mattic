window.cerebro = window.cerebro || {};

window.cerebro.Map = function( id ) {
	this.markers = {};
	this.map = L.map( id ).setView( [ 31.505, -70.09 ], 4 );
	L.tileLayer( 'https://{s}.tiles.mapbox.com/v4/examples.ra3sdcxr/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q', {
	} ).addTo( this.map );
};

window.cerebro.Map.prototype = {
	animationSteps: 5,
	addPoint: function( pointId, latlng ) {
		var options = {
			className: 'pointTitle',
			title: pointId,
			icon: this.createIcon( 'http://2.gravatar.com/avatar/aea8fc8e014aa6431088a79f31934880' )
		};
		var circle = L.marker( [ latlng.lat, latlng.lng ], options ).addTo( this.map );
		this.markers[ pointId ] = circle;
	},
	movePoint: function( pointId, latlng ) {
		this.markers[ pointId ].setLatLng( latlng );
	},
	animatePoint: function( pointId, originalLatlng, destination, step, speed ) {
		var currentLatlng = {
			lat: this.markers[ pointId ].getLatLng().lat,
			lng: this.markers[ pointId ].getLatLng().lng
		};
		var timeDifference = destination.date.getTime() - originalLatlng.date.getTime();
		var minuteDifference = Math.ceil( timeDifference / 1000 / 60 );
		var stepDifference = Math.ceil( minuteDifference / 10 );
		for ( var i = 0; i <= this.animationSteps; i++ ) {
			setTimeout( function( step ) {
				var latlng = {
					lat: currentLatlng.lat - step * ( currentLatlng.lat - destination.lat ) / stepDifference / this.animationSteps,
					lng: currentLatlng.lng - step * ( currentLatlng.lng - destination.lng ) / stepDifference / this.animationSteps
				};
				this.markers[ pointId ].setLatLng( latlng );
			}.bind( this, i ), Math.floor( i * speed / this.animationSteps ) );
		}
	},
	createIcon: function( image ) {
		return L.icon( {
			iconUrl: image,
			iconSize: [ 30, 30 ],
			iconAnchor: [ 30, 30 ],
			shadowUrl: image,
			shadowRetinaUrl: image,
			shadowSize: [ 0, 0 ],
			shadowAnchor: [ 15, 15 ]
		} );
	}
};