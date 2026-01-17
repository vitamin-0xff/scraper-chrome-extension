import { useCallback } from 'react'
import type { PickedElement } from './types'
import { resolveIdentifier, getIdentifierType } from '../../utils/utils'

export function useElementPicker(
  onElementPicked: (element: PickedElement, nativeElement: HTMLElement) => void,
  onPickingStateChange: (isPicking: boolean) => void
) {
  const startPicker = useCallback(() => {
    onPickingStateChange(true)
    console.log('Content Script: Element picker activated')

    const style = document.createElement('style')
    style.id = 'extractor-picker-styles'
    style.textContent = `
      [data-extractor-highlight] {
        outline: 3px solid #ff0000 !important;
        background-color: rgba(255, 0, 0, 0.1) !important;
      }
      * {
        cursor: crosshair !important;
      }
      #extractor-tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        pointer-events: none;
        z-index: 999999;
        white-space: nowrap;
      }
    `
    document.head.appendChild(style)

    const tooltip = document.createElement('div')
    tooltip.id = 'extractor-tooltip'
    tooltip.style.display = 'none'
    document.body.appendChild(tooltip)

    let hoveredElement: Element | null = null

    const stopPicker = () => {
      onPickingStateChange(false)
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleEscape, true)

      document.querySelectorAll('[data-extractor-highlight]').forEach(el => {
        el.removeAttribute('data-extractor-highlight')
      })

      const styleEl = document.getElementById('extractor-picker-styles')
      if (styleEl) styleEl.remove()

      const tooltipEl = document.getElementById('extractor-tooltip')
      if (tooltipEl) tooltipEl.remove()

      document.body.style.cursor = 'auto'
      console.log('Content Script: Element picker deactivated')
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (hoveredElement && hoveredElement !== target) {
        hoveredElement.removeAttribute('data-extractor-highlight')
      }

      if (target && target !== document.body && target !== document.documentElement) {
        target.setAttribute('data-extractor-highlight', 'true')
        hoveredElement = target

        const elementData: PickedElement = {
          tagName: target.tagName,
          id: target.id || null,
          className: target.className || null,
          outerHTML: '',
          textContent: '',
          href: (target as HTMLAnchorElement).href || target.getAttribute('href'),
        }
        const identifier = resolveIdentifier(elementData)
        const identifierType = getIdentifierType(elementData)

        tooltip.textContent = `${identifier} (${identifierType})`
        tooltip.style.display = 'block'
        tooltip.style.left = `${e.clientX + 15}px`
        tooltip.style.top = `${e.clientY + 15}px`
      } else {
        tooltip.style.display = 'none'
      }
    }

    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      tooltip.style.display = 'none'

      const target = e.target as HTMLElement
      if (!target) return
      console.log('Content Script: Element clicked:', target);
      const elementData: PickedElement = {
        tagName: target.tagName,
        id: target.id || null,
        className: target.className || null,
        outerHTML: target.outerHTML?.substring(0, 500) || '',
        textContent: target.textContent?.substring(0, 200) || '',
        href: (target as HTMLAnchorElement).href || target.getAttribute('href'),
      }

      console.log('Content Script: Selected element:', elementData)
      onElementPicked(elementData, target)
      stopPicker()
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopPicker()
      }
    }

    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleEscape, true)
  }, [onElementPicked, onPickingStateChange])

  return { startPicker }
}
