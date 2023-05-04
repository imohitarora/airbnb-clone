'use client';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import useSearchModal from '../../hooks/useSearchModal';
import Modal from './Modal';
import { useCallback, useMemo, useState } from 'react';
import { Range } from 'react-date-range';
import dynamic from 'next/dynamic';
import CountrySelect, {
  CountrySelectValue,
} from '../inputs/CountrySelect';
import qs from 'query-string';
import { formatISO } from 'date-fns';
import Heading from '../Heading';
import Calendar from '../inputs/Calendar';
import Counter from '../inputs/Counter';

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModel = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModel = useSearchModal();

  const [location, setLocation] =
    useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const Map = useMemo(
    () =>
      dynamic(() => import('../Map'), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const onSubmit = useCallback(() => {
    if (STEPS.INFO !== step) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(
        dateRange.startDate
      );
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModel.close();
    router.push(url);
  }, [
    bathroomCount,
    dateRange,
    guestCount,
    location,
    onNext,
    params,
    roomCount,
    router,
    searchModel,
    step,
  ]);

  const actionLabel = useMemo(() => {
    switch (step) {
      case STEPS.LOCATION:
        return 'Next';
      case STEPS.DATE:
        return 'Next';
      case STEPS.INFO:
        return 'Search';
    }
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    switch (step) {
      case STEPS.LOCATION:
        return undefined;
      case STEPS.DATE:
        return 'Back';
      case STEPS.INFO:
        return 'Back';
    }
  }, [step]);

  let bodyContent = (
    <div className=" flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfect location!!"
      />
      <CountrySelect
        value={location}
        onChange={(value) => {
          setLocation(value as CountrySelectValue);
        }}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (STEPS.DATE === step) {
    bodyContent = (
      <div className=" flex flex-col gap-8">
        <Heading
          title="When do you wannna go?"
          subtitle="Make sure everyone is free!"
        />
        <Calendar
          value={dateRange}
          onChange={(val) => setDateRange(val.selection)}
        />
      </div>
    );
  }

  if (STEPS.INFO === step) {
    bodyContent = (
      <div className=" flex flex-col gap-8">
        <Heading
          title="More Information"
          subtitle="Find your perfect place!"
        />
        <Counter
          title="Guests"
          subtitle="How many guests?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Rooms"
          subtitle="How many Rooms?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Bathrooms"
          subtitle="How many Bathrooms?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModel.isOpen}
      onClose={searchModel.close}
      title="Filters"
      actionLabel={actionLabel}
      secondaryAction={
        step !== STEPS.LOCATION ? onBack : undefined
      }
      secondaryLabel={secondaryActionLabel}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default SearchModel;
