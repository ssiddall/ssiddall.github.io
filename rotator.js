//
// Rotator.js - Rotate content based on date and/or time
//
// Version 1.5 by David Methvin, Windows Magazine
//
// Tested with JavaScript on Netscape 3.04+ and IE 3.02+
//
// For info see http://www.winmag.com/web/howto/rotator/

// Array to map unit names into actual time increments
function makeUnits() {
  this["h"] = 60*60*1000;    	// hours
  this["d"] = 24*60*60*1000;	// days
  this["w"] = 7*24*60*60*1000;	// weeks
}
units = new makeUnits();

// Define a new Rotator event
//
//   whenstr	Date and time the event occurs. Note that time
//		is expressed in 24-hour format. Examples:
//			12 Aug 1998 15:30
//			17 Oct 1999	(assumes 00:00 for time)
//			13 Dec		(assumes this year)
//			07:30		(assumes today)
//		
//   runtime	How long the event runs. A number followed by
//		either h for hours, d for days, or w for weeks.
//
//   whatstr	Text that will be returned by the object if this
//		event is currently active.
//
function RotatorEvent(whenstr, runtime, whatstr) {

  // Fix up short date and time formats
  if ( whenstr.length < 10 ) {
    var year = this.now.getYear();
    if ( year < 1000 ) year += 1900;	// Nav 2&3 bug!
    if ( whenstr.substring(2,3) == ":" ) {
      // Prepend current date to time-only format
      whenstr = this.now.getDate() + this.now.toString().substring(3,8) + year + " " + whenstr;
    } else {
      // Append current year to day-and-date format
      whenstr = whenstr + " " + year;
    }
  }

  // Create and check variable from event date/time format
  var when = new Date(whenstr);
  if ( when == 0 || isNaN(when) ) alert("Bad date: "+whenstr);

  // Calcuate event duration based on units (hours, days, weeks)
  var unit = units[runtime.substring(runtime.length-1)];
  if ( typeof(unit) == "undefined" ) alert("Bad duration: "+runtime);
  var len = runtime.substring(0,runtime.length-1) * unit;

  // See if this event is currently active
  if ( this.now.getTime() < when.getTime() ) return;     // hasn't started yet
  if ( when.getTime()+len < this.now.getTime() ) return; // already finished

  // Event is active, assign its text string to the object
  this.content = whatstr;
}

function GetEvent() {
  return this.content;
}

// Create the content rotation object
//
//   str	string to be used if no event matches
//   zone	(optional) time zone offset, in hours, from GMT
//		Examples: EST=5, EDT=4, PST=8, PDT=7
//
function Rotator(str, zone) { 
  this.content = str;		// default text for the event
  this.now = new Date();
  if ( zone ) {			// adjust for event's time zone
    this.now.setTime(this.now.getTime() +
    (this.now.getTimezoneOffset()-Math.round(zone*60))*60*1000);
  //alert("TZoffset="+Date.getTimezoneOffset()/60+" zone="+zone);
  }
  this.event   = RotatorEvent;	// function to define new events
  this.getEvent = GetEvent; 	// function to get winning event
}

