const express = require('express');
const router = express.Router();
const Oficina = require('../model/oficina');

router.get('/', async (req, res, next) => {
  try {
    const oficinas = await Oficina.listar();
    const resumo = await Oficina.obterResumo();
    res.render('oficinas/index', {
      title: 'Catálogo de Oficinas',
      active: 'inicio',
      oficinas,
      resumo,
      somenteAbertas: false,
      mensagemVazia: oficinas.length === 0
        ? 'Nenhuma oficina cadastrada.'
        : null
    });
  } catch (error) {
    next(error);
  }
});

router.get('/abertas', async (req, res, next) => {
  try {
    const todas = await Oficina.listar();
    const oficinas = todas.filter((oficina) => oficina.inscricoesAbertas);
    const resumo = await Oficina.obterResumo();
    res.render('oficinas/index', {
      title: 'Inscrições Abertas',
      active: 'inicio',
      oficinas,
      resumo,
      somenteAbertas: true,
      mensagemVazia: todas.length === 0
        ? 'Nenhuma oficina cadastrada.'
        : oficinas.length === 0
          ? 'Nenhuma oficina está com inscrições abertas.'
          : null
    });
  } catch (error) {
    next(error);
  }
});

router.get('/sobre', (req, res) => {
  res.render('sobre', {
    title: 'Sobre',
    active: 'sobre',
    autor: 'Nome do(a) autor(a)'
  });
});

router.get('/pesquisa', (req, res) => {
  res.render('oficinas/pesquisa', {
    title: 'Pesquisa de Oficinas',
    active: 'pesquisa',
    pesquisado: false,
    termo: '',
    resultados: []
  });
});

router.post('/pesquisa', async (req, res, next) => {
  try {
    const termo = String(req.body.termo || '').trim();
    const resultados = await Oficina.pesquisarPorTitulo(termo);
    res.render('oficinas/pesquisa', {
      title: 'Pesquisa de Oficinas',
      active: 'pesquisa',
      pesquisado: true,
      termo,
      resultados
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
