/* 
   --------------------------------------------------------------
   🚀 HACKAURA 2026 - ULTIMATE REGISTRATION SCRIPT
   --------------------------------------------------------------
   1. Auto-Emails with Premium "Digital Ticket" Design
   2. Real-Time Stats API
   3. Duplicate Checking
   --------------------------------------------------------------
*/

// --- CONFIGURATION ---
var CONFIG = {
    SHEET_NAME: 'Form Responses 1', // Check your sheet tab name!
    EVENT_DATE: 'March 1-2, 2026',
    REPORTING_TIME: '11:00 AM',
    VENUE_NAME: 'VSM Institute of Technology, Nipani',
    VENUE_MAP: 'https://maps.app.goo.gl/to5bjseBAVoWZ3mP7',
    WHATSAPP_LINK: 'https://chat.whatsapp.com/DuetdcEgnGZGrfVSPxA1Sv'
};

/* 
   --------------------------------------------------------------
   PART 1: AUTO-EMAIL TRIGGER (onFormSubmit)
   --------------------------------------------------------------
*/
function onFormSubmit(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
        if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // Fallback to first sheet

        // 1. GET DATA & MAP COLUMNS
        var row = e.range.getRow();
        var lastCol = sheet.getLastColumn();
        var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        var data = sheet.getRange(row, 1, 1, lastCol).getValues()[0];

        // Helper to find value by header name (fuzzy search)
        function getValue(keywords) {
            var index = -1;
            for (var i = 0; i < headers.length; i++) {
                var h = String(headers[i]).toLowerCase();
                for (var j = 0; j < keywords.length; j++) {
                    if (h.indexOf(keywords[j].toLowerCase()) > -1) {
                        return data[i];
                    }
                }
            }
            return "";
        }

        // Extract Fields Dynamically
        var teamName = getValue(['Team Name', 'Team']);
        var leaderName = getValue(['Leader Name', 'Full Name', 'Representative']); // Removed generic 'Name' to avoid matching 'Team Name'
        var email = getValue(['Leader Email', 'Email']);
        var college = getValue(['College', 'Institute']);
        var domain = getValue(['Domain', 'Track', 'Theme']);
        var phone = getValue(['Phone', 'Mobile']);

        // Fallback indexes if headers fail (Match your specific form order if needed)
        if (!teamName) teamName = data[1];
        if (!college) college = data[2];
        if (!leaderName) leaderName = data[3];
        if (!email) email = data[4];

        // Generate Ticket ID (e.g., HA26-042)
        var ticketId = "HA26-" + ("000" + (row - 1)).slice(-3);

        // 2. EMAIL SUBJECT
        var subject = "🎟️ Registration Confirmed: " + teamName + " [Ticket: " + ticketId + "]";

        // 3. PREMIUM HTML EMAIL BODY
        var htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0; -webkit-font-smoothing: antialiased;">
        
        <!-- CENTER WRAPPER -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 20px 0;">
              
              <!-- MAIN CONTAINER -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 0 80px rgba(34, 211, 238, 0.15);">
                
                <!-- 1. HERO HEADER (Geometric Mesh Gradient) -->
                <tr>
                   <td align="center" style="padding: 50px 20px; background-color: #0f172a; background-image: radial-gradient(circle at 10% 20%, rgba(34, 211, 238, 0.2) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 20%); border-bottom: 1px solid #1e293b;">
                      
                      <p style="margin: 0 0 10px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px;">Invitation Confirmed</p>
                      
                      <h1 style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 800; line-height: 1; letter-spacing: -1px;">
                         HACK<span style="color: #22d3ee; text-shadow: 0 0 30px rgba(34, 211, 238, 0.6);">AURA</span>
                      </h1>
                      
                      <div style="margin-top: 15px; display: inline-block; padding: 6px 16px; border: 1px solid #334155; border-radius: 50px; background: rgba(255,255,255,0.02);">
                         <span style="color: #a855f7; font-weight: 600; font-size: 14px;">2026 Season</span>
                         <span style="color: #475569; margin: 0 8px;">|</span>
                         <span style="color: #e2e8f0; font-size: 14px;">Official Entry Pass</span>
                      </div>

                   </td>
                </tr>

                <!-- 2. CONTENT AREA -->
                <tr>
                   <td style="padding: 40px 30px;">
                      
                      <!-- Greeting -->
                      <p style="margin: 0 0 5px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Welcome Team Leader</p>
                      <h2 style="margin: 0 0 25px; color: #f8fafc; font-size: 28px; font-weight: 700;">${leaderName}</h2>

                      <!-- TICKET CARD (Glassmorphism) -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; margin-bottom: 30px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);">
                         
                         <!-- Color Bar -->
                         <tr>
                            <td colspan="2" style="height: 6px; background: linear-gradient(90deg, #22d3ee, #a855f7, #f472b6);"></td>
                         </tr>

                         <tr>
                            <td valign="top" style="padding: 25px;">
                               <p style="margin: 0 0 5px; color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 700;">Team Name</p>
                               <h3 style="margin: 0 0 20px; color: #ffffff; font-size: 22px; font-weight: 700;">${teamName}</h3>

                               <p style="margin: 0 0 5px; color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 700;">Track / Domain</p>
                               <p style="margin: 0 0 20px; color: #cbd5e1; font-size: 15px;">${domain || 'Open Innovation'}</p>

                               <table width="100%">
                                  <tr>
                                     <td>
                                        <p style="margin: 0 0 5px; color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 700;">College</p>
                                        <p style="margin: 0; color: #cbd5e1; font-size: 14px;">${college}</p>
                                     </td>
                                     <td>
                                        <p style="margin: 0 0 5px; color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 700;">Ticket ID</p>
                                        <p style="margin: 0; color: #22d3ee; font-size: 14px; font-family: monospace;">${ticketId}</p>
                                     </td>
                                  </tr>
                               </table>
                            </td>
                            <td valign="middle" align="center" style="padding: 25px; width: 120px; border-left: 1px dashed #334155;">
                               <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://hackaura2026.netlify.app/verify?ticketId=' + ticketId)}" width="110" height="110" style="display: block; border-radius: 8px; border: 4px solid #ffffff;" alt="QR">
                               <a href="https://hackaura2026.netlify.app/verify?ticketId=${ticketId}" style="display: block; margin-top: 10px; font-size: 11px; text-decoration: none; color: #22d3ee; font-weight: 600;">View Ticket &rarr;</a>
                            </td>
                         </tr>
                         <!-- Ticket Footer -->
                         <tr>
                            <td colspan="2" style="padding: 15px 25px; background-color: #172033; border-top: 1px solid #334155;">
                               <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 500;">📅 March 1-2, 2026  &nbsp;&nbsp;•&nbsp;&nbsp;  📍 VSMIT, Nipani</p>
                            </td>
                         </tr>
                      </table>

                      <!-- CTA Button -->
                      <div style="text-align: center;">
                         <a href="${CONFIG.WHATSAPP_LINK}" style="background-color: #22c55e; color: #ffffff; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.4);">
                            Click to Join WhatsApp Group
                         </a>
                      </div>

                   </td>
                </tr>

                <!-- 3. FOOTER INFO -->
                <tr>
                   <td style="padding: 30px; background-color: #0c1220; border-top: 1px solid #1e293b;">
                      <p style="margin: 0 0 20px; color: #475569; font-size: 11px; font-weight: 700; text-transform: uppercase; text-align: center; letter-spacing: 1px;">Event Coordinators</p>
                      
                      <table width="100%" style="margin-bottom: 20px;">
                         <tr>
                            <td width="50%" valign="top">
                               <p style="margin: 0; color: #cbd5e1; font-size: 13px; font-weight: 600;">Abdulwahab Mulla</p>
                               <p style="margin: 2px 0 15px; color: #64748b; font-size: 12px;">+91 73497 58871</p>

                               <p style="margin: 0; color: #cbd5e1; font-size: 13px; font-weight: 600;">Sandesh Birannavar</p>
                               <p style="margin: 2px 0 0; color: #64748b; font-size: 12px;">+91 77950 31246</p>
                            </td>
                            <td width="50%" valign="top">
                               <p style="margin: 0; color: #cbd5e1; font-size: 13px; font-weight: 600;">Rakshita Halluri</p>
                               <p style="margin: 2px 0 15px; color: #64748b; font-size: 12px;">+91 72040 33630</p>

                               <p style="margin: 0; color: #cbd5e1; font-size: 13px; font-weight: 600;">Sana Ravat</p>
                               <p style="margin: 2px 0 0; color: #64748b; font-size: 12px;">+91 80959 81415</p>
                            </td>
                         </tr>
                      </table>

                      <p style="margin: 0; color: #334155; font-size: 11px; text-align: center;">&copy; 2026 HACKAURA • Secured by Digital Pass System</p>
                   </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;


        // 4. SEND EMAIL
        if (email) {
            MailApp.sendEmail({
                to: email,
                subject: subject,
                htmlBody: htmlBody
            });
        }

    } catch (err) {
        console.error("Error in onFormSubmit: " + err.toString());
    }
}

