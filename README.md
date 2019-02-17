# Automation-iOS-Scriptable

This repo contains a collection of my scripts that I use for automation on iOS with the [Scriptable](https://scriptable.app) app.

Scriptable allows me to extend the functionality of Siri Shortcuts with deeper integration to iOS and third party apps.


## Uncheck Reminders
This script simply unchecks all reminders in an iOS Reminders list. 

### Setup
In the top of the script you can customize the folowing parameters:

```JavaScript
/* The name of the Reminders list to uncheck */
const LIST_NAME = "Change Oil Filter"
```


## Out of Office
This script created an 'Out of Office' event in yout work calendar from any event you share with the script in Fantastical. 

### Requirements - ./lib
This script uses the folowing files from the ./lib folder: 
- require.js
- ical.js

### Setup
In the top of the script you can customize the folowing parameters:

```JavaScript
/* Set the title of the calendar the 'Out of Office' event should be added to */
const CALENDAR_TITLE = 'work';

/* Set the title of the 'Out of Office' event */
const OUT_OF_OFFICE_EVENT_TITLE = 'Out of Office';

/* Add a buffer before the event */
const BUFFER_HOURS_BEFORE_EVENT = ;
const BUFFER_MINUTES_BEFORE_EVENT = 30;

/* Add a buffer after the event */
const BUFFER_HOURS_AFTER_EVENT = 0;
const BUFFER_MINUTES_AFTER_EVENT = 30;
```


## Test - Require

This script is simply to test if libraries can be required in correctly.

Use this script when trying out new libraries for the first time.
