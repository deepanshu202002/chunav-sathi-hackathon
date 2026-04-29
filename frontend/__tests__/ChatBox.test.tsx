import { render, screen, fireEvent } from '@testing-library/react'
import ChatBox from '@/components/ChatBox'

// Mock the streamChat function to avoid actual API calls
jest.mock('@/lib/api', () => ({
  streamChat: jest.fn(),
}))

describe('ChatBox', () => {
  it('renders chat input', () => {
    render(<ChatBox />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<ChatBox />)
    const button = screen.getByRole('button', { name: /send/i })
    expect(button).toBeInTheDocument()
  })

  it('typing in input updates value', () => {
    render(<ChatBox />)
    const input = screen.getByRole('textbox') as HTMLTextAreaElement
    fireEvent.change(input, { target: { value: 'test message' } })
    expect(input.value).toBe('test message')
  })
})
