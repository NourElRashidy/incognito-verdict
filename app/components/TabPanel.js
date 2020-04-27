import React from 'react';
import PropTypes from 'prop-types';

const TabPanel = ({ children, currentTab, tabIndex, className }) => {
  return (
    <>
      {
        (currentTab === tabIndex) &&
        <div className={className}>{children}</div>
      }
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  currentTab: PropTypes.any.isRequired,
  tabIndex: PropTypes.any.isRequired,
};

export default TabPanel;
