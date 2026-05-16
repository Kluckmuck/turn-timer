import { formatTime } from '../../src/utils/time'

describe('formatTime', () => {
  it('formats zero milliseconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formats seconds correctly', () => {
    expect(formatTime(5000)).toBe('00:05')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(65000)).toBe('01:05')
  })

  it('formats hours when over 60 minutes', () => {
    expect(formatTime(3661000)).toBe('1:01:01')
  })

  it('pads single digit minutes and seconds', () => {
    expect(formatTime(61000)).toBe('01:01')
  })
})
