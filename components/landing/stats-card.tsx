"use client"

export function StatsCard() {
  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <div className="rounded-3xl bg-gray-100 p-8 sm:p-12">
        <div className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-sm font-medium">
          Speeeeeeedy
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">
          Say bye to the sloooow steps of creating multiple search ads
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">
          Get copy written for you, publish ads via the API, and then get out
          the dashboard and on with life.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-4">
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">Multiple URLs</dt>
            <dd className="text-sm font-semibold">
              For bulk generation of ads
            </dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              Paste in multiple URLs, and we'll generate 15 headlines and 4
              descriptions for each one.
            </p>
          </div>
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">Correct Info</dt>
            <dd className="text-sm font-semibold">Through web-scraping</dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              We scrape your URLs to extract specific information about your
              products & services. No generic AI fluff.
            </p>
          </div>
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">Trained AI</dt>
            <dd className="text-sm font-semibold">Not Google's AI Shite</dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              Instead of Google's awful AI recommendations, we've trained this
              one to write good copy.
            </p>
          </div>
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">
              1-Click Publish
            </dt>
            <dd className="text-sm font-semibold">Via The API</dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              No need to copy & paste, we'll publish your ads via the API.
              They'll be draft, so you can review them before they go live.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
