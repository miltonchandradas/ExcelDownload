import { createAdzoneTable, createBlowlineTable } from "./app.js";

function downloadAdzones() {
   let downloadLink;
   let dataType = "application/vnd.ms-excel";

   let table = createAdzoneTable();
   let tableHTML = table.outerHTML.replace(/ /g, "%20");

   // Specify file name
   let filename = "adzones.xls";

   // Create download link element
   downloadLink = document.createElement("a");

   document.body.appendChild(downloadLink);

   if (navigator.msSaveOrOpenBlob) {
      let blob = new Blob(["\ufeff", tableHTML], {
         type: dataType,
      });
      navigator.msSaveOrOpenBlob(blob, filename);
   } else {
      // Create a link to the file
      downloadLink.href = "data:" + dataType + ", " + tableHTML;

      // Setting the file name
      downloadLink.download = filename;

      //triggering the function
      downloadLink.click();
   }
}

function downloadBlowlines() {
   let downloadLink;
   let dataType = "application/vnd.ms-excel";

   let table = createBlowlineTable();
   let tableHTML = table.outerHTML.replace(/ /g, "%20");

   // Specify file name
   let filename = "blowlines.xls";

   // Create download link element
   downloadLink = document.createElement("a");

   document.body.appendChild(downloadLink);

   if (navigator.msSaveOrOpenBlob) {
      let blob = new Blob(["\ufeff", tableHTML], {
         type: dataType,
      });
      navigator.msSaveOrOpenBlob(blob, filename);
   } else {
      // Create a link to the file
      downloadLink.href = "data:" + dataType + ", " + tableHTML;

      // Setting the file name
      downloadLink.download = filename;

      //triggering the function
      downloadLink.click();
   }
}

document.querySelector("#btnAdzone").addEventListener("click", downloadAdzones);

document
   .querySelector("#btnBlowline")
   .addEventListener("click", downloadBlowlines);
