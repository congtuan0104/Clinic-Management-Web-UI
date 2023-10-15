import './global.scss';

import { ConfigProvider as AntProvider } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './App.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AntProvider locale={vi_VN}>
      <App />
    </AntProvider>
  </QueryClientProvider>,
);
