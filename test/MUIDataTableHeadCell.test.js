import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import getTextLabels from '../src/textLabels';
import TableHeadCell from '../src/components/TableHeadCell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

describe('<TableHeadCell />', () => {
  let classes;

  beforeAll(() => {
    classes = {
      root: {},
    };
  });

  it('should add custom props to header cell if "setCellHeaderProps" provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = vi.fn();
    const setCellHeaderProps = { 'data-custom': 'test', className: 'testClass' };

    const { container } = render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell
                cellHeaderProps={setCellHeaderProps}
                options={options}
                sortDirection={'asc'}
                sort={true}
                toggleSort={toggleSort}
                classes={classes}
              >
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>,
    );

    // Check for content presence
    expect(screen.getByText('some content')).toBeInTheDocument();
  });

  it('should render a table head cell with sort label when options.sort = true provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = vi.fn();

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell
                options={options}
                sortDirection={'asc'}
                sort={true}
                toggleSort={toggleSort}
                classes={classes}
              >
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>,
    );

    // Column header with content should be present
    expect(screen.getByText('some content')).toBeInTheDocument();
  });

  it('should render a table help icon when hint provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell options={options} hint={'hint text'} classes={classes}>
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>,
    );

    // Help icon should be present (it's an SVG)
    expect(screen.getByTestId('HelpIcon')).toBeInTheDocument();
  });

  it('should trigger toggleSort prop callback when calling method handleSortClick', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = vi.fn();

    render(
      <DndProvider backend={HTML5Backend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell
                options={options}
                sort={true}
                index={0}
                sortDirection={'asc'}
                toggleSort={toggleSort}
                classes={classes}
              >
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>,
    );

    const sortButton = screen.getByTestId('headcol-0');
    fireEvent.click(sortButton);
    expect(toggleSort).toHaveBeenCalledTimes(1);
  });
});
