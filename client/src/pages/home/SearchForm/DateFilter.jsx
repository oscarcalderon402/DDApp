import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { BsSearch } from 'react-icons/bs';
import { startOfDay, endOfDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { GlobalContext } from '../../../context/GlobalState';

const DateFilter = () => {
  const { getData } = useContext(GlobalContext);
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsActive(false);
    }
  }, [startDate, endDate]);

  setTimeout(() => {
    setLoading(true);
  }, [2000]);

  const handleClick = () => {
    setIsActive(true);
    getData(startDate, endDate);
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex">
        {/* DatePicket */}
        <div
          className="d-flex align-items-center h-100"
          style={{ whiteSpace: 'nowrap' }}
        >
          <span
            className="mr-2 text-center"
            //   style={{ marginRight: "10px", marginTop: "5px" }}
          >
            From :
          </span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            // showTimeSelect
            // timeFormat="hh:mm a"
            // timeIntervals={15}
            // timeCaption="time"
            dateFormat="MMMM d, yyyy "
            className="form-control"
          />
        </div>
        {/* DatePicket */}

        {/* DatePicket */}
        <div
          className="d-flex align-items-center h-100 ml-3"
          style={{ whiteSpace: 'nowrap' }}
        >
          <span className="mr-2 text-center">To :</span>
          <DatePicker
            selected={endDate}
            style={{ width: '100%' }}
            onChange={(date) => setEndDate(date)}
            // showTimeSelect
            // timeFormat="hh:mm a"
            // timeIntervals={15}
            // timeCaption="time"
            dateFormat="MMMM d, yyyy"
            className="form-control"
          />
        </div>
        <button
          style={{ background: isActive ? 'gray' : '#4582ec' }}
          className="ml-3 btn btn-primary"
          disabled={isActive ? true : false}
          onClick={handleClick}
        >
          <BsSearch />
        </button>
      </div>
    </div>
  );
};

export default DateFilter;
