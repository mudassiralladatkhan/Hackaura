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
function doGet_legacy(e) {
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

        // --- NEW: OTP HANDLERS (Fallback for GET) ---

        // ACTION: SEND OTP (GET)
        if (e.parameter.action === 'sendOTP') {
            var ticketId = e.parameter.ticketId;
            var ticketNum = parseInt(ticketId.split('-')[1], 10);

            if (isNaN(ticketNum) || ticketNum < 1 || ticketNum >= data.length) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Invalid Ticket ID' })).setMimeType(ContentService.MimeType.JSON);
            }

            var teamEmail = data[ticketNum][getHeaderIndex(headers, ['Email Address', 'Leader Email'])];
            var teamName = data[ticketNum][getHeaderIndex(headers, ['Team Name', 'Team'])];

            if (!teamEmail) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'No email found for this team.' })).setMimeType(ContentService.MimeType.JSON);
            }

            var otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Save OTP
            var otpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active_OTPs");
            if (!otpSheet) {
                otpSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Active_OTPs");
                otpSheet.appendRow(["Timestamp", "Ticket ID", "OTP"]);
            }
            otpSheet.appendRow([new Date(), ticketId, otp]);

            // Send Email
            MailApp.sendEmail({
                to: teamEmail,
                subject: "Hackaura Project Submission OTP",
                htmlBody: `
                    <h2>Project Submission Verification</h2>
                    <p>Hello Team <b>${teamName}</b>,</p>
                    <p>Your OTP for submitting your project is:</p>
                    <h1 style="color: #4ade80; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 15 minutes.</p>
                `
            });

            return ContentService.createTextOutput(JSON.stringify({
                'result': 'success',
                'message': 'OTP sent to registered email.'
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // ACTION: VERIFY OTP (GET)
        if (e.parameter.action === 'verifyOTP') {
            var ticketId = e.parameter.ticketId;
            var userOtp = e.parameter.otp;

            var otpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active_OTPs");
            if (!otpSheet) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'No OTP requested.' })).setMimeType(ContentService.MimeType.JSON);
            }

            var otpData = otpSheet.getDataRange().getValues();
            var isValid = false;

            for (var i = otpData.length - 1; i >= 1; i--) {
                if (String(otpData[i][1]) === String(ticketId)) {
                    var timestamp = new Date(otpData[i][0]);
                    var storedOtp = String(otpData[i][2]).trim();
                    var now = new Date();
                    var diffMins = (now - timestamp) / 60000;

                    if (diffMins <= 15 && storedOtp === String(userOtp).trim()) {
                        isValid = true;
                    }
                    break;
                }
            }

            if (isValid) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'OTP Verified' })).setMimeType(ContentService.MimeType.JSON);
            } else {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Invalid or Expired OTP' })).setMimeType(ContentService.MimeType.JSON);
            }
        }

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

        // ACTION: GET ALL PARTICIPANTS (For Admin List)
        if (e.parameter.action === 'getAllParticipants') {
            var allTeams = [];
            for (var i = 1; i < data.length; i++) {
                allTeams.push({
                    ticketId: 'HA26-' + String(i).padStart(3, '0'),
                    teamName: data[i][getHeaderIndex(headers, ['Team Name', 'Team'])],
                    leaderName: data[i][getHeaderIndex(headers, ['Leader Name', 'Full Name'])],
                    email: data[i][getHeaderIndex(headers, ['Email Address', 'Leader Email'])],
                    phone: data[i][getHeaderIndex(headers, ['Phone Number', 'Phone', 'Mobile'])],
                    college: data[i][getHeaderIndex(headers, ['College', 'Institute'])],
                    membersCount: [
                        data[i][getHeaderIndex(headers, ['Member 1 Name', 'Member 1'])],
                        data[i][getHeaderIndex(headers, ['Member 2 Name', 'Member 2'])],
                        data[i][getHeaderIndex(headers, ['Member 3 Name', 'Member 3'])]
                    ].filter(Boolean).length + 1, // +1 for leader
                    status: data[i][getHeaderIndex(headers, ['Attendance', 'Status'])] || 'Pending'
                });
            }

            return ContentService.createTextOutput(JSON.stringify({
                'result': 'success',
                'teams': allTeams
            })).setMimeType(ContentService.MimeType.JSON);
        }


        // ACTION: CHECK UNIQUE (Duplicate Check)
        if (e.parameter.action === 'checkUnique') {
            var teamIdx = getHeaderIndex(headers, ['Team', 'Team Name']);
            var emailIdx = getHeaderIndex(headers, ['Email', 'Leader Email', 'Email Address']);
            var phoneIdx = getHeaderIndex(headers, ['Phone', 'Leader Phone', 'Mobile']);

            var exists = false;
            var type = e.parameter.type;
            var value = String(e.parameter.value).trim().toLowerCase();

            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (type === 'teamName' && teamIdx > -1 && String(row[teamIdx]).trim().toLowerCase() === value) exists = true;
                if (type === 'email' && emailIdx > -1 && String(row[emailIdx]).trim().toLowerCase() === value) exists = true;
                if (type === 'phone' && phoneIdx > -1 && String(row[phoneIdx]).trim() === value) exists = true;
                if (exists) break;
            }
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'exists': exists })).setMimeType(ContentService.MimeType.JSON);
        }

        // --------------------------

        // Legacy implicit check (Optional: remove if not needed, but keeping for safety)
        if (e.parameter.teamName || e.parameter.email || e.parameter.phone) {
            // ... legacy logic ...
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Please use action=checkUnique' })).setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Invalid params' })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.toString() })).setMimeType(ContentService.MimeType.JSON);
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.toString() })).setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

