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
3. **Redirecionar**: \`GET /{shortCode}\`
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
        url: process.env.VERCEL
          ? 'https://url-shortener-hazel-rho.vercel.app'
          : `http://localhost:${env.PORT}`,
        description: process.env.VERCEL ? 'Production server' : 'Development server',
      },
    ],
    paths: {
      '/health': {
        get: {
          summary: 'Health Check',
          description: 'Verifica o status da aplicação',
          tags: ['System'],
          responses: {
            '200': {
              description: 'Aplicação funcionando normalmente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/metrics': {
        get: {
          summary: 'Expor métricas da aplicação',
          tags: ['Observability'],
          responses: {
            '200': {
              description: 'Métricas no formato JSON',
            },
          },
        },
      },
      '/': {
        get: {
          summary: 'Página inicial da API',
          description: 'Redireciona para a documentação da API',
          tags: ['System'],
          responses: {
            '302': {
              description: 'Redirecionamento para documentação',
            },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Autenticar usuário',
          description: 'Realiza login do usuário e retorna JWT token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/shorten': {
        post: {
          summary: 'Encurtar URL',
          description: 'Cria uma URL encurtada. Autenticação é opcional.',
          tags: ['URL Shortening'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateShortUrlRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'URL encurtada criada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CreateShortUrlResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/user/urls': {
        get: {
          summary: 'Listar URLs do usuário',
          description: 'Lista todas as URLs encurtadas do usuário autenticado',
          tags: ['User URLs'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Lista de URLs do usuário',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/UserUrlsResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Usuário não autenticado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/user/urls/{id}': {
        patch: {
          summary: 'Atualizar URL do usuário',
          description: 'Atualiza a URL original de uma URL encurtada do usuário',
          tags: ['User URLs'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'ID da URL encurtada',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateShortUrlRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'URL atualizada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CreateShortUrlResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Dados inválidos ou URL não encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Usuário não autenticado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Deletar URL do usuário',
          description: 'Deleta uma URL encurtada do usuário (soft delete)',
          tags: ['User URLs'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'ID da URL encurtada',
            },
          ],
          responses: {
            '200': {
              description: 'URL deletada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DeleteUrlResponse',
                  },
                },
              },
            },
            '400': {
              description: 'URL não encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Usuário não autenticado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
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
  apis: [], // Não precisamos mais de APIs externas já que definimos tudo inline
};

export const specs = swaggerJsdoc(options);
