import React from "react";
// import CookieConsent from "./CookieConsent";
import { useCookies } from "react-cookie";

const App = () => {
  // const [cookies] = useCookies(["cookieConsent"]);

  return (
    <div className="app">
      <h1>Welcome to my website</h1>
      {/* {!cookies.cookieConsent && <CookieConsent />} */}
    </div>
  );
};

export default App;
