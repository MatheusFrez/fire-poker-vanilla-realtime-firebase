import Router from '../src/router/router';

describe('Rotas', () => {
  it('Deve navegar para outra página', (done) => {
    const router = new Router({
      routes: [{
        path: /^\/other\/?$/,
        callback: () => {
          done();
        },
      }],
      notFound: () => null,
    });
    router.push('/other');
  });

  it('Deve receber o parâmetro da página', () => {
    const router = new Router({
      routes: [{
        path: /^\/other\/(\d+)\/?$/,
        callback: (id: string) => {
          expect(id).toBe('123');
        },
      }],
      notFound: () => null,
    });
    router.push('/other/123');
  });

  it('Deve navegar para not found', (done) => {
    const router = new Router({
      routes: [],
      notFound: () => {
        done();
      },
    });
    router.push('/other');
  });

  it('Deve navegar a partir do href da tag "a"', () => {
    // eslint-disable-next-line no-new
    new Router({
      routes: [{
        path: /^\/other\/(\d+)\/?$/,
        callback: (id) => {
          expect(id).toBe('123');
        },
      }],
      notFound: () => null,
    });
    const anchor = document.createElement('a');
    anchor.setAttribute('href', '/other/123');
    anchor.click();
  });
});
