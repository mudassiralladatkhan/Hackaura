# 📊 Enabling Real-Time Registration Stats

To show the **real number of registered teams** on your website, you need to add a small piece of code to your Google Apps Script.

### Step 1: Open Your Script
1. Go to your Google Sheet.
2. Click **Extensions** > **Apps Script**.
3. Open your existing script file (where you handle `doPost` and `doGet`).

### Step 2: Update the `doGet` Function
Find your `function doGet(e) { ... }` and **replace it** (or update it) with this code:

```javascript
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('Form Responses 1'); // Make sure this matches your sheet name!
    
    // ACTION: CHECK UNIQUE (Existing)
    if (e.parameter.teamName || e.parameter.email || e.parameter.phone) {
      // ... keep your existing checkUnique logic here ...
      // If you are using the exact code I provided earlier, it handled checking logic.
      // Below is a safe way to merge both features.
      
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var teamNameIndex = headers.indexOf('Team Name');
      var emailIndex = headers.indexOf('Leader Email'); 
      var phoneIndex = headers.indexOf('Leader Phone Number');

      var data = sheet.getDataRange().getValues();
      var exists = false;

      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (e.parameter.teamName && row[teamNameIndex].toString().toLowerCase() === e.parameter.teamName.toString().toLowerCase()) exists = true;
        if (e.parameter.email && row[emailIndex].toString().toLowerCase() === e.parameter.email.toString().toLowerCase()) exists = true;
        if (e.parameter.phone && row[phoneIndex].toString() === e.parameter.phone.toString()) exists = true;
      }
      
      return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'exists': exists }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ACTION: GET STATS (New!)
    else if (e.parameter.action === 'getStats') {
      // Subtract 1 for header row. Ensure we don't return negative.
      var count = Math.max(0, sheet.getLastRow() - 1);
      
      // Optional: Estimate college count (simple unique count of college column if needed, or just return basic count)
      return ContentService.createTextOutput(JSON.stringify({ 
        'count': count,
        'collegeCount': Math.floor(count / 3) // Simple estimate or implement unique logic
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Invalid parameters' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Step 3: Deploy New Version (CRITICAL!)
Reflecting changes in Google Apps Script requires a **New Deployment**.
1. Click **Deploy** > **Manage deployments**.
2. Click the **Pencil icon** (Edit) next to your "Web App" deployment.
3. Under **Version**, select **"New version"**.
4. Click **Deploy**.

Once you do this, your website will automatically start showing the real number of teams! 🚀
