import React, { useContext } from 'react';
import ModalAddCase from '../ModalAddCase';
import { GlobalContext } from '../../../context/GlobalState';

const ButtonModal = () => {
  const { isOpenModal, openModal, role } = useContext(GlobalContext);

  return (
    <>
      {!!isOpenModal && <ModalAddCase />}
      {role === 'overdue' && (
        <div>
          <button
            className="btn btn-primary  px-5"
            onClick={() => openModal(true)}
          >
            +ADD CASE
          </button>
        </div>
      )}
    </>
  );
};

export default ButtonModal;
