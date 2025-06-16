function getSelectedHtml() {
  const sel = window.getSelection();
  if (sel.rangeCount === 0) return "";
  const range = sel.getRangeAt(0);
  const div = document.createElement("div");
  div.appendChild(range.cloneContents());
  return div.innerHTML;
}

// function removeStyleAndClassFromHtml(html) {
//   // Remove all 'style' attributes
//   html = html.replace(/\s*style="[^"]*"/g, "");
//   // Remove all 'class' attributes
//   html = html.replace(/\s*class="[^"]*"/g, "");

//   console.log(html, "htmlml");
//   return html;
// }
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

if (!window.hasAddedListener) {
  window.hasAddedListener = true;
  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    const selectedText = window.getSelection().toString();
    const selectedHtml = getSelectedHtml();

    switch (msg.action) {
      case "saveAsTxt":
        saveBlob(
          new Blob([selectedText], { type: "text/plain" }),
          "text_output.txt"
        );
        break;

      case "saveAsHtml":
        saveBlob(
          new Blob([selectedHtml], { type: "text/html" }),
          "text_output.html"
        );
        break;
      case "saveAsPdf":
        await import(chrome.runtime.getURL("libs/jspdf.umd.min.js"));
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        const maxWidth = pageWidth - 2 * margin;
        doc.setFontSize(14);

        const lines = doc.splitTextToSize(selectedText, maxWidth);
        doc.text(lines, margin, margin);
        doc.save("text_output.pdf");
        break;

      case "saveAsDocx":
        await import(chrome.runtime.getURL("libs/docx.umd.js"));

        const { Document, Packer, Paragraph, TextRun } = window.docx;

        const docx = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [new TextRun(window.getSelection().toString())],
                }),
              ],
            },
          ],
        });

        const blob = await Packer.toBlob(docx);
        saveBlob(blob, "text_output.docx");
        break;
    }
  });
}
/* case "saveAsDocx":
  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
    xmlns:w='urn:schemas-microsoft-com:office:word'
    xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'></head>
<body>${selectedHtml}</body>
</html>
`;

  const wordBlob = new Blob([htmlContent], {
    type: "application/msword",
  });
  saveBlob(wordBlob, "text_output.doc");
  break; */

/* 
  
   await import(chrome.runtime.getURL("libs/purify.min.js"));
        await import(chrome.runtime.getURL("libs/html2canvas.min.js"));
        await import(chrome.runtime.getURL("libs/jspdf.umd.min.js"));
        const { jsPDF } = window.jspdf;

        // Create a container element and fill it with selectedHtml string
        clearStyleAndClassAttributesOnSelectedHtml =
          removeStyleAndClassFromHtml(selectedHtml);
        const container = document.createElement("div");
        container.innerHTML = clearStyleAndClassAttributesOnSelectedHtml;
        document.body.appendChild(container);
        // console.log(container);
        // Ensure the container doesn't overflow horizontally by setting max width and enabling text wrapping
        container.style.maxWidth = "115mm"; // A4 page width
        container.style.wordBreak = "break-all"; // Enable word wrapping
        container.style.whiteSpace = "normal"; // Ensure text breaks across lines

        const doc = new jsPDF({
          unit: "mm",
          format: "a4",
        });

        // Set the margins for the document
        const margin = 2;

        doc.html(container, {
          html2canvas: {
            scale: 0.45, // Adjust scaling to fit content
            logging: false, // Disable logs for clean output
            useCORS: true, // Enable CORS for external resources
          },
          callback: function (doc) {
            // Save the document after rendering it
            doc.save("text_output.pdf");
            document.body.removeChild(container);
          },
          margin: [margin, margin], // Set margins to avoid overflow
          x: margin, // Horizontal padding
          y: margin, // Vertical padding
          autoPaging: true, // Enable auto paging for large content
        });
        break;
  
  */

//DENEME

/*   case "saveAsPdf":
        await import(chrome.runtime.getURL("libs/purify.min.js"));
        await import(chrome.runtime.getURL("libs/html2canvas.min.js"));
        await import(chrome.runtime.getURL("libs/jspdf.umd.min.js"));
        const { jsPDF } = window.jspdf;

        // const doc = new jsPDF();
        var doc = new jsPDF();
        doc.html(selectedHtml, {
          html2canvas: {
            scale: 0.45,
          },
          callback: function (doc) {
            doc.save();
          },
        });
        // const pageWidth = doc.internal.pageSize.getWidth();
        // const margin = 10;
        // const maxWidth = pageWidth - 2 * margin;

        // const lines = doc.splitTextToSize(selectedText, maxWidth);
        //doc.text(lines, margin, margin);
        doc.save("text_output.pdf");
        break; */
