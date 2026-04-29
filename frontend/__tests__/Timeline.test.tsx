import { render, screen, fireEvent } from '@testing-library/react'
import Timeline from '@/components/Timeline'

describe('Timeline', () => {
  const mockOnSelectStep = jest.fn()
  const steps = [
    { id: 1, label: 'Step 1', description: 'Desc 1', query: 'q1' },
    { id: 2, label: 'Step 2', description: 'Desc 2', query: 'q2' },
  ]

  beforeEach(() => {
    mockOnSelectStep.mockClear()
  })

  it('renders timeline component', () => {
    render(<Timeline steps={steps} onSelectStep={mockOnSelectStep} />)
    expect(document.querySelector('nav') || document.querySelector('ol')).toBeTruthy()
  })

  it('renders provided steps', () => {
    render(<Timeline steps={steps} onSelectStep={mockOnSelectStep} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('clicking a step calls onSelectStep', () => {
    render(<Timeline steps={steps} onSelectStep={mockOnSelectStep} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(mockOnSelectStep).toHaveBeenCalledTimes(1)
  })
})
