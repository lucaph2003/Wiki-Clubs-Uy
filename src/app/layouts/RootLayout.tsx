import { Outlet } from 'react-router';
import { AudioToggle } from '@/components/media/AudioToggle';

export function RootLayout(): React.ReactElement {
  return (
    <div className="min-h-dvh bg-club-surface text-club-ink">
      <Outlet />
      <AudioToggle />
    </div>
  );
}
