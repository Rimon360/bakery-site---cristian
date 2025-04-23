const fs = require("fs");

let seq = (min = 10000000, max = 99999999) => Math.floor(Math.random() * (max - min + 1)) + min;

let prependToFile = (filePath, data) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, {recursive: true});
    }
    const logFile = filePath.endsWith("/") ? filePath + "activity.log" : filePath + "/activity.log";
    const existingData = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "";
    const newData = data + existingData;
    fs.writeFileSync(logFile, newData, "utf8");
  } catch (error) {
    console.error("Error prepending to file:", error);
  }
};

module.exports.getDate = () => {
  return new Date().toISOString().replace(/T/, "; ").replace(/:/g, "-").split(".")[0];
};

module.exports.prependToFile = prependToFile;
module.exports.seq = seq;
