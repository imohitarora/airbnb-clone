import getCurrentUser from '../../actions/getCurrentUser';
import getListingById from '../../actions/getListingById';
import getReservations from '../../actions/getReservations';
import ClientOnly from '../../components/ClientOnly';
import EmptyState from '../../components/EmptyState';
import ListingClient from './ListingClient';

interface IParams {
  listingId?: string;
}

const ListingPage = async ({
  params,
}: {
  params: IParams;
}) => {
  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  const reservation = await getReservations(params);

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        reservations={reservation}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ListingPage;
