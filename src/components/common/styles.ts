import { theme } from '../../styles/theme';

export const commonStyles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  pageContainer: {
    padding: '2rem 0',
  },
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.md,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    display: 'block',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${theme.colors.secondary.light}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '1rem',
    transition: 'all 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary.main,
      boxShadow: `0 0 0 3px ${theme.colors.primary.light}40`,
    },
  },
  button: {
    base: {
      padding: '0.5rem 1rem',
      borderRadius: theme.borderRadius.md,
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.2s',
      cursor: 'pointer',
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${theme.colors.primary.light}40`,
      },
    },
    primary: {
      backgroundColor: theme.colors.primary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.colors.primary.dark,
      },
    },
    secondary: {
      backgroundColor: theme.colors.secondary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.colors.secondary.dark,
      },
    },
    outline: {
      backgroundColor: 'transparent',
      border: `1px solid ${theme.colors.primary.main}`,
      color: theme.colors.primary.main,
      '&:hover': {
        backgroundColor: `${theme.colors.primary.main}10`,
      },
    },
  },
  heading: {
    h1: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      lineHeight: theme.typography.h1.lineHeight,
      marginBottom: theme.spacing.lg,
    },
    h2: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      lineHeight: theme.typography.h2.lineHeight,
      marginBottom: theme.spacing.md,
    },
    h3: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      lineHeight: theme.typography.h3.lineHeight,
      marginBottom: theme.spacing.sm,
    },
    h4: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.h4.fontWeight,
      lineHeight: theme.typography.h4.lineHeight,
      marginBottom: theme.spacing.sm,
    },
  },
  alert: {
    base: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    success: {
      backgroundColor: `${theme.colors.success}10`,
      color: theme.colors.success,
      border: `1px solid ${theme.colors.success}`,
    },
    error: {
      backgroundColor: `${theme.colors.error}10`,
      color: theme.colors.error,
      border: `1px solid ${theme.colors.error}`,
    },
    warning: {
      backgroundColor: `${theme.colors.warning}10`,
      color: theme.colors.warning,
      border: `1px solid ${theme.colors.warning}`,
    },
  },
}; 