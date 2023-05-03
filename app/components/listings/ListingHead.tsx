'use client';

import React from 'react';
import { SafeUser } from '../../types';
import useCountries from '../../hooks/useCountries';
import Heading from '../Heading';
import Image from 'next/image';
import HeartButton from '../HeartButton';

interface ListingHeadProps {
  title: string;
  locationValue: string;
  imageSrc: string;
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser,
}) => {
  const { getByValue } = useCountries();
  const country = getByValue(locationValue);
  return (
    <>
      <Heading
        title={title}
        subtitle={`${country?.region}, ${country?.label}`}
      />
      <div className=" w-full h-[60vh] relative overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className=" object-cover w-full"
        />
        <div className=" absolute right-5 top-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
