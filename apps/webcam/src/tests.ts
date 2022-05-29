import cron from "node-cron";

let CRON = "0,30 7,11,15,19 * * *"; // every 7,11,15,19 hours
let isValid = cron.validate(CRON);
console.log(`Cron expression ${CRON} is ${isValid ? "" : "NOT"} valid`);

CRON = "0 7-19 * * *";
isValid = cron.validate(CRON);
console.log(`Cron expression ${CRON} is ${isValid ? "" : "NOT"} valid`);

CRON = "0 20-6 * * *";
isValid = cron.validate(CRON);
console.log(`Cron expression ${CRON} is ${isValid ? "" : "NOT"} valid`);

CRON = "*/5 * * * *";
cron.schedule(CRON, () => {
  console.log("New task", new Date());
});
