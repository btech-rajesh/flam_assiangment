"use client"

import { Search, Filter, X } from "lucide-react"
import { Input } from "./ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"
import { Label } from "./ui/Label"
import { Button } from "./ui/Button"

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  filteredEventsCount,
}) {
  const handleClearFilters = () => {
    onSearchChange("")
    onCategoryChange("")
  }

  const hasActiveFilters = searchTerm || selectedCategory

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Search & Filter
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-500 hover:text-gray-700">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div>
        <Label htmlFor="search">Search Events</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Filter by Category</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 pt-2 border-t">
        {hasActiveFilters ? (
          <p>
            Showing {filteredEventsCount} event{filteredEventsCount !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory && ` in "${selectedCategory}"`}
          </p>
        ) : (
          <p>Showing all events</p>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button onClick={() => onSearchChange("")} className="ml-1 hover:text-blue-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Category: {selectedCategory}
                <button onClick={() => onCategoryChange("")} className="ml-1 hover:text-green-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
