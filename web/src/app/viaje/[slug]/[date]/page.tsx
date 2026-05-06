import { DynamicTripDayPage, generateTripDayMetadata } from '@/components/DynamicTrip';
import { tripFromSlug } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { slug: string; date: string };
}) {
  return generateTripDayMetadata({ config: tripFromSlug(params.slug), date: params.date });
}

export default function GenericTripDayPage({
  params,
}: {
  params: { slug: string; date: string };
}) {
  return <DynamicTripDayPage config={tripFromSlug(params.slug)} date={params.date} />;
}
