import React, { useEffect, useRef } from 'react';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { useDeepCompareEffect } from '@fuse/hooks';
import FusePageSimple from '@fuse/core/FusePageSimple';
import ReciboHeader from './ReciboHeader';
import ReciboList from './ReciboList';
import ReciboDialog from './ReciboDialog';
import reducer from './store';
import { getRecibos } from './store/reciboSlice';

function ReciboApp() {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);

  const pageLayout = useRef(null);

  useEffect(() => {
    dispatch(getRecibos(user));
  }, [dispatch]);

  return (
    <>
      <FusePageSimple
        // classes={}
        header={<ReciboHeader pageLayout={pageLayout} />}
        content={<ReciboList />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <ReciboDialog />
    </>
  );
}

export default withReducer('reciboApp', reducer)(ReciboApp);
