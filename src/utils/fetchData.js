const baseUrl = 'https://freecurrencyapi.net/api/v2/'
const apiKey = '33710520-508a-11ec-af2a-3d5c524d16de'

function _addBaseCurrencyToList(currencyList, baseCurrency) {
  return { ...currencyList, [baseCurrency]: 1 }
}

export async function getLatestData(baseCurrency) {
  try {
    const url = `${baseUrl}latest?apikey=${apiKey}&base_currency=${baseCurrency}`
    const response = await fetch(url)
    let { data } = await response.json()
    data = _addBaseCurrencyToList(data, baseCurrency)
    return data
  } catch (err) {
    console.warn(err)
  }
}

export async function getHistoryData(baseCurrency, dateFrom, dateTo) {
  try {
    const url = `${baseUrl}historical?apikey=${apiKey}&base_currency=${baseCurrency}&date_from=${dateFrom}&date_to=${dateTo}`
    const response = await fetch(url)
    let { data } = await response.json()
    Object.keys(data).forEach(date => {
      data[date] = { ...data[date], [baseCurrency]: 1 }
      data[date] = _addBaseCurrencyToList(data[date], baseCurrency)
    })
    return data
  } catch (err) {
    console.warn(err)
  }
}
