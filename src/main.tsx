import './global.scss';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import 'dayjs/locale/vi';

import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '@/config';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { Notifications } from '@mantine/notifications';

import App from './App.tsx';
import { DatesProvider } from '@mantine/dates';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient(); // react-query client instance

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId='1087876261618-736jt9okomsjkrl4ahmr7e06n7vj6a80.apps.googleusercontent.com'>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <DatesProvider settings={{ locale: 'vi' }}>
            <Notifications autoClose={2000} limit={5} />
            <App />
          </DatesProvider>
        </MantineProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </ReduxProvider>,
);
