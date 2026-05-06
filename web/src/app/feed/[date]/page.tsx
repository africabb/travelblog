import { DynamicTripDayPage } from '@/components/DynamicTrip';
import { JAPAN_TRIP } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export default function PublicDayPage({ params }: { params: { date: string } }) {
  return <DynamicTripDayPage config={JAPAN_TRIP} date={params.date} />;
}
