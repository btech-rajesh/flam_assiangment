"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { X, AlertTriangle } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { Textarea } from "./ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"
import { Checkbox } from "./ui/Checkbox"
import { useEvents } from "../contexts/EventContext"

const eventColors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Red", value: "#EF4444" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
]

const predefinedCategories = ["Work", "Personal", "Health", "Education", "Social", "Travel", "Meeting", "Appointment"]

export function EventModal({ isOpen, onClose, selectedDate, editEvent }) {
  const { addEvent, updateEvent, hasConflict, getAllCategories } = useEvents()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    color: "#3B82F6",
    category: "No Category",
    recurrence: {
      type: "none",
      interval: 1,
      daysOfWeek: [],
      endDate: "",
      count: undefined,
    },
  })
  const [conflictWarning, setConflictWarning] = useState(false)
  const [customCategory, setCustomCategory] = useState("")
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const existingCategories = getAllCategories()
  const allCategories = [...new Set([...predefinedCategories, ...existingCategories])].sort()

  useEffect(() => {
    if (editEvent) {
      const eventDate = new Date(editEvent.date)
      setFormData({
        title: editEvent.title,
        description: editEvent.description || "",
        date: format(eventDate, "yyyy-MM-dd"),
        time: format(eventDate, "HH:mm"),
        duration: editEvent.duration,
        color: editEvent.color,
        category: editEvent.category || "No Category",
        recurrence: editEvent.recurrence || {
          type: "none",
          interval: 1,
          daysOfWeek: [],
          endDate: "",
          count: undefined,
        },
      })
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: "09:00",
        title: "",
        description: "",
        category: "No Category",
      }))
    }
  }, [editEvent, selectedDate])

  useEffect(() => {
    if (formData.title && formData.date && formData.time) {
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: eventDateTime.toISOString(),
        duration: formData.duration,
        color: formData.color,
        category: formData.category,
        recurrence: formData.recurrence.type !== "none" ? formData.recurrence : undefined,
      }

      const hasConflictResult = hasConflict(eventData, editEvent?.id)
      setConflictWarning(hasConflictResult)
    }
  }, [formData, hasConflict, editEvent])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.time) return

    const eventDateTime = new Date(`${formData.date}T${formData.time}`)
    const finalCategory = showCustomCategory && customCategory ? customCategory : formData.category

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: eventDateTime.toISOString(),
      duration: formData.duration,
      color: formData.color,
      category: finalCategory,
      recurrence: formData.recurrence.type !== "none" ? formData.recurrence : undefined,
    }

    if (editEvent) {
      updateEvent({ ...eventData, id: editEvent.id })
    } else {
      addEvent(eventData)
    }

    onClose()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      color: "#3B82F6",
      category: "No Category",
      recurrence: {
        type: "none",
        interval: 1,
        daysOfWeek: [],
        endDate: "",
        count: undefined,
      },
    })
    setConflictWarning(false)
    setCustomCategory("")
    setShowCustomCategory(false)
  }

  const handleDayOfWeekChange = (day, checked) => {
    setFormData((prev) => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        daysOfWeek: checked
          ? [...prev.recurrence.daysOfWeek, day]
          : prev.recurrence.daysOfWeek.filter((d) => d !== day),
      },
    }))
  }

  const handleCategoryChange = (value) => {
    if (value === "custom") {
      setShowCustomCategory(true)
      setFormData((prev) => ({ ...prev, category: "" }))
    } else {
      setShowCustomCategory(false)
      setFormData((prev) => ({ ...prev, category: value }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{editEvent ? "Edit Event" : "Add New Event"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {conflictWarning && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">This event conflicts with an existing event</span>
            </div>
          )}

          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))}
              min="15"
              step="15"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={showCustomCategory ? "custom" : formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select or create category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Category">No Category</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="custom">+ Create New Category</SelectItem>
              </SelectContent>
            </Select>
            {showCustomCategory && (
              <Input
                className="mt-2"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter new category name"
              />
            )}
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {eventColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color.value ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Recurrence</Label>
            <Select
              value={formData.recurrence.type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  recurrence: { ...prev.recurrence, type: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Recurrence</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.recurrence.type === "weekly" && (
            <div>
              <Label>Days of Week</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <div key={day} className="flex items-center space-x-1">
                    <Checkbox
                      id={`day-${index}`}
                      checked={formData.recurrence.daysOfWeek.includes(index)}
                      onCheckedChange={(checked) => handleDayOfWeekChange(index, checked)}
                    />
                    <Label htmlFor={`day-${index}`} className="text-xs">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.recurrence.type !== "none" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interval">Repeat Every</Label>
                <Input
                  id="interval"
                  type="number"
                  value={formData.recurrence.interval}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recurrence: { ...prev.recurrence, interval: Number.parseInt(e.target.value) },
                    }))
                  }
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.recurrence.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recurrence: { ...prev.recurrence, endDate: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editEvent ? "Update Event" : "Add Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
