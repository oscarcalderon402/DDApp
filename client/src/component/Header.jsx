import React from 'react';
// import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from '@okta/okta-react';

const Header = () => {
  const { authState, oktaAuth } = useOktaAuth();

  if (!authState) {
    return <div>Loading...</div>;
  }

  const logout = async () => oktaAuth.signOut();

  const button = authState.isAuthenticated ? (
    <button className="btn btn-danger" onClick={logout}>
      Logout
    </button>
  ) : null;

  return (
    <div
      //   style={{
      //     backgroundColor: "gray",
      //     color: "white",
      //     display: "flex",
      //     justifyContent: "space-between",
      //     height: "40px",
      //   }}
      className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between"
    >
      <div className="align-self-center">
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>DD App</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="align-self-center mr-3">
          {authState.isAuthenticated && authState?.accessToken?.claims?.sub
            ? authState.accessToken.claims.sub
            : ''}
        </div>

        {button}
      </div>
    </div>
  );
};
export default Header;
