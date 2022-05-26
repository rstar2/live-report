import cron from "node-cron";

const CRON = "0 7,11,15,19 * * *"; // every 7,11,15,19 hours
const isValid = cron.validate(CRON);

console.log(`Cron expression ${CRON} is ${isValid ? "" : "NOT"} valid`);
