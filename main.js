const url = "./resume.pdf";

let pdfDoc = null,
  pageNum = 1,
  pageIsRendring = false,
  pageNumIsPending = null;

// Scaling
const scale = 5,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

// Render the page

const renderPage = (num) => {
  pageIsRendring = true;

  // Get the page
  pdfDoc.getPage(num).then((page) => {
    // console.log(page);

    //Set scale

    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport,
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendring = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Output current page
    document.querySelector("#page-num").textContent = num;
  });
};

//Check for pages rendering
const queueRenderPage = (num) => {
  if (pageIsRendring) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Show Prev page

const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  } else {
    pageNum--;
    queueRenderPage(pageNum);
  }
};

// Show Next page

const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  } else {
    pageNum++;
    queueRenderPage(pageNum);
  }
};

// Get Document

pdfjsLib
  .getDocument(url)
  .promise.then((pdfDoc_) => {
    pdfDoc = pdfDoc_;
    //   console.log(pdfDoc);

    document.querySelector("#page-count").textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch((err) => {
    // Display Error
    const div = document.createElement("div");
    div.className = "error";
    div.appendChild(document.createTextNode(err.message));
    document.querySelector("body").insertBefore(div, canvas);

    //remove top bar

    document.querySelector(".top-bar").style.display = "none";
  });

//Buttons Events

document.querySelector("#prev-page").addEventListener("click", showPrevPage);
document.querySelector("#next-page").addEventListener("click", showNextPage);
