/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Define a custom light theme
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
  dark: false, // Set the theme to light
  colors: {
    background: '#FFFFFF', // Background color
    surface: '#FFFFFF', // Surface color for cards and components
    'surface-bright': '#FFFFFF', // Bright surface color
    'surface-light': '#EEEEEE', // Light surface color
    'surface-variant': '#424242', // Variant surface color
    'on-surface-variant': '#EEEEEE', // Text color on variant surface
    primary: '#1867C0', // Primary color
    'primary-darken-1': '#1F5592', // Darker shade of primary color
    secondary: '#48A9A6', // Secondary color
    'secondary-darken-1': '#018786', // Darker shade of secondary color
    error: '#B00020', // Error color
    info: '#2196F3', // Info color
    success: '#4CAF50', // Success color
    warning: '#FB8C00', // Warning color
  },
  variables: {
    'border-color': '#000000', // Border color
    'border-opacity': 0.12, // Border opacity
    'high-emphasis-opacity': 0.87, // High emphasis opacity
    'medium-emphasis-opacity': 0.6, // Medium emphasis opacity
    'disabled-opacity': 0.38, // Disabled component opacity
    'idle-opacity': 0.04, // Idle state opacity
    'hover-opacity': 0.04, // Hover state opacity
    'focus-opacity': 0.12, // Focus state opacity
    'selected-opacity': 0.08, // Selected state opacity
    'activated-opacity': 0.12, // Activated state opacity
    'pressed-opacity': 0.12, // Pressed state opacity
    'dragged-opacity': 0.08, // Dragged state opacity
    'theme-kbd': '#212529', // Keyboard background color
    'theme-on-kbd': '#FFFFFF', // Keyboard text color
    'theme-code': '#F5F5F5', // Code background color
    'theme-on-code': '#000000', // Code text color
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme, // Register the custom theme
    },
  },
})
