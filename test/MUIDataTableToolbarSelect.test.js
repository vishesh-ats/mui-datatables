import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TableToolbarSelect from '../src/components/TableToolbarSelect';
import getTextLabels from '../src/textLabels';

describe('<TableToolbarSelect />', () => {
  it('should render table toolbar select', () => {
    const onRowsDelete = vi.fn();
    render(
      <TableToolbarSelect
        options={{ textLabels: getTextLabels() }}
        selectedRows={{ data: [1] }}
        onRowsDelete={onRowsDelete}
      />,
    );

    // Delete icon should be present
    expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
  });

  it('should call customToolbarSelect with correct arguments', () => {
    const onRowsDelete = vi.fn();
    const customToolbarSelect = vi.fn();
    const selectedRows = { data: [1] };
    const displayData = [1];

    render(
      <TableToolbarSelect
        options={{ textLabels: getTextLabels(), customToolbarSelect }}
        selectedRows={selectedRows}
        onRowsDelete={onRowsDelete}
        displayData={displayData}
      />,
    );

    expect(customToolbarSelect).toHaveBeenCalled();
    // Check that first two arguments are correct
    expect(customToolbarSelect.mock.calls[0][0]).toEqual(selectedRows);
    expect(customToolbarSelect.mock.calls[0][1]).toEqual(displayData);
    // Third and fourth arguments should be functions
    expect(typeof customToolbarSelect.mock.calls[0][2]).toBe('function');
    expect(typeof customToolbarSelect.mock.calls[0][3]).toBe('function');
  });

  it('should call selectRowUpdate when customToolbarSelect passed and setSelectedRows was called', () => {
    const onRowsDelete = vi.fn();
    const selectRowUpdate = vi.fn();
    const customToolbarSelect = (_, __, setSelectedRows) => {
      setSelectedRows([1]);
    };
    const selectedRows = { data: [1] };
    const displayData = [1];

    render(
      <TableToolbarSelect
        options={{ textLabels: getTextLabels(), customToolbarSelect }}
        selectedRows={selectedRows}
        onRowsDelete={onRowsDelete}
        displayData={displayData}
        selectRowUpdate={selectRowUpdate}
      />,
    );

    expect(selectRowUpdate).toHaveBeenCalledTimes(1);
  });
});
