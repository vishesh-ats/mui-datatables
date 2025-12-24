import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TableFilter from '../src/components/TableFilter';
import getTextLabels from '../src/textLabels';

describe('<TableFilter />', () => {
  let data;
  let columns;
  let filterData;

  beforeEach(() => {
    columns = [
      { name: 'firstName', label: 'First Name', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'company', label: 'Company', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'city', label: 'City Label', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'state', label: 'State', display: true, sort: true, filter: true, sortDirection: 'desc' },
    ];

    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];

    filterData = [
      ['Joe James', 'John Walsh', 'Bob Herm', 'James Houston'],
      ['Test Corp'],
      ['Yonkers', 'Hartford', 'Tampa', 'Dallas'],
      ['NY', 'CT', 'FL', 'TX'],
    ];
  });

  it('should render label as filter name', () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    render(<TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />);

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('City Label')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
  });

  it("should render data table filter view with checkboxes if filterType = 'checkbox'", () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    render(<TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(13);
  });

  it('should render data table filter view with no checkboxes if filter=false for each column', () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const noFilterColumns = columns.map((item) => ({ ...item, filter: false }));

    render(<TableFilter columns={noFilterColumns} filterData={filterData} filterList={filterList} options={options} />);

    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes.length).toBe(0);
  });

  it("should render data table filter view with selects if filterType = 'select'", () => {
    const options = { filterType: 'select', textLabels: getTextLabels() };
    const filterList = [['Joe James'], [], [], []];

    render(<TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(4);
  });

  it("should render data table filter view with checkbox selects if filterType = 'multiselect'", () => {
    const options = { filterType: 'multiselect', textLabels: getTextLabels() };
    const filterList = [['Joe James', 'John Walsh'], [], [], []];

    render(<TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(4);
  });

  it("should render data table filter view with TextFields if filterType = 'textfield'", () => {
    const options = { filterType: 'textField', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    render(<TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />);

    const textfields = screen.getAllByRole('textbox');
    expect(textfields.length).toBe(4);
  });

  it("should render data table filter view with no TextFields if filter=false when filterType = 'textField'", () => {
    const options = { filterType: 'textField', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const noFilterColumns = columns.map((item) => ({ ...item, filter: false }));

    render(<TableFilter columns={noFilterColumns} filterData={filterData} filterList={filterList} options={options} />);

    const textfields = screen.queryAllByRole('textbox');
    expect(textfields.length).toBe(0);
  });

  it('should render a filter dialog with custom footer when customFooter is provided', () => {
    const CustomFooter = () => <div data-testid="custom-footer">customFooter</div>;
    const options = { textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const onFilterUpdate = vi.fn();

    render(
      <TableFilter
        customFooter={CustomFooter}
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    );

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('should invoke onFilterReset when reset is pressed', () => {
    const options = { textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const onFilterUpdate = vi.fn();
    const handleClose = vi.fn();
    const onFilterReset = vi.fn();

    render(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        handleClose={handleClose}
        onFilterReset={onFilterReset}
      />,
    );

    const resetButton = screen.getByTestId('filterReset-button');
    fireEvent.click(resetButton);

    expect(onFilterReset).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(0);
  });

  it('should trigger onFilterUpdate when checkbox is changed', () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const onFilterUpdate = vi.fn();
    const updateFilterByType = vi.fn();

    render(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        updateFilterByType={updateFilterByType}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onFilterUpdate).toHaveBeenCalled();
  });

  it('should trigger onFilterUpdate when textfield is changed', () => {
    const options = { filterType: 'textField', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const onFilterUpdate = vi.fn();
    const updateFilterByType = vi.fn();

    render(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        updateFilterByType={updateFilterByType}
      />,
    );

    const textfields = screen.getAllByRole('textbox');
    fireEvent.change(textfields[0], { target: { value: 'test' } });

    expect(onFilterUpdate).toHaveBeenCalled();
  });
});
