// TEST FUNCTION - Run this to grant Drive permissions
function testDrivePermissions() {
    var folder = DriveApp.getFoldersByName("Hackaura Signatures");
    Logger.log("Drive access granted!");
    return "Success - Drive permissions are working!";
}

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;900&display=swap');
          body { margin: 0; padding: 0; background-color: #000000; -webkit-font-smoothing: antialiased; }
          img { border: 0; display: block; outline: none; }
          .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Outfit', Helvetica, Arial, sans-serif;">
        
        <!-- OUTER WRAPPER -->
        <div style="background-color: #000000; padding: 40px 10px; background-image: url('https://cdn.pixabay.com/animation/2023/06/26/05/06/05-06-03-999_512.gif'); background-size: cover;">
          
          <div style="max-width: 600px; margin: 0 auto; background-color: rgba(10, 10, 20, 0.95); border: 1px solid #333; border-radius: 24px; overflow: hidden; box-shadow: 0 0 50px rgba(0, 238, 255, 0.15); backdrop-filter: blur(10px);">
            
            <!-- HEADER -->
            <div style="background: linear-gradient(135deg, #09090b 0%, #1e1b4b 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #333;">
               <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExazF5ZHM4ZHM4ZHM4ZHM4ZHM4ZHM4ZHM4ZHM4ZHM4ZHM4ZHModmVyaWZpZWQ/w3l5y7y7/giphy.gif" width="50" style="margin: 0 auto 15px; border-radius: 50%; box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);" alt="Verified">
               <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">
                 Registration <span style="color: #22d3ee; text-shadow: 0 0 15px rgba(34, 211, 238, 0.6);">Confirmed</span>
               </h1>
            </div>

            <div style="padding: 40px 30px;">
              <p style="font-size: 18px; color: #94a3b8; text-align: center; margin-bottom: 30px;">
                Get ready to disrupt the future, <strong style="color: #ffffff;">${leaderName}</strong>. ⚡
              </p>

              <!-- TICKET -->
              <div style="background: #0f1115; border: 1px solid #2d3748; border-radius: 20px; position: relative; overflow: hidden; box-shadow: 0 20px 50px -10px rgba(0,0,0,0.7);">
                
                <!-- Ticket Top -->
                <div style="padding: 30px; border-bottom: 2px dashed #374151; position: relative; background: radial-gradient(circle at top right, rgba(34, 211, 238, 0.1), transparent 40%);">
                    <div style="position: absolute; bottom: -12px; left: -12px; width: 24px; height: 24px; background: #0b0c10; border-radius: 50%; border-right: 1px solid #333;"></div>
                    <div style="position: absolute; bottom: -12px; right: -12px; width: 24px; height: 24px; background: #0b0c10; border-radius: 50%; border-left: 1px solid #333;"></div>

                    <h2 style="margin: 0; font-size: 26px; color: #ffffff; text-align: center; margin-bottom: 5px;">${teamName}</h2>
                    <p style="margin: 0; color: #64748b; text-align: center; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${college}</p>
                </div>

                <!-- Ticket Bottom (QR & Actions) -->
                <div style="padding: 30px; text-align: center;">
                    
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('https://hackaura2026.netlify.app/verify?ticketId=' + ticketId)}" alt="QR" width="150" height="150" style="margin: 0 auto; border: 8px solid #ffffff; border-radius: 8px;">
                    
                    <p style="font-family: monospace; font-size: 28px; color: #22d3ee; margin: 15px 0 5px; font-weight: 700; letter-spacing: 2px;">${ticketId}</p>
                    
                    <!-- NEW VERIFY BUTTON -->
                    <a href="https://hackaura2026.netlify.app/verify?ticketId=${ticketId}" style="display: inline-block; margin-top: 15px; padding: 8px 20px; background: rgba(34, 211, 238, 0.15); color: #22d3ee; text-decoration: none; border-radius: 4px; font-size: 13px; border: 1px solid rgba(34, 211, 238, 0.3); font-weight: 600; text-transform: uppercase;">
                       Verify Ticket Status ↗
                    </a>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 25px; border-top: 1px solid #1f2937; padding-top: 20px;">
                       <div>
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase; display: block;">Domain</span>
                          <span style="color: #cbd5e1; font-weight: 600;">${domain || 'Open'}</span>
                       </div>
                       <div>
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase; display: block;">Date</span>
                          <span style="color: #cbd5e1; font-weight: 600;">${CONFIG.EVENT_DATE}</span>
                       </div>
                    </div>
                </div>
              </div>

              <!-- VENUE MAP -->
              <div style="margin: 30px 0; border: 1px solid #333; border-radius: 12px; overflow: hidden; position: relative;">
                  <a href="${CONFIG.VENUE_MAP}" style="display: block; text-decoration: none;">
                    <!-- Simulated Map View Image -->
                    <img src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" alt="Venue Map" width="100%" style="display: block; opacity: 0.8; filter: grayscale(40%) contrast(120%);">
                    
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, #000 0%, transparent 100%); padding: 40px 20px 15px;">
                       <span style="background: #22d3ee; color: #000; padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; text-transform: uppercase;">Navigate</span>
                       <p style="margin: 5px 0 0; color: #fff; font-weight: 700;">VSM Institute of Technology, Nipani</p>
                    </div>
                  </a>
              </div>

              <!-- ACTIONS -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${CONFIG.WHATSAPP_LINK}" style="display: block; width: 100%; background: #22c55e; color: #ffffff; padding: 18px 0; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);">
                  Join WhatsApp Group
                </a>
                <p style="margin-top: 12px; font-size: 13px; color: #64748b;">Required for competition updates</p>
              </div>

              <!-- STYLED COORDINATORS (New Design) -->
              <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 25px; border: 1px solid #333;">
                  <h3 style="margin: 0 0 20px; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Event Coordinators</h3>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding-bottom: 20px; vertical-align: top;">
                         <div style="border-left: 2px solid #a855f7; padding-left: 10px;">
                            <span style="display: block; color: #e2e8f0; font-weight: 600; font-size: 14px;">Abdulwahab M.</span>
                            <a href="tel:+917349758871" style="color: #94a3b8; font-size: 13px; text-decoration: none;">+91 73497 58871</a>
                         </div>
                      </td>
                      <td width="50%" style="padding-bottom: 20px; vertical-align: top;">
                         <div style="border-left: 2px solid #ec4899; padding-left: 10px;">
                            <span style="display: block; color: #e2e8f0; font-weight: 600; font-size: 14px;">Rakshita Halluri</span>
                            <a href="tel:+917204033630" style="color: #94a3b8; font-size: 13px; text-decoration: none;">+91 72040 33630</a>
                         </div>
                      </td>
                    </tr>
                    <tr>
                      <td width="50%" style="vertical-align: top;">
                         <div style="border-left: 2px solid #22d3ee; padding-left: 10px;">
                            <span style="display: block; color: #e2e8f0; font-weight: 600; font-size: 14px;">Sandesh B.</span>
                            <a href="tel:+917795031246" style="color: #94a3b8; font-size: 13px; text-decoration: none;">+91 77950 31246</a>
                         </div>
                      </td>
                      <td width="50%" style="vertical-align: top;">
                         <div style="border-left: 2px solid #f59e0b; padding-left: 10px;">
                            <span style="display: block; color: #e2e8f0; font-weight: 600; font-size: 14px;">Sana Ravat</span>
                            <a href="tel:+918095981415" style="color: #94a3b8; font-size: 13px; text-decoration: none;">+91 80959 81415</a>
                         </div>
                      </td>
                    </tr>
                  </table>
              </div>

            </div>
            
            <div style="text-align: center; padding: 25px; border-top: 1px solid #222;">
               <p style="margin: 0; color: #4b5563; font-size: 12px;">VSM's Institute of Technology, Nipani</p>
            </div>

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
                    'leaderName': getVal(['Leader Name', 'Full Name', 'Representative']),
                    'leaderEmail': getVal(['Leader Email', 'Email']),
                    'leaderPhone': getVal(['Leader Phone', 'Phone', 'Mobile']),
                    'college': getVal(['College', 'Institute']),
                    'domain': getVal(['Domain', 'Track']) || 'Open Innovation',
                    'members': [
                        getVal(['Member 1 Name', 'Member 1', 'Teammate 1']),
                        getVal(['Member 2 Name', 'Member 2', 'Teammate 2']),
                        getVal(['Member 3 Name', 'Member 3', 'Teammate 3'])
                    ].filter(function (m) { return m && String(m).trim() !== "" }),
                    'status': 'Confirmed'
                })).setMimeType(ContentService.MimeType.JSON);
            }
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Invalid Ticket ID' })).setMimeType(ContentService.MimeType.JSON);
        }

        // ACTION: CHECK DUPLICATES
        var data = sheet.getDataRange().getValues();
        var headers = data[0];

        // --- NEW: ADMIN ACTIONS ---

        // ACTION: MARK ATTENDANCE (Check-In)
        if (e.parameter.action === 'markAttendance' && e.parameter.ticketId) {
            var ticketId = e.parameter.ticketId; // HA26-XXX
            var rowNum = parseInt(ticketId.split('-')[1], 10) + 1;

            if (rowNum > 1 && rowNum <= sheet.getLastRow()) {
                var attendanceCol = getHeaderIndex(headers, ['Attendance', 'Status']) + 1;
                var timeCol = getHeaderIndex(headers, ['Check-In Time', 'Arrival Time']) + 1;

                // If columns don't exist, we assume they are at the end (User must create them ideally)
                // For safety, let's hardcode likely columns if not found or append? 
                // Better strategy: Use specific columns if found, else just log to a specific column index if user followed instructions.
                // Let's try to find headers dynamically, if not found, use last columns? No, dangerous.
                // We will ask user to create "Attendance" and "Check-In Time" headers.

                if (attendanceCol === 0) {
                    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Column "Attendance" not found in Sheet' })).setMimeType(ContentService.MimeType.JSON);
                }

                var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                sheet.getRange(rowNum, attendanceCol).setValue("Checked In");
                if (timeCol > 0) sheet.getRange(rowNum, timeCol).setValue(timestamp);

                return ContentService.createTextOutput(JSON.stringify({
                    'result': 'success',
                    'message': 'Checked In Successfully!',
                    'teamName': sheet.getRange(rowNum, getHeaderIndex(headers, ['Team Name', 'Team']) + 1).getValue(),
                    'timestamp': timestamp
                })).setMimeType(ContentService.MimeType.JSON);
            }
        }

        // ACTION: GET ATTENDANCE LIST (For Printing)
        if (e.parameter.action === 'getAttendanceList') {
            var attendanceIdx = getHeaderIndex(headers, ['Attendance', 'Status']);
            if (attendanceIdx === -1) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);

            var approvedTeams = [];
            for (var i = 1; i < data.length; i++) {
                if (data[i][attendanceIdx] === 'Checked In') {
                    approvedTeams.push({
                        ticketId: 'HA26-' + String(i).padStart(3, '0'),
                        teamName: data[i][getHeaderIndex(headers, ['Team Name', 'Team'])],
                        leaderName: data[i][getHeaderIndex(headers, ['Leader Name', 'Full Name'])],
                        college: data[i][getHeaderIndex(headers, ['College', 'Institute'])],
                        members: [
                            data[i][getHeaderIndex(headers, ['Member 1 Name', 'Member 1'])],
                            data[i][getHeaderIndex(headers, ['Member 2 Name', 'Member 2'])],
                            data[i][getHeaderIndex(headers, ['Member 3 Name', 'Member 3'])]
                        ].filter(Boolean).join(", "),
                        checkInTime: data[i][getHeaderIndex(headers, ['Check-In Time', 'Arrival Time'])] || 'N/A',
                        signature: data[i][getHeaderIndex(headers, ['Signature', 'Signed', 'Digital Signature'])] || null
                    });
                }
            }

            return ContentService.createTextOutput(JSON.stringify({
                'result': 'success',
                'teams': approvedTeams
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // ACTION: RESET ATTENDANCE (Clear all attendance data for testing)
        if (e.parameter.action === 'resetAttendance') {
            var attendanceIdx = getHeaderIndex(headers, ['Attendance', 'Status']);
            var timeIdx = getHeaderIndex(headers, ['Check-In Time', 'Arrival Time']);
            var signatureIdx = getHeaderIndex(headers, ['Signature', 'Signed', 'Digital Signature']);

            var clearedCount = 0;

            // Clear all attendance-related columns
            for (var i = 1; i < data.length; i++) {
                var rowNum = i + 1;
                if (attendanceIdx > -1) {
                    sheet.getRange(rowNum, attendanceIdx + 1).clearContent();
                }
                if (timeIdx > -1) {
                    sheet.getRange(rowNum, timeIdx + 1).clearContent();
                }
                if (signatureIdx > -1) {
                    sheet.getRange(rowNum, signatureIdx + 1).clearContent();
                }
                clearedCount++;
            }

            return ContentService.createTextOutput(JSON.stringify({
                'result': 'success',
                'message': 'Attendance data cleared',
                'rowsCleared': clearedCount
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // --------------------------

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

// --- NEW: POST HANDLER FOR SIGNATURES & IMAGES ---
function doPost(e) {
    var lock = LockService.getScriptLock();
    try {
        lock.waitLock(30000);

        // Parse the POST body
        var request = JSON.parse(e.postData.contents);
        var action = request.action;

        // 1. ACTION: UPLOAD SIGNATURE
        if (action === 'uploadSignature') {
            var ticketId = request.ticketId;
            var imageBase64 = request.image; // "data:image/png;base64,..."

            if (!ticketId || !imageBase64) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Missing data' })).setMimeType(ContentService.MimeType.JSON);
            }

            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form_Responses");
            // Fallback name if user renamed it, try to get first sheet
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

            var data = sheet.getDataRange().getValues();
            var headers = data[0];
            var rowNum = parseInt(ticketId.split('-')[1], 10) + 1;

            // Verify Row
            if (rowNum < 2 || rowNum > sheet.getLastRow()) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Invalid Ticket ID' })).setMimeType(ContentService.MimeType.JSON);
            }

            // Save signature as data URL directly in sheet (no Drive needed!)
            // This avoids all Drive permission issues
            var signatureDataUrl = imageBase64; // Already in data:image/png;base64,... format

            // Log signature length for debugging
            Logger.log("Signature length: " + signatureDataUrl.length + " characters");

            // Google Sheets has a 50,000 character limit per cell
            // If signature is too large, save a note instead
            if (signatureDataUrl.length > 50000) {
                signatureDataUrl = "Signature too large (" + signatureDataUrl.length + " chars). Saved: " + signatureDataUrl.substring(0, 100) + "...";
            }

            // Update Sheet with BOTH Signature AND Attendance
            var signatureCol = getHeaderIndex(headers, ['Signature', 'Signed', 'Digital Signature']) + 1;
            var attendanceCol = getHeaderIndex(headers, ['Attendance', 'Status']) + 1;
            var timeCol = getHeaderIndex(headers, ['Check-In Time', 'Arrival Time']) + 1;

            Logger.log("Signature column index: " + signatureCol);
            Logger.log("Attendance column index: " + attendanceCol);

            if (signatureCol === 0) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Column "Signature" not found in Sheet' })).setMimeType(ContentService.MimeType.JSON);
            }

            if (attendanceCol === 0) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Column "Attendance" not found in Sheet' })).setMimeType(ContentService.MimeType.JSON);
            }

            var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            // Mark attendance AND save signature in one operation
            sheet.getRange(rowNum, attendanceCol).setValue("Checked In");
            if (timeCol > 0) sheet.getRange(rowNum, timeCol).setValue(timestamp);
            sheet.getRange(rowNum, signatureCol).setValue(signatureDataUrl);

            // Get team name for response
            var teamName = sheet.getRange(rowNum, getHeaderIndex(headers, ['Team Name', 'Team']) + 1).getValue();

            return ContentService.createTextOutput(JSON.stringify({
                'result': 'success',
                'message': 'Checked In Successfully!',
                'teamName': teamName,
                'timestamp': timestamp,
                'signatureUrl': signatureDataUrl
            })).setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Unknown Action' })).setMimeType(ContentService.MimeType.JSON);

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
