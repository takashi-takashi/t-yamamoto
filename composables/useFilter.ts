export const useMyFilter = () => {
  const toFixed = (value: any, decimal = 1) => {
    return Number(value.toFixed(decimal))
  }
  return { toFixed }
}
