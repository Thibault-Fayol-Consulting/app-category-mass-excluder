/**
 * --------------------------------------------------------------------------
 * App Category Mass Excluder — Script Google Ads
 * --------------------------------------------------------------------------
 * Exclut tous les emplacements d'applications mobiles des campagnes
 * Display et Video. Evite de gaspiller du budget sur l'inventaire
 * in-app de mauvaise qualite.
 *
 * Auteur :  Thibault Fayol — Consultant SEA PME
 * Site :    https://thibaultfayol.com
 * Licence : MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,                      // true = log uniquement, false = applique les exclusions + envoie email
  EMAIL: 'contact@votredomaine.com',    // Destinataire des alertes
  APP_EXCLUSION_URLS: [                 // URLs de categories d'apps a exclure
    'mobileapp::2-',                    // Toutes les apps Google Play
    'mobileapp::1-',                    // Toutes les apps iOS (si applicable)
    'adsenseformobileapps.com'          // AdSense pour apps mobiles
  ]
};

function main() {
  try {
    Logger.log('Exclusion massive des applications mobiles (Display/Video)...');

    var campIter = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .get();

    var appliques = [];
    var ignores = 0;
    var erreurs = [];

    while (campIter.hasNext()) {
      var camp = campIter.next();
      var campName = camp.getName();

      try {
        var type = camp.getAdvertisingChannelType ? camp.getAdvertisingChannelType() : 'UNKNOWN';

        if (type === 'SEARCH' || type === 'SHOPPING' || type === 'PERFORMANCE_MAX') {
          ignores++;
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
              Logger.log('  Attention : Impossible d\'exclure "' + url + '" sur "' + campName + '" : ' + innerErr.message);
            }
          });
        }

        appliques.push(campName);
        Logger.log('Apps exclues pour : ' + campName);
      } catch (campErr) {
        erreurs.push(campName + ' : ' + campErr.message);
        Logger.log('ERREUR sur "' + campName + '" : ' + campErr.message);
      }
    }

    Logger.log('Termine. Applique a ' + appliques.length + ' campagnes, ignore ' +
               ignores + ' (Search/Shopping/PMax), erreurs : ' + erreurs.length);

    if (appliques.length > 0 && !CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@votredomaine.com') {
      var body = 'Exclusions d\'apps appliquees sur ' + appliques.length + ' campagnes :\n\n' +
                 appliques.join('\n');
      if (erreurs.length > 0) {
        body += '\n\nErreurs (' + erreurs.length + ') :\n' + erreurs.join('\n');
      }
      MailApp.sendEmail(CONFIG.EMAIL,
        'Exclusions Apps : ' + appliques.length + ' campagne(s) traitee(s)',
        body);
      Logger.log('Email d\'alerte envoye a ' + CONFIG.EMAIL);
    }
  } catch (e) {
    Logger.log('ERREUR FATALE : ' + e.message);
    if (!CONFIG.TEST_MODE && CONFIG.EMAIL !== 'contact@votredomaine.com') {
      MailApp.sendEmail(CONFIG.EMAIL, 'App Category Excluder — Erreur script', e.message);
    }
  }
}
