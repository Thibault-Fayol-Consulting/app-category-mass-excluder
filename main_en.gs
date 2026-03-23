/**
 * --------------------------------------------------------------------------
 * App Category Mass Excluder — Google Ads Script
 * --------------------------------------------------------------------------
 * Excludes all mobile app placements from Display and Video campaigns
 * by adding app category exclusions. Prevents budget waste on
 * low-quality in-app inventory that rarely converts for SMBs.
 *
 * Author:  Thibault Fayol — Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,                      // true = log only, false = apply exclusions + send email
  EMAIL: 'contact@domain.com',          // Alert recipient
  APP_EXCLUSION_URLS: [                 // App category URLs to exclude
    'mobileapp::2-',                    // All Google Play apps
    'mobileapp::1-',                    // All iOS apps (if applicable)
    'adsenseformobileapps.com'          // AdSense for mobile apps
  ]
};

function main() {
  try {
    Logger.log('Applying mass mobile app exclusions to Display/Video campaigns...');

    var campIter = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .get();

    var applied = [];
    var skipped = 0;
    var errors = [];

    while (campIter.hasNext()) {
      var camp = campIter.next();
      var campName = camp.getName();

      try {
        var type = camp.getAdvertisingChannelType ? camp.getAdvertisingChannelType() : 'UNKNOWN';

        if (type === 'SEARCH' || type === 'SHOPPING' || type === 'PERFORMANCE_MAX') {
          skipped++;
          continue;
        }

        if (!CONFIG.TEST_MODE) {
          CONFIG.APP_EXCLUSION_URLS.forEach(function(url) {
            try {
              camp.display()
                .newPlacementExclusionBuilder()
                .withUrl(url)
                .build();
            } catch (innerErr) {
              Logger.log('  Warning: Could not exclude "' + url + '" on "' + campName + '": ' + innerErr.message);
            }
          });
        }

        applied.push(campName);
        Logger.log('Excluded app placements for: ' + campName);
      } catch (campErr) {
        errors.push(campName + ': ' + campErr.message);
        Logger.log('ERROR on "' + campName + '": ' + campErr.message);
      }
    }

    Logger.log('Done. Applied to ' + applied.length + ' campaigns, skipped ' +
               skipped + ' (Search/Shopping/PMax), errors: ' + errors.length);

    if (applied.length > 0 && !CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@domain.com') {
      var body = 'App placements excluded on ' + applied.length + ' campaigns:\n\n' +
                 applied.join('\n');
      if (errors.length > 0) {
        body += '\n\nErrors (' + errors.length + '):\n' + errors.join('\n');
      }
      MailApp.sendEmail(CONFIG.EMAIL,
        'App Exclusions Applied: ' + applied.length + ' campaign(s)',
        body);
      Logger.log('Alert email sent to ' + CONFIG.EMAIL);
    }
  } catch (e) {
    Logger.log('FATAL ERROR: ' + e.message);
    if (!CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@domain.com') {
      MailApp.sendEmail(CONFIG.EMAIL, 'App Category Excluder — Script Error', e.message);
    }
  }
}
