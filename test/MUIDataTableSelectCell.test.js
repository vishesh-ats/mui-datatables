import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TableSelectCell from '../src/components/TableSelectCell';

describe('<TableSelectCell />', () => {
  it('should render table select cell', () => {
    render(<TableSelectCell checked={false} selectableOn={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should render table select cell checked', () => {
    render(<TableSelectCell checked={true} selectableOn={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should render table select cell unchecked', () => {
    render(<TableSelectCell checked={false} selectableOn={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});
