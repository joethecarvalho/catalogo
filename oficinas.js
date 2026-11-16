const express = require('express');
const router = express.Router();
const Oficina = require('../model/oficina');

function validarDados(body) {
  const dados = {
    titulo: String(body.titulo || '').trim(),
    responsavel: String(body.responsavel || '').trim(),
    descricao: String(body.descricao || '').trim(),
    cargaHoraria: Number(body.cargaHoraria)
  };
  const erros = [];
  if (!dados.titulo) erros.push('Informe o título da oficina.');
  if (!dados.responsavel) erros.push('Informe a pessoa responsável.');
  if (!dados.descricao) erros.push('Informe a descrição da atividade.');
  if (!Number.isInteger(dados.cargaHoraria) || dados.cargaHoraria < 1 || dados.cargaHoraria > 40) {
    erros.push('A carga horária deve ser um número inteiro entre 1 e 40.');
  }
  return { dados, erros };
}

router.get('/nova', (req, res) => {
  res.render('oficinas/formulario', {
    title: 'Nova Oficina',
    active: 'nova',
    acao: '/oficinas',
    botao: 'Cadastrar oficina',
    oficina: { titulo: '', responsavel: '', descricao: '', cargaHoraria: '' }
  });
});

router.post('/', async (req, res, next) => {
  try {
    const { dados, erros } = validarDados(req.body);
    if (erros.length) {
      return res.status(400).render('oficinas/formulario', {
        title: 'Nova Oficina',
        active: 'nova',
        acao: '/oficinas',
        botao: 'Cadastrar oficina',
        oficina: req.body,
        erros
      });
    }
    await Oficina.criar(dados);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const oficina = await Oficina.buscarPorId(req.params.id);
    if (!oficina) return res.status(404).render('error', { title: 'Oficina não encontrada', message: 'A oficina solicitada não existe.' });
    res.render('oficinas/detalhes', { title: 'Detalhes da Oficina', oficina });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/editar', async (req, res, next) => {
  try {
    const oficina = await Oficina.buscarPorId(req.params.id);
    if (!oficina) return res.status(404).render('error', { title: 'Oficina não encontrada', message: 'A oficina solicitada não existe.' });
    res.render('oficinas/formulario', {
      title: 'Editar Oficina',
      active: '',
      acao: `/oficinas/${oficina.id}/editar`,
      botao: 'Salvar alterações',
      oficina,
      editando: true
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/editar', async (req, res, next) => {
  try {
    const oficinaAtual = await Oficina.buscarPorId(req.params.id);
    if (!oficinaAtual) return res.status(404).render('error', { title: 'Oficina não encontrada', message: 'A oficina solicitada não existe.' });

    const { dados, erros } = validarDados(req.body);
    if (erros.length) {
      return res.status(400).render('oficinas/formulario', {
        title: 'Editar Oficina',
        active: '',
        acao: `/oficinas/${oficinaAtual.id}/editar`,
        botao: 'Salvar alterações',
        oficina: { ...oficinaAtual, ...req.body },
        editando: true,
        erros
      });
    }
    await Oficina.atualizar(req.params.id, dados);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/alternar', async (req, res, next) => {
  try {
    const oficina = await Oficina.alternarInscricoes(req.params.id);
    if (!oficina) return res.status(404).render('error', { title: 'Oficina não encontrada', message: 'A oficina solicitada não existe.' });
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/excluir', async (req, res, next) => {
  try {
    await Oficina.excluir(req.params.id);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
