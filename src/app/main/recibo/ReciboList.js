import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import ReciboTable from './ReciboTable';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {
  openEditReciboDialog,
  // removeRecebimento,
  // toggleStarredRecebimento,
  selectRecibo,
} from './store/reciboSlice';

const ReciboList = () => {
  const dispatch = useDispatch();
  const recibo = useSelector(selectRecibo);
  const searchText = useSelector(
    ({ reciboApp }) => reciboApp.recibo.searchText
  );
  const user = useSelector(({ auth }) => auth.user);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: 'Recibo',
        accessor: 'tipo',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Valor definido',
        accessor: 'valorFormat',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Data',
        accessor: 'data',
        className: 'font-medium',
        sortable: true,
      },
      {
        id: 'action',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            {user.role == 'admin' ? (
              <Tooltip title="Editar" aria-label="editar">
                <IconButton
                  onClick={(ev) => {
                    ev.stopPropagation();
                    dispatch(openEditReciboDialog(row.original));
                  }}
                >
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>
            ) : (
              ''
            )}
          </div>
        ),
      },
    ],
    // [dispatch, user.starred]
    [dispatch]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return recibo;
      }
      return FuseUtils.filterArrayByString(recibo, _searchText);
    }

    if (recibo) {
      setFilteredData(getFilteredArray(recibo, searchText));
    }
  }, [recibo, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          Nenhum recibo cadastrado!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    >
      <ReciboTable columns={columns} data={filteredData} />
    </motion.div>
  );
};

export default ReciboList;
