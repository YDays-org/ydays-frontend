import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../../../../contexts/AuthContext';
import SettingsTab from './SettingsTab';

// Mock the profileService
jest.mock('../../../../services/profileService', () => ({
  profileService: {
    updateUserProfile: jest.fn(),
    changePassword: jest.fn(),
  }
}));

// Mock the useAuth hook
const mockUserProfile = {
  id: "7CegIZRthsT1hi1vwdgmxgXj2IT2",
  email: "yassineova@gmail.com",
  emailVerified: true,
  fullName: "yassine hamdoune",
  role: "partner",
  profilePictureUrl: "https://lh3.googleusercontent.com/a/ACg8ocLT_yCeHdFn3OuvuTElEXgEXHfy35OQKWgUl0UQI2D4d5tcxhEb=s96-c",
  phoneNumber: null,
  phoneVerified: false,
  createdAt: "2025-07-12T15:49:25.279Z",
  updatedAt: "2025-07-13T12:12:35.386Z",
  partner: {
    id: "e7fd401a-a24a-40fa-b045-8af9e279abfe",
    userId: "7CegIZRthsT1hi1vwdgmxgXj2IT2",
    companyName: "TechVenture SARL",
    companyAddress: "123 Tech Ave, Casablanca",
    websiteUrl: "https://techventure.ma",
    socialMediaLinks: null,
    createdAt: "2025-07-12T17:20:55.552Z",
    updatedAt: "2025-07-12T17:20:55.552Z"
  }
};

const mockAuthContext = {
  userProfile: mockUserProfile,
  syncUserProfile: jest.fn(),
};

const renderWithAuth = (component) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      {component}
    </AuthContext.Provider>
  );
};

describe('SettingsTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile tab by default with user information', () => {
    renderWithAuth(<SettingsTab />);
    
    // Check if user information is displayed
    expect(screen.getByText('Informations du compte')).toBeInTheDocument();
    expect(screen.getByText('yassine hamdoune')).toBeInTheDocument();
    expect(screen.getByText('yassineova@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('partner')).toBeInTheDocument();
    expect(screen.getByText('TechVenture SARL')).toBeInTheDocument();
  });

  it('displays partner information when user is a partner', () => {
    renderWithAuth(<SettingsTab />);
    
    expect(screen.getByText('Informations partenaire')).toBeInTheDocument();
    expect(screen.getByText('TechVenture SARL')).toBeInTheDocument();
    expect(screen.getByText('123 Tech Ave, Casablanca')).toBeInTheDocument();
    expect(screen.getByText('https://techventure.ma')).toBeInTheDocument();
  });

  it('shows loading state when userProfile is null', () => {
    renderWithAuth(<SettingsTab />);
    
    // Re-render with null userProfile
    render(
      <AuthContext.Provider value={{ ...mockAuthContext, userProfile: null }}>
        <SettingsTab />
      </AuthContext.Provider>
    );
    
    expect(screen.getByText('Chargement du profil...')).toBeInTheDocument();
  });

  it('switches to notifications tab', () => {
    renderWithAuth(<SettingsTab />);
    fireEvent.click(screen.getByText(/Notifications/i));
    expect(screen.getByText(/Préférences de notifications/i)).toBeInTheDocument();
  });

  it('shows email field as disabled', () => {
    renderWithAuth(<SettingsTab />);
    
    const emailInput = screen.getByDisplayValue('yassineova@gmail.com');
    expect(emailInput).toBeDisabled();
    expect(emailInput).toHaveClass('bg-gray-100');
  });

  it('validates password confirmation', async () => {
    renderWithAuth(<SettingsTab />);
    
    const passwordInput = screen.getByPlaceholderText('Laisser vide pour ne pas changer');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmer le nouveau mot de passe');
    const submitButton = screen.getByText('Sauvegarder');
    
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas.')).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    renderWithAuth(<SettingsTab />);
    
    const passwordInput = screen.getByPlaceholderText('Laisser vide pour ne pas changer');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmer le nouveau mot de passe');
    const submitButton = screen.getByText('Sauvegarder');
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Le mot de passe doit contenir au moins 6 caractères.')).toBeInTheDocument();
    });
  });
}); 