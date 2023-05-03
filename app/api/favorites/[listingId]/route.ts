import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
  listingId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid listing ID');
  }

  let favouriteIds = [...(currentUser.favoriteIds || [])];

  favouriteIds.push(listingId);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds: favouriteIds },
  });

  return NextResponse.json(user);

}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }
    const { listingId } = params;
    
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid listing ID');
    }
    
    let favouriteIds = [...(currentUser.favoriteIds || [])];
    
    favouriteIds = favouriteIds.filter((id) => id !== listingId);
    
    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { favoriteIds: favouriteIds },
    });
    
    return NextResponse.json(user);

}
