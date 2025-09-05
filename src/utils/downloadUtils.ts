// Download utilities for scraping results

export interface ScrapingRecord {
  recordNo: number
  status: 'successful' | 'failed'
  url?: string
  timestamp?: string
  errorMessage?: string
}

export interface ConversationEntry {
  type: 'AI' | 'User'
  message: string
  timestamp: string
}

// Generate mock scraping data
export const generateScrapingData = (): ScrapingRecord[] => {
  const data: ScrapingRecord[] = []
  for (let i = 1; i <= 70; i++) {
    // 69 successful, 1 failed based on the uploaded image
    const isSuccessful = i <= 69
    data.push({
      recordNo: i,
      status: isSuccessful ? 'successful' : 'failed',
      url: `https://example.com/page-${i}`,
      timestamp: new Date(Date.now() - (70 - i) * 60000).toISOString(),
      errorMessage: isSuccessful ? undefined : 'Network timeout error'
    })
  }
  return data
}

// Generate mock conversation data
export const generateConversationData = (): ConversationEntry[] => {
  return [
    {
      type: 'User',
      message: 'I want to scrape product data from this e-commerce website',
      timestamp: new Date(Date.now() - 600000).toISOString()
    },
    {
      type: 'AI',
      message: 'I can help you scrape product data. I\'ll analyze the website structure and create an efficient scraping strategy. What specific data points do you need?',
      timestamp: new Date(Date.now() - 580000).toISOString()
    },
    {
      type: 'User',
      message: 'I need product names, prices, descriptions, and availability status',
      timestamp: new Date(Date.now() - 560000).toISOString()
    },
    {
      type: 'AI',
      message: 'Perfect! I\'ll configure the scraper to extract: product names, prices, descriptions, and availability status. The estimated cost is $4.90 for 70 records.',
      timestamp: new Date(Date.now() - 540000).toISOString()
    },
    {
      type: 'User',
      message: 'That sounds good. Please proceed with the scraping.',
      timestamp: new Date(Date.now() - 520000).toISOString()
    },
    {
      type: 'AI',
      message: 'Scraping initiated successfully! I\'ll process the data with 98.7% accuracy. You can monitor the progress in real-time.',
      timestamp: new Date(Date.now() - 500000).toISOString()
    },
    {
      type: 'AI',
      message: 'Scraping completed successfully! 69 records extracted successfully, 1 failed due to network timeout. Total processing time: 7 minutes 32 seconds.',
      timestamp: new Date(Date.now() - 60000).toISOString()
    }
  ]
}

// Generate CSV content
export const generateCSV = (data: ScrapingRecord[]): string => {
  const headers = 'Record No,Status,URL,Timestamp,Error Message\n'
  const rows = data.map(record => 
    `${record.recordNo},${record.status} extraction,${record.url || ''},${record.timestamp || ''},${record.errorMessage || ''}`
  ).join('\n')
  return headers + rows
}

// Generate JSON content
export const generateJSON = (data: ScrapingRecord[]): string => {
  const jsonData = data.map(record => ({
    recordNo: record.recordNo,
    status: `${record.status} extraction`,
    url: record.url,
    timestamp: record.timestamp,
    errorMessage: record.errorMessage
  }))
  return JSON.stringify(jsonData, null, 2)
}

// Generate Excel content (CSV format for simplicity)
export const generateExcel = (data: ScrapingRecord[]): string => {
  return generateCSV(data)
}

// Generate chat log content
export const generateChatLog = (conversations: ConversationEntry[]): string => {
  return conversations.map(entry => 
    `${entry.type}: "${entry.message}"`
  ).join('\n\n')
}

// Download file utility
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Main download functions
export const downloadCSV = () => {
  const data = generateScrapingData()
  const csvContent = generateCSV(data)
  downloadFile(csvContent, 'scraping-results.csv', 'text/csv')
}

export const downloadJSON = () => {
  const data = generateScrapingData()
  const jsonContent = generateJSON(data)
  downloadFile(jsonContent, 'scraping-results.json', 'application/json')
}

export const downloadExcel = () => {
  const data = generateScrapingData()
  const excelContent = generateExcel(data)
  downloadFile(excelContent, 'scraping-results.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
}

export const downloadChatLog = () => {
  const conversations = generateConversationData()
  const chatContent = generateChatLog(conversations)
  downloadFile(chatContent, 'conversation-history.txt', 'text/plain')
}