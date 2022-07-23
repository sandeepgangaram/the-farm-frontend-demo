const fs = require("fs");
const http = require("http");
const { URL } = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

// Server

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/TEMPLATE_overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/TEMPLATE_card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/TEMPLATE_product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, "http://localhost:8000");
  const query = Object.fromEntries(searchParams); // { id: '0' }

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARD%}", cardsHtml);
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //   API
  } else if (pathname === "/api") {
    res.end(data);

    //   Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

const port = process.env.PORT || 8000;

server.listen(port, process.env.HOSTNAME, () => {
  console.log(`Listening to requests on port ${port}`);
});
