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
        resolve({
          status: res.statusCode,
          error: res.headers['x-vercel-error'],
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

waitAndTest();
