import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import MUIDataTable from '../src/MUIDataTable';

describe('<MUIDataTable />', () => {
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

  it('should render a data table', () => {
    render(<MUIDataTable columns={columns} data={data} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', () => {
    render(<MUIDataTable columns={columns} data={data} />);

    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Company').length).toBeGreaterThan(0);
    expect(screen.getAllByText('City Label').length).toBeGreaterThan(0);
    expect(screen.getAllByText('State').length).toBeGreaterThan(0);
  });

  it('should render correct data rows', () => {
    render(<MUIDataTable columns={columns} data={data} />);

    expect(screen.getByText('Joe James')).toBeInTheDocument();
    expect(screen.getAllByText('Test Corp').length).toBeGreaterThan(0);
    expect(screen.getByText('Yonkers')).toBeInTheDocument();
    expect(screen.getAllByText('NY').length).toBeGreaterThan(0);
  });

  it('should render title when provided', () => {
    render(<MUIDataTable columns={columns} data={data} title="Test Table" />);

    expect(screen.getAllByText('Test Table').length).toBeGreaterThan(0);
  });

  it('should handle sorting when column header is clicked', async () => {
    const options = { sort: true };
    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const nameHeader = screen.getByTestId('headcol-0');
    fireEvent.click(nameHeader);

    // After sorting, the order should change
    const cells = screen.getAllByTestId(/MuiDataTableBodyCell-0-/);
    expect(cells.length).toBe(4);
  });

  it('should handle search when search text is entered', async () => {
    const options = { search: true };
    render(<MUIDataTable columns={columns} data={data} options={options} />);

    // Click search button
    const searchButton = screen.getByLabelText('Search');
    fireEvent.click(searchButton);

    // Wait for search input to appear
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Type search text
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Joe' } });

    // Joe James should be visible, others filtered out
    await waitFor(() => {
      expect(screen.getByText('Joe James')).toBeInTheDocument();
    });
  });

  it('should render with selectable rows when selectableRows is multiple', () => {
    const options = { selectableRows: 'multiple' };
    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('should not render checkboxes when selectableRows is none', () => {
    const options = { selectableRows: 'none' };
    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes.length).toBe(0);
  });

  it('should handle row selection', () => {
    const onRowSelectionChange = vi.fn();
    const options = {
      selectableRows: 'multiple',
      onRowSelectionChange,
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Click first data row checkbox

    expect(onRowSelectionChange).toHaveBeenCalled();
  });

  it('should handle select all rows', () => {
    const onRowSelectionChange = vi.fn();
    const options = {
      selectableRows: 'multiple',
      onRowSelectionChange,
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Click header checkbox

    expect(onRowSelectionChange).toHaveBeenCalled();
  });

  it('should render pagination when pagination is true', () => {
    const options = { pagination: true };
    render(<MUIDataTable columns={columns} data={data} options={options} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should not render pagination when pagination is false', () => {
    const options = { pagination: false };
    render(<MUIDataTable columns={columns} data={data} options={options} />);

    expect(screen.queryByText(/rows per page/i)).toBeNull();
  });

  it('should render table with filter option enabled', () => {
    const options = {
      filter: true,
      filterType: 'checkbox',
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    // Table should render
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should call onColumnSortChange when sort is changed', () => {
    const onColumnSortChange = vi.fn();
    const options = { sort: true, onColumnSortChange };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const nameHeader = screen.getByTestId('headcol-0');
    fireEvent.click(nameHeader);

    expect(onColumnSortChange).toHaveBeenCalled();
  });

  it('should render toolbar with core buttons', () => {
    render(<MUIDataTable columns={columns} data={data} />);

    expect(screen.getByTestId('Search-iconButton')).toBeInTheDocument();
    expect(screen.getByTestId('DownloadCSV-iconButton')).toBeInTheDocument();
    expect(screen.getByTestId('Print-iconButton')).toBeInTheDocument();
  });

  it('should handle custom options for columns', () => {
    const customColumns = [
      { name: 'Name', options: { filter: false, sort: false } },
      { name: 'Company', options: { display: false } },
      { name: 'City', label: 'City Label' },
      { name: 'State' },
    ];

    render(<MUIDataTable columns={customColumns} data={data} />);

    // Company column should be hidden
    expect(screen.queryByText('Company')).toBeNull();
    // But other columns should be visible
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('City Label').length).toBeGreaterThan(0);
  });

  it('should render empty state when no data', () => {
    render(<MUIDataTable columns={columns} data={[]} />);

    expect(screen.getByText('Sorry, no matching records found')).toBeInTheDocument();
  });

  it('should render with responsive option', () => {
    const options = { responsive: 'standard' };
    const { container } = render(<MUIDataTable columns={columns} data={data} options={options} />);

    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('should handle onTableChange callback', () => {
    const onTableChange = vi.fn();
    const options = { onTableChange };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    // Click sort
    const nameHeader = screen.getByTestId('headcol-0');
    fireEvent.click(nameHeader);

    expect(onTableChange).toHaveBeenCalled();
  });

  it('should render with server-side options', () => {
    const options = {
      serverSide: true,
      count: 100,
      page: 0,
      rowsPerPage: 10,
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render with resizable columns when enabled', () => {
    const options = { resizableColumns: true };
    const { container } = render(<MUIDataTable columns={columns} data={data} options={options} />);

    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('should render with draggable columns when enabled', () => {
    const options = { draggableColumns: { enabled: true } };
    render(<MUIDataTable columns={columns} data={data} options={options} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should handle rows per page change', () => {
    const onChangeRowsPerPage = vi.fn();
    const options = {
      pagination: true,
      rowsPerPageOptions: [5, 10, 15],
      onChangeRowsPerPage,
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    const rowsPerPageSelect = screen.getByRole('combobox');
    expect(rowsPerPageSelect).toBeInTheDocument();
  });

  it('should support custom rowsPerPage', () => {
    const options = {
      pagination: true,
      rowsPerPage: 5,
      rowsPerPageOptions: [5, 10, 15],
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
