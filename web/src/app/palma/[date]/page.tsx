import { DynamicTripDayPage, generateTripDayMetadata } from '@/components/DynamicTrip';
import { PALMA_TRIP } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { date: string } }) {
  return generateTripDayMetadata({ config: PALMA_TRIP, date: params.date });
}

export default function PalmaDayPage({ params }: { params: { date: string } }) {
  return <DynamicTripDayPage config={PALMA_TRIP} date={params.date} />;
}
