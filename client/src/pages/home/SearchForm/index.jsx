import React, { useEffect, useContext } from 'react';
import DateFilter from './DateFilter';
import StatusFilter from './StatusFilter';
import ButtonModal from './ButtonModal';
import PendingAlert from './PendingAlert';
import { socket } from '../../../utils/socket';

import { GlobalContext } from '../../../context/GlobalState';

const SearchForm = () => {
  const { DDCases, getInitialData } = useContext(GlobalContext);

  useEffect(() => {
    if (DDCases.length > 0) {
      return;
    } else {
      getInitialData();
    }
  }, []);

  // socket.once('reload:server', (data) => {
  //   getInitialData();
  // });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <DateFilter />
        <PendingAlert />
        <StatusFilter />
        <ButtonModal />
      </div>
    </>
  );
};

export default SearchForm;
