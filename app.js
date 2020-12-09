import { promotions, headerInfo } from "./data.js";

(function createTableFromJSON() {
   let numberOfPromotions = promotions.length;
   _checkVersions(promotions);

   let promotionProperties = Object.keys(promotions[0]);

   let columnHeaders = [
      "AdCopy Detail",
      "Proj Retail",
      "Additional Coupons",
      "Adzone 1",
      "Adzone 2",
      "Adzone 3",
   ];
   console.log(columnHeaders);

   // Create dynamic HTML table
   let table = document.createElement("table");
   table.id = "tblFrontpage";
   table.style.cssText =
      "margin: 25px 0; font-family: sans-serif; font-size: 0.9em; min-width: 400px; border: 1px solid black; border-radius: 5px 5px 0 0; overflow: hidden; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);";

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
   tr.style.background = "#009879";
   tr.style.color = "#fff";
   tr.style.textAlign = "left";
   tr.style.fontWeight = "bold";

   // thead.appendChild(tr);
   table.appendChild(tr);

   // Add the column headers
   columnHeaders.forEach((header) => {
      let th = document.createElement("th");
      th.innerHTML = header;
      th.style.padding = "12px 15px";
      tr.appendChild(th);
   });

   // Add the grouping and aggregation data - This is going to be hard to implement in Production...  For now, let's hardcode this !!
   let groupTbody = document.createElement("tbody");
   let groupTr = groupTbody.insertRow();
   let groupCell = groupTr.insertCell();
   groupCell.innerHTML = `${
      promotions[0].eventName
   }: <b>${_sumOfProjectedRetail(promotions[0].eventName)}</b>`;
   table.appendChild(groupTbody);

   // Add JSON data as rows to the table
   let tbody = document.createElement("tbody");
   promotions.forEach((promotion, index) => {
      tr = tbody.insertRow();
      // tr.style.borderBottom = "1px solid #dddddd";

      /* if (index === 3) {
         tr.style.fontWeight = "bold";
         tr.style.color = "#009879";
      } */

      if (index % 2 === 0) {
         tr.style.backgroundColor = "#f0f0f0";
      }

      /* if (index === numberOfPromotions - 1) {
         tr.style.borderBottom = "2px solid #009879";
      } */

      promotionProperties.forEach((promotionProperty) => {
         switch (promotionProperty) {
            case "size": {
               let cell = tr.insertCell();
               cell.style.padding = "12px 15px";
               cell.style.border = "1px solid black";
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
               cell.innerHTML = cellValue;
               break;
            }

            case "projectedRetail": {
               let cell = tr.insertCell();
               cell.style.padding = "12px 15px";
               cell.style.textAlign = "center";
               cell.style.verticalAlign = "middle";
               cell.style.border = "1px solid black";
               let cellValue = `
                    ${_formatCurrency(promotion["projectedRetail"])}
                `;
               cell.innerHTML = cellValue;
               break;
            }

            case "hasAdditionalCoupon": {
               let cell = tr.insertCell();
               cell.style.padding = "12px 15px";
               cell.style.textAlign = "center";
               cell.style.verticalAlign = "middle";
               cell.style.border = "1px solid black";

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
               cell.innerHTML = cellValue;

               break;
            }

            case "adzone1SalesRetail": {
               let cell = tr.insertCell();
               cell.style.padding = "12px 15px";
               cell.style.textAlign = "center";
               cell.style.verticalAlign = "middle";
               cell.style.border = "1px solid black";

               let cellValue = `
                         ${
                            promotion["adzone1SalesRetail"]
                               ? _formatCurrency(
                                    promotion["adzone1SalesRetail"]
                                 ) + "<br>"
                               : ""
                         }
                         ${
                            promotion["adzone1Discount"]
                               ? "<span style='color:red;text-decoration:underline;vertical-align:middle;'>" +
                                 _formatCurrency(promotion["adzone1Discount"]) +
                                 "</span>"
                               : ""
                         }
                         ${
                            promotion["adzone1Discount"]
                               ? "<br>" +
                                 _finalPrice(
                                    promotion["adzone1SalesRetail"],
                                    promotion["adzone1Discount"]
                                 )
                               : ""
                         }
                     `;
               cell.innerHTML = cellValue;

               break;
            }

            case "adzone2SalesRetail": {
               let cell = tr.insertCell();
               cell.style.padding = "12px 15px";
               cell.style.textAlign = "center";
               cell.style.verticalAlign = "middle";
               cell.style.border = "1px solid black";

               let cellValue = `
                          ${
                             promotion["adzone2SalesRetail"]
                                ? _formatCurrencyWithVersion(
                                     promotion["adzone2SalesRetail"],
                                     promotion["adzone2Version"],
                                     cell
                                  ) + "<br>"
                                : ""
                          }
                          ${
                             promotion["adzone2Discount"]
                                ? "<span style='color:red;text-decoration:underline;vertical-align:middle;'>" +
                                  _formatCurrency(
                                     promotion["adzone2Discount"]
                                  ) +
                                  "</span>"
                                : ""
                          }
                          ${
                             promotion["adzone2Discount"]
                                ? "<br>" +
                                  _finalPrice(
                                     promotion["adzone2SalesRetail"],
                                     promotion["adzone2Discount"]
                                  )
                                : ""
                          }
                      `;
               cell.innerHTML = cellValue;

               break;
            }

            case "adzone3SalesRetail": {
               let cell = tr.insertCell();
               cell.style.padding = "12px 15px";
               cell.style.textAlign = "center";
               cell.style.verticalAlign = "middle";
               cell.style.border = "1px solid black";

               let cellValue = `
                            ${
                               promotion["adzone3SalesRetail"]
                                  ? _formatCurrencyWithVersion(
                                       promotion["adzone3SalesRetail"],
                                       promotion["adzone3Version"],
                                       cell
                                    ) + "<br>"
                                  : ""
                            }
                            ${
                               promotion["adzone3Discount"]
                                  ? "<span style='color:red;text-decoration:underline;vertical-align:middle;'>" +
                                    _formatCurrency(
                                       promotion["adzone3Discount"]
                                    ) +
                                    "</span>"
                                  : ""
                            }
                            ${
                               promotion["adzone3Discount"]
                                  ? "<br>" +
                                    _finalPrice(
                                       promotion["adzone3SalesRetail"],
                                       promotion["adzone3Discount"]
                                    )
                                  : ""
                            }
                                    `;
               cell.innerHTML = cellValue;

               break;
            }

            case "adzone4SalesRetail": {
               let cell = tr.insertCell();
               cell.style.padding = "12px 15px";

               let cellValue = `
                           ${
                              promotion["adzone4SalesRetail"]
                                 ? _formatCurrencyWithVersion(
                                      promotion["adzone4SalesRetail"],
                                      promotion["adzone4Version"]
                                   ) + "<br>"
                                 : ""
                           }
                           ${
                              promotion["adzone4Discount"]
                                 ? "<p style='color:red;text-decoration:underline'>" +
                                   _formatCurrency(
                                      promotion["adzone4Discount"]
                                   ) +
                                   "</p>"
                                 : ""
                           }
                           ${
                              promotion["adzone4Discount"]
                                 ? "<p style='color:green;'>" +
                                   _finalPrice(
                                      promotion["adzone4SalesRetail"],
                                      promotion["adzone4Discount"]
                                   ) +
                                   "</p><br>"
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

   // Add table to container...
   let divContainer = document.getElementById("showData");
   divContainer.innerHTML = "";
   divContainer.appendChild(table);
})();

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
   let promotionsWithVersions = promotions.map((promotion) => {
      if (promotion.adzone1SalesRetail !== promotion.adzone2SalesRetail) {
         promotion.adzone2Version = true;
      } else {
         promotion.adzone2Version = false;
      }

      if (promotion.adzone1SalesRetail !== promotion.adzone3SalesRetail) {
         promotion.adzone3Version = true;
      } else {
         promotion.adzone3Version = false;
      }

      return promotion;
   });
}

function _sumOfProjectedRetail(eventName) {
   let sum = promotions.reduce((total, promotion) => {
      if (promotion.eventName === eventName) {
         total += parseFloat(promotion.projectedRetail);
      }

      return total;
   }, 0);

   return _formatCurrency(sum);
}
