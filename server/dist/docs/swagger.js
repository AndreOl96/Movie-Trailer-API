import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
export default function setupSwagger(app) {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation - Super Store',
                version: '1.0.0',
            },
            components: {
                schemas: {
                    UserInput: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            email: { type: 'string', format: 'email' },
                            password: { type: 'string', format: 'password' },
                            avatar: { type: 'string' },
                            role: { type: 'string' },
                            isActive: { type: 'boolean' }
                        },
                        required: ['name', 'email', 'password', 'role']
                    }
                }
            }
        },
        apis: ['./src/**/*.ts'],
    };
    const specs = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
//# sourceMappingURL=swagger.js.map