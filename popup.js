const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  },
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const format = document.getElementById("format").value;
  const html = quill.root.innerHTML;
  const text = quill.getText().trim();

  if (!text) {
    alert("Please enter some text.");
    return;
  }

  switch (format) {
    case "txt":
      downloadBlob(new Blob([text], { type: "text/plain" }), "output.txt");
      break;

    case "html":
      const fullHtml = `<html><body>${html}</body></html>`;
      downloadBlob(new Blob([fullHtml], { type: "text/html" }), "output.html");
      break;

    case "pdf":
      await import(chrome.runtime.getURL("libs/html2canvas.min.js"));
      await import(chrome.runtime.getURL("libs/jspdf.umd.min.js"));
      const { jsPDF } = window.jspdf;

      const pdfDoc = new jsPDF({ unit: "mm", format: "a4" });

      const container = document.createElement("div");
      container.innerHTML = html;
      container.style.padding = "10px";
      document.body.appendChild(container);

      pdfDoc.html(container, {
        html2canvas: { scale: 0.5 },
        callback: function (doc) {
          doc.save("output.pdf");
          document.body.removeChild(container);
        },
        x: 10,
        y: 10,
      });
      break;

    case "docx":
      await import(chrome.runtime.getURL("libs/docx.umd.js"));
      const { Document, Packer, Paragraph } = window.docx;

      const paragraphFromHTML = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return Array.from(div.childNodes).map((node) => {
          return new Paragraph({
            text: node.textContent || "",
          });
        });
      };

      const docx = new Document({
        sections: [
          {
            children: paragraphFromHTML(html),
          },
        ],
      });

      const blob = await Packer.toBlob(docx);
      downloadBlob(blob, "output.docx");
      break;
  }
});

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
