import { Button, createTheme, MantineColorsTuple, Checkbox, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';

const primary: MantineColorsTuple = [
  '#f5f5fc',
  '#d0d0ff',
  '#9f9cff',
  '#6964ff', // main
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

const error: MantineColorsTuple = [
  '#ffe9e9',
  '#ffd1d1',
  '#fba0a1',
  '#f76d6d',
  '#f34141',
  '#f22625',
  '#f21616',
  '#d8070b',
  '#c10008',
  '#a90003',
];

// các thông báo thành công :green.6: #2BDD66
// các thông báo cảnh báo :orange.6:

// config theme of mantine ui library
export const theme = createTheme({
  colors: {
    primary,
    secondary,
    error,
  },
  primaryColor: 'primary',
  primaryShade: 3,
  fontFamily: 'Montserrat, sans-serif',
  defaultRadius: 'sm',
  cursorType: 'pointer',
  components: {
    Button: Button.extend({
      styles: {
        label: { fontWeight: 500 },
      },
    }),

    Select: Select.extend({
      styles: {
        input: {
          cursor: 'pointer',
        },
      },
    }),

    DateInput: DateInput.extend({
      styles: {
        input: {
          cursor: 'pointer',
        },
      },
    }),

    Checkbox: Checkbox.extend({
      styles: {
        label: {
          cursor: 'pointer',
        },
      },
    }),
  },
});
