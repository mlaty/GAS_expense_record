/**
 * 支出記帳工具 - Google Apps Script 後端
 */

/**
 * 取得或建立支出記錄 Google Sheets
 */
function getOrCreateExpenseSheet() {
  // 從 PropertiesService 取得已儲存的 Spreadsheet ID
  const properties = PropertiesService.getScriptProperties();
  let savedSpreadsheetId = properties.getProperty('EXPENSE_SPREADSHEET_ID');
  
  let spreadsheet;
  
  if (savedSpreadsheetId) {
    try {
      // 嘗試開啟已存在的 Google Sheets
      spreadsheet = SpreadsheetApp.openById(savedSpreadsheetId);
      console.log('使用現有的 Google Sheets，ID:', savedSpreadsheetId);
    } catch (e) {
      console.error('無法開啟已儲存的 Google Sheets:', e);
      // 如果無法開啟，建立新的
      spreadsheet = createNewSpreadsheet();
    }
  } else {
    // 第一次執行，建立新的 Google Sheets
    spreadsheet = createNewSpreadsheet();
  }
  
  return getOrCreateSheet(spreadsheet);
}

/**
 * 建立新的 Google Sheets 並儲存 ID
 */
function createNewSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create('支出記錄');
  const spreadsheetId = spreadsheet.getId();
  
  // 儲存 Spreadsheet ID 到 PropertiesService
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('EXPENSE_SPREADSHEET_ID', spreadsheetId);
  
  console.log('已建立新的 Google Sheets，ID:', spreadsheetId);
  console.log('Google Sheets 網址:', 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit');
  
  return spreadsheet;
}

/**
 * 取得或建立工作表
 */
function getOrCreateSheet(spreadsheet) {
  let sheet = spreadsheet.getActiveSheet();
  
  // 檢查是否已有標題列
  if (sheet.getLastRow() === 0) {
    const headers = ['日期', '使用者', '分類', '金額', '備註', '建立時間'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // 設定標題列格式
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // 自動調整欄寬
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}

/**
 * 新增支出記錄
 */
function addExpense(expenseData) {
  try {
    console.log('開始處理支出記錄:', JSON.stringify(expenseData));
    
    const sheet = getOrCreateExpenseSheet();
    console.log('Google Sheets 取得成功');
    
    // 驗證資料
    if (!expenseData) {
      throw new Error('沒有收到資料');
    }
    
    if (!expenseData.user || !expenseData.category || !expenseData.amount || !expenseData.date) {
      console.error('資料驗證失敗:', expenseData);
      throw new Error('缺少必要的資料欄位');
    }
    
    if (expenseData.amount <= 0) {
      throw new Error('金額必須大於 0');
    }
    
    // 準備要寫入的資料（在後端生成時間戳記）
    const now = new Date();
    const rowData = [
      expenseData.date,
      expenseData.user,
      expenseData.category,
      expenseData.amount,
      expenseData.note || '',
      now
    ];
    
    console.log('準備寫入資料:', rowData);
    
    // 寫入新的一列
    sheet.appendRow(rowData);
    console.log('資料已寫入 Google Sheets');
    
    // 格式化最後一列
    const lastRow = sheet.getLastRow();
    console.log('最後一列位置:', lastRow);
    
    // 設定日期格式
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd');
    
    // 設定金額格式
    sheet.getRange(lastRow, 4).setNumberFormat('#,##0');
    
    // 設定建立時間格式
    sheet.getRange(lastRow, 6).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    
    console.log('支出記錄已成功新增:', expenseData);
    console.log('Google Sheets 網址:', 'https://docs.google.com/spreadsheets/d/' + sheet.getParent().getId() + '/edit');
    
    return {
      success: true,
      message: '支出記錄已成功新增',
      rowNumber: lastRow,
      sheetUrl: 'https://docs.google.com/spreadsheets/d/' + sheet.getParent().getId() + '/edit'
    };
    
  } catch (error) {
    console.error('新增支出記錄時發生錯誤:', error);
    console.error('錯誤堆疊:', error.stack);
    throw new Error('新增支出記錄失敗: ' + error.message);
  }
}

/**
 * 取得支出記錄統計
 */
function getExpenseStatistics() {
  try {
    const sheet = getOrCreateExpenseSheet();
    
    if (sheet.getLastRow() <= 1) {
      return {
        totalRecords: 0,
        totalAmount: 0,
        categoryStats: {},
        userStats: {}
      };
    }
    
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    
    let totalAmount = 0;
    const categoryStats = {};
    const userStats = {};
    
    data.forEach(row => {
      const [date, user, category, amount, note, timestamp] = row;
      
      totalAmount += amount;
      
      // 分類統計
      if (categoryStats[category]) {
        categoryStats[category] += amount;
      } else {
        categoryStats[category] = amount;
      }
      
      // 使用者統計
      if (userStats[user]) {
        userStats[user] += amount;
      } else {
        userStats[user] = amount;
      }
    });
    
    return {
      totalRecords: data.length,
      totalAmount: totalAmount,
      categoryStats: categoryStats,
      userStats: userStats
    };
    
  } catch (error) {
    console.error('取得統計資料時發生錯誤:', error);
    throw new Error('取得統計資料失敗: ' + error.message);
  }
}

/**
 * Web App 主要函式
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('支出記帳工具');
}

/**
 * 簡單測試函式
 */
function simpleTest() {
  console.log('測試函式執行成功');
  return '測試成功！';
}

/**
 * 包含其他 HTML 檔案的函式
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * 測試函式 - 用於開發階段測試
 */
function testAddExpense() {
  const testData = {
    user: '測試使用者',
    date: '2024-12-14',
    category: '食(三餐)',
    amount: 150,
    note: '午餐',
    timestamp: new Date()
  };
  
  const result = addExpense(testData);
  console.log('測試結果:', result);
  
  const stats = getExpenseStatistics();
  console.log('統計資料:', stats);
}