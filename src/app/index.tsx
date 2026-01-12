import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ConfigProvider, Image, Space, theme } from 'antd';
import Nprogress from 'nprogress';
import { Suspense, useEffect } from 'react';
import { Outlet, useMatches } from 'react-router';
import classes from './style.module.css';

Nprogress.configure({
  showSpinner: false,
});

const queryClient = new QueryClient({});

export default function AppShell() {
  const match = useMatches();

  return (
    <App>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#00b96b',
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <div className={classes.wrap}>
            <div className={classes.content}>
              <header className={classes.header}>
                <Space size='large'>
                  <Image
                    preview={false}
                    width={60}
                    src='/assets/imgs/logo.png'
                  />
                  <h1>{(match.at(-1)?.handle as { title?: string })?.title}</h1>
                </Space>
              </header>
              <main className={classes.main}>
                <Suspense fallback={<Fallback />}>
                  <Outlet />
                </Suspense>
              </main>
            </div>
          </div>
        </QueryClientProvider>
      </ConfigProvider>
    </App>
  );
}

function Fallback() {
  useEffect(() => {
    Nprogress.start();

    return () => {
      Nprogress.done();
    };
  }, []);

  return <></>;
}
