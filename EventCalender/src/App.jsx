import { Calendar } from "./components/Calender"
import { EventProvider } from "./contexts/EventContext"
import "./App.css"

function App() {
  return (
    <EventProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Event Calendar</h1>
           <div className="text-center mb-4 text-sm text-gray-600">
           {/* Add events by clicking on any day |  Search and filter events |  Drag events to reschedule */}
           </div> 
          <Calendar />
        </div>
      </div>
    </EventProvider>
  )
}

export default App
