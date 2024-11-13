interface Utils {
  isNullOrUndefined(value: any): boolean
  isBlank(value: any): boolean
}

const utils: Utils = {
  isNullOrUndefined(value: any) {
    return typeof value === 'undefined' || value === null
  },
  isBlank(value: any) {
    return this.isNullOrUndefined(value) || value === ''
  },
}

export { utils }
