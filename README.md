This is short description of this project 
1.Set up the react-vite app
using (create react vite@latest)
2.Set up the talwind for vite using its documentaion 
3.Download the depencies requrie for this project 

"@tailwindcss/vite": "^4.1.11",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.525.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "^4.1.11"

4.set up the component for different purpose as i have ui for 
->1).Button.jsx->This Button component is a reusable, customizable React button using forwardRef.
It supports multiple variant and size styles, allowing consistent theming via Tailwind classes.
The cn utility merges conditional class names for styling.
It's structured for accessibility, flexibility, and easy extension in UI libraries.
2).Checkbox.jsx->This Checkbox component is a custom, accessible checkbox built using a <button> instead of a native <input type="checkbox">:
forwardRef and ARIA roles: Uses forwardRef to allow external refs and sets role="checkbox" with aria-checked for accessibility.
3).Input.jsx->Allows passing a ref to the underlying <input> element.
and many more


5.Add a environment variable to set replace the use of indexDb as i have directly set up the token using setItem 






