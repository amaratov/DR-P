import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

function RequireAuth({ children }) {
  const location = useLocation();
  const loggedInStatus = localStorage.getItem('userLoginStatus');
  const loggedInExpireDateTime = localStorage.getItem('userLoginExpiringAt');

  if (!loggedInStatus || loggedInStatus !== 'Logged in') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (loggedInExpireDateTime && parseInt(loggedInExpireDateTime, 10) < Date.now()) {
    localStorage.clear();
    window.location.reload();
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

RequireAuth.defaultProps = {
  children: () => {},
};

export default RequireAuth;
