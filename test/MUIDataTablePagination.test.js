import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import getTextLabels from '../src/textLabels';
import TablePagination from '../src/components/TablePagination';

// Wrapper component to provide valid HTML structure for table footer
const TableWrapper = ({ children }) => <table>{children}</table>;

describe('<TablePagination />', () => {
  let options;

  beforeAll(() => {
    options = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
    };
  });

  it('should render a table footer with pagination', () => {
    render(
      <TableWrapper>
        <TablePagination options={options} count={100} page={1} rowsPerPage={10} />
      </TableWrapper>,
    );
    // Check for pagination controls
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should trigger changePage prop callback when page is changed', () => {
    const changePage = vi.fn();
    render(
      <TableWrapper>
        <TablePagination options={options} count={100} page={1} rowsPerPage={10} changePage={changePage} />
      </TableWrapper>,
    );

    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    expect(changePage).toHaveBeenCalledTimes(1);
  });

  it('should correctly change page to be in bounds if out of bounds page was set', () => {
    render(
      <TableWrapper>
        <TablePagination options={options} count={5} page={1} rowsPerPage={10} />
      </TableWrapper>,
    );
    // With count=5 and rowsPerPage=10, page should be clamped to 0
    // The component should display "1-5 of 5" or similar - use regex for different dash types
    expect(screen.getByText(/1.5 of 5/i)).toBeInTheDocument();
  });
});