// --- GET HANDLER FOR DOMAIN-SPECIFIC API CALLS (AVOIDS CORS PREFLIGHT) ---
function doGet(e) {
    var lock = LockService.getScriptLock();
    // Shorter lock for GET to avoid timeout pileups
    lock.tryLock(5000);

    try {
        // Safety check for manual run in editor
        if (!e || !e.parameter) {
            return createCORSResponse({ 'result': 'error', 'message': 'You cannot run doGet directly. Use the deployed URL.' });
        }

        var action = e.parameter.action;
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
        if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form_Responses");
        if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

        var data = sheet.getDataRange().getValues();
        var headers = data[0];

        // --- NEW: STATS ACTION (Restored) ---
        if (action === 'getStats') {
            var count = Math.max(0, sheet.getLastRow() - 1); // Total teams

            // Calculate Unique Colleges
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

            return createCORSResponse({
                'result': 'success',
                'count': count,
                'collegeCount': uniqueCount
            });
        }

        // --- DUPLICATE CHECK ACTION ---
        if (action === 'checkUnique') {
            var teamIdx = getHeaderIndex(headers, ['Team', 'Team Name']);
            var emailIdx = getHeaderIndex(headers, ['Email', 'Leader Email', 'Email Address']);
            var phoneIdx = getHeaderIndex(headers, ['Phone', 'Leader Phone', 'Mobile']);

            var exists = false;
            var type = e.parameter.type;
            var value = String(e.parameter.value).trim().toLowerCase();

            for (var i = 1; i < data.length; i++) {
                var row = data[i];
                if (type === 'teamName' && teamIdx > -1 && String(row[teamIdx]).trim().toLowerCase() === value) exists = true;
                if (type === 'email' && emailIdx > -1 && String(row[emailIdx]).trim().toLowerCase() === value) exists = true;
                if (type === 'phone' && phoneIdx > -1 && String(row[phoneIdx]).trim() === value) exists = true;
                if (exists) break;
            }
            return createCORSResponse({ 'result': 'success', 'exists': exists });
        }

        // --- ADMIN ACTIONS ---

        // ACTION: GET ALL PARTICIPANTS
        if (action === 'getAllParticipants') {
            var allTeams = [];
            for (var i = 1; i < data.length; i++) {
                allTeams.push({
                    ticketId: 'HA26-' + String(i).padStart(3, '0'),
                    teamName: data[i][getHeaderIndex(headers, ['Team Name', 'Team'])] || '',
                    leaderName: data[i][getHeaderIndex(headers, ['Leader Name', 'Full Name'])] || '',
                    email: data[i][getHeaderIndex(headers, ['Email Address', 'Leader Email'])] || '',
                    phone: data[i][getHeaderIndex(headers, ['Phone Number', 'Phone', 'Mobile'])] || '',
                    college: data[i][getHeaderIndex(headers, ['College', 'Institute'])] || '',
                    membersCount: [
                        data[i][getHeaderIndex(headers, ['Member 1 Name', 'Member 1'])],
                        data[i][getHeaderIndex(headers, ['Member 2 Name', 'Member 2'])],
                        data[i][getHeaderIndex(headers, ['Member 3 Name', 'Member 3'])]
                    ].filter(function (m) { return m }).length + 1,
                    status: data[i][getHeaderIndex(headers, ['Attendance', 'Status'])] || 'Pending',
                    assignedProblem: data[i][getHeaderIndex(headers, ['Problem Statment', 'Problem Statement'])] || null
                });
            }
            return createCORSResponse({ 'result': 'success', 'teams': allTeams });
        }

        // ACTION: GET ATTENDANCE LIST
        if (action === 'getAttendanceList') {
            var attendanceIdx = getHeaderIndex(headers, ['Attendance', 'Status']);
            var timeIdx = getHeaderIndex(headers, ['Check-In Time', 'Arrival Time']);
            var teamNameIdx = getHeaderIndex(headers, ['Team Name', 'Team']);
            var leaderNameIdx = getHeaderIndex(headers, ['Leader Name', 'Full Name']);
            var signatureIdx = getHeaderIndex(headers, ['Signature', 'Signed', 'Digital Signature']);

            var approvedTeams = [];

            for (var i = 1; i < data.length; i++) {
                if (data[i][attendanceIdx] === 'Checked In') {
                    var timeVal = data[i][timeIdx];
                    var timeStr = 'N/A';

                    if (timeVal) {
                        try {
                            // If it's a Date object, format it. Otherwise use as string.
                            if (timeVal instanceof Date) {
                                timeStr = timeVal.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                            } else {
                                timeStr = String(timeVal);
                            }
                        } catch (e) {
                            timeStr = String(timeVal);
                        }
                    }

                    approvedTeams.push({
                        ticketId: 'HA26-' + String(i).padStart(3, '0'),
                        teamName: data[i][teamNameIdx] || 'Team ' + i,
                        leaderName: data[i][leaderNameIdx] || 'Leader',
                        members: [
                            data[i][getHeaderIndex(headers, ['Member 1 Name', 'Member 1'])],
                            data[i][getHeaderIndex(headers, ['Member 2 Name', 'Member 2'])],
                            data[i][getHeaderIndex(headers, ['Member 3 Name', 'Member 3'])]
                        ].filter(function (m) { return m }).join(", "),
                        checkInTime: timeStr,
                        signature: data[i][signatureIdx] || null
                    });
                }
            }
            return createCORSResponse({ 'result': 'success', 'teams': approvedTeams });
        }

        // ACTION: MARK ATTENDANCE (If used via GET)
        if (action === 'markAttendance') {
            var ticketId = e.parameter.ticketId;
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID', 'TicketId']);
            var rowNum = findRowIndexByTicketId(data, ticketId, ticketIndex) + 1;

            if (rowNum > 1) {
                var attendanceCol = getHeaderIndex(headers, ['Attendance', 'Status']) + 1;
                var timeCol = getHeaderIndex(headers, ['Check-In Time', 'Arrival Time']) + 1;
                var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                if (attendanceCol > 0) sheet.getRange(rowNum, attendanceCol).setValue("Checked In");
                if (timeCol > 0) sheet.getRange(rowNum, timeCol).setValue(timestamp);

                return createCORSResponse({ 'result': 'success', 'message': 'Checked In' });
            }
            return createCORSResponse({ 'result': 'error', 'message': 'Ticket not found' });
        }

        // ACTION: RESET ATTENDANCE
        if (action === 'resetAttendance') {
            var attendanceIdx = getHeaderIndex(headers, ['Attendance', 'Status']);
            var timeIdx = getHeaderIndex(headers, ['Check-In Time', 'Arrival Time']);
            var signatureIdx = getHeaderIndex(headers, ['Signature', 'Signed', 'Digital Signature']);

            var clearedCount = 0;
            for (var i = 1; i < data.length; i++) {
                if (attendanceIdx > -1) sheet.getRange(i + 1, attendanceIdx + 1).clearContent();
                if (timeIdx > -1) sheet.getRange(i + 1, timeIdx + 1).clearContent();
                if (signatureIdx > -1) sheet.getRange(i + 1, signatureIdx + 1).clearContent();
                clearedCount++;
            }
            return createCORSResponse({ 'result': 'success', 'rowsCleared': clearedCount });
        }

        // ACTION: RESET PROBLEM
        if (action === 'resetProblem') {
            var ticketId = e.parameter.ticketId;
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID', 'TicketId', 'Ticket', 'Ref No', 'ID']);
            var assignedNumIndex = getHeaderIndex(headers, ['Assigned Problem Number', 'Assigned Problem']);
            var problemNameIndex = getHeaderIndex(headers, ['Problem Statment', 'Problem Statement']);

            var rowIndex = findRowIndexByTicketId(data, ticketId, ticketIndex);

            if (rowIndex > -1) {
                if (assignedNumIndex > -1) sheet.getRange(rowIndex + 1, assignedNumIndex + 1).clearContent();
                if (problemNameIndex > -1) sheet.getRange(rowIndex + 1, problemNameIndex + 1).clearContent();

                return createCORSResponse({ 'result': 'success', 'message': 'Problem reset successfully' });
            }
            return createCORSResponse({ 'result': 'error', 'message': 'Ticket not found' });
        }

        // ACTION: GET TEAM DETAILS
        if (action === 'getTeamDetails') {
            var ticketId = e.parameter.ticketId;
            var idx = findRowIndexByTicketId(data, ticketId, getHeaderIndex(headers, ['Ticket ID', 'TicketId']));
            if (idx > -1) {
                var row = data[idx];
                var teamName = row[getHeaderIndex(headers, ['Team Name', 'Team'])];
                var problemTitle = row[getHeaderIndex(headers, ['Problem Statment', 'Problem Statement'])];

                // Gather Members (Check for Member 1, 2, 3, 4)
                var members = [];
                var memberHeaders = [
                    ['Member 1', 'Member 1 Name', 'Team Member 1', 'Participant 1', 'Member 1 (Optional)', 'Member1'],
                    ['Member 2', 'Member 2 Name', 'Team Member 2', 'Participant 2', 'Member 2 (Optional)', 'Member2'],
                    ['Member 3', 'Member 3 Name', 'Team Member 3', 'Participant 3', 'Member 3 (Optional)', 'Member3'],
                    ['Member 4', 'Member 4 Name', 'Team Member 4', 'Participant 4', 'Member 4 (Optional)', 'Member4']
                ];

                for (var i = 0; i < memberHeaders.length; i++) {
                    var idx = getHeaderIndex(headers, memberHeaders[i]);
                    if (idx > -1) {
                        var val = String(row[idx]).trim();
                        // Ignore email addresses in parens like "Name (email@example.com)" if present, or just take the whole string.
                        // The user's screenshot shows "Name (email)". Let's keep it simple and just take the value for now, 
                        // as cleaning it might be risky without knowing exact format.
                        if (val) members.push(val);
                    }
                }

                return createCORSResponse({
                    'result': 'success',
                    'teamName': teamName,
                    'leaderName': row[getHeaderIndex(headers, ['Leader Name', 'Full Name', 'Representative'])],
                    'leaderEmail': row[getHeaderIndex(headers, ['Leader Email', 'Email Address', 'Email'])],
                    'leaderPhone': row[getHeaderIndex(headers, ['Leader Phone', 'Phone', 'Mobile'])],
                    'college': row[getHeaderIndex(headers, ['College', 'Institute'])],
                    'domain': row[getHeaderIndex(headers, ['Hackathon Domain', 'Domain', 'Track'])],
                    'members': members,
                    'status': row[getHeaderIndex(headers, ['Attendance', 'Status'])] || 'Registered',
                    'problemTitle': problemTitle || ''
                });
            }
            return createCORSResponse({ 'result': 'error', 'message': 'Ticket not found' });
        }

        // ACTION: VERIFY DOMAIN TICKET
        if (action === 'verifyDomainTicket') {
            var ticketId = e.parameter.ticketId;
            var domain = e.parameter.domain;

            var ticketIndex = getHeaderIndex(headers, ['Ticket ID', 'TicketId', 'Ticket', 'Ref No', 'ID']);
            var domainIndex = getHeaderIndex(headers, ['Hackathon Domain', 'Domain']);
            var teamNameIndex = getHeaderIndex(headers, ['Team Name']);
            var leaderEmailIndex = getHeaderIndex(headers, ['Email Address', 'Leader Email']);
            var assignedProblemIndex = getHeaderIndex(headers, ['Assigned Problem Number', 'Assigned Problem']);
            var attendanceIndex = getHeaderIndex(headers, ['Attendance', 'Status']);

            var rowIndex = findRowIndexByTicketId(data, ticketId, ticketIndex);

            if (rowIndex > -1) {
                var row = data[rowIndex];

                // CHECK ATTENDANCE
                var status = String(row[attendanceIndex]).trim().toLowerCase();
                if (status !== 'checked in') {
                    return createCORSResponse({
                        'result': 'error',
                        'message': 'Access Denied: Team not Checked-In. Please visit the registration desk.'
                    });
                }

                var teamDomain = String(row[domainIndex]).trim();
                if (teamDomain.toLowerCase() !== domain.toLowerCase()) {
                    return createCORSResponse({
                        'result': 'error',
                        'message': 'This ticket is registered for ' + teamDomain + ', not ' + domain
                    });
                }

                return createCORSResponse({
                    'result': 'success',
                    'teamName': row[teamNameIndex],
                    'leaderEmail': row[leaderEmailIndex],
                    'assignedProblem': row[assignedProblemIndex] || null
                });
            }

            return createCORSResponse({
                'result': 'error',
                'message': 'Ticket ID not found'
            });
        }

        // ACTION: GET PROBLEM STATEMENTS
        if (action === 'getProblemStatements') {
            var domain = e.parameter.domain;
            var problems = [];
            var problemSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Problem Statements");

            if (problemSheet) {
                var problemData = problemSheet.getDataRange().getValues();
                for (var i = 1; i < problemData.length; i++) {
                    if (String(problemData[i][0]).toLowerCase() === domain.toLowerCase()) {
                        problems.push({
                            'number': problemData[i][1],
                            'title': problemData[i][2],
                            'description': problemData[i][3]
                        });
                    }
                }
            }

            if (problems.length === 0) problems = getPlaceholderProblems(domain);

            return createCORSResponse({ 'result': 'success', 'problems': problems });
        }

        // ACTION: ASSIGN PROBLEM
        if (action === 'assignProblem') {
            var ticketId = e.parameter.ticketId;
            var problemNumber = e.parameter.problemNumber;
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID', 'TicketId', 'ID']);
            var assignedNumIndex = getHeaderIndex(headers, ['Assigned Problem Number', 'Assigned Problem']);
            var problemNameIndex = getHeaderIndex(headers, ['Problem Statment', 'Problem Statement']);
            var domainIndex = getHeaderIndex(headers, ['Hackathon Domain', 'Domain']);

            var rowIndex = findRowIndexByTicketId(data, ticketId, ticketIndex);

            if (rowIndex > -1) {
                var domain = data[rowIndex][domainIndex];
                var problemTitle = "Problem " + problemNumber;

                // Lookup Title
                var problemSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Problem Statements");
                if (problemSheet) {
                    var pData = problemSheet.getDataRange().getValues();
                    for (var k = 1; k < pData.length; k++) {
                        if (String(pData[k][0]).toLowerCase() === String(domain).toLowerCase() && pData[k][1] == problemNumber) {
                            problemTitle = pData[k][2];
                            break;
                        }
                    }
                } else {
                    var placeholders = getPlaceholderProblems(domain);
                    var ph = placeholders.filter(function (p) { return p.number == problemNumber })[0];
                    if (ph) problemTitle = ph.title;
                }

                if (assignedNumIndex > -1) sheet.getRange(rowIndex + 1, assignedNumIndex + 1).setValue(problemNumber);
                if (problemNameIndex > -1) sheet.getRange(rowIndex + 1, problemNameIndex + 1).setValue(problemTitle);

                return createCORSResponse({
                    'result': 'success',
                    'message': 'Problem assigned successfully',
                    'number': problemNumber,
                    'title': problemTitle
                });
            }
            return createCORSResponse({ 'result': 'error', 'message': 'Ticket ID not found' });
        }

        // ACTION: GET ASSIGNED PROBLEM
        if (action === 'getAssignedProblem') {
            var ticketId = e.parameter.ticketId;
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID', 'TicketId']);
            var assignedProblemIndex = getHeaderIndex(headers, ['Assigned Problem Number', 'Assigned Problem']);
            var domainIndex = getHeaderIndex(headers, ['Hackathon Domain', 'Domain']);

            var rowIndex = findRowIndexByTicketId(data, ticketId, ticketIndex);

            if (rowIndex > -1) {
                var problemNumber = data[rowIndex][assignedProblemIndex];
                var domain = data[rowIndex][domainIndex];

                if (!problemNumber) return createCORSResponse({ 'result': 'error', 'message': 'No problem assigned yet' });

                var problemSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Problem Statements");
                if (problemSheet) {
                    var pData = problemSheet.getDataRange().getValues();
                    for (var j = 1; j < pData.length; j++) {
                        if (String(pData[j][0]).toLowerCase() === String(domain).toLowerCase() && pData[j][1] == problemNumber) {
                            return createCORSResponse({
                                'result': 'success',
                                'problem': { 'number': pData[j][1], 'title': pData[j][2], 'description': pData[j][3] }
                            });
                        }
                    }
                }

                // Fallback
                var placeholders = getPlaceholderProblems(domain);
                var phHandler = placeholders.filter(function (p) { return p.number == problemNumber })[0];
                if (phHandler) return createCORSResponse({ 'result': 'success', 'problem': phHandler });

                return createCORSResponse({ 'result': 'error', 'message': 'Problem details not found' });
            }
            return createCORSResponse({ 'result': 'error', 'message': 'Ticket ID not found' });
        }

        // ACTION: SEND OTP
        if (action === 'sendOTP') {
            var ticketId = e.parameter.ticketId;
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID', 'TicketId']);
            var rowIndex = findRowIndexByTicketId(data, ticketId, ticketIndex);

            if (rowIndex === -1) return createCORSResponse({ 'result': 'error', 'message': 'Invalid Ticket ID' });

            var attendanceIndex = getHeaderIndex(headers, ['Attendance', 'Status']);
            var assignedProblemIndex = getHeaderIndex(headers, ['Assigned Problem Number', 'Assigned Problem']);

            // CHECK ATTENDANCE
            if (attendanceIndex > -1) {
                var statusValue = String(data[rowIndex][attendanceIndex]).trim().toLowerCase();
                if (statusValue !== 'checked in') {
                    return createCORSResponse({
                        'result': 'error',
                        'message': 'Access Denied: Team not Checked-In. Please visit the registration desk.'
                    });
                }
            }

            // CHECK PROBLEM ASSIGNMENT (Only for Project Submission)
            if (assignedProblemIndex > -1 && e.parameter.type === 'submission') {
                var assignedVal = String(data[rowIndex][assignedProblemIndex]).trim();
                if (!assignedVal) {
                    return createCORSResponse({
                        'result': 'error',
                        'message': 'Access Denied: No problem assigned. Please visit a domain page (e.g., /genai) to get your problem statement first.'
                    });
                }
            }

            var teamEmail = data[rowIndex][getHeaderIndex(headers, ['Email Address', 'Leader Email'])];
            var teamName = data[rowIndex][getHeaderIndex(headers, ['Team Name', 'Team'])];

            if (!teamEmail) return createCORSResponse({ 'result': 'error', 'message': 'No email found.' });

            var otp = Math.floor(100000 + Math.random() * 900000).toString();
            var otpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active_OTPs");
            if (!otpSheet) {
                otpSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Active_OTPs");
                otpSheet.appendRow(["Timestamp", "Ticket ID", "OTP"]);
            }
            otpSheet.appendRow([new Date(), ticketId, otp]);

            MailApp.sendEmail({
                to: teamEmail,
                subject: "Hackaura Validation OTP",
                htmlBody: `<h2>OTP: ${otp}</h2><p>Valid for 15 mins.</p>`
            });

            return createCORSResponse({ 'result': 'success', 'message': 'OTP sent' });
        }

        // ACTION: VERIFY OTP
        if (action === 'verifyOTP') {
            var ticketId = e.parameter.ticketId;
            var userOtp = e.parameter.otp;
            var otpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active_OTPs");

            if (!otpSheet) return createCORSResponse({ 'result': 'error', 'message': 'No OTPs found' });

            var otpData = otpSheet.getDataRange().getValues();
            var isValid = false;
            for (var i = otpData.length - 1; i >= 1; i--) {
                if (String(otpData[i][1]) === String(ticketId)) {
                    var diff = (new Date() - new Date(otpData[i][0])) / 60000;
                    if (diff <= 15 && String(otpData[i][2]).trim() === String(userOtp).trim()) {
                        isValid = true;
                    }
                    break;
                }
            }
            return isValid ? createCORSResponse({ 'result': 'success', 'message': 'Verified' }) : createCORSResponse({ 'result': 'error', 'message': 'Invalid OTP' });
        }

        return createCORSResponse({ 'result': 'error', 'message': 'Unknown Action: ' + action });

    } catch (err) {
        return createCORSResponse({ 'result': 'error', 'error': 'Server Error: ' + err.toString() });
    } finally {
        lock.releaseLock();
    }
}

