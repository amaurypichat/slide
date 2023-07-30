import React, { useState } from "react";
import { useCookies } from "react-cookie";

const CookieConsent = () => {
  const [cookies, setCookie] = useCookies(["cookieConsent"]);
  const giveCookieConsent = () => {
    setCookie("cookieConsent", true, { path: "/" });
  };

  return (
    <>
      {cookies == ["cookieConsent"] ? (
        <div className="app p-1 fixed bottom-0 left-0 z-50 bg-black w-full ">
          <h1>Welcome to my website</h1>
          <div className="cookie-consent">
            <p>
              We use cookies to enhance your user experience. By using our
              website, you agree to our use of cookies.{" "}
              <a href={"/privacy-policy"}>Learn more.</a>
            </p>
            <button
              className="cookie-consent border-2 border-white px-2 mt-1"
              onClick={giveCookieConsent}
            >
              Accept
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CookieConsent;
