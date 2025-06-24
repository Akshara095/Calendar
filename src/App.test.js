import { render, screen } from '@testing-library/react';
import App from './App';
import './index.css'; // ✅ make sure this is here


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
