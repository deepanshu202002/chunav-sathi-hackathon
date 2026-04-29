import { render, screen, fireEvent } from '@testing-library/react'
import TopicCards from '@/components/TopicCards'

describe('TopicCards', () => {
  const mockOnSelectTopic = jest.fn()

  beforeEach(() => {
    mockOnSelectTopic.mockClear()
  })

  it('renders topic cards section', () => {
    render(<TopicCards topics={[]} onSelectTopic={mockOnSelectTopic} />)
    expect(screen.getByRole('region') || document.querySelector('section')).toBeTruthy()
  })

  it('renders at least one topic card if provided', () => {
    const topics = [{ id: 1, title: 'Test Topic', query: 'test' }]
    render(<TopicCards topics={topics} onSelectTopic={mockOnSelectTopic} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('calls onSelectTopic when a card is clicked', () => {
    const topics = [{ id: 1, title: 'Test Topic', query: 'test' }]
    render(<TopicCards topics={topics} onSelectTopic={mockOnSelectTopic} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(mockOnSelectTopic).toHaveBeenCalledTimes(1)
  })
})