// --- CORS SUPPORT FOR LOCAL DEVELOPMENT ---
function doOptions(e) {
    return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.JSON);
}

// Helper function to create CORS-enabled responses
function createCORSResponse(jsonObject) {
    return ContentService.createTextOutput(JSON.stringify(jsonObject))
        .setMimeType(ContentService.MimeType.JSON);
}

// --- NEW: POST HANDLER FOR SIGNATURES & IMAGES ---
function doPost(e) {
    // Handle OPTIONS preflight request for CORS (Just return empty JSON, headers not needed/possible)
    if (e && e.parameter && e.parameter.method === 'OPTIONS') {
        return ContentService.createTextOutput("")
            .setMimeType(ContentService.MimeType.JSON);
    }

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

            // ... (rest of uploadSignature) ...
            // FOR BREVITY I AM NOT REPLACING THE INSIDE OF uploadSignature, I AM JUST INSERTING AFTER IT...
            // Wait, multi_replace cannot insert, it replaces. I should append to the end of doPost or find a unique insertion point.
            // I'll append the new actions BEFORE the end of doPost, after the uploadSignature block.


            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form_Responses");
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

        // 2. ACTION: UPLOAD PAYMENT PROOF
        if (action === 'uploadPaymentProof') {
            var teamName = request.teamName || "Unknown Team";
            var imageBase64 = request.image; // "data:image/png;base64,..."

            if (!imageBase64) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Missing image data' })).setMimeType(ContentService.MimeType.JSON);
            }

            // Create/Find "Payment Screenshots" Folder
            var folderName = "Hackaura Payment Screenshots";
            var folders = DriveApp.getFoldersByName(folderName);
            var folder;
            if (folders.hasNext()) {
                folder = folders.next();
            } else {
                folder = DriveApp.createFolder(folderName);
                folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            }

            // Save Image
            var blob = Utilities.newBlob(Utilities.base64Decode(imageBase64.split(',')[1]), MimeType.PNG, teamName + "_Payment.png");
            var file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

            return ContentService.createTextOutput(JSON.stringify({
                'result': 'success',
                'url': file.getUrl()
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // ACTION: SUBMIT PROJECT
        if (action === 'submitProject') {
            var ticketId = request.ticketId;
            var ticketNum = parseInt(ticketId.split('-')[1], 10);

            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form_Responses");
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
            var data = sheet.getDataRange().getValues();
            var headers = data[0];

            // Validate Ticket ID
            if (isNaN(ticketNum) || ticketNum < 1 || ticketNum >= data.length) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Invalid Ticket ID' })).setMimeType(ContentService.MimeType.JSON);
            }

            var teamName = data[ticketNum][getHeaderIndex(headers, ['Team Name', 'Team'])];

            // --- TEAM FOLDER MANAGEMENT ---
            // Create/find a folder named "TicketID - TeamName" for organized storage
            var parentFolderId = "1PTclMTstaA_iwmoS4i5TADV88_haWU1B";
            var teamFolderName = ticketId + " - " + teamName;
            var teamFolder;

            try {
                var parentFolder = DriveApp.getFolderById(parentFolderId);
                var folders = parentFolder.getFoldersByName(teamFolderName);
                if (folders.hasNext()) {
                    // Folder already exists, use it
                    teamFolder = folders.next();
                } else {
                    // Create new team folder
                    teamFolder = parentFolder.createFolder(teamFolderName);
                    teamFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
                }
                teamFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            } catch (e) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Folder Creation Failed: ' + e.toString() })).setMimeType(ContentService.MimeType.JSON);
            }

            // --- FILE UPLOADS ---
            var finalPptLink = request.pptLink || '';
            var finalVideoLink = request.videoLink || '';

            // Handle PPT File - Save to team folder
            if (request.pptSubmissionType === 'file' && request.pptFile) {
                try {
                    var decoded = Utilities.base64Decode(request.pptFile.split(',')[1] || request.pptFile);
                    var blob = Utilities.newBlob(decoded, MimeType.PDF, request.pptFileName || "Presentation.pdf");

                    var file = teamFolder.createFile(blob);
                    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
                    finalPptLink = file.getUrl();
                } catch (e) {
                    return createCORSResponse({ 'result': 'error', 'message': 'PPT Upload Failed: ' + e.toString() });
                }
            }

            // Handle Video File - Save to team folder
            if (request.videoSubmissionType === 'file' && request.videoFile) {
                try {
                    var decodedVideo = Utilities.base64Decode(request.videoFile.split(',')[1] || request.videoFile);
                    var videoBlob = Utilities.newBlob(decodedVideo, 'video/mp4', request.videoFileName || "Demo.mp4");

                    var vFile = teamFolder.createFile(videoBlob);
                    vFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
                    finalVideoLink = vFile.getUrl();
                } catch (e) {
                    return createCORSResponse({ 'result': 'error', 'message': 'Video Upload Failed: ' + e.toString() });
                }
            }

            // Get or Create "Submissions" Sheet
            var submissionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Submissions");
            if (!submissionSheet) {
                submissionSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Submissions");
                submissionSheet.appendRow(["Timestamp", "Ticket ID", "Team Name", "Project Title", "Description", "PPT Link", "Repo Link", "Video Link", "Other Links"]);
            }

            // Append Submission Data
            submissionSheet.appendRow([
                new Date(),
                ticketId,
                teamName,
                request.title,
                request.description,
                finalPptLink,
                request.repoLink || '',
                finalVideoLink,
                request.otherLinks || ''
            ]);

            return createCORSResponse({
                'result': 'success',
                'message': 'Project submitted successfully!'
            });
        }

        // ACTION: SEND OTP
        if (action === 'sendOTP') {
            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
            var data = sheet.getDataRange().getValues();
            var headers = data[0];

            var ticketId = request.ticketId;
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID', 'TicketId']);
            var rowIndex = findRowIndexByTicketId(data, ticketId, ticketIndex);

            if (rowIndex === -1) return createCORSResponse({ 'result': 'error', 'message': 'Invalid Ticket ID' });

            var attendanceIndex = getHeaderIndex(headers, ['Attendance', 'Status']);
            var assignedProblemIndex = getHeaderIndex(headers, ['Assigned Problem Number', 'Assigned Problem']);

            // CHECK ATTENDANCE
            if (attendanceIndex > -1) {
                var statusValue = String(data[rowIndex][attendanceIndex]).trim().toLowerCase();
                if (statusValue !== 'checked in') {
                    return createCORSResponse({
                        'result': 'error',
                        'message': 'Access Denied: Team not Checked-In. Please visit the registration desk.'
                    });
                }
            }

            // CHECK PROBLEM ASSIGNMENT (Only for Project Submission)
            if (assignedProblemIndex > -1 && request.type === 'submission') {
                var assignedVal = String(data[rowIndex][assignedProblemIndex]).trim();
                if (!assignedVal) {
                    return createCORSResponse({
                        'result': 'error',
                        'message': 'Access Denied: No problem assigned. Please visit a domain page (e.g., /genai) to get your problem statement first.'
                    });
                }
            }

            var teamEmail = data[rowIndex][getHeaderIndex(headers, ['Email Address', 'Leader Email'])];
            var teamName = data[rowIndex][getHeaderIndex(headers, ['Team Name', 'Team'])];

            if (!teamEmail) {
                return createCORSResponse({ 'result': 'error', 'message': 'No email found for this team.' });
            }

            var otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Save OTP
            var otpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active_OTPs");
            if (!otpSheet) {
                otpSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Active_OTPs");
                otpSheet.appendRow(["Timestamp", "Ticket ID", "OTP"]);
            }
            otpSheet.appendRow([new Date(), ticketId, otp]);

            // Send Email
            MailApp.sendEmail({
                to: teamEmail,
                subject: "Hackaura Project Submission OTP",
                htmlBody: `
                    <h2>Project Submission Verification</h2>
                    <p>Hello Team <b>${teamName}</b>,</p>
                    <p>Your OTP for submitting your project is:</p>
                    <h1 style="color: #4ade80; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 15 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                `
            });

            return createCORSResponse({
                'result': 'success',
                'message': 'OTP sent to registered email.'
            });
        }

        // ACTION: VERIFY OTP
        if (action === 'verifyOTP') {
            var ticketId = request.ticketId;
            var userOtp = request.otp;

            var otpSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active_OTPs");
            if (!otpSheet) {
                return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'No OTP requested.' })).setMimeType(ContentService.MimeType.JSON);
            }

            var otpData = otpSheet.getDataRange().getValues();
            var isValid = false;

            // Check from bottom up for latest OTP
            for (var i = otpData.length - 1; i >= 1; i--) {
                if (String(otpData[i][1]) === String(ticketId)) {
                    var timestamp = new Date(otpData[i][0]);
                    var storedOtp = String(otpData[i][2]).trim();
                    var now = new Date();
                    var diffMins = (now - timestamp) / 60000;

                    if (diffMins <= 15 && storedOtp === String(userOtp).trim()) {
                        isValid = true;
                    }
                    break; // Only check the latest one
                }
            }

            if (isValid) {
                return createCORSResponse({ 'result': 'success', 'message': 'OTP Verified' });
            } else {
                return createCORSResponse({ 'result': 'error', 'message': 'Invalid or Expired OTP' });
            }
        }

        // 4. ACTION: VERIFY DOMAIN TICKET
        if (action === 'verifyDomainTicket') {
            var ticketId = request.ticketId;
            var domain = request.domain;

            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

            var data = sheet.getDataRange().getValues();
            var headers = data[0];
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID']);
            var domainIndex = getHeaderIndex(headers, ['Hackathon Domain', 'Domain']);
            var teamNameIndex = getHeaderIndex(headers, ['Team Name']);
            var leaderEmailIndex = getHeaderIndex(headers, ['Leader Email', 'Email']);
            var assignedProblemIndex = getHeaderIndex(headers, ['Assigned Problem Number']);

            // Find ticket
            for (var i = 1; i < data.length; i++) {
                if (String(data[i][ticketIndex]) === String(ticketId)) {
                    var teamDomain = String(data[i][domainIndex]).trim();

                    // Verify domain matches
                    if (teamDomain.toLowerCase() !== domain.toLowerCase()) {
                        return createCORSResponse({
                            'result': 'error',
                            'message': 'This ticket is registered for ' + teamDomain + ', not ' + domain
                        });
                    }

                    return createCORSResponse({
                        'result': 'success',
                        'teamName': data[i][teamNameIndex],
                        'leaderEmail': data[i][leaderEmailIndex],
                        'assignedProblem': data[i][assignedProblemIndex] || null
                    });
                }
            }

            return createCORSResponse({
                'result': 'error',
                'message': 'Ticket ID not found'
            });
        }

        // 5. ACTION: GET PROBLEM STATEMENTS
        if (action === 'getProblemStatements') {
            var domain = request.domain;

            var problemSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Problem Statements");
            if (!problemSheet) {
                return createCORSResponse({
                    'result': 'error',
                    'message': 'Problem Statements sheet not found. Please create it first.'
                });
            }

            var problemData = problemSheet.getDataRange().getValues();
            var problemHeaders = problemData[0];
            var problems = [];

            // Find problems for this domain
            for (var i = 1; i < problemData.length; i++) {
                if (String(problemData[i][0]).toLowerCase() === domain.toLowerCase()) {
                    problems.push({
                        'number': problemData[i][1],
                        'title': problemData[i][2],
                        'description': problemData[i][3]
                    });
                }
            }

            return createCORSResponse({
                'result': 'success',
                'problems': problems
            });
        }

        // 6. ACTION: ASSIGN PROBLEM
        if (action === 'assignProblem') {
            var ticketId = request.ticketId;
            var problemNumber = request.problemNumber;

            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

            var data = sheet.getDataRange().getValues();
            var headers = data[0];
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID']);
            var assignedProblemIndex = getHeaderIndex(headers, ['Assigned Problem Number']);

            // Find and update ticket
            for (var i = 1; i < data.length; i++) {
                if (String(data[i][ticketIndex]) === String(ticketId)) {
                    sheet.getRange(i + 1, assignedProblemIndex + 1).setValue(problemNumber);
                    return createCORSResponse({
                        'result': 'success',
                        'message': 'Problem assigned successfully'
                    });
                }
            }

            return createCORSResponse({
                'result': 'error',
                'message': 'Ticket ID not found'
            });
        }

        // 7. ACTION: GET ASSIGNED PROBLEM
        if (action === 'getAssignedProblem') {
            var ticketId = request.ticketId;

            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

            var data = sheet.getDataRange().getValues();
            var headers = data[0];
            var ticketIndex = getHeaderIndex(headers, ['Ticket ID']);
            var domainIndex = getHeaderIndex(headers, ['Hackathon Domain', 'Domain']);
            var assignedProblemIndex = getHeaderIndex(headers, ['Assigned Problem Number']);

            // Find ticket
            for (var i = 1; i < data.length; i++) {
                if (String(data[i][ticketIndex]) === String(ticketId)) {
                    var problemNumber = data[i][assignedProblemIndex];
                    var domain = data[i][domainIndex];

                    if (!problemNumber) {
                        return createCORSResponse({
                            'result': 'error',
                            'message': 'No problem assigned yet'
                        });
                    }

                    // Fetch problem details from Problem Statements sheet
                    var problemSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Problem Statements");
                    var problemFound = null;

                    if (problemSheet) {
                        var problemData = problemSheet.getDataRange().getValues();
                        for (var j = 1; j < problemData.length; j++) {
                            if (String(problemData[j][0]).toLowerCase() === domain.toLowerCase() &&
                                problemData[j][1] == problemNumber) {
                                problemFound = {
                                    'number': problemData[j][1],
                                    'title': problemData[j][2],
                                    'description': problemData[j][3]
                                };
                                break;
                            }
                        }
                    }

                    // Fallback to placeholder if not found in sheet
                    if (!problemFound) {
                        var placeholders = getPlaceholderProblems(domain);
                        // Adjust index (Problem 1 is index 0)
                        var index = parseInt(problemNumber, 10) - 1;
                        if (index >= 0 && index < placeholders.length) {
                            problemFound = placeholders[index];
                        } else {
                            // Generic fallback
                            problemFound = {
                                'number': problemNumber,
                                'title': domain + ' Problem ' + problemNumber,
                                'description': 'Description placeholder'
                            };
                        }
                    }

                    if (problemFound) {
                        return createCORSResponse({
                            'result': 'success',
                            'problem': problemFound
                        });
                    }

                    return createCORSResponse({
                        'result': 'error',
                        'message': 'Problem details not found'
                    });
                }
            }

            return createCORSResponse({
                'result': 'error',
                'message': 'Ticket ID not found'
            });
        }

        // 8. ACTION: GET PAYMENT SCREENSHOTS (ADMIN)
        if (action === 'getPaymentScreenshots') {
            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
            if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
            var data = sheet.getDataRange().getValues();
            var headers = data[0];

            var paymentIdx = getHeaderIndex(headers, ['Payment', 'Payment Proof', 'Screenshot', 'Upload', 'Transaction', 'Payment Screenshot', 'Payment Screen Shot']);
            var ticketIdx = getHeaderIndex(headers, ['Ticket ID', 'TicketId']);
            var teamIdx = getHeaderIndex(headers, ['Team Name', 'Team']);

            var screenshots = [];

            if (paymentIdx > -1) {
                for (var i = 1; i < data.length; i++) {
                    var val = String(data[i][paymentIdx]);
                    var url = "";

                    // Extract URL if present
                    var urlMatch = val.match(/https?:\/\/[^\s|]+/);
                    if (urlMatch) {
                        url = urlMatch[0];
                    }

                    // Return entry even if no URL (so we see old data too)
                    if (val && val.length > 2) { // Filter out empty cells
                        screenshots.push({
                            'ticketId': ticketIdx > -1 ? data[i][ticketIdx] : 'Unknown',
                            'teamName': teamIdx > -1 ? data[i][teamIdx] : 'Unknown',
                            'url': url,
                            'raw': val
                        });
                    }
                }
            }

            return createCORSResponse({
                'result': 'success',
                'screenshots': screenshots
            });
        }

        return createCORSResponse({ 'result': 'error', 'message': 'Unknown Action' });

    } catch (err) {
        return createCORSResponse({ 'result': 'error', 'error': err.toString() });
    } finally {
        lock.releaseLock();
    }
}

