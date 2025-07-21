"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { generateRecurringEvents } from "../utils/recurrence"

const EventContext = createContext()

// Storage functions directly in context
const storage_key= import.meta.env.VITE_STORAGE_KEY;

const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem(storage_key, JSON.stringify(events))
  } catch (error) {
    console.error("Failed to save events to storage:", error)
  }
}

const loadEventsFromStorage = () => {
  try {
    const stored = localStorage.getItem(storage_key)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load events from storage:", error)
    return []
  }
}

function eventReducer(state, action) {
  switch (action.type) {
    case "SET_EVENTS":
      return action.payload
    case "ADD_EVENT":
      return [...state, action.payload]
    case "UPDATE_EVENT":
      return state.map((event) => (event.id === action.payload.id ? action.payload : event))
    case "DELETE_EVENT":
      return state.filter((event) => event.id !== action.payload)
    case "DELETE_RECURRING_SERIES":
      return state.filter((event) => event.recurringId !== action.payload)
    default:
      return state
  }
}

export function EventProvider({ children }) {
  const [events, dispatch] = useReducer(eventReducer, [])

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = loadEventsFromStorage()
    if (savedEvents.length > 0) {
      dispatch({ type: "SET_EVENTS", payload: savedEvents })
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length >= 0) {
      saveEventsToStorage(events)
    }
  }, [events])

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }

    if (event.recurrence && event.recurrence.type !== "none") {
      const recurringEvents = generateRecurringEvents(newEvent)
      recurringEvents.forEach((recurringEvent) => {
        dispatch({ type: "ADD_EVENT", payload: recurringEvent })
      })
    } else {
      dispatch({ type: "ADD_EVENT", payload: newEvent })
    }
  }

  const updateEvent = (event) => {
    dispatch({ type: "UPDATE_EVENT", payload: event })
  }

  const deleteEvent = (eventId) => {
    dispatch({ type: "DELETE_EVENT", payload: eventId })
  }

  const deleteRecurringSeries = (recurringId) => {
    dispatch({ type: "DELETE_RECURRING_SERIES", payload: recurringId })
  }

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const hasConflict = (newEvent, excludeId) => {
    const newEventDate = new Date(newEvent.date)
    const newEventEnd = new Date(newEventDate.getTime() + (newEvent.duration || 60) * 60000)

    return events.some((event) => {
      if (excludeId && event.id === excludeId) return false

      const eventDate = new Date(event.date)
      const eventEnd = new Date(eventDate.getTime() + (event.duration || 60) * 60000)

      return (
        eventDate.toDateString() === newEventDate.toDateString() &&
        ((newEventDate >= eventDate && newEventDate < eventEnd) ||
          (newEventEnd > eventDate && newEventEnd <= eventEnd) ||
          (newEventDate <= eventDate && newEventEnd >= eventEnd))
      )
    })
  }

  const getFilteredEvents = (searchTerm, selectedCategory) => {
    return events.filter((event) => {
      const matchesSearch =
        !searchTerm ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = !selectedCategory || selectedCategory === "all" || event.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }

  const getAllCategories = () => {
    const categories = [...new Set(events.map((event) => event.category).filter(Boolean))]
    return categories.sort()
  }

  // Clear all events (useful for testing)
  const clearAllEvents = () => {
    dispatch({ type: "SET_EVENTS", payload: [] })
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        deleteRecurringSeries,
        getEventsForDate,
        hasConflict,
        getFilteredEvents,
        getAllCategories,
        clearAllEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}
