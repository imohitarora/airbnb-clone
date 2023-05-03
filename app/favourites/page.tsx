import getCurrentUser from '../actions/getCurrentUser';
import getFavouriteListings from '../actions/getFavouriteListings';

import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/EmptyState';

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
