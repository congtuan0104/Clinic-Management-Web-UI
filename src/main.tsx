import './global.scss';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '@/config';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { Notifications } from '@mantine/notifications';

import App from './App.tsx';

const queryClient = new QueryClient(); // react-query client instance

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications autoClose={2000} />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </ReduxProvider>,
);
