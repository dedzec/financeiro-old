import React, { useEffect, useRef } from 'react';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { useDeepCompareEffect } from '@fuse/hooks';
import FusePageSimple from '@fuse/core/FusePageSimple';
import RecebimentoHeader from './RecebimentoHeader';
import RecebimentosList from './RecebimentosList';
import RecebimentoDialog from './RecebimentoDialog';
import reducer from './store';
import { getRecebimentos } from './store/recebimentosSlice';
import { getTipos } from './store/tiposSlice';
import { getAlunos } from './store/alunosSlice';

function RecebimentosApp() {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);

  const pageLayout = useRef(null);

  useEffect(() => {
    dispatch(getRecebimentos(user));
    dispatch(getTipos(user));
    dispatch(getAlunos(user));
  }, [dispatch]);

  return (
    <>
      <FusePageSimple
        // classes={}
        header={<RecebimentoHeader pageLayout={pageLayout} />}
        content={<RecebimentosList />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <RecebimentoDialog />
    </>
  );
}

export default withReducer('recebimentosApp', reducer)(RecebimentosApp);
