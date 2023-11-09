import { Button, createTheme } from '@mantine/core';

// config theme of mantine ui library
export const theme = createTheme({
  fontFamily: 'Montserrat, sans-serif',
  defaultRadius: 'sm',
  components: {
    Button: Button.extend({
      styles: {
        label: { fontWeight: 500 },
      },
    }),
  },
});
