import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const saved =
      localStorage.getItem('shd_user');

    return saved
      ? JSON.parse(saved)
      : null;
  });

  const [token, setToken] = useState(
    () =>
      localStorage.getItem('shd_token') ||
      null
  );

  const [loading, setLoading] = useState(true);


  /*
   * Verify saved login session
   */
  useEffect(() => {

    const verifyAuth = async () => {

      const savedToken =
        localStorage.getItem('shd_token');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {

        const profile =
          await authService.getProfile();

        setUser(profile);

        localStorage.setItem(
          'shd_user',
          JSON.stringify(profile)
        );

      } catch (err) {

        console.warn(
          'Session verification failed:',
          err
        );

        /*
         * Token is invalid.
         * Completely clear the local session.
         */
        localStorage.removeItem('shd_token');
        localStorage.removeItem('shd_user');

        setToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    verifyAuth();

  }, []);


  /*
   * LOGIN
   */
  const login = async (credentials) => {

    const data =
      await authService.login(credentials);

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem(
      'shd_token',
      data.token
    );

    localStorage.setItem(
      'shd_user',
      JSON.stringify(data.user)
    );

    return data;
  };


  /*
   * REGISTER
   */
  const register = async (userData) => {

    const data =
      await authService.register(userData);

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem(
      'shd_token',
      data.token
    );

    localStorage.setItem(
      'shd_user',
      JSON.stringify(data.user)
    );

    return data;
  };


  /*
   * LOGOUT
   */
  const logout = async () => {

    try {
      await authService.logout();
    } catch (err) {
      console.warn(
        'Backend logout failed:',
        err
      );
    }

    /*
     * IMPORTANT:
     * Remove BOTH token and user.
     */
    localStorage.removeItem('shd_token');
    localStorage.removeItem('shd_user');

    setToken(null);
    setUser(null);
  };


  /*
   * UPDATE USER
   */
  const updateUser = (updatedUser) => {

    setUser(updatedUser);

    localStorage.setItem(
      'shd_user',
      JSON.stringify(updatedUser)
    );
  };


  /*
   * ROLE CHECKS
   */
  const isStudent =
    user?.role === 'STUDENT';

  const isWarden =
    user?.role === 'WARDEN';

  const isAdmin =
    user?.role === 'ADMIN';


  const isAuthenticated =
    !!token && !!user;


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,
        register,
        logout,
        updateUser,

        isStudent,
        isWarden,
        isAdmin,

        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};