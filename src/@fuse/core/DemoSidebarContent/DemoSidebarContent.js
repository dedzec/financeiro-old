import React, { cloneElement, memo } from 'react';
import _ from '@lodash';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function DemoSidebarContent() {
  function generate(element) {
    return _(30).times((value) =>
      cloneElement(element, {
        key: value,
      })
    );
  }

  return (
    <div>
      <List dense>
        {generate(
          <ListItem button>
            <ListItemText primary="Single-line item" />
          </ListItem>
        )}
      </List>
    </div>
  );
}

export default memo(DemoSidebarContent);
