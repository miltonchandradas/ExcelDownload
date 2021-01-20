import { promotions, headerInfo } from "./adzonedata.js";
import { blowlines, blowlineHeaders } from "./blowlinedata.js";

export const createBlowlineTable = () => {
   let groupedByEvents = _groupByEvent(blowlines, "eventName");
   console.log(groupedByEvents);

   let blowlineProperties = Object.keys(blowlines[0]);

   let columnHeaders = [
      "AdCopy Detail",
      "Projected Retail",
      "Price Plus Discount",
      "Digital Coupon",
      "Mix n Match Coupon",
      "Final Retail",
   ];
   console.log(columnHeaders);

   // Create dynamic HTML table
   let table = document.createElement("table");
   table.id = "tblBlowlines";

   table.style.cssText =
      "font-family: sans-serif; font-size: 0.9em; border: 1px solid lightgrey;";

   // Add the header information on top...  Just 4 fields based on discussions with Wakefern
   let headerTbody = document.createElement("tbody");
   let headerTr = headerTbody.insertRow();
   let headerCell1 = headerTr.insertCell();
   headerCell1.innerHTML = `Ad Date: ${blowlineHeaders.adDate}`;
   headerTr = headerTbody.insertRow();
   let headerCell2 = headerTr.insertCell();
   headerCell2.innerHTML = `Week No.: ${blowlineHeaders.week}`;
   headerTr = headerTbody.insertRow();
   let headerCell3 = headerTr.insertCell();
   headerCell3.innerHTML = `Vehicle: ${blowlineHeaders.vehicle}`;
   headerTr = headerTbody.insertRow();
   let headerCell4 = headerTr.insertCell();
   headerCell4.innerHTML = `Projected Sales: ${_formatCurrency(
      blowlineHeaders.projectedSales
   )}`;
   headerTr = headerTbody.insertRow();
   let headerCell5 = headerTr.insertCell();
   headerCell5.style.height = "20px";
   table.appendChild(headerTbody);

   // Add a new row for the column headers
   let tr = document.createElement("tr");
   tr.style.color = "#fff";
   tr.style.textAlign = "left";
   tr.style.fontWeight = "bold";

   table.appendChild(tr);

   // Add the column headers
   columnHeaders.forEach((header) => {
      let th = document.createElement("th");
      th.innerHTML = header;
      th.style.backgroundColor = "#009879";
      th.style.padding = "12px 15px";
      tr.appendChild(th);
   });

   Object.values(groupedByEvents).forEach((promotionsByEvent) => {
      let groupTbody = document.createElement("tbody");
      let groupTr = groupTbody.insertRow();
      let groupCell = groupTr.insertCell();
      groupCell.style.backgroundColor = "#e9f5f8";
      groupCell.style.height = "40px";
      groupCell.style.verticalAlign = "middle";

      groupCell.innerHTML = `${
         promotionsByEvent[0].eventName
      }: <b><span style='color:blue;'>${_sumOfProjectedRetail(
         promotionsByEvent
      )}</span></b>`;
      table.appendChild(groupTbody);

      // Add JSON data as rows to the table
      let tbody = document.createElement("tbody");
      promotionsByEvent.forEach((promotion, index) => {
         tr = tbody.insertRow();

         /* if (index % 2 === 0) {
            tr.style.backgroundColor = "#f0f0f0";
         } */

         let cell1 = tr.insertCell();
         _setCellStyle(cell1, false);

         let cell2 = tr.insertCell();
         _setCellStyle(cell2, true);

         let cell3 = tr.insertCell();
         _setCellStyle(cell3, true);

         let cell4 = tr.insertCell();
         _setCellStyle(cell4, true);

         let cell5 = tr.insertCell();
         _setCellStyle(cell5, true);

         let cell6 = tr.insertCell();
         _setCellStyle(cell6, true);

         blowlineProperties.forEach((blowlineProperty) => {
            switch (blowlineProperty) {
               case "adcopyDetail": {
                  let cellValue = `<b>${promotion.adcopyDetail}</b>`;
                  cell1.innerHTML = cellValue;

                  if (index % 2 === 0) {
                     cell1.style.backgroundColor = "#f0f0f0";
                  }
                  break;
               }

               case "projectedRetail": {
                  let cellValue = `${_formatCurrency(
                     promotion.projectedRetail
                  )}`;
                  cell2.innerHTML = cellValue;

                  if (index % 2 === 0) {
                     cell2.style.backgroundColor = "#f0f0f0";
                  }

                  break;
               }

               case "priceplus": {
                  let cellValue = `
                  ${
                     promotion.priceplus
                        ? _formatCurrency(promotion.priceplus)
                        : "-"
                  }`;
                  cell3.innerHTML = cellValue;

                  if (index % 2 === 0) {
                     cell3.style.backgroundColor = "#f0f0f0";
                  }

                  break;
               }

               case "digitalcoupon": {
                  let cellValue = `
                  ${
                     promotion.digitalcoupon
                        ? _formatCurrency(promotion.digitalcoupon)
                        : ""
                  }`;
                  cell4.innerHTML = cellValue;

                  if (index % 2 === 0) {
                     cell4.style.backgroundColor = "#f0f0f0";
                  }

                  break;
               }

               case "mixnmatch": {
                  let cellValue = `
                  ${
                     promotion.mixnmatch
                        ? _formatCurrency(promotion.mixnmatch)
                        : ""
                  }`;
                  cell5.innerHTML = cellValue;

                  if (index % 2 === 0) {
                     cell5.style.backgroundColor = "#f0f0f0";
                  }

                  break;
               }

               case "finalRetail": {
                  let cellValue = `
                  ${
                     promotion.priceplus
                        ? _formatCurrency(promotion.finalRetail)
                        : "1 / " + _formatCurrency(promotion.finalRetail)
                  }`;
                  cell6.innerHTML = cellValue;

                  if (index % 2 === 0) {
                     cell6.style.backgroundColor = "#f0f0f0";
                  }

                  break;
               }

               default:
                  break;
            }
         });
      });

      table.appendChild(tbody);
   });

   // Add table to container...  Just for display purposes
   let divContainer = document.getElementById("showBlowlines");
   divContainer.innerHTML = "";
   divContainer.appendChild(table);

   return table;
};

