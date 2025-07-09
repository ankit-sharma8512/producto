// themeConfig.ts
import { theme as antdTheme } from 'antd';

const theme = {
  algorithm: antdTheme.defaultAlgorithm, // or darkAlgorithm if you add dark mode
  token: {
    // Core tokens
    colorPrimary: '#91ba02', // Lime Green Accent
    colorSuccess: '#91ba02',
    colorWarning: '#FFF59D',
    colorError: '#F44336',
    colorInfo: '#D4FF63',

    colorTextBase: '#212121',
    colorTextSecondary: '#616161',
    colorLink: '#779902',

    colorBgBase: '#F8F8F8',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#E0E0E0',
    colorBorderSecondary: '#E0E0E0',

    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: 14,
    borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },

  components: {
    Layout: {
      headerBg: '#FFFFFF',
      siderBg: '#111111',
      headerHeight: 64,
      headerPadding: '0 24px',
      triggerBg: '#1A1A1A',
      triggerColor: '#91ba02',
      colorText: '#FAFAFA',
    },

    Menu: {
      itemColor: '#FAFAFA',
      itemHoverColor: '#91ba02',
      itemSelectedColor: '#91ba02',
      itemSelectedBg: '#1A1A1A',
      colorBgContainer: '#111111',
      groupTitleColor: '#DADADA',
    },

    Button: {
      colorPrimary: '#91ba02',
      colorPrimaryHover: '#b1d13b',
      colorPrimaryActive: '#B8F000',
      borderRadius: 6,
      controlHeight: 36,
    },

    Table: {
      headerBg: '#F8F8F8',
      headerColor: '#212121',
      rowHoverBg: '#FAFAFA',
      borderColor: '#E0E0E0',
    },

    Card: {
      borderRadius: 10,
      colorBgContainer: '#FFFFFF',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
      padding: 16,
    },

    Input: {
      borderRadius: 6,
      controlHeight: 36,
    },

    Select: {
      borderRadius: 6,
      controlHeight: 36,
    },

    Tag: {
      colorSuccess: '#91ba02',
      colorError: '#F44336',
      colorDefault: '#E0E0E0',
    },

    Statistic: {
      contentFontSize: 22,
    },

    Typography: {
      titleMarginBottom: 0,
      titleFontWeight: 600,
    },

    Tabs: {
      itemColor: '#616161',
      itemActiveColor: '#91ba02',
      itemSelectedColor: '#91ba02',
      inkBarColor: '#91ba02',
    },
  },
};

export default theme;
