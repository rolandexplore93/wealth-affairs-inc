const staffLogin = {
    tags: ['Staff'],
    summary: 'Authenticate staff',
    description: 'Each staff is authenticated into the portal',
    operationId: 'staffLogin',
    requestBody: {
        description: 'Staff login details',
        content: {
            'application/json': {
                schema: {
                    $ref: '#components/schemas/staffLogin'
                }
            }
        },
        required: true
    },
    responses: {
        200: {
            description: 'Login successful',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            message: 'Login successful. Redirecting...',
                            redirectionUrl: 'http://....',
                            loginToken: 'hbdjkns2yy27bxs013u. (Token is valid for 2 minutes)'
                        }
                    }
                }
            }
        },
        400: { description: 'Invalid credentials.' },
        401: { description: 'Not authorized.' },
        500: { description: 'Server error. Please try again.' }
    }
}

const staffRoutesDoc = {
    '/staff-login': {
        post: staffLogin
    },

    // Components configuration
    schemas: {
        staffLogin: {
            required: ['email', 'password'],
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'exa@wa.com'
                },
                password: {
                    type: 'string',
                    example: '123456'
                }
            }
        }
    }
}

module.exports = staffRoutesDoc