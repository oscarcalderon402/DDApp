import React, { useMemo, useContext } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from 'react-icons/md';
import { FiEdit2 } from 'react-icons/fi';
import { format } from 'date-fns';
import GlobalFilter from './GlobalFilter';
import { GlobalContext } from '../../../context/GlobalState';
import Swal from 'sweetalert2';

const Table = () => {
  const {
    DDCases,
    deleteCase,
    openModal,
    AddToTempCase,
    isActiveApplied,
    isActiveConfirmed,
    isActivePending,
    role,
    showPreviousCases,
    pending,
    confirmed,
  } = useContext(GlobalContext);

  const COLUMNS = [
    {
      Header: 'NAME',
      accessor: 'name',
      Cell: (data) => {
        return (
          <a
            href={`https://backoffice.ualett.com/user/${data.row.original.link}`}
            target="_blank"
          >
            {data.value}{' '}
          </a>
        );
      },
    },

    {
      Header: 'CODE',
      accessor: 'code',
      Cell: (data) => {
        const {
          row: {
            original: { code },
          },
        } = data;

        if (!code) {
          return <div></div>;
        } else {
          return (
            //   <CopyToClipboard>
            //     {' '}
            //     <span>Copy to clipboard with span</span>
            //   </CopyToClipboard>
            <div>{code}</div>
          );
        }
      },
    },
    {
      //Header: 'Number Payments',
      Header: 'NUMBER PAYMENTS',
      accessor: 'number_payments',
    },
    {
      Header: 'INSTALLMENT',
      accessor: 'installment',
      Cell: (data) => {
        const { value, row } = data;
        return (
          <div key={row?.original?._id}>
            {value?.map((e) => (
              <span
                className="badge rounded-pill bg-primary mr-2"
                key={e}
                style={{ color: 'white' }}
              >
                {e}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      Header: 'AMOUNT',
      accessor: 'amount',
    },

    {
      Header: 'TIME',
      accessor: 'time',
    },
    // {
    //   Header: "IMAGE",
    //   accessor: () => "hello",
    // },
    {
      Header: 'CREATED DATE',
      accessor: (data) => {
        return data?.createdAt ? format(new Date(data?.createdAt), 'Pp') : '';
      },
    },
    {
      Header: 'VERIFIED DATE',
      accessor: (data) => {
        return data?.verifided_date
          ? format(new Date(data?.verifided_date), 'Pp')
          : '';
      },
    },
    {
      Header: 'APPLIED DATE',
      accessor: (data) => {
        return data?.applied_date
          ? format(new Date(data?.applied_date), 'Pp')
          : '';
      },
    },
    {
      Header: 'STATUS',
      accessor: 'status',
      Cell: ({ value }) => {
        if (value === 'pending') {
          return <span className="badge badge-warning">{value}</span>;
        } else if (value === 'confirmed') {
          return <span className="badge badge-success">{value}</span>;
        } else {
          return <span className="badge badge-info">{value}</span>;
        }
      },
    },
    {
      Header: '  ',
      accessor: (data) => {
        return (
          <>
            <div className="d-flex">
              {data.status !== 'applied' && role !== 'admin' && (
                <FiEdit2
                  style={{
                    marginRight: '15px',
                    cursor: 'pointer',

                    hover: { color: 'red' },
                  }}
                  size={18}
                  onClick={() => {
                    openModal(true);
                    AddToTempCase(data?._id);
                  }}
                />
              )}

              {data.status !== 'pending' && role === 'admin' && (
                <FiEdit2
                  style={{
                    marginRight: '5px',
                    cursor: 'pointer',

                    hover: { color: 'red' },
                  }}
                  size={18}
                  onClick={() => {
                    openModal(true);
                    AddToTempCase(data?._id);
                  }}
                />
              )}

              {role === 'overdue' && data.status === 'pending' && (
                <div
                  style={{
                    marginLeft: '5px',
                    color: '#dc3545',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    Swal.fire({
                      title: 'Are you sure?',
                      text: "You won't be able to revert this!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, delete it!',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // Swal.fire(
                        //   'Deleted!',
                        //   'Your file has been deleted.',
                        //   'success'
                        // );
                        deleteCase(data?._id);
                      }
                    })
                  }
                >
                  {' '}
                  X{' '}
                </div>
              )}
              {role === 'admin' && data.reviewed && (
                <p style={{ color: '#dc3545', fontSize: '15px' }}>✓</p>
              )}
            </div>
          </>
        );
      },
    },
  ];

  //   {
  //(302) 202-1304
  // {
  //   "_id": 2,
  //   "name": "Anabal Austwick",
  //   "link": "www.ualett.com/dsadasdasd",
  //   "status": "confirmed",
  //   "amount": "$114.06",
  //   "number_payments": 1,
  //   "code": "5941017448",
  //   "installment": [11],
  //   "time": "15:08",
  //   "created_date": "13:34",
  //   "verifided_date": "10/27/2020",
  //   "applied_date": "6/30/2021"
  // },

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => {
    if (showPreviousCases === true && role === 'contable') {
      return pending;
    } else if (showPreviousCases === true && role === 'admin') {
      return confirmed;
    } else {
      return DDCases.filter((e) => {
        if (
          isActivePending === true ||
          isActiveConfirmed === true ||
          isActiveApplied === true
        ) {
          return (
            (isActivePending === true && e.status === 'pending') ||
            (isActiveConfirmed === true && e.status === 'confirmed') ||
            (isActiveApplied === true && e.status === 'applied')
          );
        } else {
          return e;
        }
      });
    }
  }, [
    DDCases,
    isActiveApplied,
    isActiveConfirmed,
    isActivePending,
    showPreviousCases,
  ]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // footerGroups,
    rows,
    state,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  // setFilterGlobal({ filter: globalFilter, setFilter: setGlobalFilter });
  // getProps(globalFilter, setGlobalFilter);
  return (
    <>
      <div className="mb-3" style={{ width: '280px' }}>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      </div>
      <table {...getTableProps()} className="table table-hover">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="table-dark">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="d-flex justify-content-end mt-2">
        <span className="mr-3 mt-1">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
          {'  '}
        </span>
        {/* <select
            className="mr-2"
            style={{ borderColor: "#f2f2f2" }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}
        <button
          className="mr-2"
          style={{
            border: '0',
            overflow: 'visible',
            background: 'none',
            height: '30px',
            width: '30px',
          }}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'}
        </button>
        <button
          className="mr-2"
          style={{
            border: '0',
            overflow: 'visible',
            background: 'none',
            height: '30px',
            width: '30px',
          }}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'}
        </button>
        <button
          className="mr-2"
          style={{
            border: '0',
            overflow: 'visible',
            background: 'none',
            height: '30px',
            width: '30px',
          }}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {'>'}
        </button>
        <button
          className="mr-2"
          style={{
            border: '0',
            overflow: 'visible',
            background: 'none',
            height: '30px',
            width: '30px',
          }}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </button>
      </div>
    </>
  );
};

export default Table;
