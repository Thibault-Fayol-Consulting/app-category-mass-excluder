# App Category Mass Excluder

> Google Ads Script for SMBs — Bulk-exclude all mobile app placements from Display and Video campaigns

## What it does
Iterates all enabled campaigns and excludes mobile app inventory (Google Play, iOS, AdSense for mobile apps) from Display and Video campaigns. Prevents budget waste on low-quality in-app placements that rarely convert for SMBs.

## Setup
1. Open Google Ads > Tools > Scripts
2. Create a new script and paste the code from `main_en.gs` (or `main_fr.gs` for French)
3. Update the `CONFIG` block at the top:
   - `EMAIL`: your alert email
   - `TEST_MODE`: set to `false` when ready to apply exclusions
   - `APP_EXCLUSION_URLS`: customize the list of app categories to exclude
4. Authorize and run a preview first
5. Schedule: **Monthly** (or after creating new campaigns)

## CONFIG reference
| Parameter | Default | Description |
|-----------|---------|-------------|
| `TEST_MODE` | `true` | `true` = log only, `false` = apply exclusions + send email |
| `EMAIL` | `contact@domain.com` | Email address for exclusion alerts |
| `APP_EXCLUSION_URLS` | *(array)* | List of app category URLs to exclude |

### Default exclusion URLs
| URL | Description |
|-----|-------------|
| `mobileapp::2-` | All Google Play Store apps |
| `mobileapp::1-` | All iOS App Store apps |
| `adsenseformobileapps.com` | AdSense for mobile apps network |

## How it works
1. Iterates all enabled campaigns
2. Skips Search, Shopping, and Performance Max campaigns
3. For each eligible campaign, adds placement exclusions via `display().newPlacementExclusionBuilder()`
4. Wraps each campaign in try/catch for resilience
5. Sends a summary email with results

## Requirements
- Google Ads account (not MCC)
- Google Ads Scripts access
- Display or Video campaigns active in the account

## License
MIT — Thibault Fayol Consulting
