"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useEvents } from "../contexts/EventContext"

export function CalendarDay({ date, events, isCurrentMonth, isToday, onClick, onEventClick }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const { updateEvent } = useEvents()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const eventData = e.dataTransfer.getData("text/plain")
    if (!eventData) return

    try {
      const draggedEvent = JSON.parse(eventData)
      const newDate = new Date(date)
      const originalDate = new Date(draggedEvent.date)
      newDate.setHours(originalDate.getHours(), originalDate.getMinutes())

      updateEvent({
        ...draggedEvent,
        date: newDate.toISOString(),
      })
    } catch (error) {
      console.error("Error dropping event:", error)
    }
  }

  const handleEventDragStart = (e, event) => {
    e.stopPropagation()
    e.dataTransfer.setData("text/plain", JSON.stringify(event))
    e.dataTransfer.effectAllowed = "move"
  }

  const dayClasses = [
    "calendar-day",
    isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400",
    isToday ? "today" : "",
    isDragOver ? "drag-over" : "",
    !isCurrentMonth ? "text-gray-400" : "text-gray-900",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={dayClasses}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600 font-bold" : ""}`}>{format(date, "d")}</div>

      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="event-item"
            style={{ backgroundColor: event.color }}
            draggable
            onDragStart={(e) => handleEventDragStart(e, event)}
            onClick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            title={`${format(new Date(event.date), "HH:mm")} - ${event.title}${event.category ? ` (${event.category})` : ""}`}
          >
            {format(new Date(event.date), "HH:mm")} {event.title}
          </div>
        ))}
        {events.length > 3 && <div className="text-xs text-gray-500 pl-1">+{events.length - 3} more</div>}
      </div>
    </div>
  )
}
