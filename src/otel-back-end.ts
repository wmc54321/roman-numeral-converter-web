import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

const provider = new NodeTracerProvider();
// traces through otel collector
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4317', // OpenTelemetry Collector gRPC endpoint
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
// export traces to console
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

// 监听 HTTP 和 Express
registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

console.log("Init OpenTelemetry Tracing backend");
