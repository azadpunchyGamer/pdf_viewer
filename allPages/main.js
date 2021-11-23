const url = "./resume.pdf";

// how to add child to parent in DOM using javascript

// const div = document.querySelector(".Idiv");
// const child = document.createElement("div");
// child.classList = "child";

// div.appendChild(child);

// var textToadd = document.createTextNode("Text to add");
// child.appendChild(textToadd);

var currPage = 1; //Pages are 1-based not 0-based
var numPages = 0;
var thePDF = null;

//This is where you start
pdfjsLib.getDocument(url).then(function (pdf) {
  //Set PDFJS global object (so we can easily access in our page functions
  thePDF = pdf;

  //How many pages it has
  numPages = pdf.numPages;

  //Start with first page
  pdf.getPage(1).then(handlePages);
});

function handlePages(page) {
  //This gives us the page's dimensions at full scale
  var viewport = page.getViewport(1);

  //We'll create a canvas for each page to draw it on
  var canvas = document.createElement("canvas");
  canvas.style.display = "block";
  var context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  //Draw it on the canvas
  page.render({ canvasContext: context, viewport: viewport });

  //Add it to the web page
  const div = document.querySelector(".parent");
  div.appendChild(canvas);

  //Move to next page
  currPage++;
  if (thePDF !== null && currPage <= numPages) {
    thePDF.getPage(currPage).then(handlePages);
  }
}
