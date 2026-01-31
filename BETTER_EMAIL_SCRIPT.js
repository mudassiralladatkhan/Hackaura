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
        var leaderName = getValue(['Leader Name', 'Name']);
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
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Outfit', 'Segoe UI', sans-serif; color: #e2e8f0;">
        
        <!-- MAIN CONTAINER -->
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; overflow: hidden; font-size: 16px; line-height: 1.6;">
          
          <!-- HERO HEADER -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 40px 20px; text-align: center; border-bottom: 1px solid #334155;">
             <h1 style="margin: 0; color: #ffffff; font-size: 38px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
               <span style="color: #22d3ee;">HACK</span>AURA <span style="font-size: 20px; vertical-align: top; color: #a855f7;">2026</span>
             </h1>
             <p style="margin: 10px 0 0; color: #94a3b8; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">National Level 24H Hackathon</p>
          </div>

          <!-- CONTENT -->
          <div style="padding: 30px 25px;">
            
            <p style="font-size: 18px; color: #ffffff;">Hello <strong>${leaderName}</strong>, 👋</p>
            <p style="color: #cbd5e1;">Correction! Your registration for <strong>HACKAURA 2026</strong> is confirmed. We are thrilled to have your team onboard.</p>


            <!-- TICKET CARD -->
            <div style="margin: 30px 0; background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 1) 100%); border: 1px solid #334155; border-radius: 16px; overflow: hidden; position: relative;">
              <!-- Top Accent -->
              <div style="height: 4px; background: linear-gradient(90deg, #22d3ee, #a855f7, #f472b6); width: 100%;"></div>
              
              <div style="padding: 25px;">
                <div style="display: table; width: 100%;">
                  <!-- Row 1 -->
                  <div style="display: table-row;">
                    <div style="display: table-cell; padding-bottom: 20px;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">Team Name</span>
                      <span style="font-size: 20px; font-weight: 700; color: #ffffff;">${teamName}</span>
                    </div>
                    <div style="display: table-cell; padding-bottom: 20px; text-align: right;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">Ticket ID</span>
                      <span style="font-size: 20px; font-weight: 700; color: #22d3ee; font-family: monospace;">${ticketId}</span>
                    </div>
                  </div>
                  <!-- Row 2 -->
                  <div style="display: table-row;">
                    <div style="display: table-cell; vertical-align: top;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">Domain</span>
                      <span style="font-size: 16px; color: #cbd5e1;">${domain || 'Open Innovation'}</span>
                    </div>
                    <div style="display: table-cell; text-align: right; vertical-align: top;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">College</span>
                      <span style="font-size: 16px; color: #cbd5e1;">${college}</span>
                    </div>
                  </div>

                  <!-- QR Code Row -->
                  <div style="display: table-row;">
                    <div style="display: table-cell; padding-top: 25px; text-align: center;" colspan="2">
                       <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://hackaura2026.netlify.app/verify?ticketId=' + ticketId)}" alt="Ticket QR" width="150" height="150" style="border: 4px solid #ffffff; border-radius: 8px; display: inline-block;">
                       <p style="margin: 10px 0 0; font-size: 12px; color: #64748b;">Scan to Verify Ticket</p>
                       <a href="https://hackaura2026.netlify.app/verify?ticketId=${ticketId}" style="display: block; margin-top: 5px; color: #22d3ee; font-size: 11px; text-decoration: none;">(or click here to verify)</a>
                    </div>
                  </div>

                </div>
              </div>
              
              <!-- Cutout Line -->
              <div style="border-top: 2px dashed #334155; position: relative;">
                <div style="position: absolute; left: -10px; top: -10px; width: 20px; height: 20px; background-color: #0f172a; border-radius: 50%;"></div>
                <div style="position: absolute; right: -10px; top: -10px; width: 20px; height: 20px; background-color: #0f172a; border-radius: 50%;"></div>
              </div>

              <!-- Event Details footer -->
              <div style="padding: 20px 25px; background-color: rgba(30, 41, 59, 0.3);">
                <div style="display: table; width: 100%;">
                   <div style="display: table-cell; vertical-align: middle;">
                      <span style="font-size: 14px; font-weight: 600; color: #f8fafc;">📅 ${CONFIG.EVENT_DATE}</span>
                   </div>
                   <div style="display: table-cell; text-align: right; vertical-align: middle;">
                      <span style="font-size: 14px; font-weight: 600; color: #f8fafc;">📍 VSMIT, Nipani</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- ACTIONS -->
            <div style="text-align: center; margin-bottom: 40px;">
              <p style="margin-bottom: 15px; font-size: 14px; color: #94a3b8;">👇 Join the group for important updates 👇</p>
              <a href="${CONFIG.WHATSAPP_LINK}" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);">
                Join WhatsApp Group
              </a>
              <div style="margin-top: 15px;">
                <a href="${CONFIG.VENUE_MAP}" style="color: #22d3ee; text-decoration: none; font-size: 13px;">View Venue on Maps ↗</a>
              </div>
            </div>

            <!-- REMINDERS -->
            <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
              <h3 style="margin-top: 0; color: #f8fafc; font-size: 16px;">🚀 Next Steps</h3>
              <ul style="padding-left: 20px; margin-bottom: 0; color: #cbd5e1; font-size: 14px;">
                <li style="margin-bottom: 8px;">Keep this ticket safe (Save screenshot).</li>
                <li style="margin-bottom: 8px;">Bring your valid College ID Card.</li>
                <li>Report at venue by <strong>${CONFIG.REPORTING_TIME}</strong>.</li>
              </ul>
            </div>

            <!-- COORDINATORS -->
            <div style="border-top: 1px solid #334155; padding-top: 30px; text-align: center;">
              <p style="text-transform: uppercase; letter-spacing: 1px; font-size: 12px; color: #64748b; font-weight: 700; margin-bottom: 20px;">Event Coordinators</p>
              
              <div style="display: inline-block; text-align: left;">
                <div style="margin-bottom: 10px;">
                  <span style="color: #e2e8f0; font-size: 14px; font-weight: 600;">Abdulwahab Mulla</span>
                  <span style="color: #94a3b8; font-size: 13px; display: block;">+91 73497 58871</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span style="color: #e2e8f0; font-size: 14px; font-weight: 600;">Sandesh Birannavar</span>
                  <span style="color: #94a3b8; font-size: 13px; display: block;">+91 77950 31246</span>
                </div>
              </div>
              <div style="display: inline-block; text-align: left; margin-left: 30px; vertical-align: top;">
                <div style="margin-bottom: 10px;">
                  <span style="color: #e2e8f0; font-size: 14px; font-weight: 600;">Rakshita Halluri</span>
                  <span style="color: #94a3b8; font-size: 13px; display: block;">+91 72040 33630</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <span style="color: #e2e8f0; font-size: 14px; font-weight: 600;">Sana Ravat</span>
                  <span style="color: #94a3b8; font-size: 13px; display: block;">+91 80959 81415</span>
                </div>
              </div>
            </div>

          </div>

          <!-- FOOTER -->
          <div style="background-color: #000000; padding: 20px; text-align: center; border-top: 1px solid #334155;">
            <p style="color: #475569; font-size: 12px; margin: 0;">Hosted by VSM's Institute of Technology, Nipani</p>
          </div>

        </div>
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
                    'leaderName': getVal(['Leader Name', 'Name']),
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
