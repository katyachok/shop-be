export const errorHandler = (statusCode: number) => {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Headers': "*",
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': "*",
      'Content-Type': 'application/json'
    },
    isBase64Encoded: false,
    body: JSON.stringify({ error: `${statusCode} status code` })
  }
}
