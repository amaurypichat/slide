import { Html, Head, Main, NextScript } from 'next/document'
import Cookie from "./../component/cookie"

export default function Document() {
  return (
    <>
    <Cookie />
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
    </>
  )
}
