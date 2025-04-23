const cron = require("node-cron");
const axios = require("axios");
const ipv4 = require("ip4");
const fs = require("fs");

const reportUrl = `http://${ipv4}:8000/api/products/get_report`;
const fileSaveDir = "../reports/";
console.log("Started cron job...", reportUrl);

// Run a task every 30 seconds
// */5 * * * * * means every 5 seconds

cron.schedule("0 19 * * *", () => {
  axios
    .get(reportUrl)
    .then((response) => {
      if (!fs.existsSync(fileSaveDir)) {
        fs.mkdirSync(fileSaveDir, {recursive: true});
      }
      response.data.products.forEach((product) => {
        let csvData = "Product Name,Goods baked,Wastage \n";
        let shopName = product.shop_name;
        product.products.forEach((p) => {
          csvData += `${p.product_name},${p.baked},${p.wastage} \n`;
        });
        const formattedDate = new Date().toISOString().replace(/T/, "_").replace(/:/g, "-").split(".")[0];
        let dir = fileSaveDir + "records_" + formattedDate + "/";
        fs.mkdirSync(dir, {recursive: true});
        const fileName = `${dir}${shopName}.csv`;
        fs.writeFile(fileName, csvData, (err) => {
          if (err) {
            console.error("Error saving the file:", err);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

// Run a task every evening at 7:00 PM
// cron.schedule("0 19 * * *", () => {
//   console.log("running a task every evening at 7:00 PM");
// });
