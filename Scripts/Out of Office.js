// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: coffee; share-sheet-inputs: file-url;

// ****** User Settings ****** //

/* Set the title of the calendar the 'Out of Office' event should be added to */
const CALENDAR_TITLE = 'work';

/* Set the title of the 'Out of Office' event */
const OUT_OF_OFFICE_EVENT_TITLE = 'Out of Office';

/* Add a buffer before the event */
const BUFFER_HOURS_BEFORE_EVENT = 0;
const BUFFER_MINUTES_BEFORE_EVENT = 30;

/* Add a buffer after the event */
const BUFFER_HOURS_AFTER_EVENT = 0;
const BUFFER_MINUTES_AFTER_EVENT = 30;



// ****** Out of Office Script ****** //

/* Set true to get debugging output in console */
const IS_DEBUGGING = false;

function logDebug(input) {
    if(IS_DEBUGGING) {
        log(input);
    }
}
logDebug(`Debug logging is Enabled - The script will stay open in Scriptable when it's done`);

// Add emulated require to this script.
eval(FileManager.local().readString('/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/lib/require.js'));
logDebug((typeof require !== 'undefined') ? `Loaded require.js` : `require.js couldn't be loaded`);

var ICAL = require('ical');
logDebug((typeof ICAL !== 'undefined') ? `Loaded ical.js` : `ical.js couldn't be loaded`);

let iCalFile = iCalFileFromArgs(args);
if(!iCalFile) {
    presentNoInputAlert();
    return;
}

let iCalEvent = iCalEventFromFile(iCalFile);
let calendar = await Calendar.forEventsByTitle(CALENDAR_TITLE);
createOutOfOfficeEvent(calendar, OUT_OF_OFFICE_EVENT_TITLE, iCalEvent);

function iCalFileFromArgs(argumrnts) {
    let iCalFile = argumrnts.fileURLs[0];
    logDebug(`Input File:\n${iCalFile}`);
    return iCalFile;
}

function presentNoInputAlert() {
    let alert = new Alert();
    alert.title = 'No Input';
    alert.message = 'A ".ics" file must be provided.\n\nTry sharing a calender event from Fantastical.';
    logDebug(`Presenting Alert:\nTitle: ${alert.title}\nMessage: ${alert.message}`);
    alert.present();
}

function iCalEventFromFile(iCalFile) {
    let iCalendarData = FileManager.local().readString(iCalFile);
    let jcalData = ICAL.parse(iCalendarData);
    let vcalendar = new ICAL.Component(jcalData);
    let vevent = vcalendar.getFirstSubcomponent('vevent');
    let iCalEvent = new ICAL.Event(vevent);
    logDebug(`iCal Event:\n${iCalEvent}`);
    return iCalEvent;
}

function isAllDayiCalEvent(iCalEvent) {
    let period = new ICAL.Period({
        start: iCalEvent.startDate,
        end: iCalEvent.endDate
    });
    const HOURS_IN_A_DAY = 24;
    const SECONDS_IN_AN_HOUR = 3600;
    let isAllDayiCalEvent = (((period.getDuration().toSeconds() / SECONDS_IN_AN_HOUR) % HOURS_IN_A_DAY) === 0);
    logDebug(isAllDayiCalEvent ? 'Event is an All Day Event' : 'Event is not an All Day Event');
    return isAllDayiCalEvent;
}

function createOutOfOfficeEvent(calendar, eventTitle, iCalEvent) {
    let startDate = new Date(iCalEvent.startDate.toJSDate().getTime());
    let endDate = new Date(iCalEvent.endDate.toJSDate().getTime());
    let isAllDay = isAllDayiCalEvent(iCalEvent);

    if (isAllDay) {
        /*
         * All Day calendar events:
         * 
         * In the iOS Calendar a flag is set to indicate whether a calendar ivent is all day or not.
         * When this flag is set a calender event will be visible shown to start 00:00 the day of the event to 23:59:59.999 the day the event ends -
         * (The minute after 23:59 (00:00) will be the next day).
         * 
         * The iCal format doesn't offer this flag to indicate that an event is All Day.
         * So in iCal format an All Day event is set to start 00:00 the day of the event and end 00:00 the day after the event ends - 
         * (All Day events are perfect increments of 24 hours).
         * 
         * This means that when parsing the iCal file back to an iOS Calendar event, the iOS Calendar end Date will end up 1 day later than expected.
         * This again means that the iOS Calendar will create a 2 day All Day event from a 1 day iCal All Day event.
         */
        const ICAL_TO_CALENDAR_DATE_DELTA = 1;
        logDebug('Formatting All Day Event');
        endDate.setDate(endDate.getDate() - ICAL_TO_CALENDAR_DATE_DELTA);
    } else {
        const MILISECONDS_IN_AN_HOUR = 3600000;
        const MILISECONDS_IN_A_MINUTE = 60000;

        let msBefore = ((BUFFER_HOURS_BEFORE_EVENT * MILISECONDS_IN_AN_HOUR) + (BUFFER_MINUTES_BEFORE_EVENT * MILISECONDS_IN_A_MINUTE));
        logDebug(`Subtracting ${msBefore} MS from startDate`);
        startDate.setTime(startDate.getTime() - msBefore);
        
        let msAfter = ((BUFFER_HOURS_AFTER_EVENT * MILISECONDS_IN_AN_HOUR) + (BUFFER_MINUTES_AFTER_EVENT * MILISECONDS_IN_A_MINUTE));
        logDebug(`Adding ${msAfter} MS to endDate`);
        endDate.setTime(endDate.getTime() + msAfter);
    }

    logDebug(`Creating Event:\nTitle: ${eventTitle}\nStart: ${startDate}\nEnd: ${endDate}\nAll Day: ${isAllDay}`);
    let outOfOfficeEvent = new CalendarEvent();
    outOfOfficeEvent.calendar = calendar;
    outOfOfficeEvent.title = eventTitle;
    outOfOfficeEvent.startDate = startDate;
    outOfOfficeEvent.endDate = endDate;
    outOfOfficeEvent.isAllDay = isAllDay;
    outOfOfficeEvent.save();
}

if (!IS_DEBUGGING) {
    Script.complete();
}
