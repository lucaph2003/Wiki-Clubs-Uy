import { RouterProvider } from 'react-router';
import { router } from '@/router';
import { SkinProvider } from './providers/SkinProvider';
import { MotionProvider } from './providers/MotionProvider';
import { AudioProvider } from './providers/AudioProvider';

export function App(): React.ReactElement {
  return (
    <SkinProvider>
      <MotionProvider>
        <AudioProvider>
          <RouterProvider router={router} />
        </AudioProvider>
      </MotionProvider>
    </SkinProvider>
  );
}