// Helper to find row by Ticket ID (Column Search OR Row-Based Fallback)
function findRowIndexByTicketId(data, ticketId, ticketColIndex) {
    if (ticketColIndex > -1) {
        for (var i = 1; i < data.length; i++) {
            if (String(data[i][ticketColIndex]).trim().toLowerCase() === String(ticketId).trim().toLowerCase()) return i;
        }
    }
    var match = String(ticketId).match(/^HA26-(\d+)$/i);
    if (match) {
        var idx = parseInt(match[1], 10);
        if (idx > 0 && idx < data.length) return idx;
    }
    return -1;
}

function getPlaceholderProblems(domain) {
    var problems = [];
    for (var i = 1; i <= 6; i++) {
        problems.push({
            'number': i,
            'title': domain + ' Problem Statement ' + i,
            'description': 'This is a placeholder description for the ' + domain + ' problem statement #' + i + '. The actual problem details will be updated shortly.'
        });
    }
    return problems;
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

// --- HELPER FOR AUTHORIZATION ---
// Run this function ONCE in the editor to authorize Drive permissions.
function testDrivePermissions() {
    var folderId = "1PTclMTstaA_iwmoS4i5TADV88_haWU1B";
    var folder = DriveApp.getFolderById(folderId);
    console.log("Access successful! Folder name: " + folder.getName());
}

// Test if you can actually CREATE files in the folder
function testFolderAccess() {
    var folder = DriveApp.getFolderById("1PTclMTstaA_iwmoS4i5TADV88_haWU1B");
    var testFile = folder.createFile("test.txt", "hello");
    console.log("SUCCESS! File created: " + testFile.getUrl());
    console.log("You are the OWNER and have full write access!");
    // Clean up test file
    testFile.setTrashed(true);
}
