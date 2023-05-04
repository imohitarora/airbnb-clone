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
    <div>
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

  return (
    <Modal
      isOpen={searchModel.isOpen}
      onClose={searchModel.close}
      title="Filters"
      actionLabel="Search"
      onSubmit={searchModel.open}
      body={bodyContent}
    />
  );
};

export default SearchModel;
