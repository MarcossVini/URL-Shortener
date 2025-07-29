import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

// Configuração de tracing distribuído com OpenTelemetry e Jaeger
// O nome do serviço deve ser configurado via variável de ambiente OTEL_SERVICE_NAME
const sdk = new NodeSDK({
  // Envia spans via HTTP para o collector do Jaeger (porta 14268)
  traceExporter: new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Inicializar tracing
try {
  sdk.start();
  console.log('🚀 Tracing initialized');
} catch (error) {
  console.error('❌ Tracing failed to start', error);
}

// Encerrar tracing no shutdown
// Encerrar tracing no shutdown
process.on('SIGTERM', () => {
  try {
    sdk.shutdown();
    console.log('🛑 Tracing terminated');
  } catch (error) {
    console.error('❌ Error shutting down tracing', error);
  } finally {
    process.exit(0);
  }
});
