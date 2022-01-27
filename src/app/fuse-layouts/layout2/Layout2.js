import React, { memo, useContext } from 'react';
import FuseDialog from '@fuse/core/FuseDialog';
import FuseMessage from '@fuse/core/FuseMessage';
import FuseSuspense from '@fuse/core/FuseSuspense';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from 'app/AppContext';
import SettingsPanel from 'app/fuse-layouts/shared-components/SettingsPanel';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import FooterLayout2 from './components/FooterLayout2';
import LeftSideLayout2 from './components/LeftSideLayout2';
import NavbarWrapperLayout2 from './components/NavbarWrapperLayout2';
import RightSideLayout2 from './components/RightSideLayout2';
import ToolbarLayout2 from './components/ToolbarLayout2';

const useStyles = makeStyles(() => ({
  root: {
    '&.boxed': {
      clipPath: 'inset(0)',
      maxWidth: (props) => `${props.config.containerWidth}px`,
      margin: '0 auto',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    '&.container': {
      '& .container': {
        maxWidth: (props) => `${props.config.containerWidth}px`,
        width: '100%',
        margin: '0 auto',
      },
    },
  },
}));

function Layout2(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const appContext = useContext(AppContext);
  const { routes } = appContext;
  const classes = useStyles({ ...props, config });

  return (
    <div
      id="fuse-layout"
      className={clsx(classes.root, config.mode, 'w-full flex')}
    >
      {config.leftSidePanel.display && <LeftSideLayout2 />}

      <div className="flex flex-auto min-w-0">
        {config.navbar.display && config.navbar.position === 'left' && (
          <NavbarWrapperLayout2 />
        )}

        <main
          id="fuse-main"
          className="flex flex-col flex-auto min-h-screen min-w-0 relative z-10"
        >
          {config.toolbar.display && (
            <ToolbarLayout2
              className={config.toolbar.style === 'fixed' && 'sticky top-0'}
            />
          )}

          <div className="sticky top-0 z-99">
            <SettingsPanel />
          </div>

          <div className="flex flex-col flex-auto min-h-0 relative z-10">
            <FuseDialog />

            <FuseSuspense>{renderRoutes(routes)}</FuseSuspense>

            {props.children}
          </div>

          {config.footer.display && (
            <FooterLayout2
              className={config.footer.style === 'fixed' && 'sticky bottom-0'}
            />
          )}
        </main>

        {config.navbar.display && config.navbar.position === 'right' && (
          <NavbarWrapperLayout2 />
        )}
      </div>

      {config.rightSidePanel.display && <RightSideLayout2 />}
      <FuseMessage />
    </div>
  );
}

export default memo(Layout2);
