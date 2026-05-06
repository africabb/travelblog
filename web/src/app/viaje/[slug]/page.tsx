import { DynamicTripPage } from '@/components/DynamicTrip';
import { tripFromSlug } from '@/lib/trips';

export const dynamic = 'force-dynamic';

export default function GenericTripPage({ params }: { params: { slug: string } }) {
  return <DynamicTripPage config={tripFromSlug(params.slug)} />;
}
