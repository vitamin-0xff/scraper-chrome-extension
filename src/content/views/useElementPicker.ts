import { useCallback } from 'react'
import type { PickedElement } from './types'
import { resolveIdentifier, getIdentifierType } from '../../utils/utils'
import { generateSelector } from './algorithms/rootElementAlgorithms'

export function useElementPicker(
  onElementPicked: (element: PickedElement) => void,
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
        transition: outline 120ms ease, background-color 120ms ease;
      }
      [data-extractor-selected] {
        transform: scale(1.04);
        transform-origin: center center;
        transition: transform 120ms ease;
        position: relative;
        z-index: 999998 !important;
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
      document.querySelectorAll('[data-extractor-selected]').forEach(el => {
        el.removeAttribute('data-extractor-selected')
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

        // Temporary object for tooltip - using type assertion to avoid creating full PickedElement
        const elementInfo = {
          tagName: target.tagName,
          className: target.className || null,
          outerHTML: '',
          textContent: '',
          href: (target as HTMLAnchorElement).href || target.getAttribute('href'),
        }
        const identifier = resolveIdentifier(elementInfo as PickedElement)
        const identifierType = getIdentifierType(elementInfo as PickedElement)

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
      target.setAttribute('data-extractor-selected', 'true')
      
      // Generate selector for the element
      const selector = generateSelector(target);
      
      // Calculate index: find all elements matching this selector and get position
      const allMatchingElements = document.querySelectorAll(selector);
      const index = Array.from(allMatchingElements).indexOf(target);
      
      const elementData: PickedElement = {
        tagName: target.tagName,
        className: target.className || null,
        outerHTML: target.outerHTML?.substring(0, 500) || '',
        textContent: target.textContent?.substring(0, 200) || '',
        href: (target as HTMLAnchorElement).href || target.getAttribute('href'),
        selector: selector,
        index: index
      }

      console.log('Content Script: Selected element:', elementData)
      onElementPicked(elementData)
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
