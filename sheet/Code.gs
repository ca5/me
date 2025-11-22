// The onOpen function runs automatically when the spreadsheet is opened.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('コンテンツ管理')
    .addItem('画像アップロード', 'showSidebar')
    .addToUi();
}

// showSidebar displays a sidebar in the spreadsheet.
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('画像アップロード');
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Uploads a file to a specific folder in Google Drive, sets its permissions to be publicly accessible,
 * and returns the direct link URL.
 *
 * @param {Object} fileData - An object containing the file's mimeType, fileName, and file content in base64.
 * @return {string} The direct link URL of the uploaded file.
 */
function uploadFile(fileData) {
  const FOLDER_NAME = 'static_site_assets';

  try {
    // Decode the base64 file content.
    const decodedFile = Utilities.base64Decode(fileData.file);
    const blob = Utilities.newBlob(decodedFile, fileData.mimeType, fileData.fileName);

    // Find the target folder or create it if it doesn't exist.
    let folder;
    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(FOLDER_NAME);
    }

    // Create the file in the specified folder.
    const file = folder.createFile(blob);

    // Set file permissions to "anyone with the link can view".
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Return the direct link URL for the file.
    return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
  } catch (e) {
    // Log the error and return an error message.
    console.error(`File upload failed: ${e.toString()}`);
    return `エラー: ${e.toString()}`;
  }
}

/**
 * Inserts a URL into the currently active cell in the spreadsheet.
 *
 * @param {string} url - The URL to insert.
 */
function insertUrlIntoCell(url) {
  const cell = SpreadsheetApp.getActiveRange();

  // Ensure only a single cell is selected.
  if (cell.getNumRows() !== 1 || cell.getNumColumns() !== 1) {
    SpreadsheetApp.getUi().alert('1つのセルを選択してください。');
    return;
  }

  // Set the value of the cell to the URL.
  cell.setValue(url);
}
