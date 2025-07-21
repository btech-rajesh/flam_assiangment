import { addDays, addWeeks, addMonths, isBefore } from "date-fns"

export function generateRecurringEvents(baseEvent) {
  if (!baseEvent.recurrence || baseEvent.recurrence.type === "none") {
    return [baseEvent]
  }

  const events = []
  const recurringId = baseEvent.id
  const startDate = new Date(baseEvent.date)
  const endDate = baseEvent.recurrence.endDate ? new Date(baseEvent.recurrence.endDate) : addMonths(startDate, 12)

  let currDate= new Date(startDate)
  let count = 0
  const maxCount = baseEvent.recurrence.count || 100

  while (isBefore(currDate, endDate) && count < maxCount) {
    // Add the current event
    events.push({
      ...baseEvent,
      id: `${recurringId}-${count}`,
      date: currDate.toISOString(),
      recurringId,
    })

    // Calculate next occurrence
    switch (baseEvent.recurrence.type) {
      case "daily":
        currDate= addDays(currDate, baseEvent.recurrence.interval || 1)
        break
      case "weekly":
        if (baseEvent.recurrence.daysOfWeek && baseEvent.recurrence.daysOfWeek.length > 0) {
          // Find next day of week
          let nextDate = addDays(currDate, 1)
          while (!baseEvent.recurrence.daysOfWeek.includes(nextDate.getDay())) {
            nextDate = addDays(nextDate, 1)
          }
          currDate= nextDate
        } else {
          currDate= addWeeks(currDate, baseEvent.recurrence.interval || 1)
        }
        break
      case "monthly":
        currDate= addMonths(currDate, baseEvent.recurrence.interval || 1)
        break
      case "custom":
        currDate= addWeeks(currDate, baseEvent.recurrence.interval || 1)
        break
      default:
        break
    }

    count++
  }

  return events
}
 