/*
   ============================================================
   HACKAURA 2026 - BACKUP EMAIL SCRIPT
   ============================================================
   
   PURPOSE: Email failover - when the primary account's 
   daily email quota (100) runs out, the main script 
   calls THIS script to send emails instead.
   
   SETUP INSTRUCTIONS:
   ============================================================
   1. Login to a DIFFERENT Google account (friend/co-organizer)
   2. Go to: https://script.google.com
   3. Click "+ New Project"
   4. Delete everything and paste this ENTIRE script
   5. Click "Deploy" → "New Deployment"
   6. Settings:
      - Type: Web App
      - Execute as: Me
      - Who has access: Anyone
   7. Click "Deploy" → Authorize when prompted
   8. Copy the deployment URL
   9. Give the URL to the main account owner
   
   That's it! This account now serves as a backup 
   email sender with its own 100 emails/day quota.
   ============================================================
*/

function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);

        if (data.action === 'sendEmail') {
            // Validate required fields
            if (!data.to || !data.subject || !data.htmlBody) {
                return ContentService.createTextOutput(
                    JSON.stringify({
                        result: 'error',
                        message: 'Missing required fields (to, subject, htmlBody)'
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }

            // Check this backup account's quota too
            var remaining = MailApp.getRemainingDailyQuota();
            if (remaining <= 0) {
                return ContentService.createTextOutput(
                    JSON.stringify({
                        result: 'error',
                        message: 'Backup quota also exhausted',
                        remaining: 0
                    })
                ).setMimeType(ContentService.MimeType.JSON);
            }

            // Send the email
            MailApp.sendEmail({
                to: data.to,
                subject: data.subject,
                htmlBody: data.htmlBody
            });

            return ContentService.createTextOutput(
                JSON.stringify({
                    result: 'success',
                    message: 'Email sent via backup',
                    remaining: remaining - 1
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // Health check action
        if (data.action === 'checkQuota') {
            return ContentService.createTextOutput(
                JSON.stringify({
                    result: 'success',
                    remaining: MailApp.getRemainingDailyQuota()
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(
            JSON.stringify({ result: 'error', message: 'Unknown action' })
        ).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(
            JSON.stringify({ result: 'error', message: err.toString() })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

// Also support GET for quick health checks
function doGet(e) {
    var remaining = MailApp.getRemainingDailyQuota();
    return ContentService.createTextOutput(
        JSON.stringify({
            result: 'success',
            status: 'Backup email service is running',
            remaining: remaining
        })
    ).setMimeType(ContentService.MimeType.JSON);
}
