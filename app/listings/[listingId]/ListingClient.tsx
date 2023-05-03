'use client';

import { Listing, Reservation } from '@prisma/client';
import { SafeListing, SafeUser } from '../../types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { categories } from '../../components/navbar/Categories';
import Container from '../../components/Container';
import ListingHead from '../../components/listings/ListingHead';
import ListingInfo from '../../components/listings/ListingInfo';
import useLoginModal from '../../hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import {
  differenceInCalendarDays,
  differenceInDays,
  eachDayOfInterval,
} from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import ListingReservation from '../../components/listings/ListingReservation';

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
};

interface ListingClientProps {
  reservations?: Reservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();

  const router = useRouter();

  const disabledDates = useMemo(() => {
    let disabledDates: Date[] = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      disabledDates = [...disabledDates, ...range];
    });
    return disabledDates;
  }, [reservations]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [totalPrice, setTotalPrice] = React.useState(listing.price);
  const [dateRange, setDateRange] = React.useState(initialDateRange);

  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      loginModal.open();
      return;
    }
    setIsLoading(true);
    const response = await axios
      .post('/api/reservations', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
        totalPrice,
      })
      .then(() => {
        toast.success('Listing reserved!');
        setDateRange(initialDateRange);
        // redirect to trips page
        router.refresh();
      })
      .catch(() => {
        toast.error('Something went wrong!');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    currentUser,
    dateRange.endDate,
    dateRange.startDate,
    listing?.id,
    loginModal,
    router,
    totalPrice,
  ]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );
      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className=" max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            id={listing.id}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            currentUser={currentUser}
          />
          <div className=" grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className=" order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation 
              price={listing.price}
              totalPrice={totalPrice}
              onChangeDate={(value) => setDateRange(value)}
              dateRange={dateRange}
              onSubmit={onCreateReservation}
              disabled = {isLoading}
              disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
