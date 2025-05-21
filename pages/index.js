import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>ParallarXiv</title>
      </Head>
      <main>
        <h1>ParallarXiv</h1>
        <p>Deployment successful!</p>
        <p>Visit <code>/api/papers</code> for generated paper data.</p>
      </main>
    </>
  )
}
