---
title: Find time zones where it's currently a certain time
date: '2016-05-05T10:18:00.000+02:00'
---

For a project I'm working I needed a function that returns the time zones where it's currently 9am. I generalized the function to be able to find time zones where it's currently any time. My Swift implementation was inspired by this [stackoverflow answer][], providing code for the same problem in Ruby.

[stackoverflow answer]: http://stackoverflow.com/a/36284082/1555903

```
func timeZonesWhereItIs(hour: Int, _ minute: Int = 0) -> [NSTimeZone] {
  let calendar = NSCalendar.init(calendarIdentifier: NSCalendarIdentifierGregorian)!
  calendar.timeZone = NSTimeZone(name: "UTC")!
  let currentUTCTime = NSDate()

  return NSTimeZone.knownTimeZoneNames().flatMap(NSTimeZone.init).filter { timeZone in
      let components = calendar.componentsInTimeZone(timeZone, fromDate: NSDate())
      components.hour = hour
      components.minute = minute
      let date = calendar.dateFromComponents(components)!

      return calendar.isDate(date, equalToDate: currentUTCTime, toUnitGranularity: .Hour)
  }
}
```

Usage:

```
timeZonesWhereItIs(12, 14)
```

To find a time zone at each hour offset use it as follows:

```
func timesZonesForEveryHour() -> [NSTimeZone] {
  return (0..<24).flatMap { timeZonesWhereItIs($0).first }
}
```

Note that there are time zones that are offset by [30 and 15 minutes][]. This function won't return those.

[30 and 15 minutes]: https://en.wikipedia.org/wiki/List_of_UTC_time_offsets

Have fun.
