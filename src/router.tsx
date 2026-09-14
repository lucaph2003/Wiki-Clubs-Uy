import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/app/layouts/RootLayout';
import { ClubLayout, clubLoader } from '@/app/layouts/ClubLayout';
import { IndexRoute, indexLoader } from '@/routes/index/IndexRoute';
import { PortadaRoute } from '@/routes/club/PortadaRoute';
import { EspaciosRoute } from '@/routes/club/EspaciosRoute';
import { IdentidadRoute } from '@/routes/club/IdentidadRoute';
import { InstitucionRoute } from '@/routes/club/InstitucionRoute';
import { DerbyRoute, derbyLoader } from '@/routes/derby/DerbyRoute';
import { NotFoundRoute } from '@/routes/not-found/NotFoundRoute';
import { RouteError } from '@/routes/not-found/RouteError';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <IndexRoute />, loader: indexLoader },
      {
        path: 'club/:slug',
        element: <ClubLayout />,
        loader: clubLoader,
        children: [
          { index: true, element: <PortadaRoute /> },
          { path: 'espacios', element: <EspaciosRoute /> },
          { path: 'identidad', element: <IdentidadRoute /> },
          { path: 'institucion', element: <InstitucionRoute /> },
        ],
      },
      { path: 'clasico/:slug', element: <DerbyRoute />, loader: derbyLoader },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]);
