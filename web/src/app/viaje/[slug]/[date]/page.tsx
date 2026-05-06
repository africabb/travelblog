import { DynamicTripDayPage } from '@/components/DynamicTrip';
import { tripFromSlug } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export default function GenericTripDayPage({
  params,
}: {
  params: { slug: string; date: string };
}) {
  return <DynamicTripDayPage config={tripFromSlug(params.slug)} date={params.date} />;
}
