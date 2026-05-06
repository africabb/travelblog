import { DynamicTripDayPage, generateTripDayMetadata } from '@/components/DynamicTrip';
import { JAPAN_TRIP } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { date: string } }) {
  return generateTripDayMetadata({ config: JAPAN_TRIP, date: params.date });
}

export default function PublicDayPage({ params }: { params: { date: string } }) {
  return <DynamicTripDayPage config={JAPAN_TRIP} date={params.date} />;
}
