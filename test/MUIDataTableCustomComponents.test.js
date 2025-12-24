import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import MUIDataTable from '../src/MUIDataTable';
import Chip from '@mui/material/Chip';
import TableFilterList from '../src/components/TableFilterList';

const CustomChip = (props) => {
  return <Chip variant="outlined" color="secondary" label={props.label} data-testid="custom-chip" />;
};

const CustomFilterList = (props) => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

describe('<MUIDataTable /> with custom components', () => {
  let data;
  let columns;

  beforeAll(() => {
    columns = [
      { name: 'Name' },
      {
        name: 'Company',
        options: {
          filter: true,
          filterType: 'custom',
          filterList: ['Test Corp'],
        },
      },
      { name: 'City', label: 'City Label' },
      { name: 'State' },
      { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', null],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
  });

  it('should render a table with custom Chip in TableFilterList', () => {
    render(
      <MUIDataTable
        columns={columns}
        data={data}
        components={{
          TableFilterList: CustomFilterList,
        }}
      />,
    );

    // Check that the custom chip is rendered
    const customChip = screen.getByTestId('custom-chip');
    expect(customChip).toBeInTheDocument();
  });
});
