/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-accent': '#06cf9c',
        'green-primary': '#005c4b',
        'green-secondary': '#025244',
        'bg-primary': '#202c33',
        'bg-secondary': '#111b21',
        "bg-container": "#233138",
        "bg-thridht": "#1c272e",
        'icon-color': '#aebbc2',
        'message': '#202c33',
        'danger': '#f25c6e',
        "color-text": "#e8deba",
        "border-color": "#212c33",
        "hover-color": "#2a3942",
        "accent-hover-color": "#344047",
      },
      animation: {
        "progress-bar": "progress ",
        "accordion-down": "accordion-down .2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-left": "slide-left 0.3s ease-out",
        "slide-right": "slide-right 0.3s ease-out",
      },
      keyframes: {
        "progress": {
          "0%": { width: "0%"},
          "100%": { width: "100%" }
        },
        "accordion-down": {
          from: { transform: "translateY(-5%)", opacity: 0  },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "slide-left":{
          from: { transform: "translateX(-40%)", opacity: 0  },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        "slide-right":{
          from: { transform: "translateX(40%)", opacity: 0  },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        "accordion-up": {
          from: { transform: "translateY(5%)", opacity: 0  },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      }
    },
  },
  plugins: [],
}