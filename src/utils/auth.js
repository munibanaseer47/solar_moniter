import auth from '@react-native-firebase/auth';

export const login = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const register = async (email, password, name) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    return { success: true };
  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email already in use';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const logout = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Logout failed. Please try again.' };
  }
};

export const getCurrentUser = () => {
  return auth().currentUser;
};