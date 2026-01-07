import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MUIDataTable from '../src/MUIDataTable';

describe('<TableToolbar />', () => {
  const columns = ['First Name', 'Company', 'City', 'State'];
  const data = [
    ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
    ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
    ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
    ['James Houston', 'Test Corp', 'Dallas', 'TX'],
  ];

  it('should render a toolbar with search button', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getByTestId('Search-iconButton')).toBeInTheDocument();
  });

  it('should render a toolbar with download button', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getByTestId('DownloadCSV-iconButton')).toBeInTheDocument();
  });

  it('should render a toolbar with print button', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    expect(screen.getByTestId('Print-iconButton')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    // Table data should be present
    expect(screen.getByText('Joe James')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<MUIDataTable columns={columns} data={data} />);
    // Headers should be present
    expect(screen.getAllByText('First Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Company').length).toBeGreaterThan(0);
  });

  it('should not render search button when search = false', () => {
    const options = { search: false };
    render(<MUIDataTable columns={columns} data={data} options={options} />);
    expect(screen.queryByTestId('Search-iconButton')).toBeNull();
  });

  it('should not render download button when download = false', () => {
    const options = { download: false };
    render(<MUIDataTable columns={columns} data={data} options={options} />);
    expect(screen.queryByTestId('DownloadCSV-iconButton')).toBeNull();
  });

  it('should not render print button when print = false', () => {
    const options = { print: false };
    render(<MUIDataTable columns={columns} data={data} options={options} />);
    expect(screen.queryByTestId('Print-iconButton')).toBeNull();
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

  it('should render title when provided', () => {
    render(<MUIDataTable columns={columns} data={data} title="Test Title" />);
    expect(screen.getAllByText('Test Title').length).toBeGreaterThan(0);
  });

  it('should render custom toolbar when customToolbar is provided', () => {
    const customToolbar = () => <div data-testid="custom-toolbar">Custom Toolbar</div>;
    const options = { customToolbar };
    render(<MUIDataTable columns={columns} data={data} options={options} />);
    expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
  });
});
