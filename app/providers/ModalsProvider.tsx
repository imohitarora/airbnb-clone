'use client';

import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import RentModal from "../components/modals/RentModal";
import SearchModel from "../components/modals/SearchModel";

const ModalsProvider = () => {
  return ( 
    <>
      <LoginModal />
      <RegisterModal />
      <SearchModel />
      <RentModal />
    </>
   );
}
 
export default ModalsProvider;