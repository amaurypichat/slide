import { Html, Head, Main, NextScript } from 'next/document'
import Cookie from "./../component/cookie"

export default function Document() {
  return (
    <>
    <Cookie />
    <Html lang="en">
      <Head >
	  <link rel="icon" href="/favigcon.ico?v=4" sizes="any" />
      <meta name="description" content="Amaury PICHAT Développeur Web"></meta>
	  </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
    </>
  )
}
