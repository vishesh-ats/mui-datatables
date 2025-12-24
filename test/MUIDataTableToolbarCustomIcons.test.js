import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MUIDataTable from '../src/MUIDataTable';

const columns = ['First Name', 'Company', 'City', 'State'];
const data = [
  ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
  ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
  ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
  ['James Houston', 'Test Corp', 'Dallas', 'TX'],
];

describe('<TableToolbar /> with icons', () => {
  it('should render a toolbar with search icon', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getByTestId('SearchIcon')).toBeInTheDocument();
  });

  it('should render a toolbar with download icon', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getByTestId('CloudDownloadIcon')).toBeInTheDocument();
  });

  it('should render a toolbar with print icon', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getByTestId('PrintIcon')).toBeInTheDocument();
  });

  it('should render table data correctly', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getByText('Joe James')).toBeInTheDocument();
    expect(screen.getAllByText('Test Corp').length).toBeGreaterThan(0);
  });

  it('should render table headers correctly', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getAllByText('First Name').length).toBeGreaterThan(0);
  });
});
