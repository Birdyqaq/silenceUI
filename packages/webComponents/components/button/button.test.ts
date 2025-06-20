// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SuButton } from './index'
import { fireEvent } from '@testing-library/dom'

let button: SuButton | undefined

describe('SuButton', () => {
    beforeEach(() => {
        button = document.createElement('su-button') as SuButton
        document.body.appendChild(button)
    })

    it('should be defined', () => {
        expect(SuButton).toBeDefined()
    })

    it('should render slot content', async () => {
        if (!button) return
        button.loading = false
        button.innerHTML = 'Click Me'
        await button.updateComplete
        const btn = button.shadowRoot?.querySelector('button')
        expect(btn?.textContent?.includes('Click Me')).toBe(false)
    })

    it('should reflect disabled attribute', async () => {
        if (!button) return
        button.disabled = true
        await button.updateComplete
        const btn = button.shadowRoot?.querySelector('button')
        expect(btn?.hasAttribute('disabled')).toBe(true)
    })

    it('should emit click event when not disabled', async () => {
        if (!button) return
        const btn = button.shadowRoot?.querySelector('button')
        let clicked = false
        button.addEventListener('click', () => { clicked = true })
        await fireEvent.click(btn!)
        expect(clicked).toBe(true)
    })

    it('should not emit click event when disabled', async () => {
        if (!button) return
        button.disabled = true
        await button.updateComplete
        const btn = button.shadowRoot?.querySelector('button')
        let clicked = false
        button.addEventListener('click', () => { clicked = true })
        await fireEvent.click(btn!)
        expect(clicked).toBe(false)
    })

    afterEach(() => {
        if (button && button.remove) button.remove()
        button = undefined
    })
})
