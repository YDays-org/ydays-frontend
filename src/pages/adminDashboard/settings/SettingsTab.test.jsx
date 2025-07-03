import { render, screen, fireEvent } from '@testing-library/react';
import SettingsTab from './SettingsTab';

describe('SettingsTab', () => {
  it('renders profile tab by default', () => {
    render(<SettingsTab />);
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('switches to notifications tab', () => {
    render(<SettingsTab />);
    fireEvent.click(screen.getByText(/Notifications/i));
    expect(screen.getByText(/Préférences de notifications/i)).toBeInTheDocument();
  });
}); 