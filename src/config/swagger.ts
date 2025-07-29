import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shortener API',
      version: '1.0.0',
      description: `
## 📚 Shortener API

API completa para encurtamento de URLs com autenticação JWT e gerenciamento de usuários.

### 🚀 Funcionalidades

- **Autenticação JWT**: Login seguro com tokens
- **Encurtamento de URLs**: Criação de links curtos
- **Redirecionamento**: Redirecionamento automático para URLs originais
- **Gerenciamento de URLs**: CRUD completo para usuários autenticados
- **Contabilização**: Rastreamento de cliques e acessos
- **Documentação Interativa**: Swagger UI para testes

### 🔐 Autenticação

Para endpoints protegidos, inclua o header:
\`\`\`
Authorization: Bearer <seu-jwt-token>
\`\`\`

### 📝 Exemplos de Uso

1. **Login**: \`POST /auth/login\`
2. **Encurtar URL**: \`POST /shorten\`
3. **Redirecionar**: \`GET /shorten/{shortCode}\`
4. **Listar URLs**: \`GET /user/urls\`

### 🛠️ Tecnologias

- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI
      `,
      contact: {
        name: 'API Support',
        email: 'support@shortener.com',
        url: 'https://github.com/shortener-api',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Detalhes do erro de validação',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Senha do usuário',
              example: '123456',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token para autenticação',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID do usuário',
                },
                email: {
                  type: 'string',
                  description: 'Email do usuário',
                },
              },
            },
          },
        },
        CreateShortUrlRequest: {
          type: 'object',
          required: ['original_url'],
          properties: {
            original_url: {
              type: 'string',
              format: 'uri',
              description: 'URL original para encurtar',
              example: 'https://www.google.com',
            },
          },
        },
        CreateShortUrlResponse: {
          type: 'object',
          properties: {
            short_url: {
              type: 'string',
              description: 'URL encurtada',
              example: 'http://localhost:3000/abc123',
            },
            original_url: {
              type: 'string',
              description: 'URL original',
              example: 'https://www.google.com',
            },
          },
        },
        UserUrl: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID da URL encurtada',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            original_url: {
              type: 'string',
              description: 'URL original',
              example: 'https://www.google.com',
            },
            short_code: {
              type: 'string',
              description: 'Código da URL encurtada',
              example: 'abc123',
            },
            short_url: {
              type: 'string',
              description: 'URL encurtada completa',
              example: 'http://localhost:3000/abc123',
            },
            click_count: {
              type: 'number',
              description: 'Número de cliques',
              example: 42,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2025-07-28T19:30:00.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
              example: '2025-07-28T19:30:00.000Z',
            },
          },
        },
        UserUrlsResponse: {
          type: 'object',
          properties: {
            urls: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UserUrl',
              },
              description: 'Lista de URLs do usuário',
            },
            total: {
              type: 'number',
              description: 'Total de URLs',
              example: 5,
            },
          },
        },
        DeleteUrlResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de confirmação',
              example: 'URL deletada com sucesso',
            },
            id: {
              type: 'string',
              description: 'ID da URL deletada',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Status da aplicação',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp da verificação',
            },
          },
        },
      },
    },
  },
  apis: ['./src/features/**/routes/*.ts', './src/server.ts'],
};

export const specs = swaggerJsdoc(options);
