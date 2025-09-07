import express from 'express';
const router = express.Router();

// Health check endpoint that returns system status and all available APIs
router.get('/', (req, res) => {
  try {
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      message: 'OpenLake IITBH Career Planning and Services Portal API is running successfully'
    };

    const availableAPIs = {
      authentication: {
        baseUrl: '/auth',
        endpoints: [
          { method: 'POST', path: '/auth/signup', description: 'User registration' },
          { method: 'POST', path: '/auth/verify-email', description: 'Email verification' },
          { method: 'POST', path: '/auth/send-code-again', description: 'Resend verification code' },
          { method: 'POST', path: '/auth/login', description: 'User login' },
          { method: 'POST', path: '/auth/forgot-password', description: 'Forgot password' },
          { method: 'POST', path: '/auth/reset-password/:token', description: 'Reset password with token' },
          { method: 'POST', path: '/auth/logout', description: 'User logout' }
        ]
      },
      alumni: {
        baseUrl: '/alumni',
        endpoints: [
          { method: 'GET', path: '/alumni/', description: 'Get all alumni list' },
          { method: 'GET', path: '/alumni/search-by-id', description: 'Search alumni by job ID' },
          { method: 'GET', path: '/alumni/search-by-role', description: 'Search alumni by job role' },
          { method: 'GET', path: '/alumni/search-by-company', description: 'Search alumni by company' }
        ]
      },
      jobs: {
        baseUrl: '/jobs',
        endpoints: [
          { method: 'GET', path: '/jobs/', description: 'Get all job listings' },
          { method: 'POST', path: '/jobs/', description: 'Create new job posting' },
          { method: 'PUT', path: '/jobs/:id', description: 'Update specific job posting' },
          { method: 'DELETE', path: '/jobs/:id', description: 'Delete specific job posting' },
          { method: 'GET', path: '/jobs/upvote/:id', description: 'Upvote job relevance score' },
          { method: 'GET', path: '/jobs/downvote/:id', description: 'Downvote job relevance score' }
        ]
      },
      profile: {
        baseUrl: '/profile',
        protected: true,
        endpoints: [
          { method: 'GET', path: '/profile/', description: 'Get student profile (requires authentication)' },
          { method: 'POST', path: '/profile/', description: 'Update student profile (requires authentication)' }
        ]
      },
      referrals: {
        baseUrl: '/referral',
        endpoints: [
          { method: 'POST', path: '/referral/request', description: 'Request a referral' },
          { method: 'POST', path: '/referral/provide', description: 'Provide a referral' },
          { method: 'GET', path: '/referral/', description: 'Get all referrals' },
          { method: 'DELETE', path: '/referral/:id', description: 'Delete specific referral' }
        ]
      },
      resume: {
        baseUrl: '/resume',
        endpoints: [
          { method: 'POST', path: '/resume/generate', description: 'Generate resume' }
        ]
      },
      statistics: {
        baseUrl: '/stats',
        endpoints: [
          { method: 'GET', path: '/stats/', description: 'Get all statistics data' },
          { method: 'PUT', path: '/stats/', description: 'Update statistics data' }
        ]
      },
      studentView: {
        baseUrl: '/student',
        endpoints: [
          { method: 'GET', path: '/student/:ID', description: 'Get student view by ID' },
          { method: 'PUT', path: '/student/:ID', description: 'Update student profile/add off-campus/update status' },
          { method: 'DELETE', path: '/student/:ID', description: 'Delete off-campus entry' }
        ]
      },
      discussionForum: {
        baseUrl: '/thread',
        protected: true,
        endpoints: [
          { method: 'GET', path: '/thread/getThreads', description: 'Get all discussion threads (requires authentication)' },
          { method: 'POST', path: '/thread/createThread', description: 'Create new discussion thread (requires authentication)' },
          { method: 'POST', path: '/thread/createComment/:threadId', description: 'Add comment to specific thread (requires authentication)' },
          { method: 'POST', path: '/thread/upvote/:threadId', description: 'Upvote specific thread (requires authentication)' },
          { method: 'POST', path: '/thread/downvote/:threadId', description: 'Downvote specific thread (requires authentication)' }
        ]
      },
      hrContacts: {
        baseUrl: '/hr-contacts',
        protected: true,
        endpoints: [
          { method: 'GET', path: '/hr-contacts/', description: 'Get all HR contacts (requires authentication)' },
          { method: 'GET', path: '/hr-contacts/:id', description: 'Get specific HR contact by ID (requires authentication)' },
          { method: 'POST', path: '/hr-contacts/', description: 'Create new HR contact (requires authentication)' },
          { method: 'PUT', path: '/hr-contacts/:id', description: 'Update specific HR contact (requires authentication)' },
          { method: 'DELETE', path: '/hr-contacts/:id', description: 'Delete specific HR contact (requires authentication)' },
          { method: 'GET', path: '/hr-contacts/export/csv', description: 'Export HR contacts as CSV (requires authentication)' }
        ]
      }
    };

    // Count total endpoints
    const totalEndpoints = Object.values(availableAPIs).reduce((total, module) => {
      return total + module.endpoints.length;
    }, 0);

    const response = {
      health: healthStatus,
      api: {
        title: 'OpenLake IITBH Career Planning and Services Portal API',
        description: 'Complete API documentation for the career planning and services portal',
        totalEndpoints: totalEndpoints,
        totalModules: Object.keys(availableAPIs).length,
        modules: availableAPIs
      },
      notes: {
        authentication: 'Protected routes require valid JWT token in Authorization header',
        baseUrl: 'All endpoints should be prefixed with /api (e.g., /api/auth/login)',
        contentType: 'Most POST/PUT requests expect application/json content-type',
        parameters: 'Routes with :id or :token expect actual values (e.g., /jobs/123, /auth/reset-password/abc123)'
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message
    });
  }
});

export default router;
