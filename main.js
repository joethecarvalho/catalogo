document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalExcluir');
  if (!modal) return;

  modal.addEventListener('show.bs.modal', (event) => {
    const botao = event.relatedTarget;
    const id = botao.getAttribute('data-oficina-id');
    const titulo = botao.getAttribute('data-oficina-titulo');

    document.getElementById('tituloOficinaExcluir').textContent = titulo;
    document.getElementById('formExcluir').action = `/oficinas/${id}/excluir`;
  });
});
