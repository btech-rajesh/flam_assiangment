"use client"

import { useState } from "react"
import { format } from "date-fns"
import { X, Edit, Trash2, Calendar, Clock, Tag, Repeat } from "lucide-react"
import { Button } from "./ui/Button"
import { EventModal } from "./EventModal"
import { useEvents } from "../contexts/EventContext"

export function EventDetailsModal({ isOpen, onClose, event }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { deleteEvent, deleteRecurringSeries } = useEvents()

  if (!isOpen || !event) return null

  const handleDelete = () => {
    if (event.recurringId) {
      const shouldDeleteSeries = window.confirm("This is a recurring event. Do you want to delete the entire series?")
      if (shouldDeleteSeries) {
        deleteRecurringSeries(event.recurringId)
      } else {
        deleteEvent(event.id)
      }
    } else {
      deleteEvent(event.id)
    }
    onClose()
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const formatRecurrence = (recurrence) => {
    if (!recurrence || recurrence.type === "none") return "No recurrence"

    switch (recurrence.type) {
      case "daily":
        return `Every ${recurrence.interval === 1 ? "day" : `${recurrence.interval} days`}`
      case "weekly":
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          const selectedDays = recurrence.daysOfWeek.map((day) => days[day]).join(", ")
          return `Weekly on ${selectedDays}`
        }
        return `Every ${recurrence.interval === 1 ? "week" : `${recurrence.interval} weeks`}`
      case "monthly":
        return `Every ${recurrence.interval === 1 ? "month" : `${recurrence.interval} months`}`
      case "custom":
        return "Custom recurrence"
      default:
        return "No recurrence"
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
              {event.description && <p className="text-gray-600 mt-1">{event.description}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {format(new Date(event.date), "h:mm a")} ({event.duration} minutes)
                </span>
              </div>

              {event.category && (
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{event.category}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Repeat className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formatRecurrence(event.recurrence)}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color }} />
                <span className="text-sm">Event Color</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t">
            <Button variant="outline" onClick={handleEdit} className="flex-1 bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedDate={new Date(event.date)}
        editEvent={event}
      />
    </>
  )
}
