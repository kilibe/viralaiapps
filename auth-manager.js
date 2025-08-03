import { supabase } from './supabase-client.js';

// Authentication Manager
class AuthManager {
  constructor() {
    this.user = null;
    this.session = null;
    this.listeners = [];
    
    // Initialize auth state
    this.initAuth();
  }

  async initAuth() {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    this.setSession(session);

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      this.setSession(session);
      this.notifyListeners(event, session);
    });
  }

  setSession(session) {
    this.session = session;
    this.user = session?.user || null;
  }

  // Subscribe to auth changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(event, session) {
    this.listeners.forEach(callback => callback(event, session));
  }

  // Sign up with email
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      // Create profile
      if (data.user) {
        await this.createUserProfile(data.user, metadata);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  }

  // Sign in with email
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }

  // Sign in with OAuth
  async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          scopes: provider === 'google' ? 'email profile' : undefined
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return { data: null, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.user = null;
      this.session = null;
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }

  // Password reset
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { data: null, error };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error };
    }
  }

  // Create user profile
  async createUserProfile(user, metadata = {}) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: metadata.full_name || user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          preferences: {
            email_notifications: true,
            weekly_report: true,
            dark_mode: false
          }
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }
    } catch (error) {
      console.error('Profile creation error:', error);
    }
  }

  // Get user profile
  async getUserProfile() {
    if (!this.user) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    if (!this.user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', this.user.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  }

  // User tracking functions
  async trackEntity(entityId) {
    if (!this.user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('user_tracked_entities')
        .insert({
          user_id: this.user.id,
          entity_id: entityId
        });

      if (error && error.code !== '23505') { // Ignore duplicate
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Track entity error:', error);
      return { error };
    }
  }

  async untrackEntity(entityId) {
    if (!this.user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('user_tracked_entities')
        .delete()
        .eq('user_id', this.user.id)
        .eq('entity_id', entityId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Untrack entity error:', error);
      return { error };
    }
  }

  async getTrackedEntities() {
    if (!this.user) return [];

    try {
      const { data, error } = await supabase
        .from('user_tracked_entities')
        .select(`
          entity_id,
          entities (
            id,
            name,
            short_description,
            category,
            website_url
          )
        `)
        .eq('user_id', this.user.id);

      if (error) throw error;
      return data.map(item => item.entities);
    } catch (error) {
      console.error('Get tracked entities error:', error);
      return [];
    }
  }

  // Check if user is tracking an entity
  async isTrackingEntity(entityId) {
    if (!this.user) return false;

    try {
      const { data, error } = await supabase
        .from('user_tracked_entities')
        .select('entity_id')
        .eq('user_id', this.user.id)
        .eq('entity_id', entityId)
        .single();

      return !error && data !== null;
    } catch (error) {
      return false;
    }
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.user;
  }
}

// Create and export singleton instance
export const authManager = new AuthManager();

// UI Helper functions
export function updateAuthUI() {
  const user = authManager.getUser();
  const isAuth = authManager.isAuthenticated();

  // Update navigation
  const trackingNav = document.querySelector('a[href="#tracking"]');
  if (trackingNav) {
    trackingNav.style.display = isAuth ? 'block' : 'none';
  }

  // Update settings icon
  const settingsIcon = document.querySelector('a[href="#settings"]');
  if (settingsIcon) {
    settingsIcon.innerHTML = isAuth ? '👤' : '⚙️';
  }

  // Add track buttons to entity rows if authenticated
  if (isAuth) {
    addTrackButtons();
  }
}

async function addTrackButtons() {
  const rows = document.querySelectorAll('.clickable-row');
  
  for (const row of rows) {
    const entityId = row.dataset.entityId;
    if (!entityId) continue;

    // Check if already tracking
    const isTracking = await authManager.isTrackingEntity(entityId);

    // Add track button
    const actionsCell = row.querySelector('td:last-child');
    if (actionsCell && !actionsCell.querySelector('.track-btn')) {
      const trackBtn = document.createElement('button');
      trackBtn.className = `track-btn ${isTracking ? 'tracking' : ''}`;
      trackBtn.innerHTML = isTracking ? '★' : '☆';
      trackBtn.title = isTracking ? 'Untrack' : 'Track';
      trackBtn.onclick = async (e) => {
        e.stopPropagation();
        await toggleTracking(entityId, trackBtn);
      };
      actionsCell.appendChild(trackBtn);
    }
  }
}

async function toggleTracking(entityId, button) {
  const isTracking = button.classList.contains('tracking');

  if (isTracking) {
    const { error } = await authManager.untrackEntity(entityId);
    if (!error) {
      button.classList.remove('tracking');
      button.innerHTML = '☆';
      button.title = 'Track';
    }
  } else {
    const { error } = await authManager.trackEntity(entityId);
    if (!error) {
      button.classList.add('tracking');
      button.innerHTML = '★';
      button.title = 'Untrack';
    }
  }
}

// Listen for auth changes
authManager.subscribe((event, session) => {
  updateAuthUI();
  
  if (event === 'SIGNED_IN') {
    console.log('User signed in');
    // Refresh the page or update content
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    // Clear user-specific content
  }
});