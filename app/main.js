window.cerebro = window.cerebro || {};

window.cerebro.App = function() {
	this.KMLReader = new window.cerebro.KMLReader();
	this.map = new window.cerebro.Map( 'mainMap' );
	$( '.speed' ).on( 'change', this.setSpeed.bind( this ) );
	this.run();
};

window.cerebro.App.prototype = {
	speed: 3,
	currentDate: new Date( '2015-04-17T01:10:00.000-07:00' ),
	people: [ 'javi' ],
	run: function() {
		$( '.speed' ).val( 50 );
		this.setSpeed();
		this.people.forEach( function( person ) {
			this.KMLReader.loadFile( person )
				.done( function() {
					this.map.addPoint( person, this.KMLReader.getOrigin( person ) );
					this.initIteration();
				}.bind( this ) );
		}.bind( this ) );
	},

	setSpeed: function() {
		var speed = $( '.speed' ).val();
		if ( isNaN( speed ) || speed > 100 ) {
			$( '.speed' ).val( 1 );
			this.speed = 1;
		} else {
			this.speed = speed;
		}
	},

	getCurrentDate: function() {
		var currentMonth = this.currentMonth > 9 ? this.currentMonth : '0' + this.currentMonth;
		var currentDay = this.currentDay > 9 ? this.currentDay : '0' + this.currentMonth;
		var currentHour = this.currentHour > 9 ? this.currentHour : '0' + this.currentHour;
		return this.currentYear + '-' + currentMonth + '-' + currentDay + 'T' + currentHour + ':' + this.currentMinute + '0';
	},
	initIteration: function() {
		this.iterate();
	},
	iterate: function() {
		this.movePoints( this.currentDate );
		this.incrementTime( this.currentDate );
		$( '.dateText' ).html( this.currentDate.toLocaleString() );
		setTimeout( this.iterate.bind( this ), Math.ceil( 10000 / this.speed ) );
	},
	incrementTime: function( date ) {
		var newDate = new Date( date.getTime() + 10 * 60 * 1000 );
		this.currentDate = newDate;
	},
	movePoints: function( currentDate ) {
		this.people.forEach( function( person ) {
			var location = this.KMLReader.getLocationAtTime( person, currentDate );
			var nextLocation = this.KMLReader.getNextLocation( person, currentDate );
			var timeDifference = nextLocation.date.getTime() - this.currentDate.getTime();
			var minuteDifference = Math.ceil( timeDifference / 1000 / 60 );
			var stepDifference = Math.ceil( minuteDifference / 10 );
			if ( location.lng != nextLocation.lng && location.lat != nextLocation.lat ) {
				this.map.animatePoint( person, location, nextLocation, stepDifference, Math.ceil( 10000 / this.speed ) );
			}
		}.bind( this ) );

	}
};
