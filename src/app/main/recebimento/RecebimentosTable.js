import React from 'react';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import clsx from 'clsx';
import RecebimentosTablePaginationActions from './RecebimentosTablePaginationActions';

// const EnhancedTable = ({ columns, data, onRowClick }) => {
const EnhancedTable = ({ columns, data }) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((_columns) => [..._columns]);
    }
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  // Render the UI for your table
  return (
    <div className="flex flex-col min-h-full sm:border-1 sm:rounded-16 overflow-hidden">
      <TableContainer className="flex flex-1">
        <Table {...getTableProps()} stickyHeader className="simple borderless">
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, ind) => (
                  <TableCell
                    key={ind}
                    className="whitespace-nowrap p-4 md:p-12"
                    {...(!column.sortable
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                  >
                    {column.render('Header')}
                    {column.sortable ? (
                      <TableSortLabel
                        active={column.isSorted}
                        // react-table has a unsorted state which is not treated here
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow
                  key={i}
                  {...row.getRowProps()}
                  // onClick={(ev) => onRowClick(ev, row)}
                  // className="truncate cursor-pointer"
                  className="truncate"
                >
                  {row.cells.map((cell, ind) => {
                    return (
                      <TableCell
                        key={ind}
                        {...cell.getCellProps()}
                        className={clsx('p-4 md:p-12', cell.column.className)}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        classes={{
          root: 'flex-shrink-0 border-t-1',
        }}
        rowsPerPageOptions={[
          5,
          10,
          25,
          { label: 'All', value: data.length + 1 },
        ]}
        colSpan={5}
        count={data.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: false,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={RecebimentosTablePaginationActions}
      />
    </div>
  );
};

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  // onRowClick: PropTypes.func,
};

export default EnhancedTable;
