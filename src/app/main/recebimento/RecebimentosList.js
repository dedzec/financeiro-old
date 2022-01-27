import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import RecebimentosTable from './RecebimentosTable';
import Tooltip from '@material-ui/core/Tooltip';
import {
  // openEditRecebimentoDialog,
  // removeRecebimento,
  // toggleStarredRecebimento,
  selectRecebimentos,
} from './store/recebimentosSlice';

import apiUrl from 'api';

import recibo from '../pdf/recibo';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import Format from '../pdf/helpers/format';

const RecebimentosList = () => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const dispatch = useDispatch();
  const recebimentos = useSelector(selectRecebimentos);
  const searchText = useSelector(
    ({ recebimentosApp }) => recebimentosApp.recebimentos.searchText
  );
  // const user = useSelector(({ recebimentosApp }) => recebimentosApp.user);

  const format = new Format();

  const [filteredData, setFilteredData] = useState(null);

  const pdf = (aluno) => {
    let arTipos = [];
    aluno.tipos.forEach((el) => {
      arTipos.push([
        {
          text: `${el.tipo} - ${format.currency(el.valor)}.`,
          margin: [10, 2, 10, 2],
          border: [true, false, true, false],
        },
      ]);
    });
    const data = { ...aluno, tiposFormat: arTipos };
    pdfMake.createPdf(recibo(data)).open();
  };

  const columns = useMemo(
    () => [
      {
        accessor: 'avatar',
        Cell: ({ row }) => {
          return (
            <Avatar
              className="mx-8"
              alt={row.original.name}
              src={`${apiUrl}/uploads/aluno/${row.original.ra}.jpeg`}
            />
          );
        },
        className: 'justify-center',
        width: 64,
        sortable: false,
      },
      {
        Header: 'Aluno',
        accessor: 'nome',
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
        Header: 'Valor',
        accessor: 'valorFormat',
        sortable: true,
      },
      {
        Header: 'Tipo',
        accessor: 'tipo',
        sortable: true,
      },
      {
        id: 'action',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            {/* <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                dispatch(toggleStarredRecebimento(row.original.idRecebimento));
              }}
            >
              {user.starred &&
              user.starred.includes(row.original.idRecebimento) ? (
                <Icon className="text-yellow-700">star</Icon>
              ) : (
                <Icon>star_border</Icon>
              )}
            </IconButton>
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                dispatch(removeRecebimento(row.original.idRecebimento));
              }}
            >
              <Icon>delete</Icon>
            </IconButton> */}
            <Tooltip title="Imprimir Recibo" aria-label="imprimir-recibo">
              <IconButton onClick={() => pdf(row.original)}>
                <Icon>print</Icon>
              </IconButton>
            </Tooltip>
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
        return recebimentos;
      }
      return FuseUtils.filterArrayByString(recebimentos, _searchText);
    }

    if (recebimentos) {
      setFilteredData(getFilteredArray(recebimentos, searchText));
    }
  }, [recebimentos, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          Não há nenhum recebimento hoje!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    >
      <RecebimentosTable
        columns={columns}
        data={filteredData}
        // onRowClick={(ev, row) => {
        //   if (row) {
        //     dispatch(openEditRecebimentoDialog(row.original));
        //   }
        // }}
      />
    </motion.div>
  );
};

export default RecebimentosList;
