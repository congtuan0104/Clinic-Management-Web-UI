module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    // fontFamily: {
    //   SFPro: ['var(--font-SFPro)'],
    //   font_icon: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    // },
    screens: {
      xs: '320px',
      xsl: '460px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    },
    extend: {
      colors: {
        primary: {
          900: '#0000b4',
          800: '#0000cc',
          700: '#0200e4',
          600: '#1109ff',
          500: '#2119fe',
          400: '#3d36fe',
          300: '#6964ff',
          200: '#9f9cff',
          100: '#d0d0ff',
          0: '#f5f5fc',
        },
        secondary: {
          900: '#ffede4',
          800: '#ffdacd',
          700: '#ffb49b',
          600: '#ff8a64',
          500: '#fe6837',
          400: '#fe5119',
          300: '#ff4509',
          200: '#e43600',
          100: '#cb2e00',
          0: '#b12300',
        },
        black: {
          100: '#000000',
          90: '#1d1d1d',
          80: '#333333',
          70: '#444444',
          30: '#999999',
          25: '#dfdfdf',
          20: '#e9edf0',
          10: '#e8e8e8',
        },
      },
      fontSize: {
        6: '6px',
        8: '8px',
        10: '10px',
        11: '11px',
        12: '12px',
        13: '13px',
        14: '14px',
        15: '15px',
        16: '16px',
        17: '17px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        28: '28px',
        32: '32px',
        36: '36px',
        48: '48px',
      },
      flex: {
        '1/10': '0 0 10%',
        '1/15': '0 0 15%',
        '2/10': '0 0 20%',
        '3/15': '0 0 35%',
        '3/10': '0 0 30%',
        '4/10': '0 0 40%',
        '5/10': '0 0 50%',
        '6/10': '0 0 60%',
        '6/15': '0 0 65%',
        '7/10': '0 0 70%',
        '7/15': '0 0 75%',
        '8/10': '0 0 80%',
        '8/15': '0 0 85%',
        '9/10': '0 0 90%',
        '10/10': '0 0 100%',
        none: 'none',
      },
      borderRadius: {
        '3px': '3px',
        '4px': '4px',
        '6px': '6px',
        '8px': '8px',
        '20px': '20px',
        '100px': '100px',
      },
      borderWidth: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '6px': '6px',
        '9px': '9px',
        '10px': '10px',
      },
      spacing: {
        '-2px': '2px',
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '6px': '6px',
        '7px': '7px',
        '9px': '9px',
        '10px': '10px',
      },
      maxWidth: {
        '1/10': '10%',
        '1/15': '15%',
        '2/10': '20%',
        '3/10': '30%',
        '3/15': '35%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '6/15': '65%',
        '7/10': '70%',
        '7/15': '75%',
        '8/10': '80%',
        '8/15': '85%',
        '9/10': '90%',
        '10/10': '100%',
      },
      height: {
        fill: '-webkit-fill-available',
        moz: '-moz-available',
      },
      width: {
        fill: '-webkit-fill-available',
        moz: '-moz-available',
      },
      margin: {
        '-2px': '2px',
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '6px': '6px',
        '7px': '7px',
        '9px': '9px',
        '10px': '10px',
        '13px': '13px',
        '14px': '14px',
        '15px': '15px',
        '17px': '17px',
        '18px': '18px',
        '21px': '21px',
        '23px': '23px',
        '29px': '29px',
        '31px': '31px',
        '34px': '34px',
        '38px': '38px',
        '40px': '40px',
        '43px': '43px',
        '45px': '45px',
        '46px': '46px',
        '50px': '50px',
        '51px': '51px',
        '61px': '61px',
        '66px': '66px',
        '70px': '70px',
        '75px': '75px',
        '85px': '85px',
        '91px': '91px',
        '122px': '122px',
        '124px': '124px',
        '131px': '131px',
        '157px': '157px',
        '170px': '170px',
        '171px': '171px',
        '177px': '177px',
        '179px': '179px',
        '207px': '207px',
        '230px': '230px',
        '217px': '217px',
        '252px': '252px',
        '269px': '269px',
        '298px': '298px',
        '314px': '314px',
        '665px': '665px',
        '688px': '688px',
        '696px': '696px',
      },
    },
  },
  // variants: {
  //   extend: {
  //     cursor: ['hover', 'focus'],
  //   },
  // },
  // plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
  corePlugins: {
    preflight: false, // <== disable to fix conflict with antd
  },
};
