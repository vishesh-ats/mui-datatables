import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import getTextLabels from '../src/textLabels';
import TableFooter from '../src/components/TableFooter';

describe('<TableFooter />', () => {
  let options;
  const changeRowsPerPage = vi.fn();
  const changePage = vi.fn();

  beforeAll(() => {
    options = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
    };
  });

  it('should render a table footer', () => {
    render(
      <TableFooter
        options={options}
        rowCount={100}
        page={1}
        rowsPerPage={10}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />,
    );

    // Check that pagination controls exist
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render a table footer with customFooter', () => {
    const customOptions = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
      customFooter: (rowCount, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
        return <div data-testid="custom-footer">Custom Footer</div>;
      },
    };

    render(
      <TableFooter
        options={customOptions}
        rowCount={100}
        page={1}
        rowsPerPage={10}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />,
    );

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('should not render a table footer when pagination is false', () => {
    const nonPageOption = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
      pagination: false,
    };

    const { container } = render(
      <TableFooter
        options={nonPageOption}
        rowCount={100}
        page={1}
        rowsPerPage={10}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />,
    );

    // When pagination is false, footer should be empty or minimal
    expect(container.querySelector('tfoot')).toBeNull();
  });

  it('should render a JumpToPage component', () => {
    const jumpOptions = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
      jumpToPage: true,
    };

    render(
      <TableFooter
        options={jumpOptions}
        rowCount={100}
        page={1}
        rowsPerPage={10}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />,
    );

    // JumpToPage component should be present
    expect(screen.getByText(/jump to page/i)).toBeInTheDocument();
  });
});
