import { describe, it, expect, beforeEach } from 'vitest'
import { findTextPaths } from '../src/utils/path-builder'

describe('findTextPaths', () => {
  beforeEach(() => {
    // Reset the DOM before each test
    document.body.innerHTML = ''
  })

  it('finds a single text node', () => {
    document.body.innerHTML = `
      <div>
        <span>Hello</span>
        <span>World</span>
      </div>
    `

    const root = document.querySelector('div')!
    const paths = findTextPaths(root, 'Hello')

    expect(paths).toEqual([
      'div:nth-of-type(1) > span:nth-of-type(1)'
    ])
  })

  it('finds multiple occurrences', () => {
    document.body.innerHTML = `
      <div>
        <span>Hello</span>
        <div>
          <span>Hello</span>
        </div>
      </div>
    `

    const root = document.querySelector('div')!
    const paths = findTextPaths(root, 'Hello')

    expect(paths).toEqual([
      'div:nth-of-type(1) > span:nth-of-type(1)',
      'div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)'
    ])
  })

  it('skips script and style elements', () => {
    document.body.innerHTML = `
      <div>
        <span>Visible</span>
        <script>Hello</script>
        <style>Hello</style>
      </div>
    `

    const root = document.querySelector('div')!
    const paths = findTextPaths(root, 'Hello')

    // Should not include script/style
    expect(paths).toEqual([])
  })

  it('matches exact normalized text', () => {
    document.body.innerHTML = `
      <div>
        <span>
          Hello
        </span>
      </div>
    `

    const root = document.querySelector('div')!
    const paths = findTextPaths(root, 'HellO ') // whitespace normalized

    expect(paths).toEqual([
      'div:nth-of-type(1) > span:nth-of-type(1)'
    ])
  })

  it('returns empty array if text not found', () => {
    document.body.innerHTML = `
      <div>
        <span>Hi</span>
      </div>
    `

    const root = document.querySelector('div')!
    const paths = findTextPaths(root, 'Hello')

    expect(paths).toEqual([])
  })
})
