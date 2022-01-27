import React, { memo } from 'react';
import QuickPanel from 'app/fuse-layouts/shared-components/quickPanel/QuickPanel';
import NotificationPanel from 'app/fuse-layouts/shared-components/notificationPanel/NotificationPanel';

function RightSideLayout1() {
  return (
    <>
      <QuickPanel />

      <NotificationPanel />
    </>
  );
}

export default memo(RightSideLayout1);
