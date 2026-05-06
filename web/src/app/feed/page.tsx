import { DynamicTripPage } from '@/components/DynamicTrip';
import { JAPAN_TRIP } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export default function FeedPage() {
  return <DynamicTripPage config={JAPAN_TRIP} />;
}
