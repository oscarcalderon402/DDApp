import React, { useContext } from 'react';
import { GlobalContext } from '../../../context/GlobalState';

const StatusFilter = () => {
  const {
    DDCases,
    filterByStatus,
    isActiveApplied,
    isActiveConfirmed,
    isActivePending,
  } = useContext(GlobalContext);

  const handleClick = (status) => {
    filterByStatus(status);
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <span className="mr-2">P:</span>
      <button
        className="btn btn-outline-warning px-4 mr-2"
        style={{
          backgroundColor: isActivePending === true ? '#f0ad4e' : '',
          color: isActivePending === true ? 'white' : '',
        }}
        onClick={() => handleClick('pending')}
      >
        {DDCases?.filter((e) => e.status === 'pending').length}
      </button>
      <span className="mr-2">C:</span>
      <button
        className="btn btn-outline-success px-4 mr-2"
        style={{
          backgroundColor: isActiveConfirmed === true ? '#02b875' : '',
          color: isActiveConfirmed === true ? 'white' : '',
        }}
        onClick={() => handleClick('confirmed')}
      >
        {' '}
        {DDCases?.filter((e) => e.status === 'confirmed').length}
      </button>
      <span className="mr-2">A:</span>
      <button
        className="btn btn-outline-info px-4 mr-2"
        style={{
          backgroundColor: isActiveApplied === true ? '#17a2b8' : '',
          color: isActiveApplied === true ? 'white' : '',
        }}
        onClick={() => handleClick('applied')}
      >
        {' '}
        {DDCases?.filter((e) => e.status === 'applied').length}
      </button>
    </div>
  );
};

export default StatusFilter;
