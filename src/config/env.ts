import { z } from 'zod';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
const result = dotenv.config();

if (result.error) {
  console.error('❌ Erro ao carregar arquivo .env:', result.error.message);
  console.log('📝 Certifique-se de que o arquivo .env existe na raiz do projeto');
  process.exit(1);
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  BASE_URL: z.string().url().default('http://localhost:3000'),
  ENABLE_OBSERVABILITY: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Função para validar e retornar as variáveis de ambiente
function validateEnv() {
  try {
    const validatedEnv = envSchema.parse(process.env);
    console.log('✅ Variáveis de ambiente carregadas com sucesso');
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação das variáveis de ambiente:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.log('\n📝 Certifique-se de que todas as variáveis estão definidas no arquivo .env');
      console.log('📄 Exemplo de .env:');
      console.log(`
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shortener"
JWT_SECRET="your-super-secret-jwt-key-with-at-least-32-characters"
BASE_URL="http://localhost:3000"
ENABLE_OBSERVABILITY=false
LOG_LEVEL=info
      `);
    }
    console.error('💥 Falha crítica na validação das variáveis de ambiente');

    // Em ambiente serverless, não podemos usar process.exit()
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed - check your environment variables');
    }

    process.exit(1);
  }
}

// Exportar as variáveis validadas
export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
