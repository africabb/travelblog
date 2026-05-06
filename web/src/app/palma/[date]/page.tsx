import { DynamicTripDayPage } from '@/components/DynamicTrip';
import { PALMA_TRIP } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export default function PalmaDayPage({ params }: { params: { date: string } }) {
  return <DynamicTripDayPage config={PALMA_TRIP} date={params.date} />;
}
