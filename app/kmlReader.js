window.cerebro = window.cerebro || {};

window.cerebro.KMLReader = function() {
	this.people = {};
};

window.cerebro.KMLReader.prototype = {
	loadFile: function( name ) {
		return $.ajax( {
			url: './data/' + name + '.kml',
			dataType: 'text',
			success: this.processFile.bind( this, name )
		} );
	},
	processFile: function( name, kmlText ) {
		this.people[ name ] = this.parseKML( kmlText );
	},
	parseKML: function( kmlText ) {
		var points = [],
			when,
			whenBefore,
			latlng,
			i,
			l,
			where,
			textNodes = kmlText.split( '<when>' );

		for ( i = 1, l = textNodes.length; i < l; i++ ) {
			when = textNodes[ i ].split( '</when>' )[ 0 ];
			where = textNodes[ i ].split( '<gx:coord>' )[ 1 ].split( '</gx:coord>' )[ 0 ];
			if ( ! whenBefore || this.getSignificantMinute( whenBefore ) != this.getSignificantMinute( when ) ) {
				points.push( {
					lat: where.split( ' ' )[ 1 ],
					lng: where.split( ' ' )[ 0 ],
					date: new Date( when )
				} );
			}

			whenBefore = when;
		}

		return points;
	},
	getSignificantMinute: function( when ) {
		return when[ 14 ];
	},
	getOrigin: function( person ) {
		return this.people[ person ][ 0 ];
	},
	getLocationAtTime: function( person, date ) {
		for ( var i = 0, l = this.people[ person ].length; i < l; i++ ) {
			if ( this.people[ person ][ i ].date > date ) {
				return i ? this.people[ person ][ i - 1 ] : this.people[ person ][ 0 ];
			}
		}
		return this.people[ person ][ 0 ];
	},
	getNextLocation: function( person, date, speed ) {
		var i, l;
		for ( i = 0, l = this.people[ person ].length; i < l; i++ ) {
			if ( this.people[ person ][ i ].date > date ) {
				return i < l - 1 ? this.people[ person ][ i ] : this.people[ person ][ l ];
			}
		}
		return this.people[ person ][ l - 1 ];
	}

};