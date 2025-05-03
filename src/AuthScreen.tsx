const handleSignup = async () => {
  if (!isSignupFormValid) {
    setError('Please fill in all required fields');
    return;
  }
  
  // Validate email format
  if (!email.includes('@') || !email.includes('.')) {
    setError('Please enter a valid email address');
    return;
  }
  
  // Validate password strength
  if (password.length < 6) {
    setError('Password must be at least 6 characters long');
    return;
  }

  try {
    setIsLoading(true);
    setError(null);
    
    console.log(`Starting signup process for ${email} as ${selectedUserRole}`);
    
    // Prepare signup data based on selected role
    const userData: UserSignupData = {
      email,
      password,
      name,
      role: selectedUserRole!,
    };
    
    // Add role-specific data
    switch (selectedUserRole) {
      case 'deaf':
        Object.assign(userData, deafUserData);
        break;
      case 'parent':
        Object.assign(userData, parentUserData);
        break;
      case 'teacher':
        Object.assign(userData, teacherUserData);
        break;
    }
    
    // Simple signup call
    const result = await signUp(userData);
    console.log('SignUp API response:', result);
    
    // Store user ID for confirmation check
    if (result && result.user) {
      // We'll let the authService.signUp handle user profile creation
      // rather than trying to create it here directly
      setPendingUserId(result.user.id);
      setShowEmailConfirmation(true);
    } else {
      setError('Failed to create account. Please try again.');
    }
  } catch (err: any) {
    console.error('Signup error:', err);
    
    // Handle common error cases
    if (err.message?.includes('already registered')) {
      setError('This email is already registered. Please try logging in instead.');
    } else if (err.message?.includes('network') || err.message?.includes('failed') || err.message?.includes('connect')) {
      setError('Network error. Please check your internet connection and try again.');
    } else {
      setError(err.message || 'Failed to sign up. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
}; 