import { DynamicTripPage } from '@/components/DynamicTrip';
import { PALMA_TRIP } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export default function PalmaPage() {
  return <DynamicTripPage config={PALMA_TRIP} />;
}
