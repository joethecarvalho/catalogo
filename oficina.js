// Repositório em memória. Os dados existem enquanto o processo do servidor estiver ativo.
let oficinas = [];
let proximoId = 1;

async function listar() {
  return [...oficinas];
}

async function buscarPorId(id) {
  return oficinas.find((oficina) => oficina.id === Number(id)) || null;
}

async function criar(dados) {
  const oficina = {
    id: proximoId++,
    titulo: dados.titulo,
    responsavel: dados.responsavel,
    descricao: dados.descricao,
    cargaHoraria: Number(dados.cargaHoraria),
    inscricoesAbertas: true
  };
  oficinas.push(oficina);
  return oficina;
}

async function atualizar(id, dados) {
  const oficina = await buscarPorId(id);
  if (!oficina) return null;

  oficina.titulo = dados.titulo;
  oficina.responsavel = dados.responsavel;
  oficina.descricao = dados.descricao;
  oficina.cargaHoraria = Number(dados.cargaHoraria);
  return oficina;
}

async function alternarInscricoes(id) {
  const oficina = await buscarPorId(id);
  if (!oficina) return null;
  oficina.inscricoesAbertas = !oficina.inscricoesAbertas;
  return oficina;
}

async function excluir(id) {
  const indice = oficinas.findIndex((oficina) => oficina.id === Number(id));
  if (indice === -1) return false;
  oficinas.splice(indice, 1);
  return true;
}

async function pesquisarPorTitulo(termo) {
  const busca = String(termo || '').trim().toLocaleLowerCase('pt-BR');
  if (!busca) return [];
  return oficinas.filter((oficina) =>
    oficina.titulo.toLocaleLowerCase('pt-BR').includes(busca)
  );
}

async function obterResumo() {
  const abertas = oficinas.filter((oficina) => oficina.inscricoesAbertas);
  const encerradas = oficinas.filter((oficina) => !oficina.inscricoesAbertas);
  return {
    total: oficinas.length,
    abertas: abertas.length,
    encerradas: encerradas.length,
    cargaHorariaAbertas: abertas.reduce((total, oficina) => total + oficina.cargaHoraria, 0)
  };
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  alternarInscricoes,
  excluir,
  pesquisarPorTitulo,
  obterResumo
};
