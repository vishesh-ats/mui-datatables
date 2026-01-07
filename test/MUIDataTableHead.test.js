import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import TableHead from '../src/components/TableHead';
import TableHeadCell from '../src/components/TableHeadCell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

describe('<TableHead />', () => {
  let columns;
  let handleHeadUpdateRef;

  beforeAll(() => {
    columns = [
      { name: 'First Name', label: 'First Name', display: 'true', sort: true },
      { name: 'Company', label: 'Company', display: 'true', sort: null },
      { name: 'City', label: 'City Label', display: 'true', sort: null },
      {
        name: 'State',
        label: 'State',
        display: 'true',
        options: { fixedHeaderOptions: { xAxis: true, yAxis: true }, selectableRows: 'multiple' },
        customHeadRender: (columnMeta) => <TableHeadCell {...columnMeta}>{columnMeta.name + 's'}</TableHeadCell>,
        sort: null,
      },
    ];

    handleHeadUpdateRef = vi.fn();
  });

  it('should render a table head', () => {
    const options = {};
    const toggleSort = vi.fn();
    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );
    const cells = screen.getAllByRole('columnheader');
    expect(cells.length).toBe(4);
  });

  it('should render the label in the table head cell', () => {
    const options = {};
    const toggleSort = vi.fn();

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('City Label')).toBeInTheDocument();
    expect(screen.getByText('States')).toBeInTheDocument();
  });

  it('should render a table head with no cells when all columns have display: false', () => {
    const options = {};
    const toggleSort = vi.fn();

    const newColumns = columns.map((column) => ({ ...column, display: false }));
    const { container } = render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={newColumns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );

    // No column headers should be visible
    const cells = container.querySelectorAll('th');
    expect(cells.length).toBe(0);
  });

  it('should trigger toggleSort prop callback when clicking sort button', () => {
    const options = { sort: true };
    const toggleSort = vi.fn();

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );

    const sortButton = screen.getByTestId('headcol-0');
    fireEvent.click(sortButton);

    expect(toggleSort).toHaveBeenCalledTimes(1);
  });

  it('should trigger selectRowUpdate prop callback when calling method handleRowSelect', () => {
    const options = { sort: true, selectableRows: 'multiple' };
    const rowSelectUpdate = vi.fn();

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            selectRowUpdate={rowSelectUpdate}
          />
        </table>
      </DndProvider>,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(rowSelectUpdate).toHaveBeenCalledTimes(1);
  });

  it('should render a table head with checkbox if selectableRows = multiple', () => {
    const options = { selectableRows: 'multiple' };

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
          />
        </table>
      </DndProvider>,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render a table head with no checkbox if selectableRows = single', () => {
    const options = { selectableRows: 'single' };

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
          />
        </table>
      </DndProvider>,
    );

    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('should render a table head with no checkbox if selectableRows = none', () => {
    const options = { selectableRows: 'none' };

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
          />
        </table>
      </DndProvider>,
    );

    expect(screen.queryByRole('checkbox')).toBeNull();
  });
});
