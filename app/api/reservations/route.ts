import { NextResponse } from 'next/server';
import prism from '@/app/libs/prismadb';
import getCurrentUser from '../../actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } =
    body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const reservation = await prism.listing.update({
    where: { id: listingId },
    data: {
      reservations: {
        create: {
          startDate,
          endDate,
          totalPrice,
          userId: currentUser.id,
        },
      },
    },
  });

  return NextResponse.json(reservation);
}
