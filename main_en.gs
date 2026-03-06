/**
 * --------------------------------------------------------------------------
 * app-category-mass-excluder - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true };
function main() {
    Logger.log("Applying mass mobile app exclusion to Display / Video campaigns...");
    var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
    var count = 0;
    while(campIter.hasNext()) {
        var camp = campIter.next();
        var channel = camp.getCampaignType ? camp.getCampaignType() : 'UNKNOWN';
        if (channel !== 'SEARCH' && channel !== 'SHOPPING') {
            Logger.log("Targeting exclusion mobileapp::2- for " + camp.getName());
            if (!CONFIG.TEST_MODE) {
               try {
                   camp.display().newPlacementBuilder().withUrl("mobileapp::2-").exclude();
                   count++;
               } catch(e) { /* Might not be a display camp format */ }
            }
        }
    }
    Logger.log("Mass excluded apps across " + count + " relevant campaigns.");
}
