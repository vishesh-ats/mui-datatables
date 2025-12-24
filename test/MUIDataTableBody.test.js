import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import MUIDataTable from '../src/MUIDataTable';

describe('<TableBody />', () => {
  let data;
  let columns;

  beforeAll(() => {
    columns = [{ name: 'Name' }, { name: 'Company' }, { name: 'City', label: 'City Label' }, { name: 'State' }];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
  });

  it('should render table body with data rows', () => {
    render(<MUIDataTable columns={columns} data={data} />);

    expect(screen.getByText('Joe James')).toBeInTheDocument();
    expect(screen.getByText('John Walsh')).toBeInTheDocument();
    expect(screen.getByText('Bob Herm')).toBeInTheDocument();
    expect(screen.getByText('James Houston')).toBeInTheDocument();
  });

  it('should render "No records" when data is empty', () => {
    render(<MUIDataTable columns={columns} data={[]} />);

    expect(screen.getByText('Sorry, no matching records found')).toBeInTheDocument();
  });

  it('should render custom "No records" message when provided', () => {
    const options = {
      textLabels: {
        body: {
          noMatch: 'Custom no match message',
          toolTip: 'Sort',
        },
      },
    };
    render(<MUIDataTable columns={columns} data={[]} options={options} />);

    expect(screen.getByText('Custom no match message')).toBeInTheDocument();
  });

  it('should handle row selection when selectableRows is enabled', () => {
    const onRowSelectionChange = vi.fn();
    const options = {
      selectableRows: 'multiple',
      onRowSelectionChange,
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox is the header checkbox, skip it
    fireEvent.click(checkboxes[1]);

    expect(onRowSelectionChange).toHaveBeenCalled();
  });

  it('should render expanded rows when expandableRows is enabled', () => {
    const renderExpandableRow = (rowData) => (
      <tr>
        <td colSpan={4}>
          <div data-testid="expanded-content">Expanded: {rowData[0]}</div>
        </td>
      </tr>
    );

    const options = {
      expandableRows: true,
      renderExpandableRow,
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    // Expand buttons should be present
    const expandButtons = screen.getAllByTestId('KeyboardArrowRightIcon');
    expect(expandButtons.length).toBeGreaterThan(0);
  });

  it('should call onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn();
    const options = { onRowClick };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    // Click on a cell in the first row
    const firstCell = screen.getByTestId('MuiDataTableBodyCell-0-0');
    fireEvent.click(firstCell);

    expect(onRowClick).toHaveBeenCalled();
  });

  it('should render custom body cell when customBodyRender is provided', () => {
    const customColumns = [
      {
        name: 'Name',
        options: {
          customBodyRender: (value) => <span data-testid="custom-cell">{value.toUpperCase()}</span>,
        },
      },
      { name: 'Company' },
      { name: 'City' },
      { name: 'State' },
    ];

    render(<MUIDataTable columns={customColumns} data={data} />);

    const customCells = screen.getAllByTestId('custom-cell');
    expect(customCells.length).toBe(4);
    expect(customCells[0]).toHaveTextContent('JOE JAMES');
  });

  it('should hide column when display is set to false', () => {
    const customColumns = [
      { name: 'Name', options: { display: false } },
      { name: 'Company' },
      { name: 'City' },
      { name: 'State' },
    ];

    render(<MUIDataTable columns={customColumns} data={data} />);

    // Name column should be hidden
    expect(screen.queryByText('Joe James')).toBeNull();
    // Other columns should be visible
    expect(screen.getAllByText('Test Corp').length).toBeGreaterThan(0);
  });
});
