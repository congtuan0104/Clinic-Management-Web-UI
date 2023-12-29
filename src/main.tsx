import './global.scss';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import 'dayjs/locale/vi';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '@/config';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { Notifications } from '@mantine/notifications';

import App from './App.tsx';
import { DatesProvider } from '@mantine/dates';

const queryClient = new QueryClient(); // react-query client instance

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider labels={{ confirm: 'Xác nhận', cancel: 'Hủy' }}>
          <DatesProvider settings={{ locale: 'vi' }}>
            <Notifications autoClose={2000} limit={5} />
            <App />
          </DatesProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </ReduxProvider>,
);

// register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // we will register it after the page complete the load
    navigator.serviceWorker.register('/sw.js');
  });
}
