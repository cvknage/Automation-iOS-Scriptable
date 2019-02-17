// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: check-double;

/* The name of the Reminders list to uncheck */
const LIST_NAME = "Change Oil Filter"

let list = await Calendar.forRemindersByTitle(LIST_NAME)
let reminders = await Reminder.all([list])

for(reminder of reminders) {
  reminder.isCompleted = false
  reminder.save()
}

Script.complete()
