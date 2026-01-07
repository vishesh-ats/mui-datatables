import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TableSearch from '../src/components/TableSearch';
import getTextLabels from '../src/textLabels';

describe('<TableSearch />', () => {
  it('should render a search bar', () => {
    const options = { textLabels: getTextLabels() };
    const onSearch = vi.fn();
    const onHide = vi.fn();

    render(<TableSearch onSearch={onSearch} onHide={onHide} options={options} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render a search bar with text initialized', () => {
    const options = { textLabels: getTextLabels() };
    const onSearch = vi.fn();
    const onHide = vi.fn();

    render(<TableSearch onSearch={onSearch} onHide={onHide} options={options} searchText="searchText" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('searchText');
  });

  it('should render a search bar with placeholder when searchPlaceholder is set', () => {
    const options = { textLabels: getTextLabels(), searchPlaceholder: 'TestingPlaceholder' };
    const onSearch = vi.fn();
    const onHide = vi.fn();

    render(<TableSearch onSearch={onSearch} onHide={onHide} options={options} />);

    const input = screen.getByPlaceholderText('TestingPlaceholder');
    expect(input).toBeInTheDocument();
  });

  it('should trigger handleTextChange prop callback when calling method handleTextChange', () => {
    const options = { onSearchChange: () => true, textLabels: getTextLabels() };
    const onSearch = vi.fn();
    const onHide = vi.fn();

    render(<TableSearch onSearch={onSearch} onHide={onHide} options={options} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onSearch).toHaveBeenCalled();
  });

  it('should hide the search bar when hitting the ESCAPE key', () => {
    const options = { textLabels: getTextLabels() };
    const onHide = vi.fn();

    render(<TableSearch onHide={onHide} options={options} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 27 });

    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should not hide search bar when entering anything but the ESCAPE key', () => {
    const options = { textLabels: getTextLabels() };
    const onHide = vi.fn();

    render(<TableSearch onHide={onHide} options={options} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'a', keyCode: 65 });

    expect(onHide).not.toHaveBeenCalled();
  });
});