export const createAdzoneTable = () => {
   _checkVersions(promotions);
   let groupedByEvents = _groupByEvent(promotions, "eventName");
   let numberOfAdzones = promotions[0].numberOfAdzones;
   console.log(groupedByEvents);

   let promotionProperties = Object.keys(promotions[0]);

   let columnHeaders = ["AdCopy Detail", "Proj Retail", "Additional Coupons"];

   for (let i = 0; i < numberOfAdzones; i++) {
      columnHeaders.push("Adzone " + (i + 1));
   }
   console.log(columnHeaders);

   // Create dynamic HTML table
   let table = document.createElement("table");
   table.id = "tblFrontpage";
   /* table.style.cssText =
      "margin: 25px 0; font-family: sans-serif; font-size: 0.9em; min-width: 400px; border: 1px solid black; border-radius: 5px 5px 0 0; overflow: hidden; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);"; */
   table.style.cssText =
      "font-family: sans-serif; font-size: 0.9em; border: 1px solid lightgrey;";

   // Add the header information on top...  Just 4 fields based on discussions with Wakefern
   let headerTbody = document.createElement("tbody");
   let headerTr = headerTbody.insertRow();
   let headerCell1 = headerTr.insertCell();
   headerCell1.innerHTML = `Ad Date: ${headerInfo.adDate}`;
   headerTr = headerTbody.insertRow();
   let headerCell2 = headerTr.insertCell();
   headerCell2.innerHTML = `Week No.: ${headerInfo.week}`;
   headerTr = headerTbody.insertRow();
   let headerCell3 = headerTr.insertCell();
   headerCell3.innerHTML = `Vehicle: ${headerInfo.vehicle}`;
   headerTr = headerTbody.insertRow();
   let headerCell4 = headerTr.insertCell();
   headerCell4.innerHTML = `Projected Sales: ${_formatCurrency(
      headerInfo.projectedSales
   )}`;
   table.appendChild(headerTbody);

   // Add a new row for the column headers
   // let thead = table.createTHead();
   let tr = document.createElement("tr");
   tr.style.color = "#fff";
   tr.style.textAlign = "left";
   tr.style.fontWeight = "bold";

   // thead.appendChild(tr);
   table.appendChild(tr);

   // Add the column headers
   columnHeaders.forEach((header) => {
      let th = document.createElement("th");
      th.innerHTML = header;
      th.style.backgroundColor = "#009879";
      th.style.padding = "12px 15px";
      tr.appendChild(th);
   });

   Object.values(groupedByEvents).forEach((promotionsByEvent) => {
      let groupTbody = document.createElement("tbody");
      let groupTr = groupTbody.insertRow();
      let groupCell = groupTr.insertCell();
      groupCell.style.backgroundColor = "#e9f5f8";

      groupCell.innerHTML = `${
         promotionsByEvent[0].eventName
      }: <b>${_sumOfProjectedRetail(promotionsByEvent)}</b>`;
      groupCell.style.height = "40px";
      table.appendChild(groupTbody);

      // Add JSON data as rows to the table
      let tbody = document.createElement("tbody");
      promotionsByEvent.forEach((promotion, index) => {
         tr = tbody.insertRow();

         /* if (index % 2 === 0) {
            tr.style.backgroundColor = "#f0f0f0";
         } */

         let cells = [];
         columnHeaders.forEach((columnHeader, i) => {
            cells[i] = tr.insertCell();

            i === 0
               ? _setCellStyle(cells[i], false)
               : _setCellStyle(cells[i], true);
         });

         promotionProperties.forEach((promotionProperty, i) => {
            switch (promotionProperty) {
               case "size": {
                  /* let cell = tr.insertCell();
                  cell.style.padding = "12px 15px";
                  cell.style.border = "1px solid black"; */
                  let cellValue = `
                    ${promotion["size"]} <br>
                    ${promotion["desc1"] ? promotion["desc1"] + "<br>" : ""}
                    ${promotion["desc2"] ? promotion["desc2"] + "<br>" : ""}
                    ${
                       promotion["desc3"]
                          ? "<b>" + promotion["desc3"] + "</b><br>"
                          : ""
                    }
                    ${
                       promotion["priceplus"]
                          ? promotion["priceplus"] + "<br>"
                          : ""
                    }
                    ${promotion["dr"] ? promotion["dr"] + "<br>" : ""}
                    ${promotion["fsi"] ? promotion["fsi"] + "<br>" : ""}
                    <br>
                `;
                  cells[0].innerHTML = cellValue;

                  if (index % 2 === 0) {
                     cells.forEach(
                        (cell) => (cell.style.backgroundColor = "#f0f0f0")
                     );
                  }

                  break;
               }

               case "projectedRetail": {
                  /* let cell = tr.insertCell();
                  cell.style.padding = "12px 15px";
                  cell.style.textAlign = "center";
                  cell.style.verticalAlign = "middle";
                  cell.style.border = "1px solid black"; */
                  let cellValue = `
                    ${_formatCurrency(promotion["projectedRetail"])}
                `;
                  cells[1].innerHTML = cellValue;
                  break;
               }

               case "hasAdditionalCoupon": {
                  /* let cell = tr.insertCell();
                  cell.style.padding = "12px 15px";
                  cell.style.textAlign = "center";
                  cell.style.verticalAlign = "middle";
                  cell.style.border = "1px solid black"; */

                  let cellValue = `
                         ${
                            promotion["additionalCoupon1"]
                               ? "<br>" + promotion["additionalCoupon1"]
                               : ""
                         }
                         ${
                            promotion["additionalCoupon2"]
                               ? "<br>" + promotion["additionalCoupon2"]
                               : ""
                         }
                     `;
                  cells[2].innerHTML = cellValue;

                  break;
               }

               case "adzone1SalesRetail": {
                  /* let cell = tr.insertCell();
                  cell.style.padding = "12px 15px";
                  cell.style.textAlign = "center";
                  cell.style.verticalAlign = "middle";
                  cell.style.border = "1px solid black"; */

                  let cellValue = `
                         ${
                            promotion[`adzone1SalesRetail`]
                               ? _formatCurrency(
                                    promotion[`adzone1SalesRetail`]
                                 ) + "<br>"
                               : ""
                         }
                         ${
                            promotion[`adzone1Discount`]
                               ? "<span style='color:red;text-decoration:underline;vertical-align:middle;'>" +
                                 _formatCurrency(promotion[`adzone1Discount`]) +
                                 "</span>"
                               : ""
                         }
                         ${
                            promotion[`adzone1Discount`]
                               ? "<br>" +
                                 _finalPrice(
                                    promotion[`adzone1SalesRetail`],
                                    promotion[`adzone1Discount`]
                                 )
                               : ""
                         }
                     `;
                  cells[3].innerHTML = cellValue;

                  break;
               }

               case "adzone2SalesRetail":
               case "adzone3SalesRetail":
               case "adzone4SalesRetail": {
                  /* let cell = tr.insertCell();
                  cell.style.padding = "12px 15px";
                  cell.style.textAlign = "center";
                  cell.style.verticalAlign = "middle";
                  cell.style.border = "1px solid black"; */
                  let cell;

                  if (promotionProperty === "adzone2SalesRetail") {
                     cell = cells[4];
                  } else if (promotionProperty === "adzone3SalesRetail") {
                     cell = cells[5];
                  } else if (promotionProperty === "adzone4SalesRetail") {
                     cell = cells[6];
                  }

                  let adzoneNumber = promotionProperty.replace(
                     /adzone|SalesRetail/gi,
                     ""
                  );

                  console.log("Adzone Number: ", adzoneNumber);

                  let cellValue = `
                          ${
                             promotion[`adzone${adzoneNumber}SalesRetail`]
                                ? _formatCurrencyWithVersion(
                                     promotion[
                                        `adzone${adzoneNumber}SalesRetail`
                                     ],
                                     promotion[`adzone${adzoneNumber}Version`],
                                     cell
                                  ) + "<br>"
                                : ""
                          }
                          ${
                             promotion[`adzone${adzoneNumber}Discount`]
                                ? "<span style='color:red;text-decoration:underline;vertical-align:middle;'>" +
                                  _formatCurrency(
                                     promotion[`adzone${adzoneNumber}Discount`]
                                  ) +
                                  "</span>"
                                : ""
                          }
                          ${
                             promotion[`adzone${adzoneNumber}Discount`]
                                ? "<br>" +
                                  _finalPrice(
                                     promotion[
                                        `adzone${adzoneNumber}SalesRetail`
                                     ],
                                     promotion[`adzone${adzoneNumber}Discount`]
                                  )
                                : ""
                          }
                      `;

                  cell.innerHTML = cellValue;

                  break;
               }

               default:
                  break;
            }
         });
      });

      table.appendChild(tbody);
   });

   // Add table to container...  Just for display purposes
   let divContainer = document.getElementById("showAdzones");
   divContainer.innerHTML = "";
   divContainer.appendChild(table);

   return table;
};

