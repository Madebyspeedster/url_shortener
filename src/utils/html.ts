import { LambdaResponse } from "./types";

export const generateDemoPage = () => `
<html>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.cdnfonts.com/css/cubano" rel="stylesheet" />
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous"
  />
  <style>
    body {
      font-family: "Cubano", sans-serif;
      font-size: 2rem;
      background: #48c9b0;
      margin: 10px;
    }
    input {
      max-width: 400px;
    }
    button {
      margin-top: 5px;
    }
    a {
      font-size: 1rem;
      color: #000;
      text-decoration: underline;
    }
  </style>
  <body>
    <h1>URL Shortener</h1>
    <form id="urlForm">
      <input
        class="form-control"
        type="text"
        id="urlInput"
        placeholder="Enter URL"
      />
      <button class="btn btn-primary" type="submit">Generate</button>
    </form>
    <div id="result"></div>
    <script>
      const output = document.getElementById("result")
      document
        .getElementById("urlForm")
        .addEventListener("submit", function (event) {
          event.preventDefault()
          output.innerHTML = "<p>Please wait...</p>"
          const url = document.getElementById("urlInput").value?.trim()
          if (!url && output) {
            output.innerHTML = "Provide valid string!"
            return
          }
          fetch("https://api.webx.in.ua/minify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ urlToMinify: url }),
          })
            .then((response) => response.json())
            .then((data) => {
              output.innerHTML =
                '<a href="' +
                data.shortUrl +
                '" target="_blank">' +
                " " +
                data.shortUrl +
                " " +
                "</a>"
            })
            .catch((error) => {
              output.innerHTML = "<p>Error: " + error.message + "</p>"
            })
        })
    </script>
  </body>
</html>
`;
export const handleDemoPage = (): LambdaResponse => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: generateDemoPage(),
  };
};
