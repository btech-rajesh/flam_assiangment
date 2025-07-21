"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "./ui/Button"
import { CalendarDay } from "./CalenderDay"
import { EventModal } from "./EventModal"
import { EventDetailsModal } from "./EventDetailsModal"
import { SearchAndFilter } from "./SearchAndFilter"
import { useEvents } from "../contexts/EventContext"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const { getEventsForDate, getFilteredEvents, getAllCategories, clearAllEvents, events } = useEvents()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // Get all days including padding for previous/next month
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())

  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()))

  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  const filteredEvents = getFilteredEvents(searchTerm, selectedCategory)
  const categories = getAllCategories()

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleday = (date) => {
    setSelectedDate(date)
    setIsEventModalOpen(true)
  }

  const handleeventClick = (event) => {
    setSelectedEvent(event)
    setIsEventDetailsOpen(true)
  }

  const handleAddEvent = () => {
    setSelectedDate(new Date())
    setIsEventModalOpen(true)
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all events? This cannot be undone.")) {
      clearAllEvents()
    }
  }

  const getFilteredEventsForDate = (date) => {
    const dayEvents = getEventsForDate(date)
    return dayEvents.filter((event) => filteredEvents.some((filteredEvent) => filteredEvent.id === event.id))
  }

  // Debug: Log events to console
  useEffect(() => {
    // console.log("Current events in storage:", events)
  }, [events])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
  {/* Calendar Header */}
        
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-8 w-8 bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-800">{format(currentDate, "MMMM yyyy")}</h2>
              <Button variant="outline" size="icon" onClick={handleMonth} className="h-8 w-8 bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddEvent} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
              {events.length > 0 && (
                <Button variant="destructive" onClick={handleClearAll} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

         
          <div className="mb-4 text-sm text-gray-600">
            Total Events: {events.length} | Storage: {events.length > 0 ? "✅ Saved" : "📝 Empty"}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {allDays.map((day) => (
              <CalendarDay
                key={day.toISOString()}
                date={day}
                events={getFilteredEventsForDate(day)}
                isCurrentMonth={isSameMonth(day, currentDate)}
                isToday={isToday(day)}
                onClick={() => handleday(day)}
                onEventClick={handleeventClick}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            filteredEventsCount={filteredEvents.length}
          />
        </div>
      </div>

      {/* Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false)
          setSelectedDate(null)
        }}
        selectedDate={selectedDate}
      />

      <EventDetailsModal
        isOpen={isEventDetailsOpen}
        onClose={() => {
          setIsEventDetailsOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
      />
    </div>
  )
}