/* 
   --------------------------------------------------------------
   PART 2: WEB API (Stats + Duplicate Check)
   --------------------------------------------------------------
   This matches your existing requirement for real-time website stats.
*/
function doGet(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = doc.getSheetByName(CONFIG.SHEET_NAME) || doc.getSheets()[0];

        // ACTION: GET STATS (With Unique College Count)
        if (e.parameter.action === 'getStats') {
            var count = Math.max(0, sheet.getLastRow() - 1); // Total teams

            // Calculate Unique Colleges
            var data = sheet.getDataRange().getValues();
            var headers = data[0];
            var collegeIdx = getHeaderIndex(headers, ['College', 'College Name', 'Institute']);

            var uniqueColleges = {};
            var uniqueCount = 0;

            if (collegeIdx > -1) {
                for (var k = 1; k < data.length; k++) {
                    var collegeName = data[k][collegeIdx];
                    if (collegeName && String(collegeName).trim() !== "") {
                        var normalized = String(collegeName).trim().toLowerCase();
                        if (!uniqueColleges[normalized]) {
                            uniqueColleges[normalized] = true;
                            uniqueCount++;
                        }
                    }
                }
            }


            return ContentService.createTextOutput(JSON.stringify({
                'count': count,
                'collegeCount': uniqueCount
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // ACTION: GET TEAM DETAILS (By Ticket ID)
        if (e.parameter.action === 'getTeamDetails' && e.parameter.ticketId) {
            var ticketId = e.parameter.ticketId; // format HA26-XXX
            var rowNum = parseInt(ticketId.split('-')[1], 10) + 1; // Reverse logic: HA26-003 -> Row 4 (Header is 1)

            if (rowNum > 1 && rowNum <= sheet.getLastRow()) {
                var dataInfo = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
                var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

                // Helper to safely get value
                var getVal = function (keys) {
                    var idx = getHeaderIndex(headers, keys);
                    return idx > -1 ? dataInfo[idx] : "";
                };

                return ContentService.createTextOutput(JSON.stringify({
                    'result': 'success',
                    'teamName': getVal(['Team Name', 'Team']),
                    'leaderName': getVal(['Leader Name', 'Full Name', 'Representative']),
                    'leaderEmail': getVal(['Leader Email', 'Email']),
                    'leaderPhone': getVal(['Leader Phone', 'Phone', 'Mobile']),
                    'college': getVal(['College', 'Institute']),
                    'domain': getVal(['Domain', 'Track']) || 'Open Innovation',
                    'members': [
                        getVal(['Member 1']),
                        getVal(['Member 2']),
                        getVal(['Member 3'])
                    ].filter(function (m) { return m && String(m).trim() !== "" }),
                    'status': 'Confirmed'
                })).setMimeType(ContentService.MimeType.JSON);
            }
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Invalid Ticket ID' })).setMimeType(ContentService.MimeType.JSON);
        }

        // ACTION: CHECK DUPLICATES
        var data = sheet.getDataRange().getValues();
        var headers = data[0];
        var teamIdx = getHeaderIndex(headers, ['Team', 'Team Name']);
        var emailIdx = getHeaderIndex(headers, ['Email', 'Leader Email', 'Email Address']);
        var phoneIdx = getHeaderIndex(headers, ['Phone', 'Leader Phone', 'Mobile']);

        if (e.parameter.teamName || e.parameter.email || e.parameter.phone) {
            var exists = false;
            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (e.parameter.teamName && teamIdx > -1 && String(row[teamIdx]).trim().toLowerCase() === String(e.parameter.teamName).trim().toLowerCase()) exists = true;
                if (e.parameter.email && emailIdx > -1 && String(row[emailIdx]).trim().toLowerCase() === String(e.parameter.email).trim().toLowerCase()) exists = true;
                if (e.parameter.phone && phoneIdx > -1 && String(row[phoneIdx]).trim() === String(e.parameter.phone).trim()) exists = true;
            }
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'exists': exists })).setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Invalid params' })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.toString() })).setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

// Helper to find column index
function getHeaderIndex(headers, possibleNames) {
    for (var i = 0; i < headers.length; i++) {
        for (var j = 0; j < possibleNames.length; j++) {
            if (typeof headers[i] === 'string' && headers[i].toLowerCase().indexOf(possibleNames[j].toLowerCase()) > -1) {
                return i;
            }
        }
    }
    return -1;
}
