import React, { useContext, useLayoutEffect } from 'react';
import { GlobalContext } from '../../../context/GlobalState';

const PendingAlert = () => {
  const {
    pending,
    confirmed,
    getPreviousCases,
    role,
    showPreviousCases,
    setShowPreviousCases,
  } = useContext(GlobalContext);

  useLayoutEffect(() => {
    getPreviousCases();
  }, [showPreviousCases]);

  return (
    <>
      {pending?.length > 0 &&
      role === 'contable' &&
      showPreviousCases === false ? (
        <button
          className="btn btn-warning"
          onClick={() => setShowPreviousCases()}
        >
          Revisar{' '}
          {pending?.length === 1 ? '1 caso' : `${pending?.length} casos`}{' '}
          Pending antes de hoy
        </button>
      ) : (
        pending?.length > 0 &&
        role === 'contable' && (
          <button
            className="btn btn-primary"
            onClick={() => setShowPreviousCases()}
          >
            Volver a casos de hoy
          </button>
        )
      )}
      {confirmed?.length > 0 &&
      role === 'admin' &&
      showPreviousCases === false ? (
        <button
          className="btn btn-success"
          onClick={() => setShowPreviousCases()}
        >
          Revisar{' '}
          {confirmed?.length === 1 ? '1 caso' : `${confirmed?.length} casos`}{' '}
          confirmados anteriores a hoy
        </button>
      ) : (
        confirmed?.length > 0 &&
        role === 'admin' && (
          <button
            className="btn btn-primary"
            onClick={() => setShowPreviousCases()}
          >
            Volver a casos de hoy
          </button>
        )
      )}
    </>
  );
};

export default PendingAlert;
