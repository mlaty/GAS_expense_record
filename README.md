# 支出記帳工具 (GAS Expense Tracker)

這是一個使用 Google Apps Script (GAS) 開發的支出記帳工具，資料會自動儲存到 Google Sheets。

## 功能特色

- ✅ 支出分類選單（15個分類，包含圖示）
- ✅ 使用者資料持久化（記住使用者名稱）
- ✅ 日期預設為當天，可手動選擇
- ✅ 金額輸入驗證
- ✅ 備註欄位
- ✅ 清除資料功能
- ✅ 資料自動儲存到 Google Sheets
- ✅ 響應式設計，支援手機和桌面版

## 部署步驟

### 1. 安裝 CLASP

```bash
npm install -g @google/clasp
```

### 2. 登入 Google 帳號

```bash
clasp login
```

### 3. 建立新的 GAS 專案

```bash
cd GAS_expense_record
clasp create --title "支出記帳工具" --type webapp
```

這會產生一個 `scriptId` 並更新 `.clasp.json` 檔案。

### 4. 推送程式碼到 GAS

```bash
clasp push
```

### 5. 部署 Web App

```bash
clasp deploy --description "支出記帳工具 v1.0"
```

### 6. 開啟 GAS 編輯器

```bash
clasp open
```

### 7. 設定 Google Sheets（選擇性）

在 GAS 編輯器中：

1. 開啟 `Code.gs`
2. 如果你想使用現有的 Google Sheets，請在第 6 行設定 `SPREADSHEET_ID`
3. 如果留空，系統會自動建立新的 Google Sheets

### 8. 測試部署

1. 在 GAS 編輯器中點擊「部署」→「管理部署作業」
2. 複製 Web App URL
3. 在瀏覽器中開啟 URL 測試功能

## 檔案結構

```
GAS_expense_record/
├── .clasp.json              # CLASP 設定檔
├── appsscript.json          # GAS 專案設定檔
├── src/
│   ├── index.html           # 前端介面
│   └── Code.gs              # 後端邏輯
└── README.md                # 說明文件
```

## 支出分類

1. 🍽️ 食(三餐)
2. 👕 衣服
3. 💡 水電瓦斯
4. 🚌 交通
5. 🧴 日常用品(雜貨)
6. 🏥 醫療
7. 📱 電信費
8. 🛡️ 保險
9. 🍻 交際費
10. ✈️ 旅遊
11. 💰 貸款
12. 🎮 娛樂
13. 📝 其他

## Google Sheets 欄位

| 欄位 | 說明 |
|------|------|
| 日期 | 支出日期 |
| 使用者 | 記帳人員 |
| 分類 | 支出分類 |
| 金額 | 支出金額 |
| 備註 | 額外說明 |
| 建立時間 | 資料建立時間戳記 |

## 開發說明

### 本地開發

1. 修改 `src/` 目錄下的檔案
2. 執行 `clasp push` 推送更新
3. 在瀏覽器中重新整理 Web App 測試

### 版本更新

```bash
clasp deploy --description "版本說明"
```

### 查看部署狀態

```bash
clasp deployments
```

## 注意事項

- 首次部署需要授權 Google Apps Script 存取權限
- Web App 預設為「任何人都可以存取」，可在部署設定中調整
- Google Sheets 會自動建立，或可指定現有的 Sheets ID
- 使用者名稱會儲存在瀏覽器的 localStorage 中

## 疑難排解

### 常見問題

1. **CLASP 授權失敗**
   - 執行 `clasp logout` 然後重新 `clasp login`

2. **推送失敗**
   - 檢查 `.clasp.json` 中的 `scriptId` 是否正確
   - 確認檔案路徑設定正確

3. **Web App 無法存取**
   - 檢查部署權限設定
   - 確認 Google Apps Script API 已啟用

4. **資料無法儲存到 Google Sheets**
   - 檢查 Google Sheets 存取權限
   - 確認 `SPREADSHEET_ID` 設定正確（或留空讓系統自動建立）

## 授權條款

MIT License# GAS_expense_record
