import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router';
import AppShell from '../app';

const Home = lazy(() => import('@/pages/Home/index'));

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<AppShell />}>
      <Route
        index
        element={<Home />}
        handle={{ title: '智慧农业AI边缘网关' }}
      />
    </Route>
  )
);
