import { NextResponse } from 'next/server';
import getCurrentUser from '../../../actions/getCurrentUser';

import prism from '@/app/libs/prismadb';

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId: listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid reservationId');
  }

  const listing = await prism.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
