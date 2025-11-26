// The onOpen function runs automatically when the spreadsheet is opened.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('コンテンツ管理')
    .addItem('画像アップロード', 'showSidebar')
    .addSeparator()
    .addItem('未使用画像を削除', 'deleteUnusedImages')
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
  try {
    // Decode the base64 file content.
    const decodedFile = Utilities.base64Decode(fileData.file);
    const blob = Utilities.newBlob(decodedFile, fileData.mimeType, fileData.fileName);

    // Get the parent folder of the active spreadsheet.
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
    const parents = spreadsheetFile.getParents();

    let parentFolder;
    if (parents.hasNext()) {
      // If the spreadsheet is in a folder, use that folder.
      parentFolder = parents.next();
    } else {
      // If the spreadsheet is in the root directory, use the root.
      parentFolder = DriveApp.getRootFolder();
    }

    // Find or create the "uploaded_image" folder inside the parent folder.
    const folderName = "uploaded_image";
    const folders = parentFolder.getFoldersByName(folderName);
    const uploadFolder = folders.hasNext() ? folders.next() : parentFolder.createFolder(folderName);

    // Create the file in the determined folder.
    const file = uploadFolder.createFile(blob);

    // Set file permissions to "anyone with the link can view".
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Return the direct link URL for the file.
    return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
  } catch (e) {
    // Log the error and throw an exception to be caught by the client-side failure handler.
    console.error(`File upload failed: ${e.toString()}`);
    throw new Error(`アップロードに失敗しました: ${e.message}`);
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

/**
 * Deletes images from the "uploaded_image" folder that are not referenced in any cell of the spreadsheet.
 */
function deleteUnusedImages() {
  try {
    const ui = SpreadsheetApp.getUi();

    // Ask for confirmation before proceeding.
    const response = ui.alert(
      '未使用画像を削除しますか？',
      'スプレッドシートのどこからも参照されていない画像が "uploaded_image" フォルダから削除されます。この操作は元に戻せません。',
      ui.ButtonSet.YES_NO
    );
    if (response !== ui.Button.YES) {
      ui.alert('操作はキャンセルされました。');
      return;
    }

    // Get the parent folder of the active spreadsheet.
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
    const parents = spreadsheetFile.getParents();
    let parentFolder;
    if (parents.hasNext()) {
      parentFolder = parents.next();
    } else {
      parentFolder = DriveApp.getRootFolder();
    }

    // Find the "uploaded_image" folder.
    const folderName = "uploaded_image";
    const folders = parentFolder.getFoldersByName(folderName);
    if (!folders.hasNext()) {
      ui.alert(`"${folderName}" フォルダが見つかりません。`);
      return;
    }
    const uploadFolder = folders.next();

    // 1. Collect all Google Drive file IDs from all sheets.
    const usedFileIds = new Set();
    const sheets = spreadsheet.getSheets();
    const urlRegex = /https:\/\/drive\.google\.com\/uc\?export=view&id=([a-zA-Z0-9_-]+)/g;

    sheets.forEach(sheet => {
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      values.forEach(row => {
        row.forEach(cell => {
          if (typeof cell === 'string') {
            let match;
            while ((match = urlRegex.exec(cell)) !== null) {
              usedFileIds.add(match[1]);
            }
          }
        });
      });
    });

    // 2. Get all file IDs from the "uploaded_image" folder.
    const imageFiles = uploadFolder.getFiles();
    const imageFileIds = new Map();
    while (imageFiles.hasNext()) {
      const file = imageFiles.next();
      imageFileIds.set(file.getId(), file);
    }

    // 3. Find and delete unused images.
    let deletedCount = 0;
    for (const [id, file] of imageFileIds.entries()) {
      if (!usedFileIds.has(id)) {
        file.setTrashed(true); // Move to trash
        deletedCount++;
        console.log(`Deleted unused file: ${file.getName()} (ID: ${id})`);
      }
    }

    // 4. Report the result to the user.
    if (deletedCount > 0) {
      ui.alert(`${deletedCount}個の未使用画像を削除しました。`);
    } else {
      ui.alert('削除対象の未使用画像はありませんでした。');
    }
  } catch (e) {
    console.error(`Error deleting unused images: ${e.toString()}`);
    SpreadsheetApp.getUi().alert(`エラーが発生しました: ${e.message}`);
  }
}
