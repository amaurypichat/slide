import React, { useState,useEffect } from "react";
const domainGroupId = "fcf10e2a-b088-4aad-84d6-26d90ed3ef74";
import CookieBot from "react-cookiebot";


export default function NextCookiebot() {
  const [hasCookiebot, setHasCookieBot] = useState(false);
  // const domainGroupId = domainGroupId;

  useEffect(() => {
    if (hasCookiebot) {
      return;
    }
    const cookie = document.querySelector("#CookieBot");
    setHasCookieBot(!!cookie);
  });

  if (hasCookiebot || !domainGroupId || typeof window === "undefined") {
    return null;
  }

  return <CookieBot domainGroupId={domainGroupId} />;
}