function _setCellStyle(cell, alignCenter) {
   cell.style.padding = "12px 15px";
   cell.style.border = "1px solid lightgrey";

   if (alignCenter) {
      cell.style.textAlign = "right";
      cell.style.verticalAlign = "middle";
   }
}

function _formatCurrency(sValue) {
   let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
   });

   return formatter.format(sValue);
}

function _formatCurrencyWithVersion(sValue, hasVersion, cell) {
   let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
   });

   if (hasVersion) {
      // return `<mark>${formatter.format(sValue)}</mark>`;
      cell.style.backgroundColor = "yellow";
   }

   return formatter.format(sValue);
}

function _finalPrice(sValue1, sValue2) {
   let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
   });

   return formatter.format(sValue1 - sValue2);
}

function _checkVersions(promotions) {
   promotions.map((promotion) => {
      let adzone1SalesRetail = promotion.adzone1SalesRetail;
      let numberOfAdzones = promotions[0].numberOfAdzones;

      for (let i = 2; i < numberOfAdzones + 1; i++) {
         if (adzone1SalesRetail !== promotion[`adzone${i}SalesRetail`]) {
            promotion[`adzone${i}Version`] = true;
         } else {
            promotion[`adzone${i}Version`] = false;
         }
      }

      return promotion;
   });
}

/* function _sumOfProjectedRetail(promotions, eventName) {
   let sum = promotions.reduce((total, promotion) => {
      if (promotion.eventName === eventName) {
         total += parseFloat(promotion.projectedRetail);
      }

      return total;
   }, 0);

   return _formatCurrency(sum);
} */

function _sumOfProjectedRetail(promotions) {
   let sum = 0;
   promotions.forEach((promotion) => (sum += promotion.projectedRetail));

   return _formatCurrency(sum);
}

function _groupByEvent(promotions, key) {
   let groupedByEvents = promotions.reduce(
      (consolidatedPromotion, promotion) => {
         (consolidatedPromotion[promotion[key]] =
            consolidatedPromotion[promotion[key]] || []).push(promotion);
         return consolidatedPromotion;
      },
      {}
   );

   return groupedByEvents;
}
