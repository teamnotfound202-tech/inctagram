export default async function SsrPage() {
const res = await fetch(`https://connectpix.site/api/v1//home/publications-followers`)
  const data = await res.json()

  return (
  <div>
    {data.totalCount}
  </div>
)
}
