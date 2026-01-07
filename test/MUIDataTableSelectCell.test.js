import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TableSelectCell from '../src/components/TableSelectCell';

// Wrapper component to provide valid HTML structure for table cells
const TableWrapper = ({ children }) => (
  <table>
    <tbody>
      <tr>{children}</tr>
    </tbody>
  </table>
);

describe('<TableSelectCell />', () => {
  it('should render table select cell', () => {
    render(
      <TableWrapper>
        <TableSelectCell checked={false} selectableOn={true} />
      </TableWrapper>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should render table select cell checked', () => {
    render(
      <TableWrapper>
        <TableSelectCell checked={true} selectableOn={true} />
      </TableWrapper>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should render table select cell unchecked', () => {
    render(
      <TableWrapper>
        <TableSelectCell checked={false} selectableOn={true} />
      </TableWrapper>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});
