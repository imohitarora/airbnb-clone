import getCurrentUser from '@/app/actions/getCurrentUser';
import getFavouriteListings from '@/app/actions/getFavouriteListings';

import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';

import FavouritesClient from './FavouritesClient';

const FavouritesPage = async () => {
  const user = await getCurrentUser();
  const listings = await getFavouriteListings();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No Favourites"
          subtitle="You don't have any favourites yet. Click the heart icon on a listing to add it to your favourites."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavouritesClient
        currentUser={user}
        listings={listings}
      />
    </ClientOnly>
  );
};

export default FavouritesPage;
