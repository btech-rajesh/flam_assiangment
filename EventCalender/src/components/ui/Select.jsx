"use client"

import { useState, createContext, useContext, forwardRef } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "../../lib/utils"

const SelectContext = createContext()

const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "")

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedValue,
        handleValueChange,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(SelectContext)

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        isOpen && "ring-2 ring-blue-500 border-transparent",
        className,
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
    </button>
  )
})

const SelectValue = ({ placeholder }) => {
  const { selectedValue } = useContext(SelectContext)
  return <span className={cn(!selectedValue && "text-gray-500")}>{selectedValue || placeholder}</span>
}

const SelectContent = ({ children, className }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} style={{ backgroundColor: "transparent" }} />
      <div
        className={cn(
          "absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto animate-fade-in",
          className,
        )}
      >
        {children}
      </div>
    </>
  )
}

const SelectItem = ({ children, value, className }) => {
  const { selectedValue, handleValueChange } = useContext(SelectContext)
  const isSelected = selectedValue === value

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 transition-colors",
        isSelected && "bg-blue-50 text-blue-900",
        className,
      )}
      onClick={() => handleValueChange(value)}
    >
      {isSelected && <Check className="absolute left-2 h-4 w-4 text-blue-600" />}
      {children}
    </div>
  )
}

SelectTrigger.displayName = "SelectTrigger"
SelectValue.displayName = "SelectValue"
SelectContent.displayName = "SelectContent"
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
