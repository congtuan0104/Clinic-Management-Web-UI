import { Button, createTheme, MantineColorsTuple, Anchor } from '@mantine/core';

const primary: MantineColorsTuple = [
  '#eaeaff',
  '#d0d0ff',
  '#9f9cff',
  '#6964ff',
  '#3d36fe',
  '#2119fe',
  '#1109ff',
  '#0200e4',
  '#0000cc',
  '#0000b4',
];

const secondary: MantineColorsTuple = [
  '#ffede4',
  '#ffdacd',
  '#ffb49b',
  '#ff8a64',
  '#fe6837',
  '#fe5119',
  '#ff4509',
  '#e43600',
  '#cb2e00',
  '#b12300',
];

// config theme of mantine ui library
export const theme = createTheme({
  colors: {
    primary,
    secondary,
  },
  primaryColor: 'primary',
  primaryShade: 3,
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
