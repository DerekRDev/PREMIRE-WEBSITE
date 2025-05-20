import { colors, spacing, typography } from './tokens';

export const theme = {
  colors,
  spacing,
  typography,
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index values for layering
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  // Border radius values
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadow values
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(24, 144, 255, 0.5)',
    none: 'none',
  },
  
  // Transition properties
  transitions: {
    ease: {
      default: 'ease-in-out',
      in: 'ease-in',
      out: 'ease-out',
      linear: 'linear',
    },
    duration: {
      faster: '50ms',
      fast: '100ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
  },
  
  // Component-specific theme values
  components: {
    // Button variants
    button: {
      variants: {
        primary: {
          backgroundColor: colors.primary[500],
          color: colors.white,
          hoverBackgroundColor: colors.primary[600],
          activeBackgroundColor: colors.primary[700],
          focusRingColor: colors.primary[500],
        },
        secondary: {
          backgroundColor: colors.secondary[500],
          color: colors.white,
          hoverBackgroundColor: colors.secondary[600],
          activeBackgroundColor: colors.secondary[700],
          focusRingColor: colors.secondary[500],
        },
        outline: {
          backgroundColor: 'transparent',
          color: colors.primary[500],
          borderColor: colors.primary[500],
          hoverBackgroundColor: colors.primary[50],
          activeBackgroundColor: colors.primary[100],
          focusRingColor: colors.primary[500],
        },
        text: {
          backgroundColor: 'transparent',
          color: colors.primary[500],
          hoverColor: colors.primary[600],
          activeColor: colors.primary[700],
          focusRingColor: colors.primary[500],
        },
      },
    },
    
    // Card variants
    card: {
      backgroundColor: colors.white,
      borderColor: colors.neutral[200],
      borderRadius: '0.5rem',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
    },
    
    // Input variants
    input: {
      borderColor: colors.neutral[300],
      focusBorderColor: colors.primary[500],
      errorBorderColor: colors.red[500],
      backgroundColor: colors.white,
      disabledBackgroundColor: colors.neutral[100],
      placeholderColor: colors.neutral[400],
    },
    
    // Select variants
    select: {
      borderColor: colors.neutral[300],
      focusBorderColor: colors.primary[500],
      errorBorderColor: colors.red[500],
      backgroundColor: colors.white,
      disabledBackgroundColor: colors.neutral[100],
    },
    
    // Modal variants
    modal: {
      overlayBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundColor: colors.white,
      borderRadius: '0.5rem',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
};

// Export theme for use in the application
export default theme;