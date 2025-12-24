import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import TableResize from '../src/components/TableResize';
import MUIDataTable from '../src/MUIDataTable';

describe('<TableResize />', () => {
  let options;

  beforeAll(() => {
    options = {
      resizableColumns: true,
      tableBodyHeight: '500px',
    };
  });

  it('should render a table resize component', () => {
    const updateDividers = vi.fn();
    const setResizeable = vi.fn();

    const { container } = render(
      <TableResize options={options} updateDividers={updateDividers} setResizeable={setResizeable} />,
    );

    // Component should be rendered
    expect(container.firstChild).toBeInTheDocument();
    expect(updateDividers).toHaveBeenCalledTimes(1);
    expect(setResizeable).toHaveBeenCalledTimes(1);
  });

  it('should create column dividers for resizable columns', () => {
    const columns = ['Name', 'Age', 'Location', 'Phone'];
    const data = [['Joe', 26, 'Chile', '555-5555']];

    const { container } = render(<MUIDataTable columns={columns} data={data} options={options} />);

    // The table should render with resize dividers
    const dividers = container.querySelectorAll('[data-divider-index]');
    expect(dividers.length).toBeGreaterThan(0);
  });
});
