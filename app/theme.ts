export const theme = {
  colors: {
    primary: "#7C3AED", // Purple
    secondary: "#F59E0B", // Amber
    success: "#10B981", // Green
    warning: "#F59E0B", // Amber
    error: "#EF4444", // Red
    background: "#F3F4F6", // Gray-100
    surface: "#FFFFFF",
    text: {
      primary: "#1F2937", // Gray-800
      secondary: "#6B7280", // Gray-500
      light: "#9CA3AF", // Gray-400
    },
    border: "#E5E7EB", // Gray-200
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold",
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold",
    },
    h3: {
      fontSize: 20,
      fontWeight: "600",
    },
    body: {
      fontSize: 16,
      fontWeight: "normal",
    },
    caption: {
      fontSize: 14,
      fontWeight: "normal",
    },
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
};
