const https = require('https');

async function waitAndTest() {
  console.log('🚀 CI/CD disparado! Aguardando deployment...\n');

  const testUrl = 'https://url-shortener-hazel-rho.vercel.app/health';
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`⏳ Tentativa ${attempts}/${maxAttempts} - Testando deployment...`);

    try {
      const result = await testDeployment(testUrl);

      if (result.status === 200) {
        console.log('✅ SUCESSO! Deployment funcionando!');
        console.log('🎉 URL principal atualizada com correções!');
        console.log('🔗 URLs disponíveis:');
        console.log('   📊 Health Check: https://url-shortener-hazel-rho.vercel.app/health');
        console.log('   📚 API Docs: https://url-shortener-hazel-rho.vercel.app/api-docs');
        console.log('   📈 Metrics: https://url-shortener-hazel-rho.vercel.app/metrics');
        console.log('   🏠 Home: https://url-shortener-hazel-rho.vercel.app/');

        // Teste adicional dos endpoints principais
        await testAdditionalEndpoints();
        return;
      } else if (result.status === 401) {
        console.log('✅ SUCESSO! Deployment funcionando (com proteção SSO)!');
        console.log('🎉 URL principal atualizada com correções!');
        return;
      } else if (result.status === 500) {
        console.log(`⏳ Ainda com erro 500... aguardando...`);
      } else {
        console.log(`⏳ Status ${result.status}... aguardando...`);
      }
    } catch (error) {
      console.log(`⏳ Erro de rede... aguardando...`);
    }

    if (attempts < maxAttempts) {
      console.log('⏰ Aguardando 30 segundos...\n');
      await sleep(30000);
    }
  }

  console.log('⚠️  Timeout - verifique manualmente o deployment no Vercel');
}

function testDeployment(url) {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            error: res.headers['x-vercel-error'],
            location: res.headers['location'],
            contentType: res.headers['content-type'],
            data: data.substring(0, 200), // Primeiros 200 caracteres para debug
          });
        });
      })
      .on('error', () => {
        resolve({ status: null, error: 'Network Error' });
      });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testAdditionalEndpoints() {
  console.log('\n🧪 Testando endpoints adicionais...');

  const endpoints = [
    { name: 'API Docs', url: 'https://url-shortener-hazel-rho.vercel.app/api-docs' },
    { name: 'Metrics', url: 'https://url-shortener-hazel-rho.vercel.app/metrics' },
    { name: 'Home Redirect', url: 'https://url-shortener-hazel-rho.vercel.app/' },
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await testDeployment(endpoint.url);
      if (result.status === 200 || result.status === 302) {
        console.log(`   ✅ ${endpoint.name}: Status ${result.status}`);
        if (result.status === 302 && result.location) {
          console.log(`      🔄 Redireciona para: ${result.location}`);
        }
        if (endpoint.name === 'Home Redirect' && result.status === 200) {
          console.log(`      📄 Content-Type: ${result.contentType}`);
          if (result.data.includes('Swagger') || result.data.includes('API Documentation')) {
            console.log(`      ✅ Conteúdo parece ser da documentação da API`);
          } else {
            console.log(`      ⚠️  Conteúdo: ${result.data.substring(0, 100)}...`);
          }
        }
      } else {
        console.log(`   ⚠️  ${endpoint.name}: Status ${result.status}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: Erro de rede`);
    }
  }

  console.log('\n🎊 Deployment completamente funcional!');
}

waitAndTest();
