import NotFound from '@/pages/NotFound';
import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router';
import AppShell from '../app';

const Home = lazy(() => import('@/pages/Home/index'));
const Analysis = lazy(() => import('@/pages/Analysis/index'));
const Assistant = lazy(() => import('@/pages/Assistant/index'));
const Report = lazy(() => import('@/pages/Assistant/components/Report/index'));
const Setting = lazy(() => import('@/pages/Setting/index'));
const LinkedApp = lazy(() => import('@/pages/LinkedApp/index'));

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<AppShell />}>
      <Route
        index
        element={<Home />}
        handle={{ title: '智慧农业AI边缘网关' }}
      />
      <Route
        path='analysis'
        element={<Analysis />}
        handle={{ title: 'AI智能识别' }}
      />
      <Route path='assistant' handle={{ title: '农业大模型助手' }}>
        <Route index element={<Assistant />} />
        <Route path='report' element={<Report />} />
      </Route>
      <Route
        path='linkedApp'
        element={<LinkedApp />}
        handle={{ title: '联动应用' }}
      />
      <Route
        path='setting'
        element={<Setting />}
        handle={{ title: '服务配置' }}
      />
      <Route path='*' element={<NotFound />} />
    </Route>,
  ),
);
