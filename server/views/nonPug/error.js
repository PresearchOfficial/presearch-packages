const nonPugError = (error) =>  {
  return `<!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Presearch</title>
          <link rel="stylesheet" href="/assets/app.css" />
          <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
              integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
              crossorigin="anonymous"
          />
      </head>
      <style>
        html, body {
          width:100%;
          height:100%;
        }
      </style>
      <body>
        <div id="Home" class="w-full h-full flex items-center justify-center flex-col">
          <p class="text-xl text-white">Oops, something went wrong...</p>
          <p class="text-xl text-white">Please try again later</p>
          <div class="p-2 mt-6 border text-center">
            <p class="text-xs text-white">Message: ${error.message}</p>
            <p class="text-xs text-white">Code: ${error.code}</p>
          </div>
        </div>
      </body>
  </html>`
}

module.exports = nonPugError;
