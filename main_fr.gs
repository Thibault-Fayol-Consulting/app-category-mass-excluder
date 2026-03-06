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
    Logger.log("Exclusion massive de toutes les applications mobiles (Display / Vidéo)...");
    var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
    var count = 0;
    while(campIter.hasNext()) {
        var camp = campIter.next();
        var channel = camp.getCampaignType ? camp.getCampaignType() : 'UNKNOWN';
        if (channel !== 'SEARCH' && channel !== 'SHOPPING') {
            Logger.log("Exclusion mobileapp::2- pour " + camp.getName());
            if (!CONFIG.TEST_MODE) {
               try {
                   camp.display().newPlacementBuilder().withUrl("mobileapp::2-").exclude();
                   count++;
               } catch(e) {}
            }
        }
    }
    Logger.log("Nettoyage effectué sur " + count + " campagnes éligibles.");
}
