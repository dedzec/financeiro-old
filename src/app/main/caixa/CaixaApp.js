import React, { useEffect, useRef } from 'react';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { useDeepCompareEffect } from '@fuse/hooks';
import FusePageSimple from '@fuse/core/FusePageSimple';
import CaixaHeader from './CaixaHeader';
import CaixaList from './CaixaList';
// import RelatorioDialog from './RelatorioDialog';
import CancelReciboDialog from './CancelReciboDialog';
import ListDialog from './ListDialog';
import reducer from './store';
import { getCaixa } from './store/caixaSlice';
import { getTipos } from './store/tiposSlice';
import { getTurmas } from './store/turmasSlice';

function CaixaApp() {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);

  const pageLayout = useRef(null);

  useEffect(() => {
    dispatch(getCaixa(user));
    dispatch(getTurmas(user));
    dispatch(getTipos(user));
  }, [dispatch]);

  return (
    <>
      <FusePageSimple
        // classes={}
        header={<CaixaHeader pageLayout={pageLayout} />}
        content={<CaixaList />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <CancelReciboDialog />
      {/* <RelatorioDialog /> */}
      <ListDialog />
    </>
  );
}

export default withReducer('caixaApp', reducer)(CaixaApp);
