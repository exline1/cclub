import cron from "node-cron";
import { ComputerService } from "../modules/computers/service";

export const initSessionCheckerJob = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    console.log("[Job] Running active sessions check...");
    try {
      const results = await ComputerService.checkEndingSoon();
      console.log(`[Job] Finished checking sessions. Ended: ${results.ended.length}, Flagged ending soon: ${results.flagged.length}`);
    } catch (error: any) {
      console.error("[Job] Error checking sessions:", error.message);
    }
  });
  console.log("[Job] Session checker cron job initialized.");
};
