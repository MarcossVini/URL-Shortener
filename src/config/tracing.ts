import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

// Configuração de tracing distribuído com OpenTelemetry e Jaeger
// O nome do serviço deve ser configurado via variável de ambiente OTEL_SERVICE_NAME

// Só inicializar tracing em ambiente de desenvolvimento ou se explicitamente habilitado
const shouldEnableTracing =
  process.env.NODE_ENV === 'development' || process.env.ENABLE_TRACING === 'true';

let sdk: NodeSDK | null = null;

if (shouldEnableTracing) {
  sdk = new NodeSDK({
    // Envia spans via HTTP para o collector do Jaeger (porta 14268)
    traceExporter: new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  // Inicializar tracing
  try {
    sdk.start();
    console.log('🚀 Tracing initialized');
  } catch (error) {
    console.error('❌ Tracing failed to start', error);
    // Não quebrar a aplicação se o tracing falhar
  }
} else {
  console.log('📊 Tracing disabled for serverless environment');
}

// Encerrar tracing no shutdown
process.on('SIGTERM', () => {
  if (sdk) {
    try {
      sdk.shutdown();
      console.log('🛑 Tracing terminated');
    } catch (error) {
      console.error('❌ Error shutting down tracing', error);
    }
  }
});
